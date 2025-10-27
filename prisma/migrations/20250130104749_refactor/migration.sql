-- AlterEnum
ALTER TYPE "LeadStatus" ADD VALUE 'CLOSED';

-- AlterTable
ALTER TABLE "_AmenityToListing" ADD CONSTRAINT "_AmenityToListing_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AmenityToListing_AB_unique";

-- AlterTable
ALTER TABLE "_FeatureToListing" ADD CONSTRAINT "_FeatureToListing_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FeatureToListing_AB_unique";

-- AlterTable
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TeamToUser_AB_unique";
