import api from './api';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const helpApi = {
  getFAQs: async (category?: string): Promise<FAQ[]> => {
    const { data } = await api.get('/help/faqs', { params: { category } });
    return data.data;
  },

  createTicket: async (subject: string, message: string): Promise<any> => {
    const { data } = await api.post('/help/tickets', { subject, message });
    return data.data;
  }
};
