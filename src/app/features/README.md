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
Style global dan import Tailwind tetap berada di src/styles.css.
