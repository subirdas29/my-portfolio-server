import { Goal } from './goal.model';
import { TGoal } from './goal.interface';
import { Blog } from '../blog/blog.model';
import { Project } from '../project/project.model';
import { Client } from '../client/client.model';
import { Order } from '../order/order.model';

const createGoal = async (payload: TGoal) => { const r = await Goal.create(payload); return r.toObject(); };

const getAllGoals = async (query: Record<string, unknown> = {}) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (query.year) filter.year = Number(query.year);
  return Goal.find(filter).sort('-createdAt').lean();
};

const updateGoal = async (id: string, payload: Partial<TGoal>) => Goal.findByIdAndUpdate(id, payload, { new: true }).lean();
const deleteGoal = async (id: string) => Goal.findByIdAndDelete(id).lean();

const syncGoals = async () => {
  const goals = await Goal.find({ isActive: true }).lean();
  const [blogCount, projectCount, clientCount, orderCount, revenue] = await Promise.all([
    Blog.countDocuments(),
    Project.countDocuments(),
    Client.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }]).then((r) => r[0]?.total || 0),
  ]);
  return Promise.all(goals.map(async (goal) => {
    let current = goal.current ?? 0;
    if (goal.type === 'blogs' || goal.type === 'blog_posts') current = blogCount;
    else if (goal.type === 'projects') current = projectCount;
    else if (goal.type === 'clients') current = clientCount;
    else if (goal.type === 'orders') current = orderCount;
    else if (goal.type === 'revenue') current = revenue;
    return Goal.findByIdAndUpdate(goal._id, { $set: { current } }, { new: true }).lean();
  }));
};

export const GoalServices = { createGoal, getAllGoals, updateGoal, deleteGoal, syncGoals };
