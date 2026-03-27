import { IChatHistory } from '../modules/ai/ai.service';

export const CONTACT_EMAIL = 'subirdas1045@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/subirdas29/';

export const getContactMessage = (siteUrl: string) =>
  `Want to know more? Get in touch with Subir:

- [Contact Form](${siteUrl}/contact)
- Email: ${CONTACT_EMAIL}
- [LinkedIn](${LINKEDIN_URL})`;

export const getFallbackMessage = (siteUrl: string) =>
  `I only have information about Subir's professional work. For further queries, feel free to reach out directly:

- [Contact Form](${siteUrl}/contact)
- Email: ${CONTACT_EMAIL}
- [LinkedIn](${LINKEDIN_URL})`;

export const GREETINGS = [
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
  'welcome',
  'thank you',
  'thanks',
  'thank',
  'bye',
  'goodbye',
  'good bye',
  'see you',
  'see ya',
  'later',
  'take care',
  // Bengali
  'হাই',
  'হেলো',
  'কেমন আছো',
  'কেমন আছেন',
  'কি অবস্থা',
  'কি খবর',
  'ধন্যবাদ',
  'বিদায়',
  // Banglish
  'kemon acho',
  'kemon aco',
  'kemon acen',
  'kemon aso',
  'ki obostha',
  'ki khobor',
  'ki khbr',
  'koi acho',
  'koi aco',
  'tumi kemon acho',
  'apni kemon achen',
  'dhonnobad',
  'thanks',
  // Slang/casual
  'wassup',
  'wazzup',
  'sup',
  'oy',
  'oii',
];

export const FOLLOW_UP_PATTERNS = [
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

export const TECH_KEYWORDS = [
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

export const detectTechQuery = (message: string): string | null => {
  const lower = message.toLowerCase();
  for (const tech of TECH_KEYWORDS) {
    if (lower.includes(tech)) {
      return tech;
    }
  }
  return null;
};

export const detectSkillQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('skill') ||
    lower.includes('technology') ||
    lower.includes('technologies') ||
    lower.includes('tech stack')
  );
};

export const detectBlogQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('blog') ||
    lower.includes('article') ||
    lower.includes('post') ||
    lower.includes('writing')
  );
};

export const detectBlogCountQuery = (message: string): boolean => {
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

export const detectSkillCountQuery = (message: string): boolean => {
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

export const detectProjectCountQuery = (message: string): boolean => {
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

export const detectPortfolioOverview = (message: string): boolean => {
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

export const detectGreeting = (message: string): boolean => {
  const lower = message.toLowerCase().trim();
  return GREETINGS.some((g) => {
    const gLower = g.toLowerCase();
    return lower === gLower || lower.startsWith(gLower + ' ');
  });
};

export const detectAllProjectsQuery = (message: string): boolean => {
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

export const detectFollowUp = (message: string): boolean => {
  const lower = message.toLowerCase().trim();
  return FOLLOW_UP_PATTERNS.some((pattern) => lower.includes(pattern));
};

export const extractTechFromHistory = (
  history?: IChatHistory[],
): string | null => {
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

export const isSkillFromHistory = (history?: IChatHistory[]): boolean => {
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

export const isBlogFromHistory = (history?: IChatHistory[]): boolean => {
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

export const detectExperienceQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('experience') ||
    lower.includes('job') ||
    lower.includes('work experience') ||
    lower.includes('employment') ||
    lower.includes('career') ||
    lower.includes('কোথায় কাজ') ||
    lower.includes('kothay kaj') ||
    lower.includes('where do you work') ||
    lower.includes('where does subir work') ||
    lower.includes('kaj koro')
  );
};

export const detectEducationQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('education') ||
    lower.includes('degree') ||
    lower.includes('university') ||
    lower.includes('college') ||
    lower.includes('study') ||
    lower.includes('studied') ||
    lower.includes('কোথায় পড়াশোনা') ||
    lower.includes('kothay porashuna') ||
    lower.includes('porashuna korecho') ||
    lower.includes('porashuna')
  );
};

export const detectAboutMeQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('about me') ||
    lower.includes('who are you') ||
    lower.includes('tell me about yourself') ||
    lower.includes('introduce yourself') ||
    lower.includes('apnar porichiti') ||
    lower.includes('nijer kotha bolo')
  );
};

// ==================== Fixed Intent Detection ====================

export const detectJobExperienceQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('job experience') ||
    lower.includes('job koto') ||
    lower.includes('job koy') ||
    lower.includes('job koi') ||
    lower.includes('tmr job') ||
    lower.includes('tor job') ||
    lower.includes('work experience') ||
    lower.includes('kaj er experience') ||
    lower.includes('kaaj er experience') ||
    lower.includes('company e kaj') ||
    lower.includes('kothay job')
  );
};

export const detectExperienceDurationQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('how many years') ||
    lower.includes('how long') ||
    lower.includes('years of experience') ||
    lower.includes('koy bochor') ||
    lower.includes('koto din') ||
    lower.includes('experience koto') ||
    lower.includes('experience age') ||
    lower.includes('koy din er experience') ||
    lower.includes('koy bochor experience') ||
    lower.includes('koi year') ||
    lower.includes('koy year') ||
    lower.includes('koto year') ||
    lower.includes('koto bochor') ||
    lower.includes('experience koi') ||
    lower.includes('experience koy') ||
    lower.includes('tmr experience') ||
    lower.includes('tor experience')
  );
};

export const detectCapabilityQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('can subir') ||
    lower.includes('can you') ||
    lower.includes('parbe kina') ||
    lower.includes('parba kina') ||
    lower.includes('korte parbe') ||
    lower.includes('banate parbe') ||
    lower.includes('handle my') ||
    lower.includes('build for me') ||
    lower.includes('develop for me') ||
    lower.includes('kaj korte parbe') ||
    lower.includes('kaj korbe kina') ||
    lower.includes('kaaj parbe')
  );
};

export const detectFreelancingQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('freelanc') ||
    lower.includes('fiverr') ||
    lower.includes('upwork') ||
    lower.includes('available for hire') ||
    lower.includes('hire') ||
    lower.includes('kaj nite') ||
    lower.includes('kaj diben') ||
    lower.includes('budget') ||
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('khoroch')
  );
};

export const detectAIAutomationQuery = (message: string): boolean => {
  const lower = message.toLowerCase();
  return (
    lower.includes('ai agent') ||
    lower.includes('ai automation') ||
    lower.includes('business automation') ||
    lower.includes('messenger bot') ||
    lower.includes('chatbot') ||
    lower.includes('chat bot') ||
    lower.includes('workflow automation') ||
    lower.includes('n8n') ||
    lower.includes('automation pipeline') ||
    lower.includes('bot bana') ||
    lower.includes('automation korbe')
  );
};
