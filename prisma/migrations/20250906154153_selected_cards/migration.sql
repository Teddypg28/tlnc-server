/*
  Warnings:

  - Added the required column `gameDetailsId` to the `SelectedCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round` to the `SelectedCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SelectedCard" ADD COLUMN     "gameDetailsId" TEXT NOT NULL,
ADD COLUMN     "round" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SelectedCard" ADD CONSTRAINT "SelectedCard_gameDetailsId_fkey" FOREIGN KEY ("gameDetailsId") REFERENCES "GameDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
