import { z } from 'zod';
const availabilityEnum = z.enum(['AVAILABLE', 'DISPATCHED', 'OFFLINE']);
export const createRiderSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(120),
        email: z.string().email(),
        phone: z.string().min(5).max(40),
        password: z.string().min(8).max(128),
        nationalId: z.string().max(40).optional(),
        vehicleType: z.string().min(1).max(60).optional(),
        licensePlate: z.string().max(30).optional(),
        homeBaseLabel: z.string().max(120).optional(),
        availability: availabilityEnum.optional(),
        accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
    }),
});
const uiStatus = z.enum(['Available', 'Dispatched', 'Offline', 'Banned']);
export const updateRiderSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(120).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(5).max(40).optional(),
        nationalId: z.string().max(40).nullable().optional(),
        vehicleType: z.string().min(1).max(60).optional(),
        licensePlate: z.string().max(30).nullable().optional(),
        homeBaseLabel: z.string().max(120).nullable().optional(),
        /** Dashboard fleet status (preferred over raw availability/accountStatus) */
        status: uiStatus.optional(),
        availability: availabilityEnum.optional(),
        accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
        completedDropoffs: z.number().int().min(0).optional(),
        rating: z.number().min(0).max(5).optional(),
    }),
});
//# sourceMappingURL=rider.schema.js.map