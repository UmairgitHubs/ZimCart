-- CreateEnum
CREATE TYPE "RiderAvailability" AS ENUM ('AVAILABLE', 'DISPATCHED', 'OFFLINE');

-- CreateTable
CREATE TABLE "RiderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nationalId" TEXT,
    "vehicleType" TEXT NOT NULL DEFAULT 'Motorcycle',
    "licensePlate" TEXT,
    "homeBaseLabel" TEXT,
    "availability" "RiderAvailability" NOT NULL DEFAULT 'OFFLINE',
    "completedDropoffs" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RiderProfile_userId_key" ON "RiderProfile"("userId");

-- AddForeignKey
ALTER TABLE "RiderProfile" ADD CONSTRAINT "RiderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
