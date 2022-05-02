/*
  Warnings:

  - You are about to drop the column `cupom` on the `Discount` table. All the data in the column will be lost.
  - Added the required column `coupon` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coupon" TEXT NOT NULL,
    "value" INTEGER NOT NULL
);
INSERT INTO "new_Discount" ("id", "value") SELECT "id", "value" FROM "Discount";
DROP TABLE "Discount";
ALTER TABLE "new_Discount" RENAME TO "Discount";
CREATE UNIQUE INDEX "Discount_coupon_key" ON "Discount"("coupon");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
