/*
  Warnings:

  - You are about to drop the column `preferred_date` on the `photo_request` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_time` on the `photo_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "photo_request" DROP COLUMN "preferred_date",
DROP COLUMN "preferred_time",
ADD COLUMN     "scheduled_at" TIMESTAMP(3);
