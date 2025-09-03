-- AlterTable
ALTER TABLE "GameDetails" ADD COLUMN     "isCheckingGuesses" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Guess" (
    "id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "autoGuess" BOOLEAN NOT NULL,
    "username" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "suit" TEXT NOT NULL,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);
