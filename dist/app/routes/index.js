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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
