/*
  Warnings:

  - Added the required column `guessTime` to the `Countdown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Countdown" ADD COLUMN     "guessTime" TIMESTAMP(3) NOT NULL;
