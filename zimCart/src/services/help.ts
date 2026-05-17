import api from './api';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export const helpApi = {
  getFAQs: async (category?: string): Promise<FAQ[]> => {
    const { data } = await api.get('/help/faqs', { params: { category } });
    return data.data;
  },

  listTickets: async (): Promise<SupportTicket[]> => {
    const { data } = await api.get('/help/tickets');
    return data.data.tickets;
  },

  createTicket: async (subject: string, message: string): Promise<SupportTicket> => {
    const { data } = await api.post('/help/tickets', { subject, message });
    return data.data;
  },
};
