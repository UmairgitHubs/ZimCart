/*
  Warnings:

  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationPreference" ADD COLUMN     "deliveryUpdatesEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "newArrivalsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "orderUpdatesEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "vibrationEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
DROP COLUMN "stock",
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "costPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discountPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "inventory" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isDeal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Draft',
ADD COLUMN     "subCategory" TEXT,
ADD COLUMN     "taxPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "variants" JSONB,
ADD COLUMN     "weight" TEXT,
ALTER COLUMN "discountPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "country" TEXT,
ADD COLUMN     "privacyConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "termsConsent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'system',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
