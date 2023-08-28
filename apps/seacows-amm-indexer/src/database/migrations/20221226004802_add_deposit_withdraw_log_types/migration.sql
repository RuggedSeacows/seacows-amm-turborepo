/*
  Warnings:

  - Changed the type of `type` on the `pool_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('BUY', 'SELL', 'WITHDRAW_TOKEN', 'WITHDRAW_NFT', 'DEPOSIT_TOKEN');

-- AlterTable
ALTER TABLE "pool_logs" DROP COLUMN "type",
ADD COLUMN     "type" "LogType" NOT NULL,
ALTER COLUMN "volume" DROP NOT NULL;

-- DropEnum
DROP TYPE "SwapType";
