-- CreateEnum
CREATE TYPE "StorageLocation" AS ENUM ('fridge', 'freezer', 'pantry');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('produce', 'dairy', 'meat', 'seafood', 'frozen', 'grains', 'canned_goods', 'snacks', 'beverages', 'condiments', 'spices', 'baking', 'household', 'leftovers', 'other');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('count', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'pint', 'quart', 'gallon', 'package', 'can', 'bottle', 'box', 'bag', 'jar');

-- CreateTable
CREATE TABLE "kitchen_items" (
    "id" UUID NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "storage_location" "StorageLocation" NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit" "Unit" NOT NULL,
    "expiration_date" DATE,
    "notes" VARCHAR(1000),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "kitchen_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kitchen_items_user_id_idx" ON "kitchen_items"("user_id");

-- CreateIndex
CREATE INDEX "kitchen_items_user_id_storage_location_idx" ON "kitchen_items"("user_id", "storage_location");

-- CreateIndex
CREATE INDEX "kitchen_items_user_id_expiration_date_idx" ON "kitchen_items"("user_id", "expiration_date");

-- CreateIndex
CREATE INDEX "kitchen_items_user_id_category_idx" ON "kitchen_items"("user_id", "category");
