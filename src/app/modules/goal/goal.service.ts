import { Goal } from './goal.model';
import { TGoal } from './goal.interface';
import { Blog } from '../blog/blog.model';
import { Project } from '../project/project.model';

const createGoal = async (payload: TGoal) => { const r = await Goal.create(payload); return r.toObject(); };
const getAllGoals = async () => Goal.find({ isActive: true }).sort('-createdAt').lean();
const updateGoal = async (id: string, payload: Partial<TGoal>) => Goal.findByIdAndUpdate(id, payload, { new: true }).lean();
const deleteGoal = async (id: string) => Goal.findByIdAndDelete(id).lean();
const syncGoals = async () => {
  const goals = await Goal.find({ isActive: true }).lean();
  return Promise.all(goals.map(async (goal) => {
    let current = 0;
    if (goal.type === 'blogs') current = await Blog.countDocuments();
    else if (goal.type === 'projects') current = await Project.countDocuments();
    return Goal.findByIdAndUpdate(goal._id, { $set: { current } }, { new: true }).lean();
  }));
};

export const GoalServices = { createGoal, getAllGoals, updateGoal, deleteGoal, syncGoals };
