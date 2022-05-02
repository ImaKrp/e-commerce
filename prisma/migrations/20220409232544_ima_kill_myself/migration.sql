/*
  Warnings:

  - You are about to drop the `_OrderedProductsToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_id` to the `OrderedProducts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_OrderedProductsToProduct_B_index";

-- DropIndex
DROP INDEX "_OrderedProductsToProduct_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_OrderedProductsToProduct";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderedProducts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "OrderedProducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderedProducts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderedProducts_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "Size" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderedProducts" ("categoryId", "id", "order_id", "quantity", "size_id") SELECT "categoryId", "id", "order_id", "quantity", "size_id" FROM "OrderedProducts";
DROP TABLE "OrderedProducts";
ALTER TABLE "new_OrderedProducts" RENAME TO "OrderedProducts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
