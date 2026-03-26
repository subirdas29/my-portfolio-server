import { model, Schema, Document } from 'mongoose';
import { TSkill } from './skill.interface';
import { AIServices } from '../ai/ai.service';

const SkillSchema = new Schema<TSkill>(
  {
    title: { type: String, required: true },
    logo: { type: [String], required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Auto-sync with Pinecone on save, update, delete
SkillSchema.post('save', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = this as Document & TSkill;
      await AIServices.upsertSkillToAI({
        _id: doc._id,
        title: doc.title,
        logo: doc.logo,
        order: doc.order,
      });
    } catch (error) {
      console.error('Error syncing skill to Pinecone:', error);
    }
  }
});

SkillSchema.post('findOneAndUpdate', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = await this.model.findOne(this.getQuery());
      if (doc) {
        const d = doc as Document & TSkill;
        await AIServices.upsertSkillToAI({
          _id: d._id,
          title: d.title,
          logo: d.logo,
          order: d.order,
        });
      }
    } catch (error) {
      console.error('Error updating skill in Pinecone:', error);
    }
  }
});

SkillSchema.post('findOneAndDelete', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = (await this.model.findOne(this.getQuery()).lean()) as
        | (TSkill & { _id: unknown })
        | null;
      if (doc && doc._id) {
        await AIServices.deleteFromAI(`skill_${doc._id.toString()}`);
      }
    } catch (error) {
      console.error('Error deleting skill from Pinecone:', error);
    }
  }
});

export const Skill = model<TSkill>('Skill', SkillSchema);
