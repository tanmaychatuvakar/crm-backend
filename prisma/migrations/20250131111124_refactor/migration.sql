/*
  Warnings:

  - Made the column `scheduled_at` on table `viewing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "viewing" ALTER COLUMN "scheduled_at" SET NOT NULL;
