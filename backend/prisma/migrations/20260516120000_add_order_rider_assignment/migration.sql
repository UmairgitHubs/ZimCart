-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "riderId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "assignedAt" TIMESTAMP(3);

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_riderId_idx" ON "Order"("riderId");
