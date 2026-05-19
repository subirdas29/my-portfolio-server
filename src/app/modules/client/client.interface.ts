import { Types } from 'mongoose';

export type TClient = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  status: 'Lead' | 'Active' | 'Completed' | 'Churned';
  source?: 'contact_form' | 'referral' | 'social' | 'direct' | 'other';
  logo?: string;
  notes?: string;
  tags?: string[];
  linkedMessageId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};
