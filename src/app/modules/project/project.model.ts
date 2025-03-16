import { model, Schema } from 'mongoose';
import { TProject } from './project.interface';

const ProjectSchema = new Schema<TProject>(
  {
    title: { type: String, required: true },
    projectType: { type: String, required: true },
    details: { type: String, required: true },
    technologies: { type: String, required: true },
    liveLink: { type: String, required: true },
    githubLink: { type: String, required: true },
    imageUrls: { type: [String], required: true },
  },
  { timestamps: true },
);

export const Project = model<TProject>('Project', ProjectSchema);
