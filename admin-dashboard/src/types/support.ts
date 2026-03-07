export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Order Issue' | 'Payment' | 'Delivery' | 'Account' | 'Technical';

export interface TicketMessage {
  id: string;
  sender: 'Customer' | 'Agent' | 'System';
  senderName: string;
  content: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderId?: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  assignedAgent?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface SupportFilters {
  searchTerm: string;
  status: 'All' | TicketStatus;
  priority: 'All' | TicketPriority;
  category: 'All' | TicketCategory;
}
