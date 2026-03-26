import '../../config';
import { Pinecone } from '@pinecone-database/pinecone';
import { Project } from '../project/project.model';
import { Skill } from '../skill/skill.model';
import { Blog } from '../blog/blog.model';

let pineconeClient: Pinecone | null = null;

const getPinecone = (): Pinecone => {
  if (!pineconeClient) {
    console.log(
      'PINECONE_API_KEY:',
      process.env.PINECONE_API_KEY ? 'present' : 'MISSING',
    );
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

const SYSTEM_PROMPT = `You are Subir Das's Professional AI Assistant. Your role is to help visitors learn about Subir's portfolio, skills, projects, and professional background.

RESPONSE GUIDELINES:
1. ALWAYS respond in the SAME LANGUAGE as the user (English, Bengali, or Banglish)
2. For greetings, use neutral friendly greetings like "Hello", "Hi", "Hey" — do NOT use religious greetings like "Assalamu Alaikum", "Namaste", etc.
3. Use ONLY the provided context to answer. If information is not in context, politely say you don't have that info
4. Be concise but informative
5. For greetings like "hello", "hi" — greet warmly and introduce yourself as Subir's AI assistant
6. Show respect and professionalism at all times
7. MAINTAIN CONVERSATION CONTEXT: If the user's message is a follow-up (like "what are those?", "tell me more", "ki ki dao", "oigula"), refer to the PREVIOUS topic discussed. Do NOT reset to a greeting.

BANGLA SPELLING RULES (VERY IMPORTANT):
7a. When responding in Bengali/Banglish, ALL words must be spelled CORRECTLY. No typos allowed.
7b. Use proper Bengali Unicode characters. Double-check every word before responding.
7c. Common correct spellings: "প্রকল্প" (not "প্রোজেক্ট"), "দক্ষতা" (not "স্কিল"), "ব্লগ" (not "ব্লগ")
7d. If unsure about a Bengali word spelling, use the English equivalent instead.

PROJECT RESPONSE RULES (VERY IMPORTANT - READ CAREFULLY):
8. When showing projects, the project cards will be rendered AUTOMATICALLY by the frontend as template cards with image, title, type, technologies, and "View Details" button
9. DO NOT describe project details in your text response — the frontend handles card rendering
10. Just mention the COUNT and optionally a brief one-line summary
11. Example response for "Next.js projects": "Next.js দিয়ে ২টি প্রকল্প আছে। নিচে দেখুন:" then the frontend shows the cards
12. Example response for "how many projects": "সাবিরের মোট ৫টি প্রকল্প আছে। নিচে দেখুন:" then the frontend shows the cards
13. Example response for "all projects": "মোট ৫টি প্রকল্প আছে। নিচে দেখুন:" then the frontend shows 2 cards + "View All" card
14. NEVER include project titles, descriptions, technologies, or links in your text — the cards will show all that

COUNTING RULES:
14. When asked "how many projects/skills/blogs" use the EXACT count provided in context. NEVER guess or estimate.
15. For count-only queries (like "blog koita", "skill koto", "how many projects"), respond with ONLY the count — do NOT list all items or show template cards
16. Example: "blog koita?" → "সাবিরের মোট ৩টি ব্লগ আছে।" — nothing more
17. Example: "skill koita?" → "সাবিরের মোট ৫টি skill category আছে।" — nothing more
18. Skills count = number of skill categories (each skill title is one category)
19. Blogs count = number of published blogs
20. Projects count = total projects, or filtered by technology if context says so

SKILLS DISPLAY:
18. When listing skills, show the count and list ALL skill category names from context
19. Format: "Subir has X skill categories:" then list each with its technologies
20. NEVER show skill image/logo URLs - only show skill names and technologies

PORTFOLIO OVERVIEW DISPLAY (when user asks about Subir's portfolio/overview/about):
21. Use this EXACT sequence (industry standard):
    - Skills (with count and all categories)
    - Projects (with count — cards will render automatically)
    - Experience (with count and details if available)
    - Education (with count and details if available)
    - About Me (if available)
    - Blogs (with count and blog titles)
22. Skills: List ALL skill categories by name with technologies - NO images
23. Projects: Just mention count, cards render automatically
24. Experience: Show count and details if available in context, otherwise say "Not yet added"
25. Education: Show count and details if available in context, otherwise say "Not yet added"
26. About Me: Show if available in context, otherwise say "Not yet added"
27. Blogs: Show count AND list each blog title with link

BLOGS DISPLAY:
28. When listing blogs, show the count and blog titles with links
29. Format: Each blog title should be a clickable link

FOLLOW-UP QUERY HANDLING (VERY IMPORTANT):
30. Short follow-up questions like "what are those?", "ki ki?", "oigula?", "tell me more", "বিস্তারিত বলো" mean the user wants DETAILS about the PREVIOUS topic
31. If the previous message was about Next.js projects, and user says "ki ki?" — respond briefly, cards will render automatically
32. If the previous message was about skills, and user says "tell me more" — show the skill list with technologies
33. Do NOT greet again for follow-up messages
34. Do NOT say "আপনি কী জিজ্ঞেস করছেন?" or "What are you asking?" — just show the relevant data
35. Continue the conversation naturally based on the data provided in context

If you don't have information about a specific topic, politely suggest contacting Subir at Email: subirdas1045@gmail.com or LinkedIn: https://www.linkedin.com/in/subirdas29/`;

const FALLBACK_MESSAGE =
  "I only have information about Subir's professional work. For this, please contact him directly at Email: subirdas1045@gmail.com, or LinkedIn: https://www.linkedin.com/in/subirdas29/.";

// ==================== Embedding ====================

export const getEmbedding = async (text: string): Promise<number[]> => {
  const apiKey = process.env.GEMINI_API_KEY!;
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

  const response = await fetch(`${url}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      taskType: 'SEMANTIC_SIMILARITY',
      outputDimensionality: 768,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Embedding API error: ${error}`);
  }

  const data = await response.json();
  return data.embedding?.values || [];
};

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
  imageUrls?: string[];
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

export interface IBlogDoc {
  _id: string | unknown;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  category?: string;
  publishedAt?: Date;
}

export interface IBlogCard {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  featuredImage: string;
}

export interface ISkillDoc {
  _id: string | unknown;
  title: string;
  logo: string[];
  order: number;
}

export interface ISkillCard {
  _id: string;
  title: string;
  logo: string[];
}

// ==================== Context Creation ====================

const createProjectContext = (doc: IProjectDoc): string => {
  const tags = doc.tags?.join(', ') || doc.technologies.join(', ');
  const image = doc.imageUrls?.[0] || 'No image available';
  return `PROJECT: ${doc.title}. Type: ${doc.projectType}. Description: ${doc.shortDescription} ${doc.details}. Features: ${doc.keyFeatures}. Technologies: ${doc.technologies.join(', ')}. Tags: ${tags}. Live Link: ${doc.liveLink}. Image: ${image}`;
};

const createBlogContext = (doc: IBlogDoc): string => {
  return `BLOG: ${doc.title}. Category: ${doc.category || 'General'}. Summary: ${doc.summary || ''}. Content: ${doc.content.substring(0, 500)}. Tags: ${doc.tags?.join(', ') || 'none'}. Published: ${doc.publishedAt?.toDateString() || 'N/A'}`;
};

const createSkillContext = (doc: ISkillDoc): string => {
  const technologies = doc.logo.filter((item) => !item.startsWith('http'));
  return `SKILL: ${doc.title}. Technologies: ${technologies.join(', ')}.`;
};

// ==================== Metadata Creation ====================

const createProjectMetadata = (doc: IProjectDoc) => ({
  title: doc.title,
  content: createProjectContext(doc),
  link: doc.liveLink,
  type: 'project',
  technologies: doc.technologies.join(', '),
  category: doc.projectType,
});

const createBlogMetadata = (doc: IBlogDoc) => ({
  title: doc.title,
  content: createBlogContext(doc),
  link: '',
  type: 'blog',
  category: doc.category || 'General',
  tags: doc.tags?.join(', ') || '',
});

const createSkillMetadata = (doc: ISkillDoc) => {
  const technologies = doc.logo.filter((item) => !item.startsWith('http'));
  return {
    title: doc.title,
    content: createSkillContext(doc),
    link: '',
    type: 'skill',
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

// ==================== Response Generation ====================

const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const callGemini = async (
  apiKey: string,
  systemInstruction: string,
  userQuestion: string,
  history?: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> => {
  const contents: { role: string; parts: { text: string }[] }[] = [];

  if (history && history.length > 0) {
    for (const h of history) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: userQuestion }],
  });

  const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

export const generateResponse = async (
  context: string,
  userQuestion: string,
  history?: { role: 'user' | 'assistant'; content: string }[],
): Promise<string | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured');
    return null;
  }

  const systemMessage = `${SYSTEM_PROMPT}\n\nContext:\n${context}`;

  const MAX_RETRIES = 2;
  for (let retry = 0; retry <= MAX_RETRIES; retry++) {
    try {
      const response = await callGemini(
        apiKey,
        systemMessage,
        userQuestion,
        history,
      );
      if (response) return response;
      return null;
    } catch (err: unknown) {
      const isRateLimited =
        err instanceof Error &&
        (err.message.includes('429') ||
          err.message.includes('RESOURCE_EXHAUSTED'));
      const isLastRetry = retry === MAX_RETRIES;

      if (isRateLimited && !isLastRetry) {
        await sleep(1000 * (retry + 1));
        continue;
      }

      console.error('Gemini API failed:', err);
      return null;
    }
  }

  return null;
};

// ==================== Chat ====================

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

const TECH_KEYWORDS = [
  'next.js',
  'nextjs',
  'react',
  'node',
  'express',
  'mongodb',
  'typescript',
  'javascript',
  'python',
  'tailwind',
  'firebase',
  'redux',
  'graphql',
  'angular',
  'vue',
  'docker',
  'aws',
  'html',
  'css',
  'bootstrap',
  'three.js',
  'socket',
  'jwt',
  'rest',
  'api',
  'prisma',
  'postgresql',
  'mysql',
];

const detectTechQuery = (message: string): string | null => {
  const lower = message.toLowerCase();
  for (const tech of TECH_KEYWORDS) {
    if (lower.includes(tech)) {
      return tech;
    }
  }
  return null;
};

const detectSkillQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('skill') ||
    lower.includes('technology') ||
    lower.includes('technologies') ||
    lower.includes('tech stack')
  );
};

const detectBlogQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('blog') ||
    lower.includes('article') ||
    lower.includes('post') ||
    lower.includes('writing')
  );
};

const detectBlogCountQuery = (message: string): boolean => {
  const lower = message.toLowerCase().trim();
  return (
    lower.includes('blog koita') ||
    lower.includes('blog koto') ||
    lower.includes('how many blog') ||
    lower.includes('blogs koita') ||
    lower.includes('blogs koto') ||
    lower.includes('koto blog') ||
    lower.includes('koita blog') ||
    lower.includes('total blog') ||
    lower.includes('number of blog')
  );
};

const detectSkillCountQuery = (message: string): boolean => {
  const lower = message.toLowerCase().trim();
  return (
    lower.includes('skill koita') ||
    lower.includes('skill koto') ||
    lower.includes('how many skill') ||
    lower.includes('skills koita') ||
    lower.includes('skills koto') ||
    lower.includes('koto skill') ||
    lower.includes('koita skill') ||
    lower.includes('total skill') ||
    lower.includes('number of skill')
  );
};

const detectProjectCountQuery = (message: string): boolean => {
  const lower = message.toLowerCase().trim();
  return (
    lower.includes('project koita') ||
    lower.includes('project koto') ||
    lower.includes('how many project') ||
    lower.includes('projects koita') ||
    lower.includes('projects koto') ||
    lower.includes('koto project') ||
    lower.includes('koita project') ||
    lower.includes('total project') ||
    lower.includes('number of project')
  );
};

const detectPortfolioOverview = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('portfolio') ||
    lower.includes('about subir') ||
    lower.includes('tell me about') ||
    lower.includes('who is subir') ||
    lower.includes('overview') ||
    lower.includes('introduce') ||
    lower.includes('about yourself')
  );
};

const GREETINGS = [
  // English
  'hi',
  'hello',
  'hey',
  'hii',
  'hiii',
  'heyy',
  'heyyy',
  'yo',
  'sup',
  'whats up',
  "what's up",
  'good morning',
  'good afternoon',
  'good evening',
  'good night',
  'howdy',
  'greetings',
  'hi there',
  'hello there',
  'hey there',
  // Bengali
  'হাই',
  'হেলো',
  'নমস্কার',
  'নমস্তে',
  'আসসালামু আলাইকুম',
  'সালাম',
  'কেমন আছো',
  'কেমন আছেন',
  'কি অবস্থা',
  'কি খবর',
  // Banglish
  'kemon acho',
  'kemon aco',
  'kemon acen',
  'kemon aso',
  'ki obostha',
  'ki khobor',
  'ki khbr',
  'nomoshkar',
  'namoskar',
  'assalamu alaikum',
  'salam',
  'koi acho',
  'koi aco',
  'tumi kemon acho',
  'apni kemon achen',
  // Slang/casual
  'wassup',
  'wazzup',
  'sup',
  'oy',
  'oii',
];

const detectGreeting = (message: string): boolean => {
  const lower = message.toLowerCase().trim();
  return GREETINGS.some((g) => {
    const gLower = g.toLowerCase();
    return lower === gLower || lower.startsWith(gLower + ' ');
  });
};

const detectAllProjectsQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('all project') ||
    lower.includes('sob project') ||
    lower.includes('joto project') ||
    lower.includes('total project') ||
    lower.includes('all works') ||
    lower.includes('sob kaj') ||
    lower.includes('show all') ||
    lower.includes('sob gulo')
  );
};

const FOLLOW_UP_PATTERNS = [
  'ki ki',
  'kii ki',
  'kia kia',
  'oigula',
  'oigulake',
  'what are those',
  'what are they',
  'tell me more',
  'more details',
  'details',
  'show me',
  'dekhabo',
  'dekha',
  'list',
  'বিস্তারিত',
  'আরো',
];

const detectFollowUp = (message: string): boolean => {
  const lower = message.toLowerCase().trim();
  return FOLLOW_UP_PATTERNS.some((pattern) => lower.includes(pattern));
};

const extractTechFromHistory = (history?: IChatHistory[]): string | null => {
  if (!history || history.length === 0) return null;

  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i].content.toLowerCase();
    for (const tech of TECH_KEYWORDS) {
      if (msg.includes(tech)) {
        return tech;
      }
    }
  }
  return null;
};

const isSkillFromHistory = (history?: IChatHistory[]): boolean => {
  if (!history || history.length === 0) return false;
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i].content.toLowerCase();
    if (
      msg.includes('skill') ||
      msg.includes('technology') ||
      msg.includes('tech stack')
    ) {
      return true;
    }
  }
  return false;
};

const isBlogFromHistory = (history?: IChatHistory[]): boolean => {
  if (!history || history.length === 0) return false;
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i].content.toLowerCase();
    if (
      msg.includes('blog') ||
      msg.includes('article') ||
      msg.includes('writing')
    ) {
      return true;
    }
  }
  return false;
};

const buildPortfolioOverviewContext = async (): Promise<string> => {
  const [skills, projects, blogs] = await Promise.all([
    getAllSkills(),
    getAllProjectsForCards(),
    getAllBlogs(),
  ]);

  const skillCount = skills.length;
  const projectCount = projects.length;
  const blogCount = blogs.length;

  const skillNames = skills
    .map((s) => {
      const technologies = s.logo.filter((item) => !item.startsWith('http'));
      return `${s.title}: ${technologies.join(', ')}`;
    })
    .join('\n');

  const projectDetails = projects
    .map((p) => {
      const detailUrl = PROJECT_DETAILS_URL(p.slug);
      return `- **[${p.title}](${detailUrl})** — ${p.shortDescription} | Type: ${p.projectType} | Tech: ${p.technologies.join(', ')}`;
    })
    .join('\n');

  const blogDetails = blogs
    .map((b) => {
      const blogUrl = `${SITE_URL}/blogs/${b.slug}`;
      return `- **[${b.title}](${blogUrl})** — ${b.category}`;
    })
    .join('\n');

  // Experience, Education, AboutMe will be fetched from DB when available
  // For now, placeholders are included so the AI can say "Not yet added"
  return `PORTFOLIO OVERVIEW DATA:

SKILLS (${skillCount} categories):
${skillNames || 'No skills added yet'}

PROJECTS (${projectCount} total):
${projectDetails || 'No projects added yet'}

EXPERIENCE: Not yet added (will be fetched from database)

EDUCATION: Not yet added (will be fetched from database)

ABOUT ME: Not yet added (will be fetched from database)

BLOGS (${blogCount} published):
${blogDetails || 'No blogs published yet'}`;
};

const buildContextFromResults = (results: ISearchResult[]): string => {
  return results
    .map((r) => {
      const type = r.metadata.type || 'unknown';
      const title = r.metadata.title || 'Unknown';
      const content = r.metadata.content || '';

      if (type === 'project') {
        return `PROJECT: ${title}\n${content}\n`;
      } else if (type === 'blog') {
        return `BLOG: ${title}\n${content}\n`;
      } else if (type === 'skill') {
        return `SKILL: ${title}\n${content}\n`;
      }
      const typeStr = String(type);
      return `${typeStr.toUpperCase()}: ${title}\n${content}\n`;
    })
    .join('\n---\n');
};

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

  // Greeting — return immediately, no DB queries, no AI call
  if (
    isGreeting &&
    !detectedTech &&
    !isSkillQuery &&
    !isBlogQuery &&
    !isPortfolioOverview
  ) {
    const lower = message.toLowerCase().trim();

    let greeting =
      "Hello! I am Subir Das's AI Assistant. How can I help you today?";

    if (lower.includes('কেমন') || lower.includes('kemon')) {
      greeting =
        'আমি ভালো আছি, ধন্যবাদ! আমি সুবির দাসের AI Assistant। আপনি কী জানতে চান?';
    } else if (
      lower.includes('কি অবস্থা') ||
      lower.includes('কি খবর') ||
      lower.includes('ki obostha') ||
      lower.includes('ki khobor')
    ) {
      greeting = 'সব ভালো! আমি সুবিরের AI Assistant। কিছু জানতে চান?';
    } else if (lower.includes('সুপ্রভাত') || lower.includes('good morning')) {
      greeting =
        "Good morning! I am Subir Das's AI Assistant. How can I help you?";
    } else if (
      lower.includes('শুভ অপরাহ্ন') ||
      lower.includes('good afternoon')
    ) {
      greeting =
        "Good afternoon! I am Subir Das's AI Assistant. How can I help you?";
    } else if (
      lower.includes('শুভ সন্ধ্যা') ||
      lower.includes('good evening')
    ) {
      greeting =
        "Good evening! I am Subir Das's AI Assistant. How can I help you?";
    } else if (lower.includes('শুভ রাত্রি') || lower.includes('good night')) {
      greeting =
        "Good night! I am Subir Das's AI Assistant. Feel free to ask me anything anytime!";
    } else if (
      lower.includes('হায়') ||
      lower.includes('হাই') ||
      lower.includes('নমস্কার') ||
      lower.includes('নমস্তে') ||
      lower.includes('nomoshkar')
    ) {
      greeting = 'আমি সুবির দাসের AI Assistant। আপনি কী জানতে চান?';
    } else if (
      lower.includes('আসসালাম') ||
      lower.includes('assalam') ||
      lower.includes('salam')
    ) {
      greeting =
        "Wa Alaikum Assalam! I am Subir Das's AI Assistant. How can I help you?";
    } else if (
      lower.includes('hey') ||
      lower.includes('yo') ||
      lower.includes('sup') ||
      lower.includes('wassup') ||
      lower.includes('wazzup')
    ) {
      greeting =
        "Hey there! I'm Subir's AI Assistant. What would you like to know?";
    } else if (lower.includes('howdy')) {
      greeting =
        "Howdy! I'm Subir Das's AI Assistant. What can I help you with?";
    } else if (lower.includes('হেলো')) {
      greeting = 'হেলো! আমি সুবির দাসের AI Assistant। কী জানতে চান?';
    }

    return {
      success: true,
      message: greeting,
      status: 'SUCCESS',
    };
  }

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

  // Follow-up query detection - look at history for previous topic
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
      const count = projectCards.length;

      if (count > 0) {
        const techContext = projectCards
          .map((p) => {
            const img = p.imageUrls?.[0] || '';
            const detailUrl = PROJECT_DETAILS_URL(p.slug);
            return `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${detailUrl}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${img}`;
          })
          .join('\n---\n');

        context = `FOLLOW-UP CONTEXT: User is asking about the previous topic "${prevTech}" projects. Found ${count} project(s) using "${prevTech}".\nView All Projects URL: ${ALL_PROJECTS_URL}\n\n${techContext}`;
      }
    } else if (prevIsSkill) {
      skillCards = await getAllSkills();
      const count = skillCards.length;
      const skillContext = skillCards
        .map((s) => {
          const technologies = s.logo.filter(
            (item) => !item.startsWith('http'),
          );
          return `SKILL CATEGORY: ${s.title}\nTechnologies: ${technologies.join(', ')}`;
        })
        .join('\n---\n');
      context = `FOLLOW-UP CONTEXT: User is asking about the previous topic "skills". Subir has ${count} skill categories.\n\n${skillContext}`;
    } else if (prevIsBlog) {
      blogCards = await getAllBlogs();
      const count = blogCards.length;
      if (count > 0) {
        const blogContext = blogCards
          .map((b) => {
            const blogUrl = `${SITE_URL}/blogs/${b.slug}`;
            return `BLOG: **[${b.title}](${blogUrl})**\nCategory: ${b.category}\nSummary: ${b.summary}`;
          })
          .join('\n---\n');
        context = `FOLLOW-UP CONTEXT: User is asking about the previous topic "blogs". Subir has published ${count} blog(s).\n\n${blogContext}`;
      }
    }
  }

  // Portfolio overview query (includes greetings and general "about" queries)
  if (
    isPortfolioOverview &&
    !detectedTech &&
    !isSkillQuery &&
    !isBlogQuery &&
    !context
  ) {
    const [allSkills, allProjects, allBlogs] = await Promise.all([
      getAllSkills(),
      getAllProjectsForCards(),
      getAllBlogs(),
    ]);

    skillCards = allSkills;
    projectCards = allProjects;
    blogCards = allBlogs;

    context = await buildPortfolioOverviewContext();
  }

  // All projects query
  if (isAllProjectsQuery && !context) {
    const allProjects = await getAllProjectsForCards();
    const count = allProjects.length;

    if (count > 0) {
      const allProjectsContext = allProjects
        .map((p) => {
          const img = p.imageUrls?.[0] || '';
          const detailUrl = PROJECT_DETAILS_URL(p.slug);
          return `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${detailUrl}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${img}`;
        })
        .join('\n---\n');

      context = `ALL PROJECTS DATA: Subir has ${count} total projects.\nView All Projects URL: ${ALL_PROJECTS_URL}\n\n${allProjectsContext}`;
      projectCards = allProjects;
    }
  }

  // Technology-based project search
  if (detectedTech && !context) {
    projectCards = await searchProjectsByTechnology(detectedTech);
    const count = projectCards.length;

    if (count > 0) {
      const techContext = projectCards
        .map((p) => {
          const img = p.imageUrls?.[0] || '';
          const detailUrl = PROJECT_DETAILS_URL(p.slug);
          return `PROJECT: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${detailUrl}\nType: ${p.projectType}\nTechnologies: ${p.technologies.join(', ')}\nDescription: ${p.shortDescription}\nLive Link: ${p.liveLink}\nImage: ${img}`;
        })
        .join('\n---\n');

      context = `TECHNOLOGY SEARCH: Found ${count} project(s) using "${detectedTech}".\nView All Projects URL: ${ALL_PROJECTS_URL}\n\n${techContext}`;
    }
  }

  // Skill query
  if (isSkillQuery && !isPortfolioOverview && !context) {
    const allSkills = await getAllSkills();
    const count = allSkills.length;

    const skillContext = allSkills
      .map((s) => {
        const technologies = s.logo.filter((item) => !item.startsWith('http'));
        return `SKILL CATEGORY: ${s.title}\nTechnologies: ${technologies.join(', ')}`;
      })
      .join('\n---\n');

    context = `SKILL DATA: Subir has ${count} skill categories.\n\n${skillContext}`;

    if (!isSkillCount) {
      skillCards = allSkills;
    }
  }

  // Blog query
  if (isBlogQuery && !context) {
    const allBlogs = await getAllBlogs();
    const count = allBlogs.length;

    if (count > 0) {
      const blogContext = allBlogs
        .map((b) => {
          const blogUrl = `${SITE_URL}/blogs/${b.slug}`;
          return `BLOG: **[${b.title}](${blogUrl})**\nCategory: ${b.category}\nSummary: ${b.summary}`;
        })
        .join('\n---\n');

      context = `BLOG DATA: Subir has published ${count} blog(s).\n\n${blogContext}`;

      if (!isBlogCount) {
        blogCards = allBlogs;
      }
    }
  }

  // If no specific query detected, do Pinecone semantic search
  if (!context) {
    const results = await searchPinecone(message, DEFAULT_TOP_K);

    if (results.length === 0 || results[0].score < SIMILARITY_THRESHOLD) {
      return {
        success: true,
        message: FALLBACK_MESSAGE,
        score: results[0]?.score || 0,
        status: 'FAILED',
      };
    } else {
      // Build context from Pinecone results
      const pineconeContext = buildContextFromResults(results);

      // Also fetch project details for any project in results
      const projectResults = results.filter(
        (r) => r.metadata.type === 'project',
      );
      if (projectResults.length > 0) {
        const titles = projectResults
          .map((r) => r.metadata.title)
          .filter(Boolean);
        const mongoProjects = await Project.find({
          title: { $in: titles },
        })
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
          .map((p) => {
            const img = p.imageUrls?.[0] || '';
            const detailUrl = PROJECT_DETAILS_URL(p.slug);
            return `PROJECT DETAIL: ${p.title}\nSlug: ${p.slug}\nDetail URL: ${detailUrl}\nImage: ${img}\nLive Link: ${p.liveLink}`;
          })
          .join('\n---\n');

        context = `${pineconeContext}\n\nPROJECT DETAILS FOR CARDS:\nView All URL: ${ALL_PROJECTS_URL}\n${projectDetails}`;
      } else {
        context = pineconeContext;
      }
    }
  }

  let response = await generateResponse(context, message, history);

  if (!response) {
    const parts: string[] = [];
    if (projectCards.length > 0) {
      const count = projectCards.length;
      parts.push(`Subir has ${count} project${count > 1 ? 's' : ''}.`);
    }
    if (skillCards.length > 0) {
      const categories = skillCards.map((s) => s.title).join(', ');
      parts.push(`Skills: ${categories}.`);
    }
    if (blogCards.length > 0) {
      const titles = blogCards.map((b) => b.title).join('; ');
      parts.push(`Blogs: ${titles}.`);
    }
    response =
      parts.length > 0
        ? parts.join(' ') +
          ' For more details, contact Subir at subirdas1045@gmail.com'
        : FALLBACK_MESSAGE;
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

export const AIServices = {
  getEmbedding,
  upsertProjectToAI,
  upsertBlogToAI,
  upsertSkillToAI,
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
