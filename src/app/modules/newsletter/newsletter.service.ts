import { Newsletter } from './newsletter.model';
import { sendEmailTo } from '../../utils/sendEmail';
import { welcomeEmailTemplate, broadcastEmailTemplate } from '../../utils/emailTemplates';

const subscribe = async (email: string) => {
  const existing = await Newsletter.findOne({ email }).lean();
  if (existing) {
    if (!existing.active) {
      const updated = await Newsletter.findOneAndUpdate({ email }, { $set: { active: true } }, { new: true }).lean();
      await sendEmailTo({ to: email, subject: 'Welcome back! 👋', html: welcomeEmailTemplate(email) });
      return updated;
    }
    return existing;
  }
  const result = await Newsletter.create({ email });
  await sendEmailTo({ to: email, subject: "You're subscribed! 🎉", html: welcomeEmailTemplate(email) });
  return result.toObject();
};

const unsubscribe = async (email: string) =>
  Newsletter.findOneAndUpdate({ email }, { $set: { active: false } }, { new: true }).lean();

const getAllSubscribers = async () => Newsletter.find({ active: true }).sort('-subscribedAt').lean();

const broadcastNewsletter = async ({ subject, body }: { subject: string; body: string }) => {
  const subscribers = await Newsletter.find({ active: true }).lean();
  if (!subscribers.length) return { sent: 0 };

  const results = await Promise.allSettled(
    subscribers.map((sub) =>
      sendEmailTo({
        to: sub.email,
        subject,
        html: broadcastEmailTemplate({ subject, body, email: sub.email }),
      })
    )
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return { sent, total: subscribers.length };
};

export const NewsletterServices = { subscribe, unsubscribe, getAllSubscribers, broadcastNewsletter };
