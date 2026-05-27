"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectAIAutomationQuery = exports.detectFreelancingQuery = exports.detectCapabilityQuery = exports.detectExperienceDurationQuery = exports.detectJobExperienceQuery = exports.detectAboutMeQuery = exports.detectEducationQuery = exports.detectExperienceQuery = exports.isBlogFromHistory = exports.isSkillFromHistory = exports.extractTechFromHistory = exports.detectFollowUp = exports.detectAllProjectsQuery = exports.detectGreeting = exports.detectPortfolioOverview = exports.detectProjectCountQuery = exports.detectSkillCountQuery = exports.detectBlogCountQuery = exports.detectBlogQuery = exports.detectSkillQuery = exports.detectTechQuery = exports.TECH_KEYWORDS = exports.FOLLOW_UP_PATTERNS = exports.GREETINGS = exports.getFallbackMessage = exports.getContactMessage = exports.LINKEDIN_URL = exports.CONTACT_EMAIL = void 0;
exports.CONTACT_EMAIL = 'subirdas1045@gmail.com';
exports.LINKEDIN_URL = 'https://www.linkedin.com/in/subirdas29/';
const getContactMessage = (siteUrl) => `Want to know more? Get in touch with Subir:\n\n- [Contact Form](${siteUrl}/contact)\n- Email: ${exports.CONTACT_EMAIL}\n- [LinkedIn](${exports.LINKEDIN_URL})`;
exports.getContactMessage = getContactMessage;
const getFallbackMessage = (siteUrl) => `I only have information about Subir's professional work. For further queries, feel free to reach out directly:\n\n- [Contact Form](${siteUrl}/contact)\n- Email: ${exports.CONTACT_EMAIL}\n- [LinkedIn](${exports.LINKEDIN_URL})`;
exports.getFallbackMessage = getFallbackMessage;
exports.GREETINGS = [
    'hi', 'hello', 'hey', 'hii', 'hiii', 'heyy', 'heyyy', 'yo', 'sup', 'whats up', "what's up",
    'good morning', 'good afternoon', 'good evening', 'good night', 'howdy', 'greetings',
    'hi there', 'hello there', 'hey there', 'welcome', 'thank you', 'thanks', 'thank',
    'bye', 'goodbye', 'good bye', 'see you', 'see ya', 'later', 'take care',
    'হাই', 'হেলো', 'কেমন আছো', 'কেমন আছেন', 'কি অবস্থা', 'কি খবর', 'ধন্যবাদ', 'বিদায়',
    'kemon acho', 'kemon aco', 'kemon acen', 'kemon aso', 'ki obostha', 'ki khobor', 'ki khbr',
    'koi acho', 'koi aco', 'tumi kemon acho', 'apni kemon achen', 'dhonnobad', 'thanks',
    'wassup', 'wazzup', 'oy', 'oii',
];
exports.FOLLOW_UP_PATTERNS = [
    'ki ki', 'kii ki', 'kia kia', 'oigula', 'oigulake', 'what are those', 'what are they',
    'tell me more', 'more details', 'details', 'show me', 'dekhabo', 'dekha', 'list', 'বিস্তারিত', 'আরো',
];
exports.TECH_KEYWORDS = [
    'next.js', 'nextjs', 'react', 'node', 'express', 'mongodb', 'typescript', 'javascript',
    'python', 'tailwind', 'firebase', 'redux', 'graphql', 'angular', 'vue', 'docker', 'aws',
    'html', 'css', 'bootstrap', 'three.js', 'socket', 'jwt', 'rest', 'api', 'prisma', 'postgresql', 'mysql',
];
const detectTechQuery = (message) => {
    const lower = message.toLowerCase();
    for (const tech of exports.TECH_KEYWORDS) {
        if (lower.includes(tech))
            return tech;
    }
    return null;
};
exports.detectTechQuery = detectTechQuery;
const detectSkillQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('skill') || lower.includes('technology') || lower.includes('technologies') || lower.includes('tech stack');
};
exports.detectSkillQuery = detectSkillQuery;
const detectBlogQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('blog') || lower.includes('article') || lower.includes('post') || lower.includes('writing');
};
exports.detectBlogQuery = detectBlogQuery;
const detectBlogCountQuery = (message) => {
    const lower = message.toLowerCase().trim();
    return lower.includes('blog koita') || lower.includes('blog koto') || lower.includes('how many blog') ||
        lower.includes('blogs koita') || lower.includes('blogs koto') || lower.includes('koto blog') ||
        lower.includes('koita blog') || lower.includes('total blog') || lower.includes('number of blog');
};
exports.detectBlogCountQuery = detectBlogCountQuery;
const detectSkillCountQuery = (message) => {
    const lower = message.toLowerCase().trim();
    return lower.includes('skill koita') || lower.includes('skill koto') || lower.includes('how many skill') ||
        lower.includes('skills koita') || lower.includes('skills koto') || lower.includes('koto skill') ||
        lower.includes('koita skill') || lower.includes('total skill') || lower.includes('number of skill');
};
exports.detectSkillCountQuery = detectSkillCountQuery;
const detectProjectCountQuery = (message) => {
    const lower = message.toLowerCase().trim();
    return lower.includes('project koita') || lower.includes('project koto') || lower.includes('how many project') ||
        lower.includes('projects koita') || lower.includes('projects koto') || lower.includes('koto project') ||
        lower.includes('koita project') || lower.includes('total project') || lower.includes('number of project');
};
exports.detectProjectCountQuery = detectProjectCountQuery;
const detectPortfolioOverview = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('portfolio') || lower.includes('about subir') || lower.includes('tell me about') ||
        lower.includes('who is subir') || lower.includes('overview') || lower.includes('introduce') || lower.includes('about yourself');
};
exports.detectPortfolioOverview = detectPortfolioOverview;
const detectGreeting = (message) => {
    const lower = message.toLowerCase().trim();
    return exports.GREETINGS.some((g) => {
        const gLower = g.toLowerCase();
        return lower === gLower || lower.startsWith(gLower + ' ');
    });
};
exports.detectGreeting = detectGreeting;
const detectAllProjectsQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('all project') || lower.includes('sob project') || lower.includes('joto project') ||
        lower.includes('total project') || lower.includes('all works') || lower.includes('sob kaj') ||
        lower.includes('show all') || lower.includes('sob gulo');
};
exports.detectAllProjectsQuery = detectAllProjectsQuery;
const detectFollowUp = (message) => {
    const lower = message.toLowerCase().trim();
    return exports.FOLLOW_UP_PATTERNS.some((pattern) => lower.includes(pattern));
};
exports.detectFollowUp = detectFollowUp;
const extractTechFromHistory = (history) => {
    if (!history || history.length === 0)
        return null;
    for (let i = history.length - 1; i >= 0; i--) {
        const msg = history[i].content.toLowerCase();
        for (const tech of exports.TECH_KEYWORDS) {
            if (msg.includes(tech))
                return tech;
        }
    }
    return null;
};
exports.extractTechFromHistory = extractTechFromHistory;
const isSkillFromHistory = (history) => {
    if (!history || history.length === 0)
        return false;
    for (let i = history.length - 1; i >= 0; i--) {
        const msg = history[i].content.toLowerCase();
        if (msg.includes('skill') || msg.includes('technology') || msg.includes('tech stack'))
            return true;
    }
    return false;
};
exports.isSkillFromHistory = isSkillFromHistory;
const isBlogFromHistory = (history) => {
    if (!history || history.length === 0)
        return false;
    for (let i = history.length - 1; i >= 0; i--) {
        const msg = history[i].content.toLowerCase();
        if (msg.includes('blog') || msg.includes('article') || msg.includes('writing'))
            return true;
    }
    return false;
};
exports.isBlogFromHistory = isBlogFromHistory;
const detectExperienceQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('experience') || lower.includes('job') || lower.includes('work experience') ||
        lower.includes('employment') || lower.includes('career') || lower.includes('কোথায় কাজ') ||
        lower.includes('kothay kaj') || lower.includes('where do you work') || lower.includes('where does subir work') ||
        lower.includes('kaj koro');
};
exports.detectExperienceQuery = detectExperienceQuery;
const detectEducationQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('education') || lower.includes('degree') || lower.includes('university') ||
        lower.includes('college') || lower.includes('study') || lower.includes('studied') ||
        lower.includes('কোথায় পড়াশোনা') || lower.includes('kothay porashuna') ||
        lower.includes('porashuna korecho') || lower.includes('porashuna');
};
exports.detectEducationQuery = detectEducationQuery;
const detectAboutMeQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('about me') || lower.includes('who are you') || lower.includes('tell me about yourself') ||
        lower.includes('introduce yourself') || lower.includes('apnar porichiti') || lower.includes('nijer kotha bolo');
};
exports.detectAboutMeQuery = detectAboutMeQuery;
const detectJobExperienceQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('job experience') || lower.includes('job koto') || lower.includes('job koy') ||
        lower.includes('job koi') || lower.includes('tmr job') || lower.includes('tor job') ||
        lower.includes('work experience') || lower.includes('kaj er experience') || lower.includes('kaaj er experience') ||
        lower.includes('company e kaj') || lower.includes('kothay job');
};
exports.detectJobExperienceQuery = detectJobExperienceQuery;
const detectExperienceDurationQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('how many years') || lower.includes('how long') || lower.includes('years of experience') ||
        lower.includes('koy bochor') || lower.includes('koto din') || lower.includes('experience koto') ||
        lower.includes('experience age') || lower.includes('koy din er experience') || lower.includes('koy bochor experience') ||
        lower.includes('koi year') || lower.includes('koy year') || lower.includes('koto year') ||
        lower.includes('koto bochor') || lower.includes('experience koi') || lower.includes('experience koy') ||
        lower.includes('tmr experience') || lower.includes('tor experience');
};
exports.detectExperienceDurationQuery = detectExperienceDurationQuery;
const detectCapabilityQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('can subir') || lower.includes('can you') || lower.includes('parbe kina') ||
        lower.includes('parba kina') || lower.includes('korte parbe') || lower.includes('banate parbe') ||
        lower.includes('handle my') || lower.includes('build for me') || lower.includes('develop for me') ||
        lower.includes('kaj korte parbe') || lower.includes('kaj korbe kina') || lower.includes('kaaj parbe');
};
exports.detectCapabilityQuery = detectCapabilityQuery;
const detectFreelancingQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('freelanc') || lower.includes('fiverr') || lower.includes('upwork') ||
        lower.includes('available for hire') || lower.includes('hire') || lower.includes('kaj nite') ||
        lower.includes('kaj diben') || lower.includes('budget') || lower.includes('price') ||
        lower.includes('cost') || lower.includes('khoroch');
};
exports.detectFreelancingQuery = detectFreelancingQuery;
const detectAIAutomationQuery = (message) => {
    const lower = message.toLowerCase();
    return lower.includes('ai agent') || lower.includes('ai automation') || lower.includes('business automation') ||
        lower.includes('messenger bot') || lower.includes('chatbot') || lower.includes('chat bot') ||
        lower.includes('workflow automation') || lower.includes('n8n') || lower.includes('automation pipeline') ||
        lower.includes('bot bana') || lower.includes('automation korbe');
};
exports.detectAIAutomationQuery = detectAIAutomationQuery;
//# sourceMappingURL=aiChatDetection.js.map