import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { socket } from '@/services/socket';

export function useRiderSocket() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'RIDER' || !user?.id) return;

    socket.connect();
    socket.emit('join', { userId: user.id, role: 'RIDER' });

    const onAssigned = () => {
      queryClient.invalidateQueries({ queryKey: ['rider'] });
    };
    const onUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['rider'] });
    };

    socket.on('order:assigned', onAssigned);
    socket.on('order:updated', onUpdated);

    return () => {
      socket.off('order:assigned', onAssigned);
      socket.off('order:updated', onUpdated);
      socket.disconnect();
    };
  }, [isAuthenticated, user?.id, user?.role, queryClient]);
}
