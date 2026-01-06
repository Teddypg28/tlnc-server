import { PrismaClient } from "@prisma/client"
import cardNames from "./data/cardNames"
const db = new PrismaClient()

export const shuffleNewDeck = async () => {
    return await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
}

export const drawNewCard = async (deckId: string) => {
    return await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
}

export const getSelectedCardName = (uri: string) => {
    const splitString = uri.split('img/')[1]
    const cardName = splitString.split('.png')[0]
    return cardNames[cardName as keyof typeof cardNames]
}

export const getAlreadySelectedCards = async (season: number) => {
    const db = new PrismaClient()
    const selectedCards = await db.selectedCard.findMany({include: {gameDetails: true}, where: {gameDetails: {season}}})
    const cardCodes = selectedCards.map(card => card.code)
    return cardCodes
}