import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/config/apiConfig';

const SOCKET_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
