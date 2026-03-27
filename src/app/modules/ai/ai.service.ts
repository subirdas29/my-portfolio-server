import '../../config';
import { Pinecone } from '@pinecone-database/pinecone';
import { Project } from '../project/project.model';
import { Skill } from '../skill/skill.model';
import { Blog } from '../blog/blog.model';
import {
  detectTechQuery,
  detectSkillQuery,
  detectBlogQuery,
  detectBlogCountQuery,
  detectSkillCountQuery,
  detectProjectCountQuery,
  detectPortfolioOverview,
  detectGreeting,
  detectAllProjectsQuery,
  detectFollowUp,
  extractTechFromHistory,
  isSkillFromHistory,
  isBlogFromHistory,
  getFallbackMessage,
  getContactMessage,
  detectExperienceQuery,
  detectEducationQuery,
  detectAboutMeQuery,
  detectExperienceDurationQuery,
  detectJobExperienceQuery,
  detectCapabilityQuery,
  detectFreelancingQuery,
  detectAIAutomationQuery,
} from '../../utils/aiChatDetection';
import {
  EXPERIENCE_DATA,
  EDUCATION_DATA,
  ABOUT_ME_DATA,
  buildExperienceContext,
  buildEducationContext,
  buildAboutMeContext,
} from '../../data/portfolioStaticData';
import {
  buildJobExperienceResponse,
  buildExperienceDurationResponse,
  buildFreelancingResponse,
  buildCapabilityResponse,
  buildNegativeFallbackResponse,
  extractCapabilityWhat,
} from '../../data/fixedIntents';
import { getEmbedding } from '../../middlewares/embedding';
import { generateResponse } from '../../middlewares/responseGeneration';

// ==================== Pinecone Client ====================

let pineconeClient: Pinecone | null = null;

const getPinecone = (): Pinecone => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pineconeClient;
};

const NAMESPACE = 'portfolio_data';
const SIMILARITY_THRESHOLD = 0.7;
const DEFAULT_TOP_K = 5;

const SITE_URL = process.env.PORTFOLIO_URL || 'http://localhost:3000';
const PROJECT_DETAILS_URL = (slug: string) =>
  `${SITE_URL}/all-projects/projectDetails/${slug}`;
const ALL_PROJECTS_URL = `${SITE_URL}/all-projects`;
const FALLBACK_MESSAGE = getFallbackMessage(SITE_URL);

// ==================== Document Types ====================

export interface IProjectDoc {
  _id: string | unknown;
  title: string;
  shortDescription: string;
  details: string;
  keyFeatures: string;
  technologies: string[];
  liveLink: string;
  projectType: string;
  tags?: string[];
}

export interface IBlogDoc {
  _id: string | unknown;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  category?: string;
  publishedAt?: Date;
}

export interface ISkillDoc {
  _id: string | unknown;
  title: string;
  logo: string[];
  order?: number;
}

export interface IProjectCard {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  liveLink: string;
  imageUrls: string[];
  projectType: string;
  technologies: string[];
}

export interface ISkillCard {
  _id: string;
  title: string;
  logo: string[];
}

export interface IBlogCard {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  featuredImage: string;
}

// ==================== Context Builders ====================

const createProjectContext = (doc: IProjectDoc): string => {
  return [
    `PROJECT: ${doc.title}`,
    `Description: ${doc.shortDescription}`,
    `Details: ${doc.details}`,
    `Key Features: ${doc.keyFeatures}`,
    `Technologies: ${doc.technologies.join(', ')}`,
    `Live: ${doc.liveLink}`,
    `Type: ${doc.projectType}`,
    `Tags: ${(doc.tags || []).join(', ')}`,
  ].join('\n');
};

const createProjectMetadata = (doc: IProjectDoc) => ({
  title: doc.title,
  content: `${doc.shortDescription} ${doc.details}`.slice(0, 8000),
  type: 'project',
  link: doc.liveLink,
  technologies: doc.technologies.join(', '),
  category: doc.projectType || 'Full-Stack',
});

const createBlogContext = (doc: IBlogDoc): string => {
  return [
    `BLOG: ${doc.title}`,
    `Summary: ${doc.summary || ''}`,
    `Category: ${doc.category || ''}`,
    `Tags: ${(doc.tags || []).join(', ')}`,
    `Content: ${doc.content}`,
  ].join('\n');
};

const createBlogMetadata = (doc: IBlogDoc) => ({
  title: doc.title,
  content: `${doc.summary || ''} ${doc.content}`.slice(0, 8000),
  type: 'blog',
  link: '',
  technologies: (doc.tags || []).join(', '),
  category: doc.category || 'General',
});

const createSkillContext = (doc: ISkillDoc): string => {
  const technologies = doc.logo.filter((item) => !item.startsWith('http'));
  return `SKILL CATEGORY: ${doc.title}\nTechnologies: ${technologies.join(', ')}`;
};

const createSkillMetadata = (doc: ISkillDoc) => {
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

// ==================== Upsert Functions ====================

export const upsertProjectToAI = async (doc: IProjectDoc): Promise<void> => {
  const text = createProjectContext(doc);
  const embedding = await getEmbedding(text);
  const index = getPinecone().Index(process.env.PINECONE_INDEX!);

  await index.namespace(NAMESPACE).upsert({
    records: [
      {
        id: `project_${doc._id?.toString()}`,
        values: embedding,
        metadata: createProjectMetadata(doc),
      },
    ],
  });
};

export const upsertBlogToAI = async (doc: IBlogDoc): Promise<void> => {
  const text = createBlogContext(doc);
  const embedding = await getEmbedding(text);
  const index = getPinecone().Index(process.env.PINECONE_INDEX!);

  await index.namespace(NAMESPACE).upsert({
    records: [
      {
        id: `blog_${doc._id?.toString()}`,
        values: embedding,
        metadata: createBlogMetadata(doc),
      },
    ],
  });
};

export const upsertSkillToAI = async (doc: ISkillDoc): Promise<void> => {
  const text = createSkillContext(doc);
  const embedding = await getEmbedding(text);
  const index = getPinecone().Index(process.env.PINECONE_INDEX!);

  await index.namespace(NAMESPACE).upsert({
    records: [
      {
        id: `skill_${doc._id?.toString()}`,
        values: embedding,
        metadata: createSkillMetadata(doc),
      },
    ],
  });
};

export const upsertExperienceToAI = async (): Promise<void> => {
  const index = getPinecone().Index(process.env.PINECONE_INDEX!);
  const records = await Promise.all(
    EXPERIENCE_DATA.map(async (exp, i) => {
      const context = `EXPERIENCE: ${exp.title} at ${exp.company} (${exp.duration}). ${exp.description}`;
      const embedding = await getEmbedding(context);
      return {
        id: `experience_${i}`,
        values: embedding,
        metadata: {
          title: `${exp.title} at ${exp.company}`,
          content: context,
          type: 'experience',
          company: exp.company,
          duration: exp.duration,
        },
      };
    }),
  );
  await index.namespace(NAMESPACE).upsert({ records });
};

export const upsertEducationToAI = async (): Promise<void> => {
  const index = getPinecone().Index(process.env.PINECONE_INDEX!);
  const records = await Promise.all(
    EDUCATION_DATA.map(async (edu, i) => {
      const context = `EDUCATION: ${edu.degree} from ${edu.institution} (${edu.duration}). ${edu.description}`;
      const embedding = await getEmbedding(context);
      return {
        id: `education_${i}`,
        values: embedding,
        metadata: {
          title: `${edu.degree} - ${edu.institution}`,
          content: context,
          type: 'education',
          institution: edu.institution,
          duration: edu.duration,
        },
      };
    }),
  );
  await index.namespace(NAMESPACE).upsert({ records });
};

export const upsertAboutMeToAI = async (): Promise<void> => {
  const embedding = await getEmbedding(ABOUT_ME_DATA);
  const index = getPinecone().Index(process.env.PINECONE_INDEX!);
  await index.namespace(NAMESPACE).upsert({
    records: [
      {
        id: 'aboutme_0',
        values: embedding,
        metadata: {
          title: 'About Subir Das',
          content: ABOUT_ME_DATA,
          type: 'aboutme',
        },
      },
    ],
  });
};

export const upsertAllStaticDataToAI = async (): Promise<void> => {
  console.log('Upserting experience, education, about me to Pinecone...');
  await Promise.all([
    upsertExperienceToAI(),
    upsertEducationToAI(),
    upsertAboutMeToAI(),
  ]);
  console.log('All static data upserted successfully.');
};

export const deleteFromAI = async (id: string): Promise<void> => {
  const index = getPinecone().Index(process.env.PINECONE_INDEX!);
  await index.namespace(NAMESPACE).deleteOne({ id });
};

// ==================== Search ====================

export interface ISearchResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
}

export const searchPinecone = async (
  query: string,
  topK: number = DEFAULT_TOP_K,
): Promise<ISearchResult[]> => {
  const embedding = await getEmbedding(query);
  const index = getPinecone().Index(process.env.PINECONE_INDEX!);

  const result = await index.namespace(NAMESPACE).query({
    vector: embedding,
    topK,
    includeMetadata: true,
    includeValues: false,
  });

  return result.matches.map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    metadata: match.metadata ?? {},
  }));
};

// ==================== Chat Types ====================

export interface IChatResult {
  success: boolean;
  message: string;
  score?: number;
  status?: string;
  projects?: IProjectCard[];
  skills?: ISkillCard[];
  blogs?: IBlogCard[];
}

export interface IChatHistory {
  role: 'user' | 'assistant';
  content: string;
}

// ==================== MongoDB Direct Queries ====================

export const searchProjectsByTechnology = async (
  techName: string,
): Promise<IProjectCard[]> => {
  const regex = new RegExp(techName, 'i');
  const projects = await Project.find({
    technologies: { $regex: regex },
  })
    .sort({ order: -1, createdAt: -1 })
    .select(
      'title slug shortDescription liveLink imageUrls projectType technologies',
    )
    .lean();

  return projects.map((p) => ({
    _id: p._id?.toString() || '',
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription,
    liveLink: p.liveLink,
    imageUrls: p.imageUrls || [],
    projectType: p.projectType,
    technologies: p.technologies || [],
  }));
};

export const getAllProjectsForCards = async (): Promise<IProjectCard[]> => {
  const projects = await Project.find()
    .sort({ order: -1, createdAt: -1 })
    .select(
      'title slug shortDescription liveLink imageUrls projectType technologies',
    )
    .lean();

  return projects.map((p) => ({
    _id: p._id?.toString() || '',
    title: p.title,
    slug: p.slug,
    shortDescription: p.shortDescription,
    liveLink: p.liveLink,
    imageUrls: p.imageUrls || [],
    projectType: p.projectType,
    technologies: p.technologies || [],
  }));
};

export const getAllSkills = async (): Promise<ISkillCard[]> => {
  const skills = await Skill.find()
    .sort({ order: -1 })
    .select('title logo')
    .lean();

  return skills.map((s) => ({
    _id: s._id?.toString() || '',
    title: s.title,
    logo: s.logo || [],
  }));
};

export const getSkillCount = async (): Promise<number> => {
  return Skill.countDocuments();
};

export const getAllBlogs = async (): Promise<IBlogCard[]> => {
  const blogs = await Blog.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .select('title slug summary category featuredImage')
    .lean();

  return blogs.map((b) => ({
    _id: b._id?.toString() || '',
    title: b.title,
    slug: b.slug,
    summary: b.summary || '',
    category: b.category || 'General',
    featuredImage: b.featuredImage || '',
  }));
};

export const getBlogCount = async (): Promise<number> => {
  return Blog.countDocuments({ status: 'published' });
};

export const getProjectCount = async (): Promise<number> => {
  return Project.countDocuments();
};

export const getProjectCountByTech = async (
  techName: string,
): Promise<number> => {
  const regex = new RegExp(techName, 'i');
  return Project.countDocuments({ technologies: { $regex: regex } });
};

// ==================== Portfolio Overview Context ====================

const buildPortfolioOverviewContext = async (): Promise<string> => {
  const [skills, projects] = await Promise.all([
    getAllSkills(),
    getAllProjectsForCards(),
  ]);

  const skillCount = skills.length;
  const projectCount = projects.length;

  const aiSkills: string[] = [];
  const frontendSkills: string[] = [];
  const backendSkills: string[] = [];
  const cloudSkills: string[] = [];

  const aiKeywords = [
    'n8n',
    'gemini',
    'rag',
    'langchain',
    'openai',
    'zapier',
    'automation',
    'agent',
  ];
  const frontendKeywords = [
    'react',
    'next',
    'typescript',
    'javascript',
    'tailwind',
    'bootstrap',
    'css',
    'html',
    'material',
    'shadcn',
    'redux',
    'zustand',
    'ant design',
    'shopify',
  ];
  const backendKeywords = [
    'node',
    'express',
    'mongodb',
    'mongoose',
    'postgresql',
    'prisma',
    'redis',
  ];
  const cloudKeywords = [
    'firebase',
    'vercel',
    'docker',
    'aws',
    'netlify',
    'cloud',
  ];

  const matchesAny = (text: string, keywords: string[]) =>
    keywords.some((k) => text.includes(k));

  skills.forEach((s) => {
    const techs = s.logo.filter((item) => !item.startsWith('http'));
    const entry = `**${s.title}**: ${techs.join(', ')}`;
    const combined = `${s.title} ${techs.join(' ')}`.toLowerCase();

    if (matchesAny(combined, aiKeywords)) aiSkills.push(entry);
    else if (matchesAny(combined, frontendKeywords)) frontendSkills.push(entry);
    else if (matchesAny(combined, backendKeywords)) backendSkills.push(entry);
    else if (matchesAny(combined, cloudKeywords)) cloudSkills.push(entry);
    else frontendSkills.push(entry);
  });

  const categorizedSkills = [
    aiSkills.length > 0
      ? `**AI & Automation:**\n${aiSkills.map((s) => `- ${s}`).join('\n')}`
      : '',
    frontendSkills.length > 0
      ? `**Frontend:**\n${frontendSkills.map((s) => `- ${s}`).join('\n')}`
      : '',
    backendSkills.length > 0
      ? `**Backend:**\n${backendSkills.map((s) => `- ${s}`).join('\n')}`
      : '',
    cloudSkills.length > 0
      ? `**Cloud & Tools:**\n${cloudSkills.map((s) => `- ${s}`).join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const experienceDetails = EXPERIENCE_DATA.map(
    (exp) =>
      `- **${exp.title}** at ${exp.company} (${exp.duration})\n  _${exp.description}_`,
  ).join('\n\n');

  const educationDetails = EDUCATION_DATA.map(
    (edu) =>
      `- **${edu.degree}**\n  ${edu.institution} | ${edu.duration}\n  _${edu.description}_`,
  ).join('\n\n');

  return `PORTFOLIO OVERVIEW DATA

**HOOK** (start response with this exact line):
"Subir Das is an AI Solutions Architect & Full-Stack Developer specializing in building self-thinking AI Agents and high-performance web ecosystems."

**SKILLS** (${skillCount} categories):
${categorizedSkills}

**PROJECTS** (${projectCount} total):
Just say: "Subir has engineered ${projectCount}+ production-grade projects. Explore his full-scale applications with [live demos](${ALL_PROJECTS_URL})."
Do NOT list project titles — the frontend will show project cards automatically.

**EXPERIENCE** (${EXPERIENCE_DATA.length} entries):
${experienceDetails}

**EDUCATION** (${EDUCATION_DATA.length} entries):
${educationDetails}

**ABOUT ME:**
${ABOUT_ME_DATA}

Do NOT mention blogs — blogs are only shown when user specifically asks about blogs.

**CLOSING** (end response with this EXACT line):
---
Ready to automate your business or build a scalable product? **Let's connect!**

RESPONSE FORMAT RULES:
- Use **bold** for headings and key terms
- Use bullet lists (- item) for skills, experience, education
- Use horizontal rules (---) to separate sections
- Keep each section concise and scannable`;
};

const buildContextFromResults = (results: ISearchResult[]): string => {
  return results
    .map((r) => {
      const type = r.metadata.type || 'unknown';
      const title = r.metadata.title || 'Unknown';
      const content = r.metadata.content || '';

      if (type === 'project') return `PROJECT: ${title}\n${content}\n`;
      if (type === 'blog') return `BLOG: ${title}\n${content}\n`;
      if (type === 'skill') return `SKILL: ${title}\n${content}\n`;
      return `${String(type).toUpperCase()}: ${title}\n${content}\n`;
    })
    .join('\n---\n');
};

// ==================== Chat Function ====================

export const chat = async (
  message: string,
  history?: IChatHistory[],
): Promise<IChatResult> => {
  const detectedTech = detectTechQuery(message);
  const isSkillQuery = detectSkillQuery(message);
  const isBlogQuery = detectBlogQuery(message);
  const isPortfolioOverview = detectPortfolioOverview(message);
  const isAllProjectsQuery = detectAllProjectsQuery(message);
  const isFollowUp = detectFollowUp(message);
  const isBlogCount = detectBlogCountQuery(message);
  const isSkillCount = detectSkillCountQuery(message);
  const isProjectCount = detectProjectCountQuery(message);
  const isGreeting = detectGreeting(message);
  const isExperienceQuery = detectExperienceQuery(message);
  const isEducationQuery = detectEducationQuery(message);
  const isAboutMeQuery = detectAboutMeQuery(message);
  const isExperienceDuration = detectExperienceDurationQuery(message);
  const isJobExperience = detectJobExperienceQuery(message);
  const isCapabilityQuery = detectCapabilityQuery(message);
  const isFreelancingQuery = detectFreelancingQuery(message);
  const isAIAutomationQuery = detectAIAutomationQuery(message);

  // Greeting — return immediately, no DB queries, no AI call
  if (
    isGreeting &&
    !detectedTech &&
    !isSkillQuery &&
    !isBlogQuery &&
    !isPortfolioOverview &&
    !isExperienceQuery &&
    !isEducationQuery &&
    !isAboutMeQuery &&
    !isJobExperience &&
    !isExperienceDuration &&
    !isCapabilityQuery &&
    !isFreelancingQuery &&
    !isAIAutomationQuery
  ) {
    const lower = message.toLowerCase().trim();
    let greeting =
      "Hello! Welcome — I'm Subir Das's AI Assistant. Whether you're here to explore his work, discuss a project, or just curious — I'm here to help. What would you like to know?";

    if (lower.includes('কেমন') || lower.includes('kemon'))
      greeting =
        "I'm doing great, thank you! I'm Subir Das's AI Assistant — here to help you explore his work, skills, and ongoing projects. What would you like to know?";
    else if (
      lower.includes('কি অবস্থা') ||
      lower.includes('কি খবর') ||
      lower.includes('ki obostha') ||
      lower.includes('ki khobor')
    )
      greeting =
        "All good here! I'm Subir's AI Assistant — ready to answer any questions about his projects, skills, or experience. How can I help you?";
    else if (lower.includes('সুপ্রভাত') || lower.includes('good morning'))
      greeting =
        "Good morning! Welcome to Subir Das's portfolio. I'm his AI Assistant — feel free to ask about his projects, skills, or how he can help with your next big idea!";
    else if (lower.includes('শুভ অপরাহ্ন') || lower.includes('good afternoon'))
      greeting =
        "Good afternoon! I'm Subir Das's AI Assistant. Whether you're exploring his work or looking for a reliable developer — I'm here to help. What's on your mind?";
    else if (lower.includes('শুভ সন্ধ্যা') || lower.includes('good evening'))
      greeting =
        "Good evening! Thanks for stopping by. I'm Subir's AI Assistant — ask me anything about his projects, tech stack, or availability!";
    else if (lower.includes('শুভ রাত্রি') || lower.includes('good night'))
      greeting =
        "Good night! Thanks for visiting. Feel free to come back anytime — I'm always here to help you learn about Subir's work!";
    else if (
      lower.includes('হায়') ||
      lower.includes('হাই') ||
      lower.includes('হেলো')
    )
      greeting =
        "Hey! I'm Subir Das's AI Assistant. Whether you want to explore his portfolio, discuss a project idea, or learn about his tech stack — I've got you covered!";
    else if (
      lower.includes('hey') ||
      lower.includes('yo') ||
      lower.includes('sup') ||
      lower.includes('wassup') ||
      lower.includes('wazzup')
    )
      greeting =
        "Hey there! Welcome to Subir's portfolio. I'm his AI Assistant — ready to help you explore projects, skills, or anything you need. What's up?";
    else if (lower.includes('howdy'))
      greeting =
        "Howdy! I'm Subir Das's AI Assistant. Feel free to ask about his experience, projects, or how he can bring your ideas to life!";
    else if (lower.includes('thank'))
      greeting =
        "You're welcome! If you have any more questions about Subir's work, skills, or availability — I'm always here to help!";
    else if (
      lower.includes('bye') ||
      lower.includes('goodbye') ||
      lower.includes('good bye')
    )
      greeting =
        "Goodbye! Thanks for visiting Subir's portfolio. Come back anytime — and don't hesitate to reach out if you need a reliable developer for your next project!";
    else if (lower.includes('welcome'))
      greeting =
        "Thank you! I'm Subir Das's AI Assistant — here to help you explore his work and discuss how he can contribute to your projects. What would you like to know?";
    else if (
      lower.includes('who made you') ||
      lower.includes('who built you') ||
      lower.includes('who created you')
    )
      greeting =
        'I was built by Subir Das himself! He designed this AI assistant to help visitors like you explore his portfolio, skills, and project capabilities. Pretty cool, right?';

    return { success: true, message: greeting, status: 'SUCCESS' };
  }

  // ==================== Fixed Intent Responses (No Gemini, No DB) ====================

  // Job Experience — show Codealign durations specifically
  if (isJobExperience && !isPortfolioOverview) {
    return {
      success: true,
      message: buildJobExperienceResponse(SITE_URL),
      status: 'SUCCESS',
    };
  }

  // General Experience Duration — show 5+ years overview
  if (isExperienceDuration && !isPortfolioOverview) {
    return {
      success: true,
      message: buildExperienceDurationResponse(SITE_URL),
      status: 'SUCCESS',
    };
  }

  if (
    isFreelancingQuery &&
    !isPortfolioOverview &&
    !isBlogQuery &&
    !isSkillQuery
  ) {
    return {
      success: true,
      message: buildFreelancingResponse(SITE_URL),
      status: 'SUCCESS',
    };
  }

  // Capability — skip if AI automation or freelancing already matched
  if (
    isCapabilityQuery &&
    !isPortfolioOverview &&
    !isBlogQuery &&
    !isSkillQuery &&
    !isAIAutomationQuery &&
    !isFreelancingQuery
  ) {
    const what = extractCapabilityWhat(message);
    return {
      success: true,
      message: buildCapabilityResponse(what, SITE_URL),
      status: 'SUCCESS',
    };
  }

  // ==================== Dynamic Queries (need DB) ====================

  let projectCards: IProjectCard[] = [];
  let skillCards: ISkillCard[] = [];
  let blogCards: IBlogCard[] = [];
  let context = '';

  // Count-only queries — return immediately, no AI call, no Pinecone search
  if (isProjectCount && !detectedTech && !isSkillQuery && !isBlogQuery) {
    const count = await getProjectCount();
    return {
      success: true,
      message: `সাবিরের মোট ${count}টি প্রকল্প আছে।`,
      status: 'SUCCESS',
    };
  }

  if (isSkillCount && !detectedTech && !isBlogQuery) {
    const count = await getSkillCount();
    return {
      success: true,
      message: `সাবিরের মোট ${count}টি skill category আছে।`,
      status: 'SUCCESS',
    };
  }

  if (isBlogCount && !detectedTech && !isSkillQuery) {
    const count = await getBlogCount();
    return {
      success: true,
      message: `সাবিরের মোট ${count}টি ব্লগ আছে।`,
      status: 'SUCCESS',
    };
  }

  // Follow-up query detection
  if (
    isFollowUp &&
    !detectedTech &&
    !isSkillQuery &&
    !isBlogQuery &&
    !isPortfolioOverview
  ) {
    const prevTech = extractTechFromHistory(history);
    const prevIsSkill = isSkillFromHistory(history);
    const prevIsBlog = isBlogFromHistory(history);

    if (prevTech) {
      projectCards = await searchProjectsByTechnology(prevTech);
      if (projectCards.length > 0) {
        const techContext = projectCards
          .map(
            (p) =>
              `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${PROJECT_DETAILS_URL(p.slug)}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${p.imageUrls?.[0] || ''}`,
          )
          .join('\n---\n');
        context = `FOLLOW-UP CONTEXT: User is asking about "${prevTech}" projects. Found ${projectCards.length} project(s).\nView All: ${ALL_PROJECTS_URL}\n\n${techContext}`;
      }
    } else if (prevIsSkill) {
      skillCards = await getAllSkills();
      const skillContext = skillCards
        .map(
          (s) =>
            `SKILL: ${s.title}\nTechnologies: ${s.logo.filter((i) => !i.startsWith('http')).join(', ')}`,
        )
        .join('\n---\n');
      context = `FOLLOW-UP: skills. ${skillCards.length} categories.\n\n${skillContext}`;
    } else if (prevIsBlog) {
      blogCards = await getAllBlogs();
      if (blogCards.length > 0) {
        const blogContext = blogCards
          .map(
            (b) =>
              `BLOG: [${b.title}](${SITE_URL}/blogs/${b.slug})\nCategory: ${b.category}`,
          )
          .join('\n---\n');
        context = `FOLLOW-UP: blogs. ${blogCards.length} published.\n\n${blogContext}`;
      }
    }
  }

  // Portfolio overview query
  if (
    isPortfolioOverview &&
    !detectedTech &&
    !isSkillQuery &&
    !isBlogQuery &&
    !context
  ) {
    context = await buildPortfolioOverviewContext();
  }

  // All projects query
  if (isAllProjectsQuery && !context) {
    const allProjects = await getAllProjectsForCards();
    projectCards = allProjects;
    const count = allProjects.length;
    if (count > 0) {
      const projectContext = allProjects
        .map(
          (p) =>
            `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${PROJECT_DETAILS_URL(p.slug)}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${p.imageUrls?.[0] || ''}`,
        )
        .join('\n---\n');
      context = `ALL PROJECTS: ${count} total.\nView All: ${ALL_PROJECTS_URL}\n\n${projectContext}`;
    }
  }

  // Tech-specific project query
  if (detectedTech && !isSkillQuery && !isBlogQuery && !context) {
    projectCards = await searchProjectsByTechnology(detectedTech);
    if (projectCards.length > 0) {
      const techContext = projectCards
        .map(
          (p) =>
            `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${PROJECT_DETAILS_URL(p.slug)}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${p.imageUrls?.[0] || ''}`,
        )
        .join('\n---\n');
      context = `TECH SEARCH: ${projectCards.length} project(s) using "${detectedTech}".\nView All: ${ALL_PROJECTS_URL}\n\n${techContext}`;
    }
  }

  // Skill query
  if (isSkillQuery && !isPortfolioOverview && !context) {
    const allSkills = await getAllSkills();
    const skillContext = allSkills
      .map(
        (s) =>
          `SKILL: ${s.title}\nTechnologies: ${s.logo.filter((i) => !i.startsWith('http')).join(', ')}`,
      )
      .join('\n---\n');
    context = `SKILLS: ${allSkills.length} categories.\n\n${skillContext}`;
    if (!isSkillCount) skillCards = allSkills;
  }

  // Blog query
  if (isBlogQuery && !context) {
    const allBlogs = await getAllBlogs();
    if (allBlogs.length > 0) {
      const blogContext = allBlogs
        .map(
          (b) =>
            `BLOG: [${b.title}](${SITE_URL}/blogs/${b.slug})\nCategory: ${b.category}\nSummary: ${b.summary}`,
        )
        .join('\n---\n');
      context = `BLOGS: ${allBlogs.length} published.\n\n${blogContext}`;
      if (!isBlogCount) blogCards = allBlogs;
    }
  }

  // Experience query
  if (isExperienceQuery && !isPortfolioOverview && !context) {
    context = `EXPERIENCE (${EXPERIENCE_DATA.length} entries):\n\n${buildExperienceContext()}`;
  }

  // Education query
  if (isEducationQuery && !isPortfolioOverview && !context) {
    context = `EDUCATION:\n\n${buildEducationContext()}`;
  }

  // About me query
  if (isAboutMeQuery && !isPortfolioOverview && !context) {
    context = `ABOUT SUBIR:\n${buildAboutMeContext()}`;
  }

  // If no specific query detected, do Pinecone semantic search
  if (!context) {
    const results = await searchPinecone(message, DEFAULT_TOP_K);

    if (results.length === 0 || results[0].score < SIMILARITY_THRESHOLD) {
      const lower = message.toLowerCase();

      // AI/Automation query — build context from about_me + skills, send to Gemini
      if (
        isAIAutomationQuery ||
        lower.includes('automation') ||
        lower.includes('agent') ||
        lower.includes('bot')
      ) {
        const skills = await getAllSkills();
        skillCards = skills;
        const aiSkills = skills
          .filter((s) => {
            const t = s.title.toLowerCase();
            return [
              'n8n',
              'gemini',
              'rag',
              'langchain',
              'openai',
              'zapier',
              'automation',
              'agent',
            ].some((k) => t.includes(k));
          })
          .map(
            (s) =>
              `${s.title}: ${s.logo.filter((i) => !i.startsWith('http')).join(', ')}`,
          )
          .join('\n');

        context = `USER IS ASKING ABOUT AI/AUTOMATION CAPABILITIES:\n\nABOUT SUBIR:\n${buildAboutMeContext()}\n\nRELEVANT AI SKILLS:\n${aiSkills || 'No specific AI skills listed'}\n\nRESPONSE RULE: Answer directly whether Subir can help with their specific need. Be confident and professional. Mention relevant skills and experience.`;
      }

      // Freelancing query — fixed response
      if (
        !context &&
        (lower.includes('freelanc') ||
          lower.includes('hire') ||
          lower.includes('available'))
      ) {
        return {
          success: true,
          message: buildFreelancingResponse(SITE_URL),
          score: results[0]?.score || 0,
          status: 'FAILED',
        };
      }

      // No match — smart fallback with about me snippet + contact
      if (!context) {
        return {
          success: true,
          message: buildNegativeFallbackResponse(SITE_URL),
          score: results[0]?.score || 0,
          status: 'FAILED',
        };
      }
    } else {
      const pineconeContext = buildContextFromResults(results);
      const projectResults = results.filter(
        (r) => r.metadata.type === 'project',
      );

      if (projectResults.length > 0) {
        const titles = projectResults
          .map((r) => r.metadata.title)
          .filter(Boolean);
        const mongoProjects = await Project.find({ title: { $in: titles } })
          .select(
            'title slug shortDescription liveLink imageUrls projectType technologies',
          )
          .lean();

        projectCards = mongoProjects.map((p) => ({
          _id: p._id?.toString() || '',
          title: p.title,
          slug: p.slug,
          shortDescription: p.shortDescription,
          liveLink: p.liveLink,
          imageUrls: p.imageUrls || [],
          projectType: p.projectType,
          technologies: p.technologies || [],
        }));

        const projectDetails = projectCards
          .map(
            (p) =>
              `PROJECT: ${p.title}\nSlug: ${p.slug}\nURL: ${PROJECT_DETAILS_URL(p.slug)}\nImage: ${p.imageUrls?.[0] || ''}\nLive: ${p.liveLink}`,
          )
          .join('\n---\n');

        context = `${pineconeContext}\n\nPROJECT CARDS:\nView All: ${ALL_PROJECTS_URL}\n${projectDetails}`;
      } else {
        context = pineconeContext;
      }
    }
  }

  let response = await generateResponse(context, message, history);

  if (!response) {
    const parts: string[] = [];
    parts.push(
      '**Subir Das** is an AI Solutions Architect & Full-Stack Developer specializing in building self-thinking AI Agents and high-performance web ecosystems.',
    );

    let skillsToUse = skillCards;
    if (skillsToUse.length === 0) {
      try {
        skillsToUse = await getAllSkills();
      } catch {}
    }
    if (skillsToUse.length > 0) {
      const aiSk: string[] = [],
        feSk: string[] = [],
        beSk: string[] = [],
        clSk: string[] = [];
      const aiKw = [
        'n8n',
        'gemini',
        'rag',
        'langchain',
        'openai',
        'zapier',
        'automation',
        'agent',
      ];
      const feKw = [
        'react',
        'next',
        'typescript',
        'javascript',
        'tailwind',
        'bootstrap',
        'css',
        'html',
        'material',
        'shadcn',
        'redux',
        'zustand',
        'ant design',
        'shopify',
      ];
      const beKw = [
        'node',
        'express',
        'mongodb',
        'mongoose',
        'postgresql',
        'prisma',
        'redis',
      ];
      const clKw = ['firebase', 'vercel', 'docker', 'aws', 'netlify', 'cloud'];
      skillsToUse.forEach((s) => {
        const t = s.title.toLowerCase();
        if (aiKw.some((k) => t.includes(k))) aiSk.push(s.title);
        else if (feKw.some((k) => t.includes(k))) feSk.push(s.title);
        else if (beKw.some((k) => t.includes(k))) beSk.push(s.title);
        else if (clKw.some((k) => t.includes(k))) clSk.push(s.title);
        else feSk.push(s.title);
      });
      const sections = [
        aiSk.length > 0 ? `**AI & Automation:**\n${aiSk.join(', ')}` : '',
        feSk.length > 0 ? `**Frontend:**\n${feSk.join(', ')}` : '',
        beSk.length > 0 ? `**Backend:**\n${beSk.join(', ')}` : '',
        clSk.length > 0 ? `**Cloud & Tools:**\n${clSk.join(', ')}` : '',
      ].filter(Boolean);
      parts.push(
        `\n\n---\n\n**Core Tech Stack** (${skillsToUse.length} categories):\n\n${sections.join('\n\n')}`,
      );
    }

    if (EXPERIENCE_DATA.length > 0) {
      parts.push(
        `\n\n---\n\n**Professional Journey:**\n${EXPERIENCE_DATA.map((e) => `- **${e.title}** at ${e.company} (${e.duration})`).join('\n')}`,
      );
    }
    if (EDUCATION_DATA.length > 0) {
      parts.push(
        `\n\n**Education:**\n${EDUCATION_DATA.map((e) => `- **${e.degree}** from ${e.institution} (${e.duration})`).join('\n')}`,
      );
    }

    let projectsToUse = projectCards;
    if (projectsToUse.length === 0) {
      try {
        projectsToUse = await getAllProjectsForCards();
      } catch {}
    }
    if (projectsToUse.length > 0) {
      parts.push(
        `\n\n---\n\nSubir has engineered **${projectsToUse.length}+ production-grade projects**. Explore his full-scale applications with [live demos](${ALL_PROJECTS_URL}).`,
      );
    }

    const closing =
      "\n\n---\nReady to automate your business or build a scalable product? **Let's connect!**";
    response = parts.join('') + closing + '\n\n' + getContactMessage(SITE_URL);
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

// ==================== Exports ====================

export const AIServices = {
  getEmbedding,
  upsertProjectToAI,
  upsertBlogToAI,
  upsertSkillToAI,
  upsertExperienceToAI,
  upsertEducationToAI,
  upsertAboutMeToAI,
  upsertAllStaticDataToAI,
  deleteFromAI,
  searchPinecone,
  generateResponse,
  chat,
  searchProjectsByTechnology,
  getAllProjectsForCards,
  getAllSkills,
  getSkillCount,
  getAllBlogs,
  getBlogCount,
  getProjectCount,
  getProjectCountByTech,
};
