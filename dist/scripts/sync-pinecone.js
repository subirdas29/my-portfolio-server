"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const mongoose_1 = __importDefault(require("mongoose"));
const project_model_1 = require("../app/modules/project/project.model");
const blog_model_1 = require("../app/modules/blog/blog.model");
const skill_model_1 = require("../app/modules/skill/skill.model");
const ai_service_1 = require("../app/modules/ai/ai.service");
const DATABASE_URL = process.env.DATABASE_URL;
function syncAllToPinecone() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!DATABASE_URL) {
            console.error('DATABASE_URL is not set in .env');
            process.exit(1);
        }
        yield mongoose_1.default.connect(DATABASE_URL);
        console.log('✅ MongoDB Connected');
        try {
            // Sync Projects
            const projects = yield project_model_1.Project.find();
            console.log(`🔄 Syncing ${projects.length} projects to Pinecone...`);
            for (const p of projects) {
                try {
                    yield ai_service_1.AIServices.upsertProjectToAI({
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
                    console.log(`  ✅ Project: ${p.title}`);
                }
                catch (err) {
                    console.error(`  ❌ Failed to sync project ${p._id}:`, err);
                }
            }
            console.log(`✅ Projects synced\n`);
            // Sync Blogs (only published)
            const blogs = yield blog_model_1.Blog.find({ status: 'published' });
            console.log(`🔄 Syncing ${blogs.length} blogs to Pinecone...`);
            for (const b of blogs) {
                try {
                    yield ai_service_1.AIServices.upsertBlogToAI({
                        _id: b._id,
                        title: b.title,
                        content: b.content,
                        summary: b.summary,
                        tags: b.tags,
                        category: b.category,
                        publishedAt: b.publishedAt,
                    });
                    console.log(`  ✅ Blog: ${b.title}`);
                }
                catch (err) {
                    console.error(`  ❌ Failed to sync blog ${b._id}:`, err);
                }
            }
            console.log(`✅ Blogs synced\n`);
            // Sync Skills
            const skills = yield skill_model_1.Skill.find();
            console.log(`🔄 Syncing ${skills.length} skills to Pinecone...`);
            for (const s of skills) {
                try {
                    yield ai_service_1.AIServices.upsertSkillToAI({
                        _id: s._id,
                        title: s.title,
                        logo: s.logo,
                        order: s.order,
                    });
                    console.log(`  ✅ Skill: ${s.title}`);
                }
                catch (err) {
                    console.error(`  ❌ Failed to sync skill ${s._id}:`, err);
                }
            }
            console.log(`✅ Skills synced\n`);
            // Sync Static Data (Experience, Education, About Me)
            console.log(`🔄 Syncing experience, education, about me to Pinecone...`);
            try {
                yield ai_service_1.AIServices.upsertAllStaticDataToAI();
                console.log(`✅ Static data synced\n`);
            }
            catch (err) {
                console.error(`❌ Failed to sync static data:`, err);
            }
            console.log(`🎉 All data synced to Pinecone successfully!`);
        }
        catch (err) {
            console.error('⚠️ Error during sync:', err);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log('🔌 MongoDB Disconnected');
            process.exit(0);
        }
    });
}
syncAllToPinecone();
