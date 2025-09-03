import { GameDetails, PrismaClient } from '@prisma/client';
import { CronJob } from 'cron'
const db = new PrismaClient()

import { drawNewCard, shuffleNewDeck } from './deckOfCardFunctions';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const allowGuesses = async () => {
    const guessLockTime = new Date()
    guessLockTime.setTime(guessLockTime.getTime() + 45000)
    await db.gameDetails.update({where: {id: '41666178-24a9-41f1-b774-b91186e9dfe1'}, data: {guessLockTime}})

    const difference = (guessLockTime.getTime() - new Date().getTime())

    // wait and allow guesses to be made
    await wait(difference)
}


CronJob.from({
    cronTime: '29 02 * * *',
    onTick: async function () {

        const gameDetails = await db.gameDetails.findFirst() as GameDetails

        const response = await shuffleNewDeck()
        const deckData = await response.json() as {deck_id: string}
        const deckId = deckData.deck_id as string

        let round = 0
        while (round < 5) {

            round++;
            await db.gameDetails.update({where: {id: gameDetails.id}, data: {currentRound: round}})

            // wait for players to guess
            await allowGuesses();
            
            // select random card from deck
            const selectedCardRes = await drawNewCard(deckId)
            const cardData = await selectedCardRes.json() as {cards: [{value: string, suit: string}]}
            const selectedCardData = {
                value: cardData.cards[0].value,
                suit: cardData.cards[0].suit.toLowerCase(),
            }

            // check if there are any right guesses
            const playerGuesses = await db.guess.findMany({where: {week: {equals: gameDetails.week}, season: {equals: gameDetails.season}, round: {equals: round}}})
            const correctGuesses: string[] = []
            playerGuesses.forEach(guess => {

                console.log(`${guess.username} guessed ${guess.value} of ${guess.suit}`)

                if (guess.suit.toLowerCase() === selectedCardData.suit && guess.value.toLowerCase() === selectedCardData.value) {
                    correctGuesses.push(guess.username)
                }
            })

            // log winners or no winners 
            if (correctGuesses.length > 0) {
                correctGuesses.forEach(correctGuess => {
                    console.log(correctGuess, " won this round!")
                })
            } else {
                console.log('Nobody won this round!')
            }
        }

    },
    start: true,
    timeZone: 'America/Chicago'
});