import type { ApiTicketStatus } from '@/lib/support-thread';

export type TicketStatus = 'Open' | 'In Progress' | 'Closed';
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
  customerPhone?: string | null;
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

export interface SupportTicketUserDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface SupportTicketDto {
  id: string;
  subject: string;
  message: string;
  status: ApiTicketStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: SupportTicketUserDto;
}

export interface SupportFilters {
  searchTerm: string;
  status: 'All' | TicketStatus;
  priority: 'All' | TicketPriority;
  category: 'All' | TicketCategory;
}
