/*
  Warnings:

  - You are about to drop the column `guessLockTimes` on the `GameDetails` table. All the data in the column will be lost.
  - Added the required column `guessLockTime` to the `GameDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameDetails" DROP COLUMN "guessLockTimes",
ADD COLUMN     "guessLockTime" TIMESTAMP(3) NOT NULL;
