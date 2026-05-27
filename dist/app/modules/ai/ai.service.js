"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIServices = exports.chat = exports.getProjectCountByTech = exports.getProjectCount = exports.getBlogCount = exports.getAllBlogs = exports.getSkillCount = exports.getAllSkills = exports.getAllProjectsForCards = exports.searchProjectsByTechnology = exports.searchPinecone = exports.deleteFromAI = exports.upsertAllStaticDataToAI = exports.upsertAboutMeToAI = exports.upsertEducationToAI = exports.upsertExperienceToAI = exports.upsertSkillToAI = exports.upsertBlogToAI = exports.upsertProjectToAI = void 0;
require("../../../app/config");
const pinecone_1 = require("@pinecone-database/pinecone");
const project_model_1 = require("../project/project.model");
const skill_model_1 = require("../skill/skill.model");
const blog_model_1 = require("../blog/blog.model");
const aiChatDetection_1 = require("../../utils/aiChatDetection");
const portfolioStaticData_1 = require("../../data/portfolioStaticData");
const fixedIntents_1 = require("../../data/fixedIntents");
const embedding_1 = require("../../middlewares/embedding");
const responseGeneration_1 = require("../../middlewares/responseGeneration");
let pineconeClient = null;
const getPinecone = () => {
    if (!pineconeClient) {
        pineconeClient = new pinecone_1.Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    }
    return pineconeClient;
};
const NAMESPACE = 'portfolio_data';
const SIMILARITY_THRESHOLD = 0.7;
const DEFAULT_TOP_K = 5;
const SITE_URL = process.env.PORTFOLIO_URL || 'http://localhost:3000';
const PROJECT_DETAILS_URL = (slug) => `${SITE_URL}/all-projects/projectDetails/${slug}`;
const ALL_PROJECTS_URL = `${SITE_URL}/all-projects`;
const FALLBACK_MESSAGE = (0, aiChatDetection_1.getFallbackMessage)(SITE_URL);
const createProjectContext = (doc) => [
    `PROJECT: ${doc.title}`,
    `Description: ${doc.shortDescription}`,
    `Details: ${doc.details}`,
    `Key Features: ${doc.keyFeatures}`,
    `Technologies: ${doc.technologies.join(', ')}`,
    `Live: ${doc.liveLink}`,
    `Type: ${doc.projectType}`,
    `Tags: ${(doc.tags || []).join(', ')}`,
].join('\n');
const createProjectMetadata = (doc) => ({
    title: doc.title,
    content: `${doc.shortDescription} ${doc.details}`.slice(0, 8000),
    type: 'project',
    link: doc.liveLink,
    technologies: doc.technologies.join(', '),
    category: doc.projectType || 'Full-Stack',
});
const createBlogContext = (doc) => [
    `BLOG: ${doc.title}`,
    `Summary: ${doc.summary || ''}`,
    `Category: ${doc.category || ''}`,
    `Tags: ${(doc.tags || []).join(', ')}`,
    `Content: ${doc.content}`,
].join('\n');
const createBlogMetadata = (doc) => ({
    title: doc.title,
    content: `${doc.summary || ''} ${doc.content}`.slice(0, 8000),
    type: 'blog',
    link: '',
    technologies: (doc.tags || []).join(', '),
    category: doc.category || 'General',
});
const createSkillContext = (doc) => {
    const technologies = doc.logo.filter((item) => !item.startsWith('http'));
    return `SKILL CATEGORY: ${doc.title}\nTechnologies: ${technologies.join(', ')}`;
};
const createSkillMetadata = (doc) => {
    const technologies = doc.logo.filter((item) => !item.startsWith('http'));
    return {
        title: doc.title,
        content: technologies.join(', '),
        type: 'skill',
        link: '',
        technologies: technologies.join(', '),
        category: 'Technical Skill',
    };
};
const upsertProjectToAI = async (doc) => {
    var _a;
    const text = createProjectContext(doc);
    const embedding = await (0, embedding_1.getEmbedding)(text);
    const index = getPinecone().Index(process.env.PINECONE_INDEX);
    await index.namespace(NAMESPACE).upsert({
        records: [
            {
                id: `project_${(_a = doc._id) === null || _a === void 0 ? void 0 : _a.toString()}`,
                values: embedding,
                metadata: createProjectMetadata(doc),
            },
        ],
    });
};
exports.upsertProjectToAI = upsertProjectToAI;
const upsertBlogToAI = async (doc) => {
    var _a;
    const text = createBlogContext(doc);
    const embedding = await (0, embedding_1.getEmbedding)(text);
    const index = getPinecone().Index(process.env.PINECONE_INDEX);
    await index.namespace(NAMESPACE).upsert({
        records: [
            {
                id: `blog_${(_a = doc._id) === null || _a === void 0 ? void 0 : _a.toString()}`,
                values: embedding,
                metadata: createBlogMetadata(doc),
            },
        ],
    });
};
exports.upsertBlogToAI = upsertBlogToAI;
const upsertSkillToAI = async (doc) => {
    var _a;
    const text = createSkillContext(doc);
    const embedding = await (0, embedding_1.getEmbedding)(text);
    const index = getPinecone().Index(process.env.PINECONE_INDEX);
    await index.namespace(NAMESPACE).upsert({
        records: [
            {
                id: `skill_${(_a = doc._id) === null || _a === void 0 ? void 0 : _a.toString()}`,
                values: embedding,
                metadata: createSkillMetadata(doc),
            },
        ],
    });
};
exports.upsertSkillToAI = upsertSkillToAI;
const upsertExperienceToAI = async () => {
    const index = getPinecone().Index(process.env.PINECONE_INDEX);
    const records = await Promise.all(portfolioStaticData_1.EXPERIENCE_DATA.map(async (exp, i) => {
        const context = `EXPERIENCE: ${exp.title} at ${exp.company} (${exp.duration}). ${exp.description}`;
        const embedding = await (0, embedding_1.getEmbedding)(context);
        return {
            id: `experience_${i}`,
            values: embedding,
            metadata: { title: `${exp.title} at ${exp.company}`, content: context, type: 'experience', company: exp.company, duration: exp.duration },
        };
    }));
    await index.namespace(NAMESPACE).upsert({ records });
};
exports.upsertExperienceToAI = upsertExperienceToAI;
const upsertEducationToAI = async () => {
    const index = getPinecone().Index(process.env.PINECONE_INDEX);
    const records = await Promise.all(portfolioStaticData_1.EDUCATION_DATA.map(async (edu, i) => {
        const context = `EDUCATION: ${edu.degree} from ${edu.institution} (${edu.duration}). ${edu.description}`;
        const embedding = await (0, embedding_1.getEmbedding)(context);
        return {
            id: `education_${i}`,
            values: embedding,
            metadata: { title: `${edu.degree} - ${edu.institution}`, content: context, type: 'education', institution: edu.institution, duration: edu.duration },
        };
    }));
    await index.namespace(NAMESPACE).upsert({ records });
};
exports.upsertEducationToAI = upsertEducationToAI;
const upsertAboutMeToAI = async () => {
    const embedding = await (0, embedding_1.getEmbedding)(portfolioStaticData_1.ABOUT_ME_DATA);
    const index = getPinecone().Index(process.env.PINECONE_INDEX);
    await index.namespace(NAMESPACE).upsert({
        records: [
            {
                id: 'aboutme_0',
                values: embedding,
                metadata: { title: 'About Subir Das', content: portfolioStaticData_1.ABOUT_ME_DATA, type: 'aboutme' },
            },
        ],
    });
};
exports.upsertAboutMeToAI = upsertAboutMeToAI;
const upsertAllStaticDataToAI = async () => {
    console.log('Upserting experience, education, about me to Pinecone...');
    await Promise.all([(0, exports.upsertExperienceToAI)(), (0, exports.upsertEducationToAI)(), (0, exports.upsertAboutMeToAI)()]);
    console.log('All static data upserted successfully.');
};
exports.upsertAllStaticDataToAI = upsertAllStaticDataToAI;
const deleteFromAI = async (id) => {
    const index = getPinecone().Index(process.env.PINECONE_INDEX);
    await index.namespace(NAMESPACE).deleteOne({ id });
};
exports.deleteFromAI = deleteFromAI;
const searchPinecone = async (query, topK = DEFAULT_TOP_K) => {
    const embedding = await (0, embedding_1.getEmbedding)(query);
    const index = getPinecone().Index(process.env.PINECONE_INDEX);
    const result = await index.namespace(NAMESPACE).query({
        vector: embedding,
        topK,
        includeMetadata: true,
        includeValues: false,
    });
    return result.matches.map((match) => {
        var _a, _b;
        return ({
            id: match.id,
            score: (_a = match.score) !== null && _a !== void 0 ? _a : 0,
            metadata: (_b = match.metadata) !== null && _b !== void 0 ? _b : {},
        });
    });
};
exports.searchPinecone = searchPinecone;
const searchProjectsByTechnology = async (techName) => {
    const regex = new RegExp(techName, 'i');
    const projects = await project_model_1.Project.find({ technologies: { $regex: regex } })
        .sort({ order: -1, createdAt: -1 })
        .select('title slug shortDescription liveLink imageUrls projectType technologies')
        .lean();
    return projects.map((p) => {
        var _a;
        return ({
            _id: ((_a = p._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            title: p.title,
            slug: p.slug,
            shortDescription: p.shortDescription,
            liveLink: p.liveLink,
            imageUrls: p.imageUrls || [],
            projectType: p.projectType,
            technologies: p.technologies || [],
        });
    });
};
exports.searchProjectsByTechnology = searchProjectsByTechnology;
const getAllProjectsForCards = async () => {
    const projects = await project_model_1.Project.find()
        .sort({ order: -1, createdAt: -1 })
        .select('title slug shortDescription liveLink imageUrls projectType technologies')
        .lean();
    return projects.map((p) => {
        var _a;
        return ({
            _id: ((_a = p._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            title: p.title,
            slug: p.slug,
            shortDescription: p.shortDescription,
            liveLink: p.liveLink,
            imageUrls: p.imageUrls || [],
            projectType: p.projectType,
            technologies: p.technologies || [],
        });
    });
};
exports.getAllProjectsForCards = getAllProjectsForCards;
const getAllSkills = async () => {
    const skills = await skill_model_1.Skill.find().sort({ order: -1 }).select('title logo').lean();
    return skills.map((s) => {
        var _a;
        return ({
            _id: ((_a = s._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            title: s.title,
            logo: s.logo || [],
        });
    });
};
exports.getAllSkills = getAllSkills;
const getSkillCount = async () => skill_model_1.Skill.countDocuments();
exports.getSkillCount = getSkillCount;
const getAllBlogs = async () => {
    const blogs = await blog_model_1.Blog.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .select('title slug summary category featuredImage')
        .lean();
    return blogs.map((b) => {
        var _a;
        return ({
            _id: ((_a = b._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            title: b.title,
            slug: b.slug,
            summary: b.summary || '',
            category: b.category || 'General',
            featuredImage: b.featuredImage || '',
        });
    });
};
exports.getAllBlogs = getAllBlogs;
const getBlogCount = async () => blog_model_1.Blog.countDocuments({ status: 'published' });
exports.getBlogCount = getBlogCount;
const getProjectCount = async () => project_model_1.Project.countDocuments();
exports.getProjectCount = getProjectCount;
const getProjectCountByTech = async (techName) => {
    const regex = new RegExp(techName, 'i');
    return project_model_1.Project.countDocuments({ technologies: { $regex: regex } });
};
exports.getProjectCountByTech = getProjectCountByTech;
const buildPortfolioOverviewContext = async () => {
    const [skills, projects] = await Promise.all([(0, exports.getAllSkills)(), (0, exports.getAllProjectsForCards)()]);
    const skillCount = skills.length;
    const projectCount = projects.length;
    const aiSkills = [], frontendSkills = [], backendSkills = [], cloudSkills = [];
    const aiKeywords = ['n8n', 'gemini', 'rag', 'langchain', 'openai', 'zapier', 'automation', 'agent'];
    const frontendKeywords = ['react', 'next', 'typescript', 'javascript', 'tailwind', 'bootstrap', 'css', 'html', 'material', 'shadcn', 'redux', 'zustand', 'ant design', 'shopify'];
    const backendKeywords = ['node', 'express', 'mongodb', 'mongoose', 'postgresql', 'prisma', 'redis'];
    const cloudKeywords = ['firebase', 'vercel', 'docker', 'aws', 'netlify', 'cloud'];
    const matchesAny = (text, keywords) => keywords.some((k) => text.includes(k));
    skills.forEach((s) => {
        const techs = s.logo.filter((item) => !item.startsWith('http'));
        const entry = `**${s.title}**: ${techs.join(', ')}`;
        const combined = `${s.title} ${techs.join(' ')}`.toLowerCase();
        if (matchesAny(combined, aiKeywords))
            aiSkills.push(entry);
        else if (matchesAny(combined, frontendKeywords))
            frontendSkills.push(entry);
        else if (matchesAny(combined, backendKeywords))
            backendSkills.push(entry);
        else if (matchesAny(combined, cloudKeywords))
            cloudSkills.push(entry);
        else
            frontendSkills.push(entry);
    });
    const categorizedSkills = [
        aiSkills.length > 0 ? `**AI & Automation:**\n${aiSkills.map((s) => `- ${s}`).join('\n')}` : '',
        frontendSkills.length > 0 ? `**Frontend:**\n${frontendSkills.map((s) => `- ${s}`).join('\n')}` : '',
        backendSkills.length > 0 ? `**Backend:**\n${backendSkills.map((s) => `- ${s}`).join('\n')}` : '',
        cloudSkills.length > 0 ? `**Cloud & Tools:**\n${cloudSkills.map((s) => `- ${s}`).join('\n')}` : '',
    ].filter(Boolean).join('\n\n');
    const experienceDetails = portfolioStaticData_1.EXPERIENCE_DATA.map((exp) => `- **${exp.title}** at ${exp.company} (${exp.duration})\n  _${exp.description}_`).join('\n\n');
    const educationDetails = portfolioStaticData_1.EDUCATION_DATA.map((edu) => `- **${edu.degree}**\n  ${edu.institution} | ${edu.duration}\n  _${edu.description}_`).join('\n\n');
    return `PORTFOLIO OVERVIEW DATA\n\n**HOOK**:\n"Subir Das is an AI Solutions Architect & Full-Stack Developer specializing in building self-thinking AI Agents and high-performance web ecosystems."\n\n**SKILLS** (${skillCount} categories):\n${categorizedSkills}\n\n**PROJECTS** (${projectCount} total):\nJust say: "Subir has engineered ${projectCount}+ production-grade projects. Explore his full-scale applications with [live demos](${ALL_PROJECTS_URL})."\n\n**EXPERIENCE** (${portfolioStaticData_1.EXPERIENCE_DATA.length} entries):\n${experienceDetails}\n\n**EDUCATION** (${portfolioStaticData_1.EDUCATION_DATA.length} entries):\n${educationDetails}\n\n**ABOUT ME:**\n${portfolioStaticData_1.ABOUT_ME_DATA}`;
};
const buildContextFromResults = (results) => results.map((r) => {
    const type = r.metadata.type || 'unknown';
    const title = r.metadata.title || 'Unknown';
    const content = r.metadata.content || '';
    if (type === 'project')
        return `PROJECT: ${title}\n${content}\n`;
    if (type === 'blog')
        return `BLOG: ${title}\n${content}\n`;
    if (type === 'skill')
        return `SKILL: ${title}\n${content}\n`;
    return `${String(type).toUpperCase()}: ${title}\n${content}\n`;
}).join('\n---\n');
const chat = async (message, history) => {
    var _a, _b;
    const detectedTech = (0, aiChatDetection_1.detectTechQuery)(message);
    const isSkillQuery = (0, aiChatDetection_1.detectSkillQuery)(message);
    const isBlogQuery = (0, aiChatDetection_1.detectBlogQuery)(message);
    const isPortfolioOverview = (0, aiChatDetection_1.detectPortfolioOverview)(message);
    const isAllProjectsQuery = (0, aiChatDetection_1.detectAllProjectsQuery)(message);
    const isFollowUp = (0, aiChatDetection_1.detectFollowUp)(message);
    const isBlogCount = (0, aiChatDetection_1.detectBlogCountQuery)(message);
    const isSkillCount = (0, aiChatDetection_1.detectSkillCountQuery)(message);
    const isProjectCount = (0, aiChatDetection_1.detectProjectCountQuery)(message);
    const isGreeting = (0, aiChatDetection_1.detectGreeting)(message);
    const isExperienceQuery = (0, aiChatDetection_1.detectExperienceQuery)(message);
    const isEducationQuery = (0, aiChatDetection_1.detectEducationQuery)(message);
    const isAboutMeQuery = (0, aiChatDetection_1.detectAboutMeQuery)(message);
    const isExperienceDuration = (0, aiChatDetection_1.detectExperienceDurationQuery)(message);
    const isJobExperience = (0, aiChatDetection_1.detectJobExperienceQuery)(message);
    const isCapabilityQuery = (0, aiChatDetection_1.detectCapabilityQuery)(message);
    const isFreelancingQuery = (0, aiChatDetection_1.detectFreelancingQuery)(message);
    const isAIAutomationQuery = (0, aiChatDetection_1.detectAIAutomationQuery)(message);
    if (isGreeting && !detectedTech && !isSkillQuery && !isBlogQuery && !isPortfolioOverview &&
        !isExperienceQuery && !isEducationQuery && !isAboutMeQuery && !isJobExperience &&
        !isExperienceDuration && !isCapabilityQuery && !isFreelancingQuery && !isAIAutomationQuery) {
        const lower = message.toLowerCase().trim();
        let greeting = "Hello! Welcome — I'm Subir Das's AI Assistant. Whether you're here to explore his work, discuss a project, or just curious — I'm here to help. What would you like to know?";
        if (lower.includes('thank'))
            greeting = "You're welcome! If you have any more questions about Subir's work, skills, or availability — I'm always here to help!";
        else if (lower.includes('bye') || lower.includes('goodbye'))
            greeting = "Goodbye! Thanks for visiting Subir's portfolio. Come back anytime!";
        else if (lower.includes('hey') || lower.includes('yo') || lower.includes('sup'))
            greeting = "Hey there! Welcome to Subir's portfolio. I'm his AI Assistant — ready to help you explore projects, skills, or anything you need. What's up?";
        return { success: true, message: greeting, status: 'SUCCESS' };
    }
    if (isJobExperience && !isPortfolioOverview)
        return { success: true, message: (0, fixedIntents_1.buildJobExperienceResponse)(SITE_URL), status: 'SUCCESS' };
    if (isExperienceDuration && !isPortfolioOverview)
        return { success: true, message: (0, fixedIntents_1.buildExperienceDurationResponse)(SITE_URL), status: 'SUCCESS' };
    if (isFreelancingQuery && !isPortfolioOverview && !isBlogQuery && !isSkillQuery)
        return { success: true, message: (0, fixedIntents_1.buildFreelancingResponse)(SITE_URL), status: 'SUCCESS' };
    if (isCapabilityQuery && !isPortfolioOverview && !isBlogQuery && !isSkillQuery && !isAIAutomationQuery && !isFreelancingQuery) {
        const what = (0, fixedIntents_1.extractCapabilityWhat)(message);
        return { success: true, message: (0, fixedIntents_1.buildCapabilityResponse)(what, SITE_URL), status: 'SUCCESS' };
    }
    let projectCards = [];
    let skillCards = [];
    let blogCards = [];
    let context = '';
    if (isProjectCount && !detectedTech && !isSkillQuery && !isBlogQuery) {
        const count = await (0, exports.getProjectCount)();
        return { success: true, message: `সুবীরের মোট ${count}টি প্রকল্প আছে।`, status: 'SUCCESS' };
    }
    if (isSkillCount && !detectedTech && !isBlogQuery) {
        const count = await (0, exports.getSkillCount)();
        return { success: true, message: `সুবীরের মোট ${count}টি skill category আছে।`, status: 'SUCCESS' };
    }
    if (isBlogCount && !detectedTech && !isSkillQuery) {
        const count = await (0, exports.getBlogCount)();
        return { success: true, message: `সুবীরের মোট ${count}টি ব্লগ আছে।`, status: 'SUCCESS' };
    }
    if (isFollowUp && !detectedTech && !isSkillQuery && !isBlogQuery && !isPortfolioOverview) {
        const prevTech = (0, aiChatDetection_1.extractTechFromHistory)(history);
        const prevIsSkill = (0, aiChatDetection_1.isSkillFromHistory)(history);
        const prevIsBlog = (0, aiChatDetection_1.isBlogFromHistory)(history);
        if (prevTech) {
            projectCards = await (0, exports.searchProjectsByTechnology)(prevTech);
            if (projectCards.length > 0) {
                const techContext = projectCards.map((p) => { var _a; return `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${PROJECT_DETAILS_URL(p.slug)}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${((_a = p.imageUrls) === null || _a === void 0 ? void 0 : _a[0]) || ''}`; }).join('\n---\n');
                context = `FOLLOW-UP CONTEXT: User is asking about "${prevTech}" projects. Found ${projectCards.length} project(s).\nView All: ${ALL_PROJECTS_URL}\n\n${techContext}`;
            }
        }
        else if (prevIsSkill) {
            skillCards = await (0, exports.getAllSkills)();
            const skillContext = skillCards.map((s) => `SKILL: ${s.title}\nTechnologies: ${s.logo.filter((i) => !i.startsWith('http')).join(', ')}`).join('\n---\n');
            context = `FOLLOW-UP: skills. ${skillCards.length} categories.\n\n${skillContext}`;
        }
        else if (prevIsBlog) {
            blogCards = await (0, exports.getAllBlogs)();
            if (blogCards.length > 0) {
                const blogContext = blogCards.map((b) => `BLOG: [${b.title}](${SITE_URL}/blogs/${b.slug})\nCategory: ${b.category}`).join('\n---\n');
                context = `FOLLOW-UP: blogs. ${blogCards.length} published.\n\n${blogContext}`;
            }
        }
    }
    if (isPortfolioOverview && !detectedTech && !isSkillQuery && !isBlogQuery && !context) {
        context = await buildPortfolioOverviewContext();
    }
    if (isAllProjectsQuery && !context) {
        const allProjects = await (0, exports.getAllProjectsForCards)();
        projectCards = allProjects;
        if (allProjects.length > 0) {
            const projectContext = allProjects.map((p) => { var _a; return `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${PROJECT_DETAILS_URL(p.slug)}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${((_a = p.imageUrls) === null || _a === void 0 ? void 0 : _a[0]) || ''}`; }).join('\n---\n');
            context = `ALL PROJECTS: ${allProjects.length} total.\nView All: ${ALL_PROJECTS_URL}\n\n${projectContext}`;
        }
    }
    if (detectedTech && !isSkillQuery && !isBlogQuery && !context) {
        projectCards = await (0, exports.searchProjectsByTechnology)(detectedTech);
        if (projectCards.length > 0) {
            const techContext = projectCards.map((p) => { var _a; return `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${PROJECT_DETAILS_URL(p.slug)}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${((_a = p.imageUrls) === null || _a === void 0 ? void 0 : _a[0]) || ''}`; }).join('\n---\n');
            context = `TECH SEARCH: ${projectCards.length} project(s) using "${detectedTech}".\nView All: ${ALL_PROJECTS_URL}\n\n${techContext}`;
        }
    }
    if (isSkillQuery && !isPortfolioOverview && !context) {
        const allSkills = await (0, exports.getAllSkills)();
        const skillContext = allSkills.map((s) => `SKILL: ${s.title}\nTechnologies: ${s.logo.filter((i) => !i.startsWith('http')).join(', ')}`).join('\n---\n');
        context = `SKILLS: ${allSkills.length} categories.\n\n${skillContext}`;
        if (!isSkillCount)
            skillCards = allSkills;
    }
    if (isBlogQuery && !context) {
        const allBlogs = await (0, exports.getAllBlogs)();
        if (allBlogs.length > 0) {
            const blogContext = allBlogs.map((b) => `BLOG: [${b.title}](${SITE_URL}/blogs/${b.slug})\nCategory: ${b.category}\nSummary: ${b.summary}`).join('\n---\n');
            context = `BLOGS: ${allBlogs.length} published.\n\n${blogContext}`;
            if (!isBlogCount)
                blogCards = allBlogs;
        }
    }
    if (isExperienceQuery && !isPortfolioOverview && !context) {
        context = `EXPERIENCE (${portfolioStaticData_1.EXPERIENCE_DATA.length} entries):\n\n${(0, portfolioStaticData_1.buildExperienceContext)()}`;
    }
    if (isEducationQuery && !isPortfolioOverview && !context) {
        context = `EDUCATION:\n\n${(0, portfolioStaticData_1.buildEducationContext)()}`;
    }
    if (isAboutMeQuery && !isPortfolioOverview && !context) {
        context = `ABOUT SUBIR:\n${(0, portfolioStaticData_1.buildAboutMeContext)()}`;
    }
    if (!context) {
        const results = await (0, exports.searchPinecone)(message, DEFAULT_TOP_K);
        if (results.length === 0 || results[0].score < SIMILARITY_THRESHOLD) {
            const lower = message.toLowerCase();
            if (isAIAutomationQuery || lower.includes('automation') || lower.includes('agent') || lower.includes('bot')) {
                const skills = await (0, exports.getAllSkills)();
                skillCards = skills;
                const aiSkills = skills.filter((s) => {
                    const t = s.title.toLowerCase();
                    return ['n8n', 'gemini', 'rag', 'langchain', 'openai', 'zapier', 'automation', 'agent'].some((k) => t.includes(k));
                }).map((s) => `${s.title}: ${s.logo.filter((i) => !i.startsWith('http')).join(', ')}`).join('\n');
                context = `USER IS ASKING ABOUT AI/AUTOMATION CAPABILITIES:\n\nABOUT SUBIR:\n${(0, portfolioStaticData_1.buildAboutMeContext)()}\n\nRELEVANT AI SKILLS:\n${aiSkills || 'No specific AI skills listed'}`;
            }
            if (!context && (lower.includes('freelanc') || lower.includes('hire') || lower.includes('available'))) {
                return { success: true, message: (0, fixedIntents_1.buildFreelancingResponse)(SITE_URL), score: ((_a = results[0]) === null || _a === void 0 ? void 0 : _a.score) || 0, status: 'FAILED' };
            }
            if (!context) {
                return { success: true, message: (0, fixedIntents_1.buildNegativeFallbackResponse)(SITE_URL), score: ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.score) || 0, status: 'FAILED' };
            }
        }
        else {
            const pineconeContext = buildContextFromResults(results);
            const projectResults = results.filter((r) => r.metadata.type === 'project');
            if (projectResults.length > 0) {
                const titles = projectResults.map((r) => r.metadata.title).filter(Boolean);
                const mongoProjects = await project_model_1.Project.find({ title: { $in: titles } })
                    .select('title slug shortDescription liveLink imageUrls projectType technologies')
                    .lean();
                projectCards = mongoProjects.map((p) => {
                    var _a;
                    return ({
                        _id: ((_a = p._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                        title: p.title, slug: p.slug, shortDescription: p.shortDescription,
                        liveLink: p.liveLink, imageUrls: p.imageUrls || [], projectType: p.projectType, technologies: p.technologies || [],
                    });
                });
                const projectDetails = projectCards.map((p) => { var _a; return `PROJECT: ${p.title}\nSlug: ${p.slug}\nURL: ${PROJECT_DETAILS_URL(p.slug)}\nImage: ${((_a = p.imageUrls) === null || _a === void 0 ? void 0 : _a[0]) || ''}\nLive: ${p.liveLink}`; }).join('\n---\n');
                context = `${pineconeContext}\n\nPROJECT CARDS:\nView All: ${ALL_PROJECTS_URL}\n${projectDetails}`;
            }
            else {
                context = pineconeContext;
            }
        }
    }
    let response = await (0, responseGeneration_1.generateResponse)(context, message, history);
    if (!response) {
        const parts = [];
        parts.push('**Subir Das** is an AI Solutions Architect & Full-Stack Developer specializing in building self-thinking AI Agents and high-performance web ecosystems.');
        let projectsToUse = projectCards;
        if (projectsToUse.length === 0) {
            try {
                projectsToUse = await (0, exports.getAllProjectsForCards)();
            }
            catch (_) { }
        }
        if (projectsToUse.length > 0) {
            parts.push(`\n\n---\n\nSubir has engineered **${projectsToUse.length}+ production-grade projects**. Explore his full-scale applications with [live demos](${ALL_PROJECTS_URL}).`);
        }
        const closing = "\n\n---\nReady to automate your business or build a scalable product? **Let's connect!**";
        response = parts.join('') + closing + '\n\n' + (0, aiChatDetection_1.getContactMessage)(SITE_URL);
    }
    return {
        success: true,
        message: response,
        status: response === FALLBACK_MESSAGE ? 'FAILED' : 'SUCCESS',
        projects: projectCards.length > 0 ? projectCards : undefined,
        skills: skillCards.length > 0 ? skillCards : undefined,
        blogs: blogCards.length > 0 ? blogCards : undefined,
    };
};
exports.chat = chat;
exports.AIServices = {
    getEmbedding: embedding_1.getEmbedding,
    upsertProjectToAI: exports.upsertProjectToAI,
    upsertBlogToAI: exports.upsertBlogToAI,
    upsertSkillToAI: exports.upsertSkillToAI,
    upsertExperienceToAI: exports.upsertExperienceToAI,
    upsertEducationToAI: exports.upsertEducationToAI,
    upsertAboutMeToAI: exports.upsertAboutMeToAI,
    upsertAllStaticDataToAI: exports.upsertAllStaticDataToAI,
    deleteFromAI: exports.deleteFromAI,
    searchPinecone: exports.searchPinecone,
    generateResponse: responseGeneration_1.generateResponse,
    chat: exports.chat,
    searchProjectsByTechnology: exports.searchProjectsByTechnology,
    getAllProjectsForCards: exports.getAllProjectsForCards,
    getAllSkills: exports.getAllSkills,
    getSkillCount: exports.getSkillCount,
    getAllBlogs: exports.getAllBlogs,
    getBlogCount: exports.getBlogCount,
    getProjectCount: exports.getProjectCount,
    getProjectCountByTech: exports.getProjectCountByTech,
};
//# sourceMappingURL=ai.service.js.map