import { Router } from 'express';

import { BlogRoutes } from '../modules/blog/blog.route';
import { ProjectRoutes } from '../modules/project/project.route';
import { MessageRoutes } from '../modules/message/message.route';
import { SkillRoutes } from '../modules/skill/skill.route';
import { AuthRoutes } from '../modules/auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/projects',
    route: ProjectRoutes,
  },
  {
    path: '/skills',
    route: SkillRoutes,
  },
  {
    path: '/messages',
    route: MessageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
