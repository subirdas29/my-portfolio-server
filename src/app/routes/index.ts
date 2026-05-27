import { Router } from 'express';

import { BlogRoutes } from '../modules/blog/blog.route';
import { ProjectRoutes } from '../modules/project/project.route';
import { MessageRoutes } from '../modules/message/message.route';
import { SkillRoutes } from '../modules/skill/skill.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { fileUploadRoutes } from '../modules/fileUpload/fileUpload.route';
import { AIRoutes } from '../modules/ai/ai.route';
import { AnalyticsRoutes } from '../modules/analytics/analytics.route';
import { ClientRoutes } from '../modules/client/client.route';
import { OrderRoutes } from '../modules/order/order.route';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { GoalRoutes } from '../modules/goal/goal.route';
import { TestimonialRoutes } from '../modules/testimonial/testimonial.route';
import { SettingsRoutes } from '../modules/settings/settings.route';
import { StatsRoutes } from '../modules/stats/stats.route';
import { CertificationRoutes } from '../modules/certification/certification.route';
import { NewsletterRoutes } from '../modules/newsletter/newsletter.route';

const router: import("express").Router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/blogs', route: BlogRoutes },
  { path: '/projects', route: ProjectRoutes },
  { path: '/skills', route: SkillRoutes },
  { path: '/messages', route: MessageRoutes },
  { path: '/upload', route: fileUploadRoutes },
  { path: '/ai', route: AIRoutes },
  { path: '/analytics', route: AnalyticsRoutes },
  { path: '/clients', route: ClientRoutes },
  { path: '/orders', route: OrderRoutes },
  { path: '/notifications', route: NotificationRoutes },
  { path: '/goals', route: GoalRoutes },
  { path: '/testimonials', route: TestimonialRoutes },
  { path: '/settings', route: SettingsRoutes },
  { path: '/stats', route: StatsRoutes },
  { path: '/certifications', route: CertificationRoutes },
  { path: '/newsletter', route: NewsletterRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
