/*
  Warnings:

  - You are about to drop the column `guessTime` on the `Countdown` table. All the data in the column will be lost.
  - You are about to drop the column `nextCasinoTime` on the `Countdown` table. All the data in the column will be lost.
  - Added the required column `guessLockTime` to the `Countdown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Countdown" DROP COLUMN "guessTime",
DROP COLUMN "nextCasinoTime",
ADD COLUMN     "guessLockTime" INTEGER NOT NULL;
