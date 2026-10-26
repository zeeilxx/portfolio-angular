import { PortfolioProject } from './models/portfolio.model';

// Konten berdasarkan CV. Petunjuk gambar: public/images/README.md.
export const profile = {
  name: 'Ridhan Fadhlil Wafi',
  role: 'Web Developer',
  location: 'Bogor, Indonesia',
  email: 'ridhanfadhlil@gmail.com',
  phone: '+62877-6542-1524',
  phoneHref: 'tel:+6287765421524',
  portfolioUrl: 'https://ridhanfadhlil.my.canva.site/',
  intro:
    'A recent graduate with one year of internship experience as a Software Engineer at Adira Finance. Experienced in developing web applications using Vue.js, TypeScript, PHP, and Laravel, including API development and integration, JSON:API, and responsive interfaces. Interested in building user-friendly, scalable applications while continuing to learn web development technologies.',
};
export const education = {
  institution: 'Universitas Pembangunan Nasional “Veteran” Jakarta',
  major: 'Informatics · Faculty of Computer Science',
  period: 'August 2022 – 2026',
  gpa: '3.76',
  focus: 'Software Engineering, with a focus on Frontend Web Development.',
  activity: 'Participated in the 2024 Student Creativity Proposal Program.',
};
export const projects: PortfolioProject[] = [
  {
    id: 'beatnusa',
    name: 'BeatNusa',
    category: 'Web-Based Rhythm Game · Undergraduate Thesis',
    description:
      'A web-based rhythm game that automatically generates playable beatmaps from uploaded music using deep learning, while introducing Indonesian traditional songs through interactive gameplay. Developed an automated beatmap generation pipeline integrating audio processing, machine learning predictions, backend services, and interactive gameplay. Model evaluation achieved an F1-score of 0.6840 and lane accuracy of 86.75%, with a System Usability Scale (SUS) score of 77.67.',
    image: '/images/projects/beatnusa/Interface_BeatNusa.png',
    images: [
      { src: '/images/projects/beatnusa/Interface_BeatNusa.png', caption: 'Main Page of BeatNusa' },
      {
        src: '/images/projects/beatnusa/Automation_BeatNusa.png',
        caption: 'Beatmap Automation BeatNusa',
      },
      { src: '/images/projects/beatnusa/SongList_BeatNusa.png', caption: 'SongList of BeatNusa' },
      { src: '/images/projects/beatnusa/Gameplay_BeatNusa.png', caption: 'Gameplay' },
      {
        src: '/images/projects/beatnusa/Development_BeatNusa.png',
        caption: 'Development Process BeatNusa',
      },
    ],
    tags: ['Deep Learning', 'Audio Processing', 'Beatmap Generation', 'Web Game'],
    year: '2026',
  },
  {
    id: 'adira',
    name: 'Adira.co.id',
    category: 'Frontend Revamp · Internship',
    description:
      'The official Adira Finance website, providing company information, financing products, and customer services. Contributed to the frontend revamp using Vue.js and Tailwind CSS, including interface development, backend integration, API response mapping for display requirements, and state management to maintain consistent data across components.',
    image: '/images/projects/adira/Adira.png',
    images: [
      { src: '/images/projects/adira/Adira.png', caption: 'Website homepage' },
      { src: '/images/projects/adira/KontakKami.png', caption: 'Contact Us page' },
      { src: '/images/projects/adira/LokasiCabang.png', caption: 'Branch Locations page' },
      {
        src: '/images/projects/adira/LayananKonsumen.png',
        caption: 'Customer Service page',
      },
    ],
    url: 'https://www.adira.co.id',
    tags: ['Vue.js', 'Tailwind CSS', 'API Integration', 'State Management'],
    year: '2025',
  },
  {
    id: 'dicicilaja',
    name: 'Dicicilaja.com',
    category: 'Fullstack Development & Maintenance · Internship',
    description:
      'An Adira Finance digital platform supporting financing services and applications for a range of customer needs. Contributed to fullstack development and website maintenance, including an order submission feature for financing applications and an installment simulator. Supported fixes and functionality improvements to ensure smooth application and service workflows.',
    image: '/images/projects/dicicilaja/Dicicilaja.png',
    images: [
      { src: '/images/projects/dicicilaja/Dicicilaja.png', caption: 'Website homepage' },
      { src: '/images/projects/dicicilaja/SubmitOrder.png', caption: 'Order submission feature' },
      { src: '/images/projects/dicicilaja/SimulasiCicilan.png', caption: 'Installment simulator' },
    ],
    url: 'https://dicicilaja.com',
    tags: ['Vue.js', 'PHP', 'Laravel', 'MySQL'],
    year: '2026',
  },
  {
    id: 'style4u',
    name: 'Style4u',
    category: 'Fullstack E-Commerce Development',
    description:
      'A secondhand e-commerce application I developed over three months as a fullstack developer in the Celerates certification program, using React, Tailwind CSS, Express, and MySQL. Developed interfaces and APIs for user authentication, product search and filtering, wishlists, shopping carts, checkout, and payment receipt uploads, along with an admin dashboard for managing products, inventory, and orders.',
    image: '/images/Style4U.png',
    tags: ['React', 'Tailwind CSS', 'Express', 'MySQL'],
    year: '2025',
  },
  {
    id: 'gigsgate',
    name: 'GigsGate',
    category: 'Web Development Project',
    description:
      'A web development project built without frameworks, using plain HTML, CSS, and JavaScript to create static interfaces. Contributed to the development of all application interfaces.',
    image: '/images/GigsGate.png',
    tags: ['VSCode', 'XAMPP', 'MySQL', 'HTML', 'CSS'],
    year: '2023',
  },
  {
    id: 'indokicks',
    name: 'IndoKicks',
    category: 'Mobile Programming Project',
    description:
      'A mobile programming project using Java and Android Studio. Contributed to frontend development and the creation of all application interfaces.',
    image: '/images/project-indokicks.webp',
    tags: ['Java', 'Android Studio'],
    year: '2025',
  },
];
export const skills = [
  {
    id: 'frontend',
    title: 'Frontend & Mobile',
    tags: ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS', 'State Management', 'Java', 'Android Studio'],
  },
  {
    id: 'backend',
    title: 'Backend & Databases',
    tags: ['PHP', 'Laravel', 'Express', 'API Integration', 'JSON:API', 'CRUD', 'MySQL', 'PostgreSQL'],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    tags: ['Deep Learning', 'Audio Processing', 'Beatmap Generation', 'Model Evaluation', 'Data Analysis'],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    tags: ['VSCode', 'Docker', 'Postman', 'DBeaver', 'Antigravity', 'XAMPP'],
  },
];
export const certifications = [
  {
    issuer: 'Celerates',
    name: 'Web Development & UI/UX',
    year: '2025',
    description:
      'Responsive web development, interface design, and user-centered design principles.',
  },
  {
    issuer: 'Certiport - A Pearson VUE Business',
    name: 'Data Analytics',
    year: '2024',
    description: 'Data analysis, visualization, and interpretation to support decision-making.',
  },
  {
    issuer: 'Wadhwani Foundation',
    name: '21st Century Employability Skills Program - Intermediate',
    year: '2024',
    description: 'Communication, teamwork, problem-solving, and career readiness.',
  },
  {
    issuer: 'LSP UPN "Veteran" Jakarta, certified under BNSP',
    name: 'Junior / Associate Data Scientist',
    year: '2025',
    description:
      'Data science, machine learning, and statistical analysis for data-driven decision-making.',
  },
];
