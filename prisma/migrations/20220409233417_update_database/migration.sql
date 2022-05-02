/*
  Warnings:

  - You are about to drop the `_OrdersToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `categoryId` on the `OrderedProducts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_OrdersToProduct_B_index";

-- DropIndex
DROP INDEX "_OrdersToProduct_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_OrdersToProduct";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "product_id" TEXT,
    CONSTRAINT "Category_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderedProducts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    CONSTRAINT "OrderedProducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderedProducts_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderedProducts_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "Size" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderedProducts" ("id", "order_id", "product_id", "quantity", "size_id") SELECT "id", "order_id", "product_id", "quantity", "size_id" FROM "OrderedProducts";
DROP TABLE "OrderedProducts";
ALTER TABLE "new_OrderedProducts" RENAME TO "OrderedProducts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
