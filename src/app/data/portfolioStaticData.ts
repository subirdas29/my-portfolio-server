export interface IExperienceEntry {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface IEducationEntry {
  degree: string;
  institution: string;
  duration: string;
  description: string;
}

export const EXPERIENCE_DATA: IExperienceEntry[] = [
  {
    title: 'Junior Software Engineer',
    company: 'Codealign',
    duration: 'Oct 2025 - Present',
    description:
      'Worked on end-to-end full-stack web application development, focusing on RESTful API development, backend logic, database management, and frontend integration. Built responsive and user-friendly interfaces, ensured smooth data flow between frontend and backend, optimized performance, and collaborated remotely with cross-functional teams to deliver scalable and efficient solutions.',
  },
  {
    title: 'Full Stack Developer (Internship)',
    company: 'Codealign',
    duration: 'Jun 2025 - Sept 2025',
    description:
      'As a Full Stack Developer Intern at CodeAlign, developed responsive and scalable web applications using Next.js, React, Redux, and Node.js. Worked closely with UI/UX designers to improve user experience, built backend APIs with MongoDB, PostgreSQL, Prisma, and Mongoose, followed clean code practices, and delivered features through agile, sprint-based workflows.',
  },
];

export const EDUCATION_DATA: IEducationEntry[] = [
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Faridpur Engineering College',
    duration: '2017 - 2021',
    description:
      'Focused on Data Structures, Algorithms, Database Management, and Software Engineering principles. Participated in various programming contests and built several academic projects.',
  },
];

export const ABOUT_ME_DATA = `I am Subir Das, a passionate Full-Stack Developer with extensive experience in building robust and scalable web applications. Beyond core development, I also specialize in AI Agent Engineering and n8n Workflow Automation, designing intelligent agents and automation pipelines to optimize complex business processes.

By combining deep expertise in Full-Stack Development with advanced AI and automation skills, I create solutions that are both powerful and intelligent, delivering seamless user experiences and operational efficiency.

Core Competencies:
- Full-Stack Development: Specialized in Next.js, MERN stack, and high-performance system architecture.
- Autonomous AI Agents: Developing self-thinking agents using LLMs to handle complex business logic.
- n8n Workflow Automation: Building advanced automation pipelines to sync 400+ apps using n8n.
- Scalable Infrastructure: Ensuring applications remain fast, secure, and reliable under heavy traffic.

Education: Bachelor of Science in Computer Science from Faridpur Engineering College (2017-2021).`;

export const buildExperienceContext = (): string => {
  return EXPERIENCE_DATA.map(
    (exp, i) =>
      `EXPERIENCE ${i + 1}: ${exp.title} at ${exp.company} (${exp.duration}). Description: ${exp.description}`,
  ).join('\n');
};

export const buildEducationContext = (): string => {
  return EDUCATION_DATA.map(
    (edu, i) =>
      `EDUCATION ${i + 1}: ${edu.degree} from ${edu.institution} (${edu.duration}). ${edu.description}`,
  ).join('\n');
};

export const buildAboutMeContext = (): string => {
  return ABOUT_ME_DATA;
};
