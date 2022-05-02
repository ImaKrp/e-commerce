-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT,
    "permission" TEXT NOT NULL DEFAULT 'client',
    "order_id" TEXT NOT NULL,
    CONSTRAINT "users_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "order_id" TEXT NOT NULL,
    CONSTRAINT "products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sizes" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "quantities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "size_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "product_id" TEXT,
    CONSTRAINT "quantities_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quantities_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
