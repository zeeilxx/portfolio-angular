# Struktur fitur

Setiap fitur (home, projects, contact) mempunyai:

- pages/: komponen halaman dengan template inline dalam file .ts.
- components/: komponen pendukung khusus fitur.
- services/: layanan data atau logika fitur.
- models/: interface dan tipe data fitur.
- <fitur>.routes.ts: route lokal fitur yang didaftarkan di app.routes.ts.

Komponen lintas fitur berada di ../shared/components/.
Folder yang belum digunakan memiliki .gitkeep agar tersimpan di Git.
Nama folder tidak otomatis mendaftarkan route.

Jalankan dari root proyek untuk menambah komponen:

```powershell
npx.cmd ng generate component features/projects/components/project-card
```

Template dan style inline sudah menjadi default generator di angular.json.
Gunakan utility Tailwind langsung di template komponen untuk layout, ukuran,
spacing, warna, dan responsivitas. CSS khusus seperti keyframes, pseudo-element,
dan efek pointer berada di `styles` komponen agar tetap terisolasi.

`src/styles.css` hanya memuat import Tailwind, token tema (`@theme inline`), reset,
font dasar, scrollbar, dan aturan aksesibilitas global. Class seperti `hero`,
`section-heading`, dan `project-card` juga menjadi penanda untuk directive animasi;
pertahankan penanda ini saat mengubah utility class.

Ukuran navbar diatur di template `shared/components/navbar.ts`: `min-h-[62px]`
untuk desktop dan `max-[760px]:min-h-[126px]` untuk mobile. Jarak scroll ke anchor
mengikuti tinggi navbar aktual melalui ResizeObserver.

`home/components/project-card.ts` dipakai di beranda dan halaman Projects.
Gunakan varian `detailed` untuk menampilkan galeri, deskripsi, dan teknologi.
