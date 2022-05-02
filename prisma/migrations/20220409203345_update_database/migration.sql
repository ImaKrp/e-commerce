/*
  Warnings:

  - Added the required column `user_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_id` on table `quantities` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("created_at", "done", "id", "value") SELECT "created_at", "done", "id", "value" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE UNIQUE INDEX "orders_user_id_key" ON "orders"("user_id");
CREATE TABLE "new_quantities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "size_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "product_id" TEXT NOT NULL,
    CONSTRAINT "quantities_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quantities_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_quantities" ("id", "product_id", "quantity", "size_id") SELECT "id", "product_id", "quantity", "size_id" FROM "quantities";
DROP TABLE "quantities";
ALTER TABLE "new_quantities" RENAME TO "quantities";
CREATE UNIQUE INDEX "quantities_size_id_key" ON "quantities"("size_id");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT,
    "permission" TEXT NOT NULL DEFAULT 'client',
    "order_id" TEXT NOT NULL
);
INSERT INTO "new_users" ("email", "id", "last_name", "name", "order_id", "password", "permission") SELECT "email", "id", "last_name", "name", "order_id", "password", "permission" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
