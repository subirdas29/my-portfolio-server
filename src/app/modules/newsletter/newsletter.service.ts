import { Newsletter } from './newsletter.model';

const subscribe = async (email: string) => {
  const existing = await Newsletter.findOne({ email }).lean();
  if (existing) {
    if (!existing.active) return Newsletter.findOneAndUpdate({ email }, { $set: { active: true } }, { new: true }).lean();
    return existing;
  }
  const result = await Newsletter.create({ email });
  return result.toObject();
};

const unsubscribe = async (email: string) =>
  Newsletter.findOneAndUpdate({ email }, { $set: { active: false } }, { new: true }).lean();

const getAllSubscribers = async () => Newsletter.find({ active: true }).sort('-subscribedAt').lean();

export const NewsletterServices = { subscribe, unsubscribe, getAllSubscribers };
