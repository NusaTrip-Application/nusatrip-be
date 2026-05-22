-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "VisibilityStatus" AS ENUM ('private', 'published');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- CreateEnum
CREATE TYPE "PlaceCategoryEnum" AS ENUM ('nature', 'culture_history', 'shopping', 'food_drinks', 'entertainment', 'wellness', 'family', 'adventure');

-- CreateTable
CREATE TABLE "users" (
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(30),
    "instagram_username" VARCHAR(100),
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "account_status" "AccountStatus" NOT NULL DEFAULT 'active',
    "profile_photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "locations" (
    "location_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "location_name" VARCHAR(120) NOT NULL,
    "province_name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "places" (
    "place_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "location_id" UUID NOT NULL,
    "place_name" VARCHAR(180) NOT NULL,
    "short_description" TEXT,
    "address" TEXT NOT NULL,
    "price_range_text" VARCHAR(100),
    "price_label" VARCHAR(50),
    "website_url" TEXT,
    "contact_phone_number" VARCHAR(50),
    "rating_value" DECIMAL(3,2),
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "google_place_id" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "places_pkey" PRIMARY KEY ("place_id")
);

-- CreateTable
CREATE TABLE "place_images" (
    "place_image_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "place_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "place_images_pkey" PRIMARY KEY ("place_image_id")
);

-- CreateTable
CREATE TABLE "place_categories" (
    "category_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_name" "PlaceCategoryEnum" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "place_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "place_category_mappings" (
    "place_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "place_category_mappings_pkey" PRIMARY KEY ("place_id","category_id")
);

-- CreateTable
CREATE TABLE "place_operating_hours" (
    "operating_hour_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "place_id" UUID NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "open_time" TIME(0),
    "close_time" TIME(0),
    "is_closed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "place_operating_hours_pkey" PRIMARY KEY ("operating_hour_id")
);

-- CreateTable
CREATE TABLE "itineraries" (
    "itinerary_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "title" VARCHAR(180),
    "description" TEXT,
    "banner_image_url" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "traveler_count" INTEGER NOT NULL,
    "interest_summary" TEXT,
    "budget_preference" DECIMAL(12,2),
    "visibility_status" "VisibilityStatus" NOT NULL DEFAULT 'private',
    "estimated_total_budget" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("itinerary_id")
);

-- CreateTable
CREATE TABLE "itinerary_items" (
    "itinerary_item_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "itinerary_id" UUID NOT NULL,
    "place_id" UUID NOT NULL,
    "visit_date" DATE NOT NULL,
    "visit_time" TIME(0) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itinerary_items_pkey" PRIMARY KEY ("itinerary_item_id")
);

-- CreateTable
CREATE TABLE "published_itinerary_reviews" (
    "review_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "itinerary_id" UUID NOT NULL,
    "reviewer_user_id" UUID NOT NULL,
    "rating" DECIMAL(2,1),
    "comment" TEXT,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "published_itinerary_reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "saved_references" (
    "saved_reference_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "itinerary_id" UUID NOT NULL,
    "saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_references_pkey" PRIMARY KEY ("saved_reference_id")
);

-- CreateTable
CREATE TABLE "duplicated_itinerary_lineages" (
    "duplication_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_itinerary_id" UUID NOT NULL,
    "new_itinerary_id" UUID NOT NULL,
    "duplicated_by_user_id" UUID NOT NULL,
    "duplicated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "duplicated_itinerary_lineages_pkey" PRIMARY KEY ("duplication_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "locations_location_name_key" ON "locations"("location_name");

-- CreateIndex
CREATE UNIQUE INDEX "places_google_place_id_key" ON "places"("google_place_id");

-- CreateIndex
CREATE INDEX "places_location_id_idx" ON "places"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "place_images_place_id_display_order_key" ON "place_images"("place_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "place_categories_category_name_key" ON "place_categories"("category_name");

-- CreateIndex
CREATE INDEX "place_category_mappings_category_id_place_id_idx" ON "place_category_mappings"("category_id", "place_id");

-- CreateIndex
CREATE UNIQUE INDEX "place_operating_hours_place_id_day_of_week_key" ON "place_operating_hours"("place_id", "day_of_week");

-- CreateIndex
CREATE INDEX "itineraries_user_id_idx" ON "itineraries"("user_id");

-- CreateIndex
CREATE INDEX "itineraries_visibility_status_idx" ON "itineraries"("visibility_status");

-- CreateIndex
CREATE UNIQUE INDEX "itinerary_items_itinerary_id_visit_date_visit_time_key" ON "itinerary_items"("itinerary_id", "visit_date", "visit_time");

-- CreateIndex
CREATE UNIQUE INDEX "published_itinerary_reviews_itinerary_id_reviewer_user_id_key" ON "published_itinerary_reviews"("itinerary_id", "reviewer_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "saved_references_user_id_itinerary_id_key" ON "saved_references"("user_id", "itinerary_id");

-- CreateIndex
CREATE UNIQUE INDEX "duplicated_itinerary_lineages_new_itinerary_id_key" ON "duplicated_itinerary_lineages"("new_itinerary_id");

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_images" ADD CONSTRAINT "place_images_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_category_mappings" ADD CONSTRAINT "place_category_mappings_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_category_mappings" ADD CONSTRAINT "place_category_mappings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "place_categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_operating_hours" ADD CONSTRAINT "place_operating_hours_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("itinerary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "published_itinerary_reviews" ADD CONSTRAINT "published_itinerary_reviews_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("itinerary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "published_itinerary_reviews" ADD CONSTRAINT "published_itinerary_reviews_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_references" ADD CONSTRAINT "saved_references_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_references" ADD CONSTRAINT "saved_references_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("itinerary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicated_itinerary_lineages" ADD CONSTRAINT "duplicated_itinerary_lineages_source_itinerary_id_fkey" FOREIGN KEY ("source_itinerary_id") REFERENCES "itineraries"("itinerary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicated_itinerary_lineages" ADD CONSTRAINT "duplicated_itinerary_lineages_new_itinerary_id_fkey" FOREIGN KEY ("new_itinerary_id") REFERENCES "itineraries"("itinerary_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicated_itinerary_lineages" ADD CONSTRAINT "duplicated_itinerary_lineages_duplicated_by_user_id_fkey" FOREIGN KEY ("duplicated_by_user_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
