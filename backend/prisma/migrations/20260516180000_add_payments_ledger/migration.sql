-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerRef" TEXT,
    "adminNotes" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill ledger rows for existing orders
INSERT INTO "Payment" ("id", "orderId", "amount", "currency", "method", "status", "createdAt", "updatedAt", "paidAt")
SELECT
    gen_random_uuid()::text,
    o."id",
    o."total",
    'USD',
    o."paymentMethod",
    CASE
        WHEN o."status" = 'CANCELLED' THEN 'CANCELLED'::"PaymentStatus"
        WHEN o."status" = 'COMPLETED' THEN 'PAID'::"PaymentStatus"
        ELSE 'PENDING'::"PaymentStatus"
    END,
    o."createdAt",
    o."updatedAt",
    CASE WHEN o."status" = 'COMPLETED' THEN o."updatedAt" ELSE NULL END
FROM "Order" o
WHERE NOT EXISTS (SELECT 1 FROM "Payment" p WHERE p."orderId" = o."id");
