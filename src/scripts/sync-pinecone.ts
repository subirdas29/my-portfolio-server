import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { Project } from '../app/modules/project/project.model';
import { Blog } from '../app/modules/blog/blog.model';
import { Skill } from '../app/modules/skill/skill.model';
import { AIServices } from '../app/modules/ai/ai.service';

const DATABASE_URL = process.env.DATABASE_URL;

async function syncAllToPinecone() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(DATABASE_URL);
  console.log('✅ MongoDB Connected');

  try {
    // Sync Projects
    const projects = await Project.find();
    console.log(`🔄 Syncing ${projects.length} projects to Pinecone...`);
    for (const p of projects) {
      try {
        await AIServices.upsertProjectToAI({
          _id: p._id,
          title: p.title,
          shortDescription: p.shortDescription,
          details: p.details,
          keyFeatures: p.keyFeatures,
          technologies: p.technologies,
          liveLink: p.liveLink,
          projectType: p.projectType,
          tags: (p as any).tags || [],
        });
        console.log(`  ✅ Project: ${p.title}`);
      } catch (err) {
        console.error(`  ❌ Failed to sync project ${p._id}:`, err);
      }
    }
    console.log(`✅ Projects synced\n`);

    // Sync Blogs (only published)
    const blogs = await Blog.find({ status: 'published' });
    console.log(`🔄 Syncing ${blogs.length} blogs to Pinecone...`);
    for (const b of blogs) {
      try {
        await AIServices.upsertBlogToAI({
          _id: b._id,
          title: b.title,
          content: b.content,
          summary: b.summary,
          tags: b.tags,
          category: b.category,
          publishedAt: b.publishedAt,
        });
        console.log(`  ✅ Blog: ${b.title}`);
      } catch (err) {
        console.error(`  ❌ Failed to sync blog ${b._id}:`, err);
      }
    }
    console.log(`✅ Blogs synced\n`);

    // Sync Skills
    const skills = await Skill.find();
    console.log(`🔄 Syncing ${skills.length} skills to Pinecone...`);
    for (const s of skills) {
      try {
        await AIServices.upsertSkillToAI({
          _id: s._id,
          title: s.title,
          logo: s.logo,
          order: s.order,
        });
        console.log(`  ✅ Skill: ${s.title}`);
      } catch (err) {
        console.error(`  ❌ Failed to sync skill ${s._id}:`, err);
      }
    }
    console.log(`✅ Skills synced\n`);

    console.log(`🎉 All data synced to Pinecone successfully!`);
  } catch (err) {
    console.error('⚠️ Error during sync:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB Disconnected');
    process.exit(0);
  }
}

syncAllToPinecone();
