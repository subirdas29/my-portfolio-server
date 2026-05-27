export type TGoal = {
  title: string;
  type: 'projects' | 'blogs' | 'blog_posts' | 'clients' | 'orders' | 'revenue' | 'custom';
  period?: 'monthly' | 'quarterly' | 'yearly';
  target: number;
  current?: number;
  unit?: string;
  year?: number;
  month?: number;
  quarter?: number;
  notes?: string;
  completed?: boolean;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
};
