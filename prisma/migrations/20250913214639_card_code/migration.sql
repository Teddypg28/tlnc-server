/*
  Warnings:

  - You are about to drop the column `card` on the `CorrectGuess` table. All the data in the column will be lost.
  - You are about to drop the column `suit` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SelectedCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CorrectGuess" DROP COLUMN "card",
ADD COLUMN     "code" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Guess" DROP COLUMN "suit",
DROP COLUMN "value",
ADD COLUMN     "code" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SelectedCard" DROP COLUMN "name",
ADD COLUMN     "code" TEXT NOT NULL DEFAULT '';
