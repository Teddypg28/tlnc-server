/*
  Warnings:

  - You are about to drop the column `guessLockTime` on the `GameDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameDetails" DROP COLUMN "guessLockTime",
ADD COLUMN     "guessLockTimes" TIMESTAMP(3)[];
