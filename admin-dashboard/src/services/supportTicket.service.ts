import apiClient from '@/lib/api-client';
import type { SupportTicketDto } from '@/types/support';

function getMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
    if (typeof r === 'string') return r;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export interface ListSupportTicketsParams {
  search?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

export interface CreateAdminTicketPayload {
  customerLookup: string;
  subject: string;
  message: string;
  category?: string;
  priority?: string;
}

export const supportTicketApi = {
  list: async (params?: ListSupportTicketsParams): Promise<SupportTicketDto[]> => {
    try {
      const response = await apiClient.get('/help/tickets/admin', { params });
      return response.data.data.tickets as SupportTicketDto[];
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },

  update: async (
    id: string,
    body: { status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'; staffReply?: string }
  ): Promise<SupportTicketDto> => {
    try {
      const response = await apiClient.patch(`/help/tickets/${id}`, body);
      return response.data.data.ticket as SupportTicketDto;
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },

  createForCustomer: async (payload: CreateAdminTicketPayload): Promise<SupportTicketDto> => {
    try {
      const response = await apiClient.post('/help/tickets/admin', payload);
      return response.data.data.ticket as SupportTicketDto;
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },
};
