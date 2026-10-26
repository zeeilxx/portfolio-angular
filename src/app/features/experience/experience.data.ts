import { Internship } from './models/experience.model';

export const internships: Internship[] = [
  {
    id: 'adira-finance',
    organization: 'PT. Adira Dinamika Multi Finance',
    documentation: '/images/experience/adira-finance/Adira_Dokumentasi.jpeg',
    certificate: '/images/experience/adira-finance/e-Certificate_Ridhan Fadhlil Wafi_Adira.pdf',
    team: 'IT Development Finance',
    role: 'Front-End Developer Intern',
    period: 'March – September 2025',
    website: 'Adira.co.id',
    url: 'https://www.adira.co.id',
    summary:
      'Frontend development of the Adira.co.id website and admin dashboard within the IT Development Finance team.',
    responsibilities: [
      'Implemented interface designs for the main website and admin dashboard using Vue.js, Tailwind CSS, and TypeScript.',
      'Integrated website pages and the admin dashboard.',
      'Implemented CRUD (create, read, update, delete) functionality.',
    ],
    stacks: [
      { label: 'Frontend', technologies: ['Vue.js', 'Tailwind CSS', 'TypeScript'] },
      { label: 'Tools & database', technologies: ['VSCode', 'Docker', 'PostgreSQL'] },
    ],
  },
  {
    id: 'dicicilaja',
    organization: 'PT. Adira Dinamika Multi Finance',
    documentation: '/images/experience/dicicilaja/Dicicilaja_Dokumentasi.jpg',
    certificate: '/images/experience/dicicilaja/e-Certificate_Ridhan Fadhlil Wafi.pdf',
    team: 'IT Development Portfolio',
    role: 'Fullstack Web Developer Intern',
    period: 'March – September 2026',
    website: 'Dicicilaja.com',
    url: 'https://dicicilaja.com',
    summary:
      'Fullstack development and maintenance of the Dicicilaja.com website within the IT Development Portfolio team.',
    responsibilities: [
      'Contributed to fullstack web development for Dicicilaja.com.',
      'Fixed issues and improved website functionality.',
      'Supported ongoing website maintenance and system support.',
    ],
    stacks: [
      { label: 'Web & database', technologies: ['Vue.js', 'PHP', 'Laravel', 'MySQL'] },
      { label: 'Tools', technologies: ['Antigravity', 'Vscode', 'Postman', 'DBeaver'] },
    ],
  },
];

export const organizations = [
  {
    name: 'Student Senate, Faculty of Computer Science, UPNVJ 2025',
    role: 'Vice Chairman',
    period: 'January 2025 – January 2026',
  },
  {
    name: 'Student Executive Board, Faculty of Computer Science, UPNVJ 2024',
    role: 'Head of Human Resources Development Department',
    period: 'January 2024 – January 2025',
  },
  {
    name: 'New Student Orientation (PKKMB), Faculty of Computer Science, UPNVJ 2024',
    role: 'Project Officer',
    period: 'May 2024 – August 2024',
  },
  {
    name: 'Student Executive Board, Faculty of Computer Science, UPNVJ 2023',
    role: 'Staff of Human Resources Development Department',
    period: 'January 2023 – December 2023',
  },
  {
    name: 'Student Leadership Training (LDKMM), Faculty of Computer Science, UPNVJ 2023',
    role: 'Project Officer',
    period: 'August 2023 – October 2023',
  },
];
