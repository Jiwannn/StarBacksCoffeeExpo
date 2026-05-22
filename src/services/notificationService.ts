import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Notification } from '../types';

export const notificationService = {
  async createNotification(data: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    await addDoc(collection(db, 'notifications'), {
      ...data,
      createdAt: new Date(),
    });
  },

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
    return notifications.sort((a, b) => {
      const aTime = (a.createdAt as any)?.seconds || 0;
      const bTime = (b.createdAt as any)?.seconds || 0;
      return bTime - aTime;
    });
  },

  async markAsRead(notificationId: string): Promise<void> {
    await updateDoc(doc(db, 'notifications', notificationId), { isRead: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getUserNotifications(userId);
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => this.markAsRead(n.id)));
  },

  async getUnreadCount(userId: string): Promise<number> {
    const notifications = await this.getUserNotifications(userId);
    return notifications.filter(n => !n.isRead).length;
  },

  async sendOrderStatusNotification(userId: string, orderNumber: string, status: string): Promise<void> {
    const messages: Record<string, { title: string; message: string }> = {
      confirmed: { title: 'Order Confirmed! ✅', message: `Your order ${orderNumber} has been confirmed.` },
      preparing: { title: 'Order Being Prepared! ☕', message: `Your order ${orderNumber} is now being prepared.` },
      out_for_delivery: { title: 'Out for Delivery! 🛵', message: `Your order ${orderNumber} is on the way!` },
      delivered: { title: 'Order Delivered! 🎉', message: `Your order ${orderNumber} has been delivered. Enjoy!` },
      cancelled: { title: 'Order Cancelled ❌', message: `Your order ${orderNumber} has been cancelled.` },
    };
    const notif = messages[status];
    if (!notif) return;
    await this.createNotification({
      userId,
      title: notif.title,
      message: notif.message,
      type: 'order',
      isRead: false,
    });
  },
};
