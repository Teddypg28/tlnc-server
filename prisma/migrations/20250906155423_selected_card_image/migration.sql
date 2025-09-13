/*
  Warnings:

  - Added the required column `image` to the `SelectedCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SelectedCard" ADD COLUMN     "image" TEXT NOT NULL;
