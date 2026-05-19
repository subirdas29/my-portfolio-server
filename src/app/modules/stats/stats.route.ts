import { Router, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Project } from '../project/project.model';
import { Blog } from '../blog/blog.model';
import { Client } from '../client/client.model';
import { Testimonial } from '../testimonial/testimonial.model';

const router = Router();

router.get(
  '/',
  catchAsync(async (_req: Request, res: Response) => {
    const [totalProjects, totalBlogs, totalClients, totalTestimonials] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Client.countDocuments(),
      Testimonial.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: {
        totalProjects,
        totalBlogs,
        totalClients,
        totalTestimonials,
      },
    });
  }),
);

export const StatsRoutes = router;
