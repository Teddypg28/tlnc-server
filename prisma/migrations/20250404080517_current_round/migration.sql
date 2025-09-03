/*
  Warnings:

  - You are about to drop the `Countdown` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Countdown";

-- CreateTable
CREATE TABLE "GameDetails" (
    "id" TEXT NOT NULL,
    "guessLockTime" INTEGER NOT NULL,
    "currentRound" INTEGER NOT NULL,

    CONSTRAINT "GameDetails_pkey" PRIMARY KEY ("id")
);
