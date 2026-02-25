import { 
  ProfileSettings, 
  StoreSettings, 
  NotificationSettings, 
  SecuritySettings 
} from "@/types/settings";

export const MOCK_PROFILE_SETTINGS: ProfileSettings = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@zimcart.co.zw",
  phoneNumber: "+263 77 123 4567",
  role: "Super Admin",
  avatarUrl: "https://i.pravatar.cc/150?u=jane",
};

export const MOCK_STORE_SETTINGS: StoreSettings = {
  storeName: "ZimCart Mart Hub",
  contactEmail: "support@zimcart.co.zw",
  supportPhone: "+263 86 44 222 111",
  physicalAddress: "123 Samora Machel Ave, Harare, Zimbabwe",
  currency: "ZWL",
  timezone: "Africa/Harare",
  taxRate: 15.0,
  deliveryRadiusKm: 25,
  storeHours: {
    openTitle: "Opening Time",
    closeTitle: "Closing Time",
    openTime: "08:00",
    closeTime: "22:00"
  },
  emergencyClose: false,
  holidayCalendar: [
    { date: "2026-04-18", description: "Independence Day" },
    { date: "2026-05-01", description: "Workers' Day" }
  ],
  complianceDocuments: [
    { id: "tax-001", name: "ZRA Tax Clearance 2026", status: "Verified", uploadedAt: "2026-01-10T14:30:00Z" },
    { id: "lic-001", name: "Harare Trading License", status: "Verified", uploadedAt: "2026-01-05T09:15:00Z" },
    { id: "saf-001", name: "Health & Safety Certificate", status: "Pending", uploadedAt: "2026-02-25T11:45:00Z" }
  ]
};

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailAlerts: {
    newOrders: true,
    cancellations: true,
    inventoryLow: true,
    marketing: false,
  },
  pushAlerts: {
    newOrders: true,
    cancellations: true,
    supportTickets: true,
    systemUpdates: false,
  }
};

export const MOCK_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorAuth: false,
  passwordLastChanged: "2026-01-15T10:30:00Z",
  activeSessions: [
    {
      device: "MacBook Pro - Chrome",
      location: "Harare, ZW",
      lastActive: "Just now",
      isCurrent: true,
    },
    {
      device: "iPhone 15 Pro - Safari",
      location: "Harare, ZW",
      lastActive: "2 hours ago",
      isCurrent: false,
    }
  ]
};
