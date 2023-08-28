/*
  Warnings:

  - Added the required column `transaction_hash` to the `pools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pools" ADD COLUMN     "transaction_hash" TEXT NOT NULL;
