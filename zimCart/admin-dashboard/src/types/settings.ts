export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  avatarUrl: string;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  supportPhone: string;
  physicalAddress: string;
  currency: string;
  timezone: string;
  taxRate: number;
  deliveryRadiusKm: number;
  storeHours: {
    openTitle: string;
    closeTitle: string;
    openTime: string;
    closeTime: string;
  };
  emergencyClose: boolean;
  holidayCalendar: { date: string; description: string }[];
  complianceDocuments: { id: string; name: string; status: 'Verified' | 'Pending' | 'Rejected'; uploadedAt: string }[];
}

export interface NotificationSettings {
  emailAlerts: {
    newOrders: boolean;
    cancellations: boolean;
    inventoryLow: boolean;
    marketing: boolean;
  };
  pushAlerts: {
    newOrders: boolean;
    cancellations: boolean;
    supportTickets: boolean;
    systemUpdates: boolean;
  };
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordLastChanged: string;
  activeSessions: {
    device: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
  }[];
}
