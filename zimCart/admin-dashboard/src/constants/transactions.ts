import { Transaction } from "@/types/transactions";

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TRX-9001",
    orderId: "ORD-2001",
    customerName: "Tadiwa Mukucha",
    amount: 124.50,
    currency: "USD",
    status: "Completed",
    paymentMethod: "EcoCash",
    timestamp: "2026-02-25T04:30:00Z",
    reference: "PP-EC-552145"
  },
  {
    id: "TRX-9002",
    orderId: "ORD-2002",
    customerName: "Nyasha Chidambaram",
    amount: 54.20,
    currency: "USD",
    status: "Pending",
    paymentMethod: "InnBucks",
    timestamp: "2026-02-25T05:15:00Z",
    reference: "IB-TX-9982"
  },
  {
    id: "TRX-9003",
    orderId: "ORD-2003",
    customerName: "Farai Matombo",
    amount: 890.00,
    currency: "USD",
    status: "Completed",
    paymentMethod: "Visa/MasterCard",
    timestamp: "2026-02-24T18:20:00Z",
    reference: "VC-AUTH-4421"
  },
  {
    id: "TRX-9004",
    orderId: "ORD-2004",
    customerName: "Rufaro Sibanda",
    amount: 25.00,
    currency: "USD",
    status: "Failed",
    paymentMethod: "EcoCash",
    timestamp: "2026-02-24T14:10:00Z",
    reference: "PP-EC-FAIL-01"
  },
  {
    id: "TRX-9005",
    orderId: "ORD-2005",
    customerName: "Tendai Shumba",
    amount: 320.00,
    currency: "USD",
    status: "Refunded",
    paymentMethod: "Bank Transfer",
    timestamp: "2026-02-23T11:05:00Z",
    reference: "BT-ZIM-7781"
  },
  {
    id: "TRX-9006",
    orderId: "ORD-2006",
    customerName: "Blessing Moyo",
    amount: 45.00,
    currency: "USD",
    status: "Completed",
    paymentMethod: "OMari",
    timestamp: "2026-02-23T09:45:00Z",
    reference: "OM-TX-3321"
  }
];
