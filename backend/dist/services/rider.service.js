import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
function toUiStatus(user, availability) {
    if (user.status === 'BLOCKED')
        return 'Banned';
    if (user.status === 'INACTIVE')
        return 'Offline';
    if (!availability)
        return 'Offline';
    if (availability === 'AVAILABLE')
        return 'Available';
    if (availability === 'DISPATCHED')
        return 'Dispatched';
    return 'Offline';
}
function uiStatusToDb(ui) {
    if (ui === 'Banned')
        return { userStatus: 'BLOCKED', availability: 'OFFLINE' };
    if (ui === 'Offline')
        return { userStatus: 'ACTIVE', availability: 'OFFLINE' };
    if (ui === 'Dispatched')
        return { userStatus: 'ACTIVE', availability: 'DISPATCHED' };
    return { userStatus: 'ACTIVE', availability: 'AVAILABLE' };
}
function formatLastActive(sessions) {
    const latest = sessions[0]?.lastActive;
    if (!latest)
        return 'Never';
    const diffMs = Date.now() - new Date(latest).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1)
        return 'Just now';
    if (mins < 60)
        return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 48)
        return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}
export function serializeRider(user) {
    const profile = user.riderProfile;
    const status = toUiStatus(user, profile?.availability ?? null);
    const avatarUrl = user.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d9488&color=fff&format=png`;
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        idNumber: profile?.nationalId || '',
        vehicleType: profile?.vehicleType || 'Motorcycle',
        licensePlate: profile?.licensePlate || 'N/A',
        assignedHub: profile?.homeBaseLabel || '—',
        status,
        distanceKm: 0,
        rating: profile?.rating ?? 0,
        totalDeliveries: profile?.completedDropoffs ?? 0,
        lastActive: formatLastActive(user.sessions),
        avatarUrl,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
}
const riderInclude = {
    riderProfile: true,
    sessions: {
        orderBy: { lastActive: 'desc' },
        take: 1,
        select: { lastActive: true },
    },
};
export async function listRiders(params) {
    const { page, limit, search, status } = params;
    const skip = (page - 1) * limit;
    const where = {
        role: 'RIDER',
    };
    if (search?.trim()) {
        const q = search.trim();
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q, mode: 'insensitive' } },
            { riderProfile: { licensePlate: { contains: q, mode: 'insensitive' } } },
            { id: { contains: q, mode: 'insensitive' } },
        ];
    }
    if (status && status !== 'All') {
        if (status === 'Banned') {
            where.status = 'BLOCKED';
        }
        else if (status === 'Available') {
            where.AND = [{ status: 'ACTIVE' }, { riderProfile: { availability: 'AVAILABLE' } }];
        }
        else if (status === 'Dispatched') {
            where.AND = [{ status: 'ACTIVE' }, { riderProfile: { availability: 'DISPATCHED' } }];
        }
        else if (status === 'Offline') {
            where.AND = [
                { status: { not: 'BLOCKED' } },
                {
                    OR: [{ status: 'INACTIVE' }, { riderProfile: { availability: 'OFFLINE' } }],
                },
            ];
        }
    }
    const [rows, total] = await Promise.all([
        prisma.user.findMany({
            where,
            include: riderInclude,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);
    const allForStats = await prisma.user.findMany({
        where: { role: 'RIDER' },
        select: {
            status: true,
            riderProfile: { select: { availability: true } },
        },
    });
    let availableNow = 0;
    let onDelivery = 0;
    let offline = 0;
    let banned = 0;
    for (const u of allForStats) {
        const s = toUiStatus(u, u.riderProfile?.availability ?? null);
        if (s === 'Available')
            availableNow++;
        else if (s === 'Dispatched')
            onDelivery++;
        else if (s === 'Banned')
            banned++;
        else
            offline++;
    }
    return {
        riders: rows.map((row) => serializeRider(row)),
        pagination: { total, page, pages: Math.ceil(total / limit) || 1 },
        stats: {
            totalFleet: allForStats.length,
            availableNow,
            onDelivery,
            offline,
            banned,
        },
    };
}
export async function createRider(input) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists)
        throw new ApiError(409, 'Email already registered');
    const hashed = await bcrypt.hash(input.password, 10);
    const availability = input.availability ?? 'OFFLINE';
    const accountStatus = input.accountStatus ?? 'ACTIVE';
    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            password: hashed,
            role: 'RIDER',
            status: accountStatus,
            riderProfile: {
                create: {
                    nationalId: input.nationalId || null,
                    vehicleType: input.vehicleType || 'Motorcycle',
                    licensePlate: input.licensePlate || null,
                    homeBaseLabel: input.homeBaseLabel || null,
                    availability,
                },
            },
        },
        include: riderInclude,
    });
    return serializeRider(user);
}
export async function updateRider(id, input) {
    const user = await prisma.user.findFirst({
        where: { id, role: 'RIDER' },
        include: { riderProfile: true },
    });
    if (!user)
        throw new ApiError(404, 'Rider not found');
    if (input.email && input.email !== user.email) {
        const taken = await prisma.user.findUnique({ where: { email: input.email } });
        if (taken)
            throw new ApiError(409, 'Email already in use');
    }
    const userPatch = {};
    if (input.name !== undefined)
        userPatch.name = input.name;
    if (input.email !== undefined)
        userPatch.email = input.email;
    if (input.phone !== undefined)
        userPatch.phone = input.phone;
    const profilePatch = {};
    if (input.nationalId !== undefined)
        profilePatch.nationalId = input.nationalId;
    if (input.vehicleType !== undefined)
        profilePatch.vehicleType = input.vehicleType;
    if (input.licensePlate !== undefined)
        profilePatch.licensePlate = input.licensePlate;
    if (input.homeBaseLabel !== undefined)
        profilePatch.homeBaseLabel = input.homeBaseLabel;
    if (input.completedDropoffs !== undefined)
        profilePatch.completedDropoffs = input.completedDropoffs;
    if (input.rating !== undefined)
        profilePatch.rating = input.rating;
    if (input.status !== undefined) {
        const mapped = uiStatusToDb(input.status);
        userPatch.status = mapped.userStatus;
        profilePatch.availability = mapped.availability;
    }
    else {
        if (input.accountStatus !== undefined)
            userPatch.status = input.accountStatus;
        if (input.availability !== undefined)
            profilePatch.availability = input.availability;
    }
    const data = { ...userPatch };
    if (Object.keys(profilePatch).length > 0) {
        if (user.riderProfile) {
            data.riderProfile = { update: profilePatch };
        }
        else {
            data.riderProfile = {
                create: {
                    nationalId: input.nationalId ?? null,
                    vehicleType: input.vehicleType || 'Motorcycle',
                    licensePlate: input.licensePlate ?? null,
                    homeBaseLabel: input.homeBaseLabel ?? null,
                    availability: profilePatch.availability ?? 'OFFLINE',
                    completedDropoffs: input.completedDropoffs ?? 0,
                    rating: input.rating ?? 0,
                },
            };
        }
    }
    const updated = await prisma.user.update({
        where: { id },
        data,
        include: riderInclude,
    });
    return serializeRider(updated);
}
export async function deleteRider(id) {
    const user = await prisma.user.findFirst({ where: { id, role: 'RIDER' } });
    if (!user)
        throw new ApiError(404, 'Rider not found');
    await prisma.user.delete({ where: { id } });
}
//# sourceMappingURL=rider.service.js.map