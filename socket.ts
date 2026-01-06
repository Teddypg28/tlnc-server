
import { Server } from "socket.io"
import { GameDetails, PrismaClient } from '@prisma/client';
import { getAlreadySelectedCards } from "./deckOfCardFunctions";

const io = new Server(8000, {cors: {origin: 'http://192.168.4.39:8081'}})

const db = new PrismaClient()

io.on('connection', async () => {
    const currentGameData = await db.gameDetails.findFirst() as GameDetails

    let currentRound = currentGameData.currentRound || 1
    const currentExpirationTime = currentGameData.guessLockTime

    const cardCodes = await getAlreadySelectedCards(currentGameData.season)
    
    io.emit('guessLockTime', currentExpirationTime)
    io.emit('currentRound', currentRound)
    io.emit('cardHistory', cardCodes)
})

export { io }


// casino opens
// 45 seconds to guess
// round locks
// fetch winners from the round
// display winners to all users
// next round opens
// process repeats until game is over
// display leaderboard at the end


