/*
  Warnings:

  - You are about to drop the column `product_id` on the `OrderedProducts` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_OrderedProductsToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "OrderedProducts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderedProducts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "OrderedProducts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderedProducts_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "Size" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderedProducts" ("categoryId", "id", "order_id", "quantity", "size_id") SELECT "categoryId", "id", "order_id", "quantity", "size_id" FROM "OrderedProducts";
DROP TABLE "OrderedProducts";
ALTER TABLE "new_OrderedProducts" RENAME TO "OrderedProducts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_OrderedProductsToProduct_AB_unique" ON "_OrderedProductsToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderedProductsToProduct_B_index" ON "_OrderedProductsToProduct"("B");
