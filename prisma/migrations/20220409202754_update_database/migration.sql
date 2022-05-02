/*
  Warnings:

  - The primary key for the `quantities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `quantities` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `size_id` on the `quantities` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `sizes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quantities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "size_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "product_id" TEXT,
    CONSTRAINT "quantities_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quantities_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_quantities" ("id", "product_id", "quantity", "size_id") SELECT "id", "product_id", "quantity", "size_id" FROM "quantities";
DROP TABLE "quantities";
ALTER TABLE "new_quantities" RENAME TO "quantities";
CREATE TABLE "new_sizes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_sizes" ("name") SELECT "name" FROM "sizes";
DROP TABLE "sizes";
ALTER TABLE "new_sizes" RENAME TO "sizes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
