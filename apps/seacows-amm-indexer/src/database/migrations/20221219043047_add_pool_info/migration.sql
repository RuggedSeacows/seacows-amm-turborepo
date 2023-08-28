/*
  Warnings:

  - Added the required column `asset_recipient` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bonding_curve` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delta` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initial_nft_ids` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initial_token_balance` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nft_address` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spot_price` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `pools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `pools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pools" ADD COLUMN     "asset_recipient" VARCHAR(42) NOT NULL,
ADD COLUMN     "bonding_curve" VARCHAR(42) NOT NULL,
ADD COLUMN     "delta" TEXT NOT NULL,
ADD COLUMN     "fee" TEXT NOT NULL,
ADD COLUMN     "initial_nft_ids" TEXT NOT NULL,
ADD COLUMN     "initial_token_balance" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "nft_address" VARCHAR(42) NOT NULL,
ADD COLUMN     "owner" VARCHAR(42) NOT NULL,
ADD COLUMN     "spot_price" TEXT NOT NULL,
ADD COLUMN     "token" VARCHAR(42) NOT NULL,
ADD COLUMN     "type" INTEGER NOT NULL;
