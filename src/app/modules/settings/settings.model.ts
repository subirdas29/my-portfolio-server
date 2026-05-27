import { model, Schema } from 'mongoose';
import { TSettings } from './settings.interface';

const settingsSchema = new Schema<TSettings>({
  ownerName: String, ownerEmail: String, ownerTitle: String, ownerBio: String, ownerAvatar: String,
  githubUsername: { type: String, default: '' },
  socialLinks: { github: String, linkedin: String, twitter: String, facebook: String, instagram: String, youtube: String },
  businessConfig: { currency: { type: String, default: 'USD' }, timezone: { type: String, default: 'Asia/Dhaka' } },
}, { timestamps: true });

export const Settings = model<TSettings>('Settings', settingsSchema);
