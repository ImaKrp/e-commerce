/*
  Warnings:

  - You are about to drop the column `order_id` on the `users` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT,
    "permission" TEXT NOT NULL DEFAULT 'client'
);
INSERT INTO "new_users" ("email", "id", "last_name", "name", "password", "permission") SELECT "email", "id", "last_name", "name", "password", "permission" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
