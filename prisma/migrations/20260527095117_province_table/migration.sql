/*
  Warnings:

  - You are about to drop the column `province_name` on the `locations` table. All the data in the column will be lost.
  - Added the required column `province_id` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "locations" DROP COLUMN "province_name",
ADD COLUMN     "province_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "provinces" (
    "province_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "province_name" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("province_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provinces_province_name_key" ON "provinces"("province_name");

-- CreateIndex
CREATE INDEX "locations_province_id_idx" ON "locations"("province_id");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("province_id") ON DELETE RESTRICT ON UPDATE CASCADE;
