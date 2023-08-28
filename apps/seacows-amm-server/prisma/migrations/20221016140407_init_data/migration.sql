-- CreateEnum
CREATE TYPE "PoolState" AS ENUM ('Created', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "TransactionMethod" AS ENUM ('Add', 'Withdraw', 'Swap', 'Approve');

-- CreateEnum
CREATE TYPE "TransactionState" AS ENUM ('Pending', 'Success', 'Failed');

-- CreateTable
CREATE TABLE "collection" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "chain_name" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amm_pool" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "pool_address" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "state" "PoolState" NOT NULL DEFAULT 'Created',
    "created_by" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "collection_address" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,

    CONSTRAINT "amm_pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "pool_address" TEXT NOT NULL,
    "methode" "TransactionMethod" NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "state" "TransactionState" NOT NULL DEFAULT 'Pending',
    "chain" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factory_pool_contract_event" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "nft_address" TEXT NOT NULL,
    "pool_type" INTEGER NOT NULL,
    "initial_nft_ids" BIGINT[],
    "initial_token_balance" BIGINT NOT NULL,
    "spot_price" BIGINT NOT NULL,
    "delta" BIGINT NOT NULL,
    "fee" BIGINT NOT NULL,
    "bonding_curve" TEXT NOT NULL,
    "asset_recipient" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "chain_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "factory_pool_contract_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "erc721_token" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "token_id" TEXT NOT NULL,
    "tokenUri" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "chain_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "erc721_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_address_key" ON "collection"("address");

-- CreateIndex
CREATE UNIQUE INDEX "collection_chain_name_address_key" ON "collection"("chain_name", "address");

-- CreateIndex
CREATE INDEX "amm_pool_pool_address_created_by_idx" ON "amm_pool"("pool_address", "created_by");

-- CreateIndex
CREATE UNIQUE INDEX "factory_pool_contract_event_address_key" ON "factory_pool_contract_event"("address");

-- CreateIndex
CREATE UNIQUE INDEX "erc721_token_address_key" ON "erc721_token"("address");

-- CreateIndex
CREATE UNIQUE INDEX "erc721_token_address_token_id_key" ON "erc721_token"("address", "token_id");
