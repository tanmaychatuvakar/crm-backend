/*
  Warnings:

  - You are about to drop the column `preferred_date` on the `viewing` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_time` on the `viewing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "viewing" DROP COLUMN "preferred_date",
DROP COLUMN "preferred_time",
ADD COLUMN     "scheduled_at" TIMESTAMP(3);
