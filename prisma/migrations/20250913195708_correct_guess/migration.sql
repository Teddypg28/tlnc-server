/*
  Warnings:

  - Changed the type of `season` on the `CorrectGuess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `week` on the `CorrectGuess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `round` on the `CorrectGuess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CorrectGuess" DROP COLUMN "season",
ADD COLUMN     "season" INTEGER NOT NULL,
DROP COLUMN "week",
ADD COLUMN     "week" INTEGER NOT NULL,
DROP COLUMN "round",
ADD COLUMN     "round" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Guess" ADD COLUMN     "playerId" TEXT NOT NULL DEFAULT '';
