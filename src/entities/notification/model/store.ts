'use client';

import { create } from 'zustand';
import { Notification } from '@/shared/types';
import { mockNotifications } from '@/mock/notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  getByRole: (role: string) => Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: (recipientId: string) => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.isRead).length,
  getByRole: (recipientId: string) => {
    return get().notifications.filter((n) => n.recipientId === recipientId);
  },
  markAsRead: (id: string) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    });
  },
  markAllAsRead: (recipientId: string) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.recipientId === recipientId ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    });
  },
  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
