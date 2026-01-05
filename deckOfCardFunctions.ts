import cardNames from "./data/cardNames"

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