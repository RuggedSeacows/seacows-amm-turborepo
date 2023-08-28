/*
  Warnings:

  - You are about to drop the column `entries` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `prize_name` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `num_xp` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Made the column `twitter` on table `campaigns` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "entries",
DROP COLUMN "prize_name",
ADD COLUMN     "discord" TEXT,
ADD COLUMN     "num_xp" INTEGER NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "twitter" SET NOT NULL;
