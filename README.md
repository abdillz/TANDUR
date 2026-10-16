# Prototipe TANDUR

Prototipe interaktif 5 layar untuk Lomba BMC AGFESPORA 2026, Tim Pangpang (Universitas Brawijaya).

## Cara membuka
1. Ekstrak zip ini.
2. Klik dua kali `index.html` (Chrome, Edge, Safari, atau Firefox). Tidak perlu internet atau instalasi.
3. Untuk membagikan lewat link: unggah seluruh folder ke Netlify Drop, Vercel, atau GitHub Pages. Link itu bisa dijadikan kode QR di slide.

## Isi layar
1. Input Menu (SPPG): menu dan porsi menjadi kebutuhan kilogram per bahan.
2. Pembagian Kuota (koperasi): kuota tanam per anggota, dengan cadangan yang bisa digeser.
3. Kuota Saya (petani): kontrak, jadwal, dan harga pasti, tampilan aplikasi dan WhatsApp.
4. Foto Mutu Panen (petani): simulasi penilaian grade dan kesegaran, lalu QR lot yang bisa dipindai.
5. Pelacakan dan Dasbor (SPPG dan Pemda): peringatan dini pasokan, asal-usul lot, progres desa.

## Catatan
- Semua nama, harga, dan angka adalah data ilustrasi dan diberi label itu di layar.
- Penilaian foto hanyalah simulasi. Perhitungan kebutuhan dan kuota memakai aturan dan algoritma biasa, bukan AI.
- Warna dan logo mengikuti logo TANDUR (hijau daun #3E4C21, cokelat tanah #42281F, latar krem-hijau #DEE9C6 ke #F1ECB4).

## Struktur
- `index.html`, `css/style.css`, `js/app.js`, `js/qr.js` (pembuat QR tanpa library luar)
- `assets/logo.png` (logo transparan), `assets/fonts/` (Poppins)
