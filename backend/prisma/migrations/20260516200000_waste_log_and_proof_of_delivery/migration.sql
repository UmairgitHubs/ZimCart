-- CreateEnum
CREATE TYPE "WasteReason" AS ENUM ('EXPIRED', 'DAMAGED', 'LEAKED', 'SPOILAGE', 'LOST');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "proofOfDeliveryUrl" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "WasteLog" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "totalLoss" DOUBLE PRECISION NOT NULL,
    "reason" "WasteReason" NOT NULL,
    "notes" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "loggedById" TEXT NOT NULL,

    CONSTRAINT "WasteLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WasteLog_storeId_createdAt_idx" ON "WasteLog"("storeId", "createdAt");
CREATE INDEX IF NOT EXISTS "WasteLog_productId_idx" ON "WasteLog"("productId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "WasteLog" ADD CONSTRAINT "WasteLog_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "WasteLog" ADD CONSTRAINT "WasteLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "WasteLog" ADD CONSTRAINT "WasteLog_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
