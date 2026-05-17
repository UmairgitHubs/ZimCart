import apiClient from '@/lib/api-client';
import type { Rider } from '@/types/riders';

export type RiderListResponse = {
  riders: Rider[];
  pagination: { total: number; page: number; pages: number };
  stats: {
    totalFleet: number;
    availableNow: number;
    onDelivery: number;
    offline: number;
    banned: number;
  };
};

function mapUiStatusToAvailability(status: Rider['status']): 'AVAILABLE' | 'DISPATCHED' | 'OFFLINE' {
  if (status === 'Available') return 'AVAILABLE';
  if (status === 'Dispatched') return 'DISPATCHED';
  return 'OFFLINE';
}

export const riderAdminApi = {
  async list(params: { page?: number; limit?: number; search?: string; status?: string }) {
    const { data } = await apiClient.get('/riders', { params });
    return data.data as RiderListResponse;
  },

  async create(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    nationalId?: string;
    vehicleType: string;
    licensePlate?: string;
    homeBaseLabel?: string;
    status: Rider['status'];
  }) {
    const body: Record<string, unknown> = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      nationalId: payload.nationalId,
      vehicleType: payload.vehicleType,
      licensePlate: payload.licensePlate || undefined,
      homeBaseLabel: payload.homeBaseLabel,
    };
    if (payload.status === 'Banned') {
      body.accountStatus = 'BLOCKED';
      body.availability = 'OFFLINE';
    } else {
      body.availability = mapUiStatusToAvailability(payload.status);
    }
    const { data } = await apiClient.post('/riders', body);
    return (data.data as { rider: Rider }).rider;
  },

  async update(
    id: string,
    payload: Partial<
      Pick<
        Rider,
        | 'name'
        | 'email'
        | 'phone'
        | 'idNumber'
        | 'vehicleType'
        | 'licensePlate'
        | 'assignedHub'
        | 'status'
        | 'totalDeliveries'
        | 'rating'
      >
    >
  ) {
    const body: Record<string, unknown> = {};
    if (payload.name !== undefined) body.name = payload.name;
    if (payload.email !== undefined) body.email = payload.email;
    if (payload.phone !== undefined) body.phone = payload.phone;
    if (payload.idNumber !== undefined) body.nationalId = payload.idNumber;
    if (payload.vehicleType !== undefined) body.vehicleType = payload.vehicleType;
    if (payload.licensePlate !== undefined) body.licensePlate = payload.licensePlate;
    if (payload.assignedHub !== undefined) body.homeBaseLabel = payload.assignedHub;
    if (payload.status !== undefined) body.status = payload.status;
    if (payload.totalDeliveries !== undefined) body.completedDropoffs = payload.totalDeliveries;
    if (payload.rating !== undefined) body.rating = payload.rating;

    const { data } = await apiClient.patch(`/riders/${id}`, body);
    return (data.data as { rider: Rider }).rider;
  },

  async remove(id: string) {
    await apiClient.delete(`/riders/${id}`);
  },

  async getLiveMap() {
    const { data } = await apiClient.get('/riders/live-map');
    return data.data.riders as {
      id: string;
      name: string;
      status: string;
      latitude: number | null;
      longitude: number | null;
      activeOrders: { orderNumber: string }[];
    }[];
  },

  async listPayouts(status = 'All') {
    const { data } = await apiClient.get('/riders/payouts', { params: { status } });
    return data.data.payouts as RiderPayoutAdmin[];
  },

  async updatePayout(id: string, body: { status: string; adminNotes?: string }) {
    const { data } = await apiClient.patch(`/riders/payouts/${id}`, body);
    return data.data.payout as RiderPayoutAdmin;
  },
};

export type RiderPayoutAdmin = {
  id: string;
  amount: number;
  method: string;
  accountRef: string;
  accountName: string | null;
  status: string;
  notes: string | null;
  adminNotes: string | null;
  requestedAt: string;
  processedAt: string | null;
  rider: { id: string; name: string; email: string; phone: string | null };
};
