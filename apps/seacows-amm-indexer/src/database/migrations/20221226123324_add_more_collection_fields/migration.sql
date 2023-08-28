/*
  Warnings:

  - Added the required column `num_assets` to the `collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "num_assets" INTEGER NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;
