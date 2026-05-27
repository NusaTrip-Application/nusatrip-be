/*
  Warnings:

  - You are about to drop the column `price_label` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `price_range_text` on the `places` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "places" DROP COLUMN "price_label",
DROP COLUMN "price_range_text",
ADD COLUMN     "price_description" VARCHAR(100),
ADD COLUMN     "price_max" DECIMAL(12,2),
ADD COLUMN     "price_min" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "provinces" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
