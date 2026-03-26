import { model, Schema, Document } from 'mongoose';
import { TProject } from './project.interface';
import { projectType } from './project.constant';
import { AIServices } from '../ai/ai.service';

const ProjectSchema = new Schema<TProject>(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    projectType: { type: String, enum: projectType, default: 'Full-Stack' },
    shortDescription: { type: String, required: true },
    details: { type: String, required: true },
    keyFeatures: {
      type: String,
      required: true,
    },
    order: { type: Number, default: 0 },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    liveLink: { type: String, required: true },
    clientGithubLink: { type: String, default: '' },
    serverGithubLink: { type: String, default: '' },
    imageUrls: { type: [String], required: true },
  },
  { timestamps: true },
);

ProjectSchema.post('save', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = this as Document & TProject;
      await AIServices.upsertProjectToAI({
        _id: doc._id,
        title: doc.title,
        shortDescription: doc.shortDescription,
        details: doc.details,
        keyFeatures: doc.keyFeatures,
        technologies: doc.technologies,
        liveLink: doc.liveLink,
        projectType: doc.projectType,
        tags: doc.tags || [],
      });
    } catch (error) {
      console.error('Error syncing project to Pinecone:', error);
    }
  }
});

ProjectSchema.post('findOneAndUpdate', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = await this.model.findOne(this.getQuery());
      if (doc) {
        const d = doc as Document & TProject;
        await AIServices.upsertProjectToAI({
          _id: d._id,
          title: d.title,
          shortDescription: d.shortDescription,
          details: d.details,
          keyFeatures: d.keyFeatures,
          technologies: d.technologies,
          liveLink: d.liveLink,
          projectType: d.projectType,
          tags: d.tags || [],
        });
      }
    } catch (error) {
      console.error('Error updating project in Pinecone:', error);
    }
  }
});

ProjectSchema.post('findOneAndDelete', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = (await this.model.findOne(this.getQuery()).lean()) as
        | (TProject & { _id: unknown })
        | null;
      if (doc && doc._id) {
        await AIServices.deleteFromAI(`project_${doc._id.toString()}`);
      }
    } catch (error) {
      console.error('Error deleting project from Pinecone:', error);
    }
  }
});

export const Project = model<TProject>('Project', ProjectSchema);
