import { Internship } from './models/experience.model';

export const internships: Internship[] = [
  {
    id: 'adira-finance',
    organization: 'PT. Adira Dinamika Multi Finance',
    documentation: '/images/experience/adira-finance/Adira_Dokumentasi.jpeg',
    certificate: '/images/experience/adira-finance/e-Certificate_Ridhan Fadhlil Wafi_Adira.pdf',
    team: 'IT Development Finance',
    role: 'Front-End Developer Intern',
    period: 'Maret – September 2025',
    website: 'Adira.co.id',
    url: 'https://www.adira.co.id',
    summary:
      'Pengembangan frontend website Adira.co.id dan dashboard admin dalam tim IT Development Finance.',
    responsibilities: [
      'Mengimplementasikan desain antarmuka website utama dan dashboard admin menggunakan Vue.js, Tailwind CSS, dan TypeScript.',
      'Mengintegrasikan halaman website dan dashboard admin.',
      'Mengimplementasikan fungsi CRUD (create, read, update, delete).',
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
    team: 'IT Development Portofolio',
    role: 'Fullstack Web Developer Intern',
    period: 'Maret – September 2026',
    website: 'Dicicilaja.com',
    url: 'https://dicicilaja.com',
    summary:
      'Pengembangan fullstack dan pemeliharaan website Dicicilaja.com dalam tim IT Development Portofolio.',
    responsibilities: [
      'Berkontribusi pada implementasi pengembangan web fullstack untuk Dicicilaja.com.',
      'Melakukan perbaikan dan peningkatan fungsionalitas website.',
      'Mendukung pemeliharaan website dan dukungan sistem secara berkelanjutan.',
    ],
    stacks: [
      { label: 'Web & database', technologies: ['Vue.js', 'PHP', 'Laravel', 'MySQL'] },
      { label: 'Tools', technologies: ['Antigravity', 'Vscode', 'Postman', 'DBeaver'] },
    ],
  },
];

// Nama kegiatan dan periode mengikuti CV, termasuk FKBM-IK 2025 pada 2024.
export const organizations = [
  {
    name: 'Senat Mahasiswa Fakultas Ilmu Komputer UPNVJ 2025',
    role: 'Vice Chairman',
    period: 'Januari 2025 – Januari 2026',
  },
  {
    name: 'Badan Eksekutif Mahasiswa Fakultas Ilmu Komputer UPNVJ 2024',
    role: 'Head of Human Resources Development Department',
    period: 'Januari 2024 – Januari 2025',
  },
  {
    name: 'FIK FAIR 2024',
    role: 'Head of Operations and Logistic Division',
    period: 'Juni 2024 – November 2024',
  },
  { name: 'FKBM-IK 2025', role: 'Transport Division', period: 'Agustus 2024 – September 2024' },
  {
    name: 'PKKMB Fakultas Ilmu Komputer UPNVJ 2024',
    role: 'Project Officer',
    period: 'Mei 2024 – Agustus 2024',
  },
  {
    name: 'Badan Eksekutif Mahasiswa Fakultas Ilmu Komputer UPNVJ 2023',
    role: 'Staff of Human Resources Development Department',
    period: 'Januari 2023 – Desember 2023',
  },
  { name: 'FIK FAIR 2023', role: 'Transport Division', period: 'September 2023 – November 2023' },
  {
    name: 'LDKMM Fakultas Ilmu Komputer UPNVJ 2023',
    role: 'Project Officer',
    period: 'Agustus 2023 – Oktober 2023',
  },
  {
    name: 'PKKMB Fakultas Ilmu Komputer UPNVJ 2023',
    role: 'Head of Equipment, Security and Health Division',
    period: 'Mei 2023 – Agustus 2023',
  },
];
