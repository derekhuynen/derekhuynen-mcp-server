import type { Profile } from '../../src/data/schema.js';

export const fixtureProfile: Profile = {
  identity: {
    name: 'Derek Huynen',
    title: 'Senior AI Engineer | Full-Stack Developer | Technical Lead',
    location: 'Reno, NV',
    workPreference: 'Remote / Open to Relocation',
    email: 'derek.huynen@gmail.com',
    links: {
      linkedin: 'https://linkedin.com/in/derekhuynen',
      github: 'https://github.com/derekhuynen',
      website: 'https://derekhuynen.com',
    },
  },
  summary: 'Senior AI and Full-Stack Engineer with production GenAI experience.',
  skills: [
    { category: 'AI / GenAI', items: ['RAG', 'Azure OpenAI', 'Semantic Kernel'] },
    { category: 'Frontend', items: ['React', 'TypeScript'] },
  ],
  experience: [
    {
      slug: 'ibm-tmobile-arrow',
      project: 'Arrow',
      title: 'Technical Lead',
      employer: 'IBM',
      client: 'T-Mobile',
      industry: 'Telecom',
      start: '2024-01',
      end: 'present',
      location: 'Remote',
      summary: 'Leads an 18-21 person cross-platform engineering team.',
      skills: ['Technical Leadership', 'AI Orchestration'],
      featured: true,
    },
    {
      slug: 'neudesic-pge-genai-chatbot',
      project: 'PG&E GenAI Chatbot',
      title: 'AI Developer',
      employer: 'Neudesic (an IBM Company)',
      client: 'PG&E',
      industry: 'Utilities',
      start: '2023-01',
      end: '2023-12',
      location: 'Remote',
      summary: 'Built a RAG chatbot on Azure OpenAI and Azure AI Search.',
      skills: ['RAG', 'Azure OpenAI', 'Azure AI Search'],
      featured: true,
    },
  ],
  projects: [
    {
      name: 'AI RAG Chatbot (2025)',
      description: 'A C#/.NET Azure Functions + Semantic Kernel RAG demo.',
      skills: ['C#', '.NET', 'Semantic Kernel'],
      url: 'https://github.com/derekhuynen/AI_RAG_Chat_Bot_2025',
    },
  ],
  resume: '# Derek Huynen\n\nSenior AI Engineer.',
};
