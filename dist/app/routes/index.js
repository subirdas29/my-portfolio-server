"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_route_1 = require("../modules/blog/blog.route");
const project_route_1 = require("../modules/project/project.route");
const message_route_1 = require("../modules/message/message.route");
const skill_route_1 = require("../modules/skill/skill.route");
const auth_route_1 = require("../modules/auth/auth.route");
const fileUpload_route_1 = require("../modules/fileUpload/fileUpload.route");
const ai_route_1 = require("../modules/ai/ai.route");
const analytics_route_1 = require("../modules/analytics/analytics.route");
const client_route_1 = require("../modules/client/client.route");
const order_route_1 = require("../modules/order/order.route");
const notification_route_1 = require("../modules/notification/notification.route");
const goal_route_1 = require("../modules/goal/goal.route");
const testimonial_route_1 = require("../modules/testimonial/testimonial.route");
const settings_route_1 = require("../modules/settings/settings.route");
const certification_route_1 = require("../modules/certification/certification.route");
const newsletter_route_1 = require("../modules/newsletter/newsletter.route");
const stats_route_1 = require("../modules/stats/stats.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/projects',
        route: project_route_1.ProjectRoutes,
    },
    {
        path: '/skills',
        route: skill_route_1.SkillRoutes,
    },
    {
        path: '/messages',
        route: message_route_1.MessageRoutes,
    },
    {
        path: '/upload',
        route: fileUpload_route_1.fileUploadRoutes,
    },
    {
        path: '/ai',
        route: ai_route_1.AIRoutes,
    },
    { path: '/analytics', route: analytics_route_1.AnalyticsRoutes },
    { path: '/clients', route: client_route_1.ClientRoutes },
    { path: '/orders', route: order_route_1.OrderRoutes },
    { path: '/notifications', route: notification_route_1.NotificationRoutes },
    { path: '/goals', route: goal_route_1.GoalRoutes },
    { path: '/testimonials', route: testimonial_route_1.TestimonialRoutes },
    { path: '/settings', route: settings_route_1.SettingsRoutes },
    { path: '/certifications', route: certification_route_1.CertificationRoutes },
    { path: '/newsletter', route: newsletter_route_1.NewsletterRoutes },
    { path: '/stats', route: stats_route_1.StatsRoutes },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
