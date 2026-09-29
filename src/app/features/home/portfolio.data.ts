import { PortfolioProject } from './models/portfolio.model';

// Konten berdasarkan CV. Petunjuk gambar: public/images/README.md.
export const profile = {
  name: 'Ridhan Fadhlil Wafi',
  role: 'Web Developer',
  location: 'Kota Bogor, Indonesia',
  email: 'ridhanfadhlil@gmail.com',
  phone: '+62877-6542-1524',
  phoneHref: 'tel:+6287765421524',
  portfolioUrl: 'https://ridhanfadhlil.my.canva.site/',
  intro:
    'Fresh graduate dengan satu tahun pengalaman magang sebagai Software Engineer di Adira Finance. Berpengalaman mengembangkan aplikasi web menggunakan Vue.js, TypeScript, PHP, dan Laravel, termasuk pengembangan dan integrasi API, JSON:API, serta antarmuka responsif. Tertarik membangun aplikasi yang mudah digunakan dan dapat berkembang, sambil terus mempelajari teknologi pengembangan web.',
};
export const education = {
  institution: 'Universitas Pembangunan Nasional “Veteran” Jakarta',
  major: 'Informatika · Fakultas Ilmu Komputer',
  period: 'Agustus 2022 – 2026',
  gpa: '3.76',
  focus: 'Software Engineering, khususnya Frontend Web Development.',
  activity: 'Berpartisipasi dalam Proposal Kreativitas Mahasiswa 2024.',
};
export const projects: PortfolioProject[] = [
  {
    id: 'adira',
    name: 'Adira.co.id',
    category: 'Frontend Revamp · Internship',
    description:
      'Website resmi Adira Finance yang menyediakan informasi perusahaan, produk pembiayaan, dan layanan pelanggan. Berkontribusi dalam revamp frontend menggunakan Vue.js dan Tailwind CSS, meliputi pengembangan antarmuka, integrasi dengan backend, pemetaan respons API sesuai kebutuhan tampilan, serta penataan state management untuk menjaga konsistensi data antarkomponen.',
    image: '/images/projects/adira/Adira.png',
    images: [
      { src: '/images/projects/adira/Adira.png', caption: 'Tampilan utama website' },
      { src: '/images/projects/adira/KontakKami.png', caption: 'Tampilan Halaman Kontak Kami' },
      { src: '/images/projects/adira/LokasiCabang.png', caption: 'Tampilan Halaman Lokasi Cabang' },
      {
        src: '/images/projects/adira/LayananKonsumen.png',
        caption: 'Tampilan Halaman Layanan Konsumen',
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
      'Platform digital Adira Finance yang mendukung layanan dan pengajuan pembiayaan untuk berbagai kebutuhan masyarakat. Berkontribusi dalam pengembangan fullstack dan pemeliharaan website, termasuk pengembangan fitur submit order untuk pengajuan pembiayaan serta simulasi cicilan. Mendukung perbaikan dan penyempurnaan fungsionalitas agar alur pengajuan dan penggunaan layanan berjalan dengan baik.',
    image: '/images/projects/dicicilaja/Dicicilaja.png',
    images: [
      { src: '/images/projects/dicicilaja/Dicicilaja.png', caption: 'Tampilan utama website' },
      { src: '/images/projects/dicicilaja/SubmitOrder.png', caption: 'Fitur submit order' },
      { src: '/images/projects/dicicilaja/SimulasiCicilan.png', caption: 'Fitur simulasi cicilan' },
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
      'Aplikasi e-commerce thrifting yang saya kembangkan selama 3 bulan sebagai fullstack developer dalam program sertifikasi Celerates, menggunakan React, Tailwind CSS, Express, dan MySQL. Mengembangkan antarmuka serta API untuk autentikasi pengguna, pencarian dan filter produk, wishlist, keranjang, checkout, dan unggah bukti pembayaran, dilengkapi dashboard admin untuk pengelolaan produk, stok, dan pesanan.',
    image: '/images/Style4U.png',
    tags: ['React', 'Tailwind CSS', 'Express', 'MySQL'],
    year: '2025',
  },
  {
    id: 'gigsgate',
    name: 'GigsGate',
    category: 'Web Development Project',
    description:
      'Proyek Pengembangan Web Tanpa Framework. Menggunakan HTML, CSS, dan JavaScript murni untuk membangun antarmuka Statis. Berkontribusi pada pengembangan seluruh antarmuka aplikasi.',
    image: '/images/GigsGate.png',
    tags: ['VSCode', 'XAMPP', 'MySQL', 'HTML', 'CSS'],
    year: '2023',
  },
  {
    id: 'indokicks',
    name: 'IndoKicks',
    category: 'Mobile Programming Project',
    description:
      'Proyek pemrograman mobile menggunakan Java dan Android Studio. Berkontribusi pada pengembangan frontend dan pembuatan seluruh antarmuka aplikasi.',
    image: '/images/project-indokicks.webp',
    tags: ['Java', 'Android Studio'],
    year: '2025',
  },
];
export const skills = [
  {
    title: 'Frontend development',
    description:
      'Pengembangan antarmuka responsif, implementasi desain, dan integrasi halaman website serta dashboard admin.',
    tags: ['Vue.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'Backend & API',
    description: 'Pengembangan aplikasi fullstack, integrasi API, dan implementasi fungsi CRUD.',
    tags: ['PHP', 'Laravel', 'JSON:API', 'MySQL', 'PostgreSQL'],
  },
  {
    title: 'Development tools',
    description: 'Perangkat yang digunakan dalam pengalaman magang dan proyek akademik.',
    tags: [
      'VSCode',
      'Docker',
      'Postman',
      'DBeaver',
      'Antigravity',
      'XAMPP',
      'Java',
      'Android Studio',
    ],
  },
];
export const certifications = [
  {
    issuer: 'Celerates',
    name: 'Web Development & UI/UX',
    year: '2025',
    description:
      'Pengembangan web responsif, desain antarmuka, dan prinsip desain yang berpusat pada pengguna.',
  },
  {
    issuer: 'Certiport - A Pearson VUE Business',
    name: 'Data Analytics',
    year: '2024',
    description:
      'Analisis, visualisasi, dan interpretasi data untuk mendukung pengambilan keputusan.',
  },
  {
    issuer: 'Wadhwani Foundation',
    name: '21st Century Employability Skills Program - Intermediate',
    year: '2024',
    description: 'Komunikasi, kerja sama tim, pemecahan masalah, dan kesiapan kerja.',
  },
];
