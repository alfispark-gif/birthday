# 🎁 Birthday Surprise (Electron)

Aplikasi desktop kecil ala "kado ulang tahun rahasia" — dibuat ulang berdasarkan
video referensi: window frameless dengan titlebar warna-warni, alur buka kado →
pesan ulang tahun → kado kedua → surat penutup dengan efek ketik (typewriter).

Karakter di-desain ulang secara orisinal (pixel-art generik) — bukan reproduksi
karakter berlisensi (Sanrio/Peanuts, dll) yang muncul di video asli.

## Cara menjalankan

Butuh [Node.js](https://nodejs.org) terpasang di komputer kamu.

```bash
cd birthday-app
npm install     # sekali saja, download Electron (perlu internet)
npm start       # membuka aplikasinya
```

## Struktur

```
birthday-app/
├── package.json
└── src/
    ├── main.js        # Electron main process (window frameless 420x460)
    ├── preload.js      # jembatan aman untuk tombol minimize/close
    ├── index.html      # 9 "scene" alur cerita
    ├── style.css        # tema warna per scene + tampilan pixel
    └── app.js           # navigasi scene, gambar karakter pixel via canvas, animasi
```

## Kustomisasi cepat

- **Nama penerima**: bisa diketik langsung di kotak nama pada scene pertama saat
  aplikasi dibuka (default "casey").
- **Pesan surat akhir**: edit fungsi `LETTER_TEMPLATE` di `src/app.js`.
- **Warna tiap scene**: ubah object `THEMES` di `src/app.js`.
- **Karakter pixel**: parameter di pemanggilan `pixelBlob(...)` (warna badan/telinga,
  bentuk telinga: round/floppy/pointy/tall, aksesori: heart/bow/beak).
- **Font pixel asli**: saat ini pakai fallback Trebuchet MS. Untuk hasil lebih
  mirip, download font "Press Start 2P" (Google Fonts), taruh sebagai file .ttf
  di `src/fonts/`, lalu ubah `@font-face` di `style.css` agar mengarah ke file
  tersebut.

## Alur aplikasi (9 scene)

1. Teaser "ada pesan rahasia" + input nama
2. "You have a GIFT!" → tombol *open gift?*
3. Animasi kado terbuka
4. Ucapan ulang tahun pertama + kue & balon → *next…*
5. "huh? what's this?" (jembatan cerita)
6. "kamu dapat kado lagi" → *find out…!*
7. Animasi kado kedua terbuka
8. Ucapan ulang tahun kedua (versi kedua) + confetti → *next…*
9. Surat penutup "From me… to you" dengan efek ketik + tombol *replay*
