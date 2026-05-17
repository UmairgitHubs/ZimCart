import type { RiderAvailability, UserStatus } from '@prisma/client';
export type RiderUiStatus = 'Available' | 'Dispatched' | 'Offline' | 'Banned';
export declare function serializeRider(user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    riderProfile: {
        nationalId: string | null;
        vehicleType: string;
        licensePlate: string | null;
        homeBaseLabel: string | null;
        availability: RiderAvailability;
        completedDropoffs: number;
        rating: number;
    } | null;
    sessions: {
        lastActive: Date;
    }[];
}): {
    id: string;
    name: string;
    email: string;
    phone: string;
    idNumber: string;
    vehicleType: string;
    licensePlate: string;
    assignedHub: string;
    status: RiderUiStatus;
    distanceKm: number;
    rating: number;
    totalDeliveries: number;
    lastActive: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
};
export declare function listRiders(params: {
    page: number;
    limit: number;
    search?: string;
    status?: RiderUiStatus | 'All';
}): Promise<{
    riders: {
        id: string;
        name: string;
        email: string;
        phone: string;
        idNumber: string;
        vehicleType: string;
        licensePlate: string;
        assignedHub: string;
        status: RiderUiStatus;
        distanceKm: number;
        rating: number;
        totalDeliveries: number;
        lastActive: string;
        avatarUrl: string;
        createdAt: string;
        updatedAt: string;
    }[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
    stats: {
        totalFleet: number;
        availableNow: number;
        onDelivery: number;
        offline: number;
        banned: number;
    };
}>;
export declare function createRider(input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    nationalId?: string;
    vehicleType?: string;
    licensePlate?: string;
    homeBaseLabel?: string;
    availability?: RiderAvailability;
    accountStatus?: UserStatus;
}): Promise<{
    id: string;
    name: string;
    email: string;
    phone: string;
    idNumber: string;
    vehicleType: string;
    licensePlate: string;
    assignedHub: string;
    status: RiderUiStatus;
    distanceKm: number;
    rating: number;
    totalDeliveries: number;
    lastActive: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
}>;
export declare function updateRider(id: string, input: {
    name?: string;
    email?: string;
    phone?: string;
    nationalId?: string | null;
    vehicleType?: string;
    licensePlate?: string | null;
    homeBaseLabel?: string | null;
    /** Dashboard fleet status */
    status?: RiderUiStatus;
    availability?: RiderAvailability;
    accountStatus?: UserStatus;
    completedDropoffs?: number;
    rating?: number;
}): Promise<{
    id: string;
    name: string;
    email: string;
    phone: string;
    idNumber: string;
    vehicleType: string;
    licensePlate: string;
    assignedHub: string;
    status: RiderUiStatus;
    distanceKm: number;
    rating: number;
    totalDeliveries: number;
    lastActive: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
}>;
export declare function deleteRider(id: string): Promise<void>;
//# sourceMappingURL=rider.service.d.ts.map