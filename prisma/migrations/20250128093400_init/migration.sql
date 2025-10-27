-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRATOR', 'LISTING_DEPARTMENT', 'LINE_MANAGER', 'AGENT', 'PHOTOGRAPHER', 'EDITOR');

-- CreateEnum
CREATE TYPE "PhotoshootStatus" AS ENUM ('UNASSIGNED', 'ASSIGNED', 'PHOTOS_UPLOADED', 'PHOTOS_EDITED', 'DONE');

-- CreateEnum
CREATE TYPE "PhotoRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "FurnishedStatus" AS ENUM ('YES', 'NO', 'PARTLY');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('COMPLETED', 'COMPLETED_PRIMARY', 'COMPLETED_SECONDARY', 'OFFPLAN_PRIMARY', 'OFFPLAN_SECONDARY', 'UNDER_CONSTRUCTION');

-- CreateEnum
CREATE TYPE "LeaseTerm" AS ENUM ('DAY', 'MONTH', 'WEEK', 'YEAR');

-- CreateEnum
CREATE TYPE "LeadExtensionRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PHOTO_REQUEST', 'AWAITING_PUBLISH', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ExtensionRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "UnpublishRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "FittedStatus" AS ENUM ('FITTED', 'SEMI_FITTED', 'SHELL_AND_CORE');

-- CreateEnum
CREATE TYPE "ReasonIntent" AS ENUM ('PHOTO_REQUEST_REJECTION', 'LISTING_UNPUBLISH', 'EXTENSION_REQUEST_REJECTION');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BROKER_CONTRACT_RENTAL', 'BROKER_CONTRACT_SALE', 'TITLE_DEED', 'POA', 'OWNER_ID', 'OTHER');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('SALE', 'RENTAL');

-- CreateEnum
CREATE TYPE "SourceIntent" AS ENUM ('LEAD', 'LISTING');

-- CreateEnum
CREATE TYPE "LeadContactType" AS ENUM ('BUYER', 'TENANT', 'SELLER', 'LANDLORD');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('GENERAL', 'LISTING', 'CAMPAIGN');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CALLED', 'CONTACTED', 'QUALIFIED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "QualificationFinanceType" AS ENUM ('CASH', 'LOAN_APPROVED', 'LOAN_NOT_APPROVED');

-- CreateEnum
CREATE TYPE "QualificationBuyerType" AS ENUM ('INVERSTOR', 'END_USER');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('SUBMITTED', 'NEGOTIATION', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LeadContactChannel" AS ENUM ('CALL', 'EMAIL', 'WHATSAPP', 'SMS', 'CHAT');

-- CreateEnum
CREATE TYPE "LeadContactResponse" AS ENUM ('INTERESTED', 'NOT_INTERESTED', 'CONTACT_LATER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "profile_image" TEXT DEFAULT '',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "phone_number_country_code" TEXT,
    "password" TEXT NOT NULL,
    "password_reset_token" TEXT,
    "password_reset_expiration" TIMESTAMP(3),
    "licensed" BOOLEAN DEFAULT false,
    "role" "Role" NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "held_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile_country_code" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "phone_country_code" TEXT,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "nationality_id" TEXT,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "emirates_id" TEXT,
    "passport_number" TEXT NOT NULL,
    "spoken_language" TEXT,
    "contact_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "object_key" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "user_id" TEXT,
    "role" TEXT NOT NULL,
    "photoshoot_id" TEXT,
    "edited_photoshoot_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_request" (
    "id" TEXT NOT NULL,
    "status" "PhotoRequestStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "preferred_date" DATE,
    "preferred_time" TEXT,
    "occupancy" TEXT,
    "key_location" TEXT NOT NULL,
    "building_access_card_location" TEXT NOT NULL,
    "parking_access_card_location" TEXT,
    "accessCardLocation" TEXT,
    "comments" TEXT,
    "is_broker_present" BOOLEAN NOT NULL DEFAULT false,
    "listing_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photo_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photoshoot" (
    "id" TEXT NOT NULL,
    "status" "PhotoshootStatus" NOT NULL DEFAULT 'UNASSIGNED',
    "rejectionReason" TEXT,
    "photographer_id" TEXT,
    "editor_id" TEXT,
    "photo_request_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photoshoot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcommunity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subcommunity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "intent" "SourceIntent" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "commercial" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nationality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nationality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing" (
    "id" TEXT NOT NULL,
    "reference_id" SERIAL NOT NULL,
    "is_sale" BOOLEAN NOT NULL DEFAULT false,
    "is_rental" BOOLEAN NOT NULL DEFAULT false,
    "location_id" TEXT,
    "community_id" TEXT,
    "subcommunity_id" TEXT,
    "property_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "unit_number" TEXT,
    "total_area" INTEGER,
    "plot_area" INTEGER,
    "number_of_bedrooms" SMALLINT,
    "number_of_bathrooms" SMALLINT,
    "floor" INTEGER,
    "view" TEXT,
    "furnished" "FurnishedStatus",
    "appliances" BOOLEAN NOT NULL DEFAULT false,
    "parking" SMALLINT,
    "street_number" TEXT,
    "sale_price" INTEGER,
    "source_id" TEXT,
    "is_half_bath" BOOLEAN NOT NULL DEFAULT false,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "ask_for_price" BOOLEAN NOT NULL DEFAULT false,
    "is_exclusive" BOOLEAN NOT NULL DEFAULT false,
    "is_commercial" BOOLEAN NOT NULL DEFAULT false,
    "is_rented" BOOLEAN NOT NULL DEFAULT false,
    "fitted" "FittedStatus",
    "contact_id" TEXT,
    "agent_id" TEXT,
    "assignee_id" TEXT,
    "publisher_id" TEXT,
    "trakheesi" TEXT,
    "property_status" "PropertyStatus",
    "service_charge" INTEGER,
    "price_per_sqft" INTEGER,
    "rental_price" INTEGER,
    "rented_from" DATE,
    "rented_until" DATE,
    "rented_price" INTEGER,
    "rented_cheques" SMALLINT,
    "tenant" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "category_id" TEXT,
    "rental_cheques" SMALLINT,
    "rental_lease_term" "LeaseTerm",
    "rental_available_from" TIMESTAMP(3),
    "str" TEXT,
    "photoshoot_id" TEXT,
    "expires_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "broker_contract_rental_document" JSONB,
    "broker_contract_sale_document" JSONB,
    "title_deed_document" JSONB,
    "poa_document" JSONB,
    "owner_id_document" JSONB,
    "other_document" JSONB,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extension_request" (
    "id" TEXT NOT NULL,
    "status" "ExtensionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "from_date" TIMESTAMP(3),
    "to_date" TIMESTAMP(3),
    "comments" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "listing_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extension_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unpublish_request" (
    "id" TEXT NOT NULL,
    "status" "UnpublishRequestStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "rejectionReason" TEXT,
    "listing_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unpublish_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reason" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "intent" "ReasonIntent" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" TEXT NOT NULL,
    "type" "LeadType" NOT NULL DEFAULT 'GENERAL',
    "status" "LeadStatus" NOT NULL DEFAULT 'PENDING',
    "source_id" TEXT,
    "subsource" TEXT,
    "campaign_id" TEXT,
    "listing_id" TEXT,
    "assignee_id" TEXT,
    "rejection_reason" TEXT,
    "approved_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_contact" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "name" TEXT NOT NULL,
    "mobile_number" TEXT,
    "phone_number" TEXT,
    "email" TEXT,
    "nationality_id" TEXT,
    "type" "LeadContactType",
    "language" TEXT,
    "lead_id" TEXT NOT NULL,
    "channel" "LeadContactChannel",
    "response" "LeadContactResponse",
    "notes" TEXT,
    "contactable" BOOLEAN NOT NULL DEFAULT true,
    "contacted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_preference" (
    "id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "community_id" TEXT,
    "subcommunity_id" TEXT,
    "property_id" TEXT,
    "category_id" TEXT,
    "min_bedrooms" SMALLINT,
    "max_bedrooms" SMALLINT,
    "min_price" INTEGER,
    "max_price" INTEGER,
    "min_area" INTEGER,
    "max_area" INTEGER,
    "lead_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_extension_request" (
    "id" TEXT NOT NULL,
    "status" "LeadExtensionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT NOT NULL,
    "until" TIMESTAMP(3) NOT NULL,
    "lead_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_extension_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualification" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "budget" SMALLINT,
    "timeline" SMALLINT,
    "level_of_interest" SMALLINT,
    "spoken_language" TEXT,
    "customer_type" TEXT,
    "finance" "QualificationFinanceType",
    "buyerType" "QualificationBuyerType",
    "nationality_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "qualified_at" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viewing" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "preferred_date" DATE NOT NULL,
    "preferred_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "viewing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "viewing_id" TEXT NOT NULL,
    "community" SMALLINT NOT NULL DEFAULT 0,
    "location" SMALLINT NOT NULL DEFAULT 0,
    "floor" SMALLINT NOT NULL DEFAULT 0,
    "view" SMALLINT NOT NULL DEFAULT 0,
    "floor_plan_layout" SMALLINT NOT NULL DEFAULT 0,
    "area" SMALLINT NOT NULL DEFAULT 0,
    "condition" SMALLINT NOT NULL DEFAULT 0,
    "price" SMALLINT NOT NULL DEFAULT 0,
    "amenities" SMALLINT NOT NULL DEFAULT 0,
    "parking" SMALLINT NOT NULL DEFAULT 0,
    "ac_type" SMALLINT NOT NULL DEFAULT 0,
    "service_charge" SMALLINT,
    "furniture_condition" SMALLINT,
    "appliances_condition" SMALLINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'SUBMITTED',
    "offeredAt" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "cheques" SMALLINT,
    "viewing_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lead_id" TEXT NOT NULL,

    CONSTRAINT "offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deal" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeatureToListing" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AmenityToListing" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TeamToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "photoshoot_photo_request_id_key" ON "photoshoot"("photo_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_code_key" ON "category"("code");

-- CreateIndex
CREATE UNIQUE INDEX "city_name_key" ON "city"("name");

-- CreateIndex
CREATE UNIQUE INDEX "community_city_id_name_key" ON "community"("city_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "subcommunity_community_id_name_key" ON "subcommunity"("community_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "property_subcommunity_id_name_key" ON "property"("subcommunity_id", "name");

-- CreateIndex
CREATE INDEX "source_intent_idx" ON "source"("intent");

-- CreateIndex
CREATE UNIQUE INDEX "source_name_intent_key" ON "source"("name", "intent");

-- CreateIndex
CREATE UNIQUE INDEX "feature_name_key" ON "feature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "amenity_code_key" ON "amenity"("code");

-- CreateIndex
CREATE UNIQUE INDEX "nationality_name_key" ON "nationality"("name");

-- CreateIndex
CREATE INDEX "listing_reference_id_idx" ON "listing"("reference_id");

-- CreateIndex
CREATE INDEX "reason_intent_idx" ON "reason"("intent");

-- CreateIndex
CREATE UNIQUE INDEX "reason_reason_intent_key" ON "reason"("reason", "intent");

-- CreateIndex
CREATE UNIQUE INDEX "lead_contact_lead_id_key" ON "lead_contact"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "lead_preference_lead_id_key" ON "lead_preference"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "qualification_lead_id_key" ON "qualification"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_viewing_id_key" ON "feedback"("viewing_id");

-- CreateIndex
CREATE UNIQUE INDEX "deal_offer_id_key" ON "deal"("offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureToListing_AB_unique" ON "_FeatureToListing"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureToListing_B_index" ON "_FeatureToListing"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AmenityToListing_AB_unique" ON "_AmenityToListing"("A", "B");

-- CreateIndex
CREATE INDEX "_AmenityToListing_B_index" ON "_AmenityToListing"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToUser_AB_unique" ON "_TeamToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "_TeamToUser"("B");

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "nationality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_photoshoot_id_fkey" FOREIGN KEY ("photoshoot_id") REFERENCES "photoshoot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_edited_photoshoot_id_fkey" FOREIGN KEY ("edited_photoshoot_id") REFERENCES "photoshoot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_request" ADD CONSTRAINT "photo_request_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photoshoot" ADD CONSTRAINT "photoshoot_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photoshoot" ADD CONSTRAINT "photoshoot_editor_id_fkey" FOREIGN KEY ("editor_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photoshoot" ADD CONSTRAINT "photoshoot_photo_request_id_fkey" FOREIGN KEY ("photo_request_id") REFERENCES "photo_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community" ADD CONSTRAINT "community_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcommunity" ADD CONSTRAINT "subcommunity_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_subcommunity_id_fkey" FOREIGN KEY ("subcommunity_id") REFERENCES "subcommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_subcommunity_id_fkey" FOREIGN KEY ("subcommunity_id") REFERENCES "subcommunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_photoshoot_id_fkey" FOREIGN KEY ("photoshoot_id") REFERENCES "photoshoot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extension_request" ADD CONSTRAINT "extension_request_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unpublish_request" ADD CONSTRAINT "unpublish_request_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_contact" ADD CONSTRAINT "lead_contact_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "nationality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_contact" ADD CONSTRAINT "lead_contact_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_preference" ADD CONSTRAINT "lead_preference_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_preference" ADD CONSTRAINT "lead_preference_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_preference" ADD CONSTRAINT "lead_preference_subcommunity_id_fkey" FOREIGN KEY ("subcommunity_id") REFERENCES "subcommunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_preference" ADD CONSTRAINT "lead_preference_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_preference" ADD CONSTRAINT "lead_preference_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_preference" ADD CONSTRAINT "lead_preference_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_extension_request" ADD CONSTRAINT "lead_extension_request_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualification" ADD CONSTRAINT "qualification_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualification" ADD CONSTRAINT "qualification_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "nationality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualification" ADD CONSTRAINT "qualification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewing" ADD CONSTRAINT "viewing_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewing" ADD CONSTRAINT "viewing_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewing" ADD CONSTRAINT "viewing_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_viewing_id_fkey" FOREIGN KEY ("viewing_id") REFERENCES "viewing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_viewing_id_fkey" FOREIGN KEY ("viewing_id") REFERENCES "viewing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deal" ADD CONSTRAINT "deal_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToListing" ADD CONSTRAINT "_FeatureToListing_A_fkey" FOREIGN KEY ("A") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToListing" ADD CONSTRAINT "_FeatureToListing_B_fkey" FOREIGN KEY ("B") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmenityToListing" ADD CONSTRAINT "_AmenityToListing_A_fkey" FOREIGN KEY ("A") REFERENCES "amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmenityToListing" ADD CONSTRAINT "_AmenityToListing_B_fkey" FOREIGN KEY ("B") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
