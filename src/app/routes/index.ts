import { Router } from 'express';

import { BlogRoutes } from '../modules/blog/blog.route';
import { ProjectRoutes } from '../modules/project/project.route';
import { MessageRoutes } from '../modules/message/message.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/projects',
    route: ProjectRoutes,
  },
  {
    path: '/messages',
    route: MessageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
