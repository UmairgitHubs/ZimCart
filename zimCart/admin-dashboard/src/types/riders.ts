export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  status: 'Available' | 'Dispatched' | 'Offline' | 'Banned';
  distanceKm: number; // For Rider Radar
  rating: number;
  totalDeliveries: number;
  lastActive: string;
  avatarUrl: string;
}
