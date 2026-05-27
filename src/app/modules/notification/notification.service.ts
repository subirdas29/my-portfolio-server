import { Response } from 'express';
import { Notification } from './notification.model';

export const sseClients = new Map<string, Response>();

export const addSSEClient = (id: string, res: Response) => sseClients.set(id, res);
export const removeSSEClient = (id: string) => sseClients.delete(id);
export const pushToAll = (data: object) => {
  sseClients.forEach((res) => res.write(`data: ${JSON.stringify(data)}\n\n`));
};

const createNotification = async (type: string, message: string, link?: string) => {
  const result = await Notification.create({ type, message, link });
  pushToAll({ type: 'new_notification', notification: result });
  return result.toObject();
};

const getAllNotifications = async () => Notification.find().sort({ createdAt: -1 }).limit(50).lean();
const markAsRead = async (id: string) => Notification.findByIdAndUpdate(id, { $set: { read: true } }, { new: true }).lean();
const markAllAsRead = async () => Notification.updateMany({}, { $set: { read: true } });
const deleteNotification = async (id: string) => Notification.findByIdAndDelete(id).lean();
const getUnreadCount = async () => Notification.countDocuments({ read: false });

export const NotificationServices = { createNotification, getAllNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount };
