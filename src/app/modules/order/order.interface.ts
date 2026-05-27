import { Types } from 'mongoose';

export type TMilestone = { title?: string; dueDate?: Date; done?: boolean };
export type TNote = { text?: string; createdAt?: Date };

export type TOrder = {
  clientId: Types.ObjectId;
  title: string;
  description?: string;
  status?: 'Pending' | 'In Progress' | 'Review' | 'Completed' | 'Cancelled';
  budget?: number;
  currency?: string;
  paidAmount?: number;
  startDate?: Date;
  deadline?: Date;
  completedAt?: Date;
  milestones?: TMilestone[];
  notes?: TNote[];
  projectId?: Types.ObjectId;
  invoiceUrl?: string;
  contractUrl?: string;
};
