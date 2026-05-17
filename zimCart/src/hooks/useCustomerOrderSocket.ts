import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { socket } from '@/services/socket';

export function useCustomerOrderSocket() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || user.role !== 'CUSTOMER') return;

    socket.connect();
    socket.emit('join', { userId: user.id, role: 'CUSTOMER' });

    const onOrderUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-tracking'] });
    };

    socket.on('order:updated', onOrderUpdated);

    return () => {
      socket.off('order:updated', onOrderUpdated);
      socket.disconnect();
    };
  }, [isAuthenticated, user?.id, user?.role, queryClient]);
}
