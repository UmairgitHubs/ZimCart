import { z } from 'zod';
export declare const createRiderSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        password: z.ZodString;
        nationalId: z.ZodOptional<z.ZodString>;
        vehicleType: z.ZodOptional<z.ZodString>;
        licensePlate: z.ZodOptional<z.ZodString>;
        homeBaseLabel: z.ZodOptional<z.ZodString>;
        availability: z.ZodOptional<z.ZodEnum<{
            AVAILABLE: "AVAILABLE";
            DISPATCHED: "DISPATCHED";
            OFFLINE: "OFFLINE";
        }>>;
        accountStatus: z.ZodOptional<z.ZodEnum<{
            ACTIVE: "ACTIVE";
            INACTIVE: "INACTIVE";
            BLOCKED: "BLOCKED";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateRiderSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        nationalId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vehicleType: z.ZodOptional<z.ZodString>;
        licensePlate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        homeBaseLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodOptional<z.ZodEnum<{
            Available: "Available";
            Dispatched: "Dispatched";
            Offline: "Offline";
            Banned: "Banned";
        }>>;
        availability: z.ZodOptional<z.ZodEnum<{
            AVAILABLE: "AVAILABLE";
            DISPATCHED: "DISPATCHED";
            OFFLINE: "OFFLINE";
        }>>;
        accountStatus: z.ZodOptional<z.ZodEnum<{
            ACTIVE: "ACTIVE";
            INACTIVE: "INACTIVE";
            BLOCKED: "BLOCKED";
        }>>;
        completedDropoffs: z.ZodOptional<z.ZodNumber>;
        rating: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=rider.schema.d.ts.map