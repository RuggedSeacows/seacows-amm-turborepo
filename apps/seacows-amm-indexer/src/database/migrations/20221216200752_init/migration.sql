-- CreateTable
CREATE TABLE "contracts" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "last_read_block" INTEGER,
    "genesis_block" INTEGER NOT NULL,
    "type" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pools" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "contract_address" VARCHAR(42) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracts_address_key" ON "contracts"("address");

-- CreateIndex
CREATE UNIQUE INDEX "pools_address_key" ON "pools"("address");

-- AddForeignKey
ALTER TABLE "pools" ADD CONSTRAINT "pools_contract_address_fkey" FOREIGN KEY ("contract_address") REFERENCES "contracts"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
