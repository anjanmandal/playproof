import { apiClient, unwrap } from './client';
import type { NotificationRecord } from '@/types';

export const fetchNotifications = (limit = 25) =>
  unwrap(
    apiClient.get<{ notifications: NotificationRecord[] }>('/notifications', {
      params: { limit },
    }),
  ).then((res) => res.notifications);
