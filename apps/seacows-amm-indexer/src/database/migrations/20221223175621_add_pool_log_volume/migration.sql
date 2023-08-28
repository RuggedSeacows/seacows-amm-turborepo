/*
  Warnings:

  - Added the required column `data` to the `pool_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `pool_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `pool_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SwapType" AS ENUM ('BUY', 'SELL');

-- AlterTable
ALTER TABLE "pool_logs" ADD COLUMN     "data" TEXT NOT NULL,
ADD COLUMN     "type" "SwapType" NOT NULL,
ADD COLUMN     "volume" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "pool_logs_pool_address_idx" ON "pool_logs"("pool_address");
