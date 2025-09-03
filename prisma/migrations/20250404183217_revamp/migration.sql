/*
  Warnings:

  - The `guessLockTime` column on the `GameDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GameDetails" DROP COLUMN "guessLockTime",
ADD COLUMN     "guessLockTime" TIMESTAMP(3),
ALTER COLUMN "currentRound" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SelectedCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SelectedCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonDetails" (
    "id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "week" TEXT NOT NULL,

    CONSTRAINT "SeasonDetails_pkey" PRIMARY KEY ("id")
);
