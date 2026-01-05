import { GameDetails, PrismaClient } from '@prisma/client';
import { CronJob } from 'cron'
const db = new PrismaClient()

import { drawNewCard, shuffleNewDeck } from './deckOfCardFunctions';
import { io } from './socket';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const allowGuesses = async () => {
    const guessLockTime = new Date()
    guessLockTime.setTime(guessLockTime.getTime() + 45000)
    const updatedGameDetails = await db.gameDetails.update({where: {id: '41666178-24a9-41f1-b774-b91186e9dfe1'}, data: {guessLockTime}})

    io.emit('guessLockTime', updatedGameDetails.guessLockTime)

    const difference = (guessLockTime.getTime() - new Date().getTime())

    // wait and allow guesses to be made
    await wait(difference)
}

CronJob.from({
    cronTime: '36 14 * * *',
    onTick: async function () {

        const gameDetails = await db.gameDetails.findFirst() as GameDetails

        const response = await shuffleNewDeck()
        const deckData = await response.json() as {deck_id: string}
        const deckId = deckData.deck_id as string

        let round = 0
        while (round < 5) {

            round++;
            await db.gameDetails.update({where: {id: gameDetails.id}, data: {currentRound: round}})
            io.emit('currentRound', round)

            // wait for players to guess
            await allowGuesses();
            
            // select random card from deck
            const selectedCardRes = await drawNewCard(deckId)
            const cardData = await selectedCardRes.json() as {cards: [{code: string, images: {png: string}}]}

            const selectedCardData = {
                code: cardData.cards[0].code,
                image: cardData.cards[0].images.png
            }

            await db.selectedCard.create({data: {code: selectedCardData.code, round, gameDetailsId: gameDetails.id, image: selectedCardData.image}})
            
            // wait 3 seconds before card is displayed
            await wait(3000)

            io.emit('selectedCard', {code: selectedCardData.code, image: selectedCardData.image})

            // check if there are any right guesses
            const playerGuesses = await db.guess.findMany({where: {week: {equals: gameDetails.week}, season: {equals: gameDetails.season}, round: {equals: round}}})
            
            const correctGuessers = await Promise.all(playerGuesses.map(async (guess) => {
                if (guess.code === selectedCardData.code) {
                    return await db.correctGuess.create({data: 
                        {
                            week: gameDetails.week, 
                            round, 
                            code: selectedCardData.code,
                            points: round*2,
                            season: gameDetails.season,
                            playerId: guess.playerId
                        }, select: {player: true}})
                }
                return null
            }))

            // wait 5 seconds to display the results
            await wait(5000)

            io.emit('correctGuessers', correctGuessers.filter(element => element !== null))

            // wait 5 seconds to advance the round
            await wait(5000)

            // end of game; send players back to waiting room
            if (round === 5) {
                io.emit('gameOver')
            }
        }

    },
    start: true,
    timeZone: 'America/Chicago'
});