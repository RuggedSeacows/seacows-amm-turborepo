/*
  Warnings:

  - Added the required column `seapoints` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "prize_name" TEXT,
ADD COLUMN     "seapoints" INTEGER NOT NULL;
