-- AlterTable
ALTER TABLE "factory_pool_contract_event" ADD COLUMN     "owner" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "erc20_token" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "chain_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "erc20_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "erc20_token_address_key" ON "erc20_token"("address");
