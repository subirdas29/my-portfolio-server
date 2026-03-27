import { getContactMessage } from '../utils/aiChatDetection';

const ALL_PROJECTS_URL_BASE =
  process.env.PORTFOLIO_URL || 'http://localhost:3000';

// ==================== Fixed Response Templates ====================

export const buildJobExperienceResponse = (siteUrl: string) =>
  `Subir's current professional experience:

- **Junior Software Engineer** at Codealign
  Oct 2025 - Present
  End-to-end full-stack web application development — RESTful APIs, backend logic, database management, frontend integration, performance optimization, and cross-team collaboration.

- **Full Stack Developer (Internship)** at Codealign
  Jun 2025 - Sept 2025
  Built responsive and scalable web applications using Next.js, React, Redux, Node.js. Backend APIs with MongoDB, PostgreSQL, Prisma, and agile sprint-based delivery.

---
Want to discuss your project? **Let's connect!**

${getContactMessage(siteUrl)}`;

export const buildExperienceDurationResponse = (siteUrl: string) =>
  `Subir has **5+ years of hands-on experience** in software development — from academic projects during B.Sc. in CSE at Faridpur Engineering College to his current role as a **Junior Software Engineer at Codealign**, building full-stack applications and AI-powered solutions.

---
Want to discuss your project? **Let's connect!**

${getContactMessage(siteUrl)}`;

export const buildFreelancingResponse = (siteUrl: string) =>
  `Subir is available on **Fiverr and Upwork** for custom projects. He focuses on AI solutions, scalable web applications, and MVPs for startups worldwide.

Whether it's a full-stack web app, an AI agent, or a workflow automation pipeline — Subir can help build it.

---
Interested? **Let's connect!**

${getContactMessage(siteUrl)}`;

export const buildCapabilityResponse = (what: string, siteUrl: string) =>
  `**Absolutely!** Subir specializes in building ${what}. With expertise in **Next.js, Node.js, AI Agents (n8n, Gemini), and workflow automation**, he can architect and deliver a production-ready solution tailored to your needs.

Key strengths for your project:
- **Full-Stack Development**: Scalable web apps with Next.js, React, Node.js, MongoDB/PostgreSQL
- **AI & Automation**: Custom AI agents, n8n workflows, Gemini integration, RAG systems
- **End-to-End Delivery**: From concept to deployment, including DevOps and optimization

---
Let's discuss your requirements! **Reach out directly:**

${getContactMessage(siteUrl)}`;

export const buildNegativeFallbackResponse = (siteUrl: string) =>
  `I don't have that specific information in my current data, but here's what I can tell you:

**Subir Das** is a Full-Stack Developer & AI Solutions Architect with **5+ years of experience** building scalable web applications, AI agents, and automation pipelines using **Next.js, Node.js, n8n, and Gemini**.

He's currently working as a **Junior Software Engineer at Codealign** and is open to new collaborations.

---
For detailed queries, **let's connect directly:**

${getContactMessage(siteUrl)}`;

// ==================== Capability "what" extractor ====================

export const extractCapabilityWhat = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes('business') || lower.includes('ব্যবসা'))
    return 'business solutions';
  if (lower.includes('automation') || lower.includes('automate'))
    return 'automation pipelines';
  if (lower.includes('agent') || lower.includes('bot'))
    return 'AI agents and bots';
  if (
    lower.includes('web') ||
    lower.includes('website') ||
    lower.includes('app')
  )
    return 'web applications';
  if (lower.includes('messenger') || lower.includes('chat'))
    return 'messenger/chat bots';
  if (
    lower.includes('ecommerce') ||
    lower.includes('e-commerce') ||
    lower.includes('shop')
  )
    return 'e-commerce solutions';
  if (lower.includes('mvp') || lower.includes('startup'))
    return 'MVPs for startups';
  return 'your project';
};
