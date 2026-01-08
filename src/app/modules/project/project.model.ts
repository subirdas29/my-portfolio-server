import { model, Schema } from 'mongoose';
import { TProject } from './project.interface';
import { projectType } from './project.constant';

const ProjectSchema = new Schema<TProject>(
  {
    title: { type: String, required: true },
      slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
 
    projectType: { type: String, enum: projectType, default: "Full-Stack" },
    details: { type: String, required: true },
    keyFeatures: { 
      type: String, 
      required: true, 
    },
    order: { type: Number, default: 0 },
    technologies: { 
      type: [String], 
      required: true, 
      default: []  
    },
    liveLink: { type: String, required: true },
    clientGithubLink: { type: String, default:"" },
    serverGithubLink: { type: String,default:""},
    imageUrls: { type: [String], required: true },
  },
  { timestamps: true },
);

export const Project = model<TProject>('Project', ProjectSchema);
