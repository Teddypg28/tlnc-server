import express from 'express'
import Joi from 'joi'
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import badwords from 'badwords/array'
import dotenv from 'dotenv'

import { Countdown, GameDetails, PrismaClient } from '@prisma/client'

const app = express()
const PORT = 3000

dotenv.config()

app.use(express.json())

const db = new PrismaClient()

import './runGame'
import './socket'

const validateRegistration = async (req: any) => {

    const players = await db.player.findMany()
    const playerUsernames = players.map(player => {
        return player.username.toLowerCase()
    })

    const playerEmails = players.map(player => {
        return player.email
    })

    const schema = Joi.object({
        email: Joi.string().email({tlds: {allow: false}}).required().custom((value, helpers) => {
            if (playerEmails.includes(value.toLowerCase())) {
                return helpers.message({custom: 'Email already exists'})
            }
        }),
        username: Joi.string().max(15).custom((value, helpers) => {
            for (const word of badwords) {
                if (value.toLowerCase().includes(word)) {
                    return helpers.message({custom: 'Username not allowed'})
                }
            }

            if (value.indexOf(' ') > 0) {
                return helpers.message({custom: 'Username must not contain any spaces'})
            }

            if (playerUsernames.includes(value.toLowerCase())) {
                return helpers.message({custom: 'Username already taken'})
            }

        }).required(),
        password: Joi.string().min(10).required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({'any.only':'Passwords must match'})

    })

    return schema.validate(req)

}

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
})

app.post('/player-guesses', async (req, res) => {
    try {      
        const { season, round } = req.body
    
        const playerGuesses = await db.guess.findMany({where: {round, AND: {season}}})
    
        res.status(200).json(playerGuesses)
    } catch (error) {
        res.status(400).json({status: error})
    }
})

app.post('/guess-check', async (req, res) => {
    try {
        const { season, round, username } = req.body
        const guess = await db.guess.findFirst({where: {username, round, season}})
        if (!guess) return res.status(200).json({guess: null})

        return res.status(200).json({guess: guess.code})
    } catch (error) {
        res.status(400).json({status: error})
    }
})

app.post('/submit-guess', async (req, res) => {
    try {
        const { code, autoGuess, round, username } = req.body

        const player = await db.player.findFirst({where: {username}})
        if (!player) return res.status(400).json({status: "No player with that username exists"})
    
        const gameDetails = await db.gameDetails.findFirst() as GameDetails
    
        const storedGuess = await db.guess.findFirst({where: 
            {username: {equals: username},  AND:
            {season: {equals: gameDetails.season}, AND: 
            {week: {equals: gameDetails.week}, AND: 
            {round: {equals: round}}
        }}}})

        if (storedGuess) {
            await db.guess.update({where: {id: storedGuess.id}, data: {autoGuess, code}})
        } else {
            await db.guess.create({
                data: {
                    round, 
                    autoGuess,
                    username,
                    code,
                    playerId: player.id,
                    season: gameDetails.season,
                    week: gameDetails.week
                }
            })
        }

        res.status(200).json({status: 'Guess successfully submitted!'})
    } catch (error) {
        res.status(400).json({status: error})
    }
})

app.get('/countdown', async (req, res) => {
    const countdownDetails = await db.countdown.findFirst() as Countdown

    return res.send(countdownDetails.nextGameDate)
})

app.get('/', async (req, res) => {
    const players = await db.player.findMany()
    const playerUsernames = players.map(player => {
        return player.username
    })
    return res.send(playerUsernames)
})

app.post('/register', async (req, res) => {

    const { error } = await validateRegistration(req.body)

    if (error) {
        return res.status(400).send({key: error.details[0].path[0], message: error.message})
    }

    const salt = await bycrypt.genSalt(10)

    const email = req.body.email.toLowerCase()
    const username = req.body.username.toLowerCase()
    const hashedPassword = await bycrypt.hash(req.body.password, salt)

    await db.player.create({data: {email, username, password: hashedPassword}})

    return res.status(200).send('Registered')

})

app.post('/login', async (req, res) => {

    const user = await db.player.findFirst({where: {username: {equals: req.body.username}}})
    if (!user) return res.status(400).json({error: 'Email, username, or password invalid'})
    
    const username = user.username
    const password = user.password

    const validPassword = await bycrypt.compare(req.body.password, password)
    if (!validPassword) return res.status(400).json({error: 'Email, username, or password invalid'})

    const data = { username }

    const token = jwt.sign(data, `${process.env.SECRET_KEY}`)

    return res.status(200).send({ token })
    
})