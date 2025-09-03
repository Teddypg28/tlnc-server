-- CreateTable
CREATE TABLE "CorrectGuess" (
    "id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "round" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "card" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "CorrectGuess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CorrectGuess" ADD CONSTRAINT "CorrectGuess_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
