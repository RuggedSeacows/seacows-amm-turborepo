-- CreateTable
CREATE TABLE "pool_logs" (
    "id" SERIAL NOT NULL,
    "transaction_index" INTEGER NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "log_index" INTEGER NOT NULL,
    "blokc_number" INTEGER NOT NULL,
    "topic_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "pool_address" VARCHAR(42) NOT NULL,

    CONSTRAINT "pool_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pool_logs_transaction_hash_log_index_key" ON "pool_logs"("transaction_hash", "log_index");
