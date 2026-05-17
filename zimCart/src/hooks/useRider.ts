import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { riderApi } from '@/services/rider';
import type { DeliveryAction } from '@/types/rider';

export const useRiderProfile = () =>
  useQuery({
    queryKey: ['rider', 'me'],
    queryFn: riderApi.getMe,
  });

export const useRiderJobs = (filter: 'active' | 'completed') =>
  useQuery({
    queryKey: ['rider', 'jobs', filter],
    queryFn: () => riderApi.getJobs(filter),
  });

export const useRiderJob = (orderId: string | undefined) =>
  useQuery({
    queryKey: ['rider', 'job', orderId],
    queryFn: () => riderApi.getJob(orderId!),
    enabled: !!orderId,
  });

export const useRiderAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (availability: 'AVAILABLE' | 'OFFLINE') => riderApi.setAvailability(availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rider', 'me'] });
    },
  });
};

export const useUpdateDeliveryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      action,
      note,
      proofOfDeliveryUrl,
    }: {
      orderId: string;
      action: DeliveryAction;
      note?: string;
      proofOfDeliveryUrl?: string;
    }) => riderApi.updateJobStatus(orderId, action, note, proofOfDeliveryUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rider'] });
    },
  });
};

export const useRiderEarnings = () =>
  useQuery({
    queryKey: ['rider', 'earnings'],
    queryFn: riderApi.getEarnings,
  });

export const useRiderNotifications = () =>
  useQuery({
    queryKey: ['rider', 'notifications'],
    queryFn: riderApi.getNotifications,
    refetchInterval: 60_000,
  });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => riderApi.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rider', 'notifications'] }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => riderApi.markAllNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rider', 'notifications'] }),
  });
};

export const useUpdateRiderProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { phone?: string; name?: string }) => riderApi.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rider', 'me'] });
    },
  });
};

export const useRiderWallet = () =>
  useQuery({
    queryKey: ['rider', 'wallet'],
    queryFn: riderApi.getWallet,
  });

export const useRequestPayout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      amount: number;
      method: string;
      accountRef: string;
      accountName?: string;
      notes?: string;
    }) => riderApi.requestPayout(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rider', 'wallet'] });
    },
  });
};
