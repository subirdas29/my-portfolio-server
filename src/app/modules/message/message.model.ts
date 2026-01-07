import { model, Schema } from 'mongoose';
import { TMessage } from './message.interface';

const MessageSchema = new Schema<TMessage>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
    type: String,
    enum: ["Pending", "Replied", "No Response", "Dealing", "Booked", "Closed"],
    default: "Pending" 
  }
  },
  {
    timestamps: true,
  },
);

export const Message = model<TMessage>('Message', MessageSchema);
