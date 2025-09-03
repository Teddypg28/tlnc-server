/*
  Warnings:

  - You are about to drop the column `rank` on the `Guess` table. All the data in the column will be lost.
  - Added the required column `value` to the `Guess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guess" DROP COLUMN "rank",
ADD COLUMN     "value" TEXT NOT NULL;
