import { model, Schema } from 'mongoose';


import { TSkill } from './skill.interface';

const SkillSchema = new Schema<TSkill>(
  {
    title: { type: String, required: true },
    logo: { type: [String], required: true },
  },
  { timestamps: true },
);

export const Skill = model<TSkill>('Skill', SkillSchema);
