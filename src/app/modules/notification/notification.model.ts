import { model, Schema } from 'mongoose';
import { TNotification } from './notification.interface';

const notificationSchema = new Schema<TNotification>({
  type: String,
  message: String,
  read: { type: Boolean, default: false },
  link: String,
  createdAt: { type: Date, default: Date.now },
});

export const Notification = model<TNotification>('Notification', notificationSchema);
