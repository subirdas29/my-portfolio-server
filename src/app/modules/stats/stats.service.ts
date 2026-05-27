import { Blog } from '../blog/blog.model';
import { Project } from '../project/project.model';
import { Client } from '../client/client.model';
import { Testimonial } from '../testimonial/testimonial.model';

const getStats = async () => {
  const [totalProjects, totalBlogs, totalClients, totalTestimonials] = await Promise.all([
    Project.countDocuments(),
    Blog.countDocuments({ status: 'published' }),
    Client.countDocuments(),
    Testimonial.countDocuments(),
  ]);
  return { totalProjects, totalBlogs, totalClients, totalTestimonials };
};

export const StatsServices = { getStats };
