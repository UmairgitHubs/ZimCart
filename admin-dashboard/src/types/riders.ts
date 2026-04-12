export interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string; // National ID or Driver's License
  vehicleType: string;
  licensePlate: string;
  assignedHub: string; // The warehouse or hub they operate from
  status: 'Available' | 'Dispatched' | 'Offline' | 'Banned';
  distanceKm: number;
  rating: number;
  totalDeliveries: number;
  lastActive: string;
  avatarUrl: string;
  createdAt?: string;
  updatedAt?: string;
}
