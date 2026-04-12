export type MartStoreStatus = 'OPEN' | 'CLOSED' | 'BUSY' | 'HIDDEN';

export interface MartStoreSettingsDto {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  rating: number;
  deliveryTime: string | null;
  minOrder: number;
  deliveryFee: number;
  isActive: boolean;
  status: MartStoreStatus;
  openingHours: Record<string, unknown> | null;
  managerId: string | null;
}
