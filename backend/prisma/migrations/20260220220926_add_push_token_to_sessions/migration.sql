-- AlterTable
ALTER TABLE "NotificationPreference" ADD COLUMN     "deliveryUpdatesEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "newArrivalsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "orderUpdatesEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "vibrationEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserSession" ADD COLUMN     "pushToken" TEXT;
