/*
  Warnings:

  - You are about to drop the column `interest_summary` on the `itineraries` table. All the data in the column will be lost.
  - Made the column `title` on table `itineraries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `budget_preference` on table `itineraries` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `published_itinerary_reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "itineraries" DROP COLUMN "interest_summary",
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "budget_preference" SET NOT NULL;

-- AlterTable
ALTER TABLE "places" ALTER COLUMN "rating_count" DROP NOT NULL,
ALTER COLUMN "rating_count" DROP DEFAULT;

-- AlterTable
ALTER TABLE "published_itinerary_reviews" ALTER COLUMN "rating" SET NOT NULL;

-- CreateTable
CREATE TABLE "itinerary_interest_categories" (
    "itinerary_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "itinerary_interest_categories_pkey" PRIMARY KEY ("itinerary_id","category_id")
);

-- CreateIndex
CREATE INDEX "itinerary_interest_categories_category_id_itinerary_id_idx" ON "itinerary_interest_categories"("category_id", "itinerary_id");

-- AddForeignKey
ALTER TABLE "itinerary_interest_categories" ADD CONSTRAINT "itinerary_interest_categories_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("itinerary_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_interest_categories" ADD CONSTRAINT "itinerary_interest_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "place_categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
