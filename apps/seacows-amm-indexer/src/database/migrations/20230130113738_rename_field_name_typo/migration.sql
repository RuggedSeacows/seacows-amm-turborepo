/*
  Warnings:

  - You are about to drop the column `campagin_event_id` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `campaign_event_id` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_campagin_event_id_fkey";

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "campagin_event_id",
ADD COLUMN     "campaign_event_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_campaign_event_id_fkey" FOREIGN KEY ("campaign_event_id") REFERENCES "campagin_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
