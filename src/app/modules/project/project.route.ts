/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { ProjectValidation } from './project.validation';
import { ProjectController } from './project.controller';
import validationRequest from '../../middlewares/validateRequest';
import cache from '../../middlewares/cache';
import { AIServices } from '../ai/ai.service';
import { Blog } from '../blog/blog.model';
import { Skill } from '../skill/skill.model';
import catchAsync from '../../utils/catchAsync';

const router = express.Router();

// Manual sync endpoint - sync all collections
router.post(
  '/sync-to-ai',
  catchAsync(async (req: any, res: any) => {
    // Sync Projects
    const { Project } = await import('./project.model');
    const projects = await Project.find();
    let synced = 0;
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
        synced++;
      } catch (e) {
        console.error(`Failed to sync project ${p._id}:`, e);
      }
    }

    // Sync Blogs
    const blogs = await Blog.find({ status: 'published' });
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
        synced++;
      } catch (e) {
        console.error(`Failed to sync blog ${b._id}:`, e);
      }
    }

    // Sync Skills
    const skills = await Skill.find();
    for (const s of skills) {
      try {
        await AIServices.upsertSkillToAI({
          _id: s._id,
          title: s.title,
          logo: s.logo,
          order: s.order,
        });
        synced++;
      } catch (e) {
        console.error(`Failed to sync skill ${s._id}:`, e);
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${synced} items to Pinecone`,
    });
  }),
);

router.post(
  '/',
  // auth(USER_ROLES.user),
  validationRequest(ProjectValidation.projectSchema),
  ProjectController.createProjectController,
);

router.get('/', cache, ProjectController.getAllProjectController);
router.get(
  '/project/:slug',
  cache,
  ProjectController.getSingleProjectController,
);

router.patch(
  '/edit-project/:id',
  // auth(USER_ROLES.user),
  validationRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateOwnProjectController,
);

router.patch('/reorder', ProjectController.updateProjectOrderController);

router.delete(
  '/:id',
  // auth(USER_ROLES.user),
  ProjectController.deleteOwnProjectController,
);

export const ProjectRoutes = router;
