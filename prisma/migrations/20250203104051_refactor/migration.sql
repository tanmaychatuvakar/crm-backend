/*
  Warnings:

  - You are about to drop the column `reference_id` on the `viewing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lead_contact" ADD COLUMN     "reference_id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "offer" ADD COLUMN     "reference_id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "viewing" DROP COLUMN "reference_id";
