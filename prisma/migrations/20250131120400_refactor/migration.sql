-- AlterTable
ALTER TABLE "lead" ADD COLUMN     "reference_id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "viewing" ADD COLUMN     "reference_id" SERIAL NOT NULL;
