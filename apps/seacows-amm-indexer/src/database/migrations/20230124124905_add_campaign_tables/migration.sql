-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "campagin_event_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "wallet_address" VARCHAR(42) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "entries" INTEGER NOT NULL,
    "twitter" TEXT,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campagin_events" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "campagin_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_campagin_event_id_fkey" FOREIGN KEY ("campagin_event_id") REFERENCES "campagin_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
