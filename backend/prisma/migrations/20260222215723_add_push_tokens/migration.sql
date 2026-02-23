/*
  Warnings:

  - You are about to drop the column `deliveryUpdatesEnabled` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `newArrivalsEnabled` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `orderUpdatesEnabled` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `soundEnabled` on the `NotificationPreference` table. All the data in the column will be lost.
  - You are about to drop the column `vibrationEnabled` on the `NotificationPreference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pushToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NotificationPreference" DROP COLUMN "deliveryUpdatesEnabled",
DROP COLUMN "newArrivalsEnabled",
DROP COLUMN "orderUpdatesEnabled",
DROP COLUMN "soundEnabled",
DROP COLUMN "vibrationEnabled";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pushToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_pushToken_key" ON "User"("pushToken");
