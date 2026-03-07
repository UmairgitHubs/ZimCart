import { SupportTicket } from "@/types/support";

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "TIC-8001",
    customerId: "CUST-001",
    customerName: "Tadiwa Mukucha",
    customerEmail: "tadiwa.m@gmail.com",
    orderId: "ORD-2001",
    subject: "Driver marked order as delivered but I didn't receive it",
    category: "Delivery",
    priority: "Critical",
    status: "Open",
    assignedAgent: "Sarah J.",
    createdAt: "2026-02-25T19:30:00Z",
    updatedAt: "2026-02-25T20:15:00Z",
    messages: [
      {
        id: "MSG-01",
        sender: "Customer",
        senderName: "Tadiwa Mukucha",
        content: "Hi, I just got a notification that my order ORD-2001 was delivered, but I have been at my gate for 20 minutes and no rider came. Please help.",
        timestamp: "2026-02-25T19:30:00Z"
      },
      {
        id: "MSG-02",
        sender: "Agent",
        senderName: "Sarah J.",
        content: "Hello Tadiwa, I'm very sorry about this. I am checking the GPS logs for the assigned rider in the Avondale area right now. I will call the rider immediately.",
        timestamp: "2026-02-25T19:40:00Z"
      },
      {
        id: "MSG-03",
        sender: "System",
        senderName: "Automated Routing",
        content: "Rider ID RD-445 GPS Ping: 1.2km away from destination.",
        timestamp: "2026-02-25T19:42:00Z",
        isInternal: true
      }
    ]
  },
  {
    id: "TIC-8002",
    customerId: "CUST-009",
    customerName: "Rumbi Matsika",
    customerEmail: "rumbi.m@hotmail.com",
    subject: "Promo code WELCOME10 isn't working on checkout",
    category: "Payment",
    priority: "Medium",
    status: "In Progress",
    assignedAgent: "David M.",
    createdAt: "2026-02-25T14:10:00Z",
    updatedAt: "2026-02-25T15:20:00Z",
    messages: [
      {
        id: "MSG-01",
        sender: "Customer",
        senderName: "Rumbi Matsika",
        content: "I am trying to use the first-time buyer code but it says 'Invalid Code'.",
        timestamp: "2026-02-25T14:10:00Z"
      },
      {
        id: "MSG-02",
        sender: "Agent",
        senderName: "David M.",
        content: "Hi Rumbi, let me check your account. It looks like the system thinks you already placed an order last month. Give me a moment to manually apply a $10 credit to your wallet.",
        timestamp: "2026-02-25T14:45:00Z"
      }
    ]
  },
  {
    id: "TIC-8003",
    customerId: "CUST-021",
    customerName: "Tendai Shumba",
    customerEmail: "tendai.s@corporate.co.zw",
    orderId: "ORD-1995",
    subject: "Received wrong item in my grocery order",
    category: "Order Issue",
    priority: "High",
    status: "Resolved",
    assignedAgent: "Sarah J.",
    createdAt: "2026-02-24T09:15:00Z",
    updatedAt: "2026-02-24T12:30:00Z",
    messages: [
      {
        id: "MSG-01",
        sender: "Customer",
        senderName: "Tendai Shumba",
        content: "I ordered 2 bags of mealie meal but got 2 bags of flour instead. Can someone come swap these?",
        timestamp: "2026-02-24T09:15:00Z"
      },
      {
        id: "MSG-02",
        sender: "Agent",
        senderName: "Sarah J.",
        content: "Hi Tendai, apologies for the mix-up at the fulfillment center. I have dispatched a rider with the correct items, they will take the flour back when they arrive. Estimated time: 45 minutes.",
        timestamp: "2026-02-24T09:30:00Z"
      },
      {
        id: "MSG-03",
        sender: "Customer",
        senderName: "Tendai Shumba",
        content: "Rider just came. Thank you for resolving it quickly.",
        timestamp: "2026-02-24T12:25:00Z"
      }
    ]
  },
  {
    id: "TIC-8004",
    customerId: "CUST-044",
    customerName: "Blessing Moyo",
    customerEmail: "blessing.m@gmail.com",
    subject: "App crashes when I try to open my profile",
    category: "Technical",
    priority: "Low",
    status: "Closed",
    createdAt: "2026-02-22T16:00:00Z",
    updatedAt: "2026-02-23T10:00:00Z",
    messages: [
      {
        id: "MSG-01",
        sender: "Customer",
        senderName: "Blessing Moyo",
        content: "I'm using an old Samsung and every time I click 'Profile', the app shuts down.",
        timestamp: "2026-02-22T16:00:00Z"
      },
      {
        id: "MSG-02",
        sender: "Agent",
        senderName: "Tech Support Team",
        content: "Hi Blessing, we pushed an update yesterday (Version 2.1.4) that fixes this bug for older Android devices. Please update your app from the Play Store.",
        timestamp: "2026-02-23T09:00:00Z"
      }
    ]
  }
];
