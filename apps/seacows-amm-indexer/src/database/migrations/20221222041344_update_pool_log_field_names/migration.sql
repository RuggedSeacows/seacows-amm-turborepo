/*
  Warnings:

  - You are about to drop the column `blokc_number` on the `pool_logs` table. All the data in the column will be lost.
  - You are about to drop the column `topic_hash` on the `pool_logs` table. All the data in the column will be lost.
  - Added the required column `block_number` to the `pool_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_id` to the `pool_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pool_logs" DROP COLUMN "blokc_number",
DROP COLUMN "topic_hash",
ADD COLUMN     "block_number" INTEGER NOT NULL,
ADD COLUMN     "topic_id" TEXT NOT NULL;
