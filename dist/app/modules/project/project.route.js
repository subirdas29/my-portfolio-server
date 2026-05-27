"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const ProjectModelModule = __importStar(require("./project.model"));
const project_validation_1 = require("./project.validation");
const project_controller_1 = require("./project.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const cache_1 = __importDefault(require("../../middlewares/cache"));
const ai_service_1 = require("../ai/ai.service");
const blog_model_1 = require("../blog/blog.model");
const skill_model_1 = require("../skill/skill.model");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const router = express_1.default.Router();
router.post('/sync-to-ai', (0, catchAsync_1.default)(async (req, res) => {
    const { Project } = ProjectModelModule;
    const projects = await Project.find();
    let synced = 0;
    for (const p of projects) {
        try {
            await ai_service_1.AIServices.upsertProjectToAI({
                _id: p._id,
                title: p.title,
                shortDescription: p.shortDescription,
                details: p.details,
                keyFeatures: p.keyFeatures,
                technologies: p.technologies,
                liveLink: p.liveLink,
                projectType: p.projectType,
                tags: p.tags || [],
            });
            synced++;
        }
        catch (e) {
            console.error(`Failed to sync project ${p._id}:`, e);
        }
    }
    const blogs = await blog_model_1.Blog.find({ status: 'published' });
    for (const b of blogs) {
        try {
            await ai_service_1.AIServices.upsertBlogToAI({
                _id: b._id,
                title: b.title,
                content: b.content,
                summary: b.summary,
                tags: b.tags,
                category: b.category,
                publishedAt: b.publishedAt,
            });
            synced++;
        }
        catch (e) {
            console.error(`Failed to sync blog ${b._id}:`, e);
        }
    }
    const skills = await skill_model_1.Skill.find();
    for (const s of skills) {
        try {
            await ai_service_1.AIServices.upsertSkillToAI({
                _id: s._id,
                title: s.title,
                logo: s.logo,
                order: s.order,
            });
            synced++;
        }
        catch (e) {
            console.error(`Failed to sync skill ${s._id}:`, e);
        }
    }
    res.status(200).json({ success: true, message: `Synced ${synced} items to Pinecone` });
}));
router.post('/', (0, validateRequest_1.default)(project_validation_1.ProjectValidation.projectSchema), project_controller_1.ProjectController.createProjectController);
router.get('/', cache_1.default, project_controller_1.ProjectController.getAllProjectController);
router.get('/project/:slug', cache_1.default, project_controller_1.ProjectController.getSingleProjectController);
router.patch('/edit-project/:id', (0, validateRequest_1.default)(project_validation_1.ProjectValidation.updateProjectSchema), project_controller_1.ProjectController.updateOwnProjectController);
router.patch('/reorder', project_controller_1.ProjectController.updateProjectOrderController);
router.delete('/:id', project_controller_1.ProjectController.deleteOwnProjectController);
exports.ProjectRoutes = router;
//# sourceMappingURL=project.route.js.map