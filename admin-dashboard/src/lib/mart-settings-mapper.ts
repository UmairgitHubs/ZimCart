import type { MartStoreSettingsDto } from '@/types/martSettings';
import type { StoreSettings } from '@/types/settings';

const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

type Prefs = {
  contactEmail?: string;
  supportPhone?: string;
  physicalAddress?: string;
  currency?: string;
  timezone?: string;
  taxRate?: number;
  deliveryRadiusKm?: number;
  emergencyClose?: boolean;
  holidays?: { date: string; description: string }[];
};

function readPrefs(raw: unknown): Prefs {
  if (!raw || typeof raw !== 'object') return {};
  const oh = raw as Record<string, unknown>;
  const p = oh._preferences;
  if (!p || typeof p !== 'object') return {};
  return p as Prefs;
}

function readSimpleHours(raw: unknown): { open: string; close: string } {
  if (!raw || typeof raw !== 'object') return { open: '08:00', close: '22:00' };
  const oh = raw as Record<string, unknown>;
  const mon = oh.monday;
  if (mon && typeof mon === 'object') {
    const m = mon as { open?: string; close?: string };
    return { open: m.open ?? '08:00', close: m.close ?? '22:00' };
  }
  return { open: '08:00', close: '22:00' };
}

export function martDtoToStoreSettings(dto: MartStoreSettingsDto): StoreSettings {
  const prefs = readPrefs(dto.openingHours);
  const hours = readSimpleHours(dto.openingHours);

  return {
    storeName: dto.name,
    martDescription: dto.description ?? '',
    martImageUrl: dto.image ?? '',
    martDeliveryTime: dto.deliveryTime ?? '',
    martMinOrder: dto.minOrder,
    martDeliveryFee: dto.deliveryFee,
    martIsActive: dto.isActive,
    martStatus: dto.status,
    contactEmail: prefs.contactEmail ?? '',
    supportPhone: prefs.supportPhone ?? '',
    physicalAddress: prefs.physicalAddress ?? '',
    currency: prefs.currency ?? 'USD',
    timezone: prefs.timezone ?? 'Africa/Harare',
    taxRate: prefs.taxRate ?? 0,
    deliveryRadiusKm: prefs.deliveryRadiusKm ?? 0,
    storeHours: {
      openTitle: 'Opening Time',
      closeTitle: 'Closing Time',
      openTime: hours.open,
      closeTime: hours.close,
    },
    emergencyClose: prefs.emergencyClose ?? false,
    holidayCalendar: Array.isArray(prefs.holidays) ? prefs.holidays : [],
    complianceDocuments: [],
  };
}

export function buildOpeningHoursJson(
  form: StoreSettings,
  previous: MartStoreSettingsDto | null
): Record<string, unknown> {
  const prev = (previous?.openingHours && typeof previous.openingHours === 'object'
    ? previous.openingHours
    : {}) as Record<string, unknown>;

  const prefs: Prefs = {
    contactEmail: form.contactEmail,
    supportPhone: form.supportPhone,
    physicalAddress: form.physicalAddress,
    currency: form.currency,
    timezone: form.timezone,
    taxRate: form.taxRate,
    deliveryRadiusKm: form.deliveryRadiusKm,
    emergencyClose: form.emergencyClose,
    holidays: form.holidayCalendar ?? [],
  };

  const weekly: Record<string, { open: string; close: string; closed: boolean }> = {};
  for (const d of WEEKDAYS) {
    weekly[d] = {
      open: form.storeHours.openTime,
      close: form.storeHours.closeTime,
      closed: false,
    };
  }

  return {
    ...prev,
    ...weekly,
    _preferences: prefs,
  };
}

export function buildMartSettingsPatch(
  form: StoreSettings,
  server: MartStoreSettingsDto,
  opts: { role: 'ADMIN' | 'STORE_MANAGER'; adminStoreId?: string }
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    name: form.storeName.trim(),
    description: form.martDescription.trim() || null,
    image: form.martImageUrl.trim() || null,
    deliveryTime: form.martDeliveryTime.trim() || null,
    minOrder: form.martMinOrder,
    deliveryFee: form.martDeliveryFee,
    isActive: form.martIsActive,
    status: form.martStatus,
    openingHours: buildOpeningHoursJson(form, server),
  };

  if (opts.role === 'ADMIN' && opts.adminStoreId) {
    body.storeId = opts.adminStoreId;
  }

  return body;
}
