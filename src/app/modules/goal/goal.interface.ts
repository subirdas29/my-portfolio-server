export type TGoal = {
  title: string;
  type: 'projects' | 'blogs' | 'clients' | 'orders' | 'revenue';
  period?: 'monthly' | 'quarterly' | 'yearly';
  target: number;
  current?: number;
  unit?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
};
