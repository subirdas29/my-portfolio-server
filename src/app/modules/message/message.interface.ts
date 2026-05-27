export type TMessage = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Replied' | 'No Response' | 'Dealing' | 'Booked' | 'Closed';
  priority: boolean;
  spam: boolean;
};
