/*
  Warnings:

  - Added the required column `image` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "order_id" TEXT NOT NULL,
    CONSTRAINT "products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("id", "name", "order_id", "value") SELECT "id", "name", "order_id", "value" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE TABLE "new_quantities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "size_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "product_id" TEXT,
    CONSTRAINT "quantities_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quantities_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_quantities" ("id", "product_id", "quantity", "size_id") SELECT "id", "product_id", "quantity", "size_id" FROM "quantities";
DROP TABLE "quantities";
ALTER TABLE "new_quantities" RENAME TO "quantities";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
