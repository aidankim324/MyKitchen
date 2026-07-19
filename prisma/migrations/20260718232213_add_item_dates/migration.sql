-- AlterTable
ALTER TABLE "kitchen_items" ADD COLUMN     "date_bought" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "opened_date" DATE;

-- CreateIndex
CREATE INDEX "kitchen_items_user_id_date_bought_idx" ON "kitchen_items"("user_id", "date_bought");
