# ANGIN (Anggaran Indonesia)
> **"Dari Pajakmu, Jadi Apa untuk Kotamu?"**  
> *Platform Civic-Tech & Open Government Data untuk Transparansi, Advokasi, dan Partisipasi Pengawasan APBD DKI Jakarta.*

---

## 🏆 Informasi Karya & Kompetisi
* **Kompetisi:** Web In Action (WIA) – Multimedia In Action 2026 (UPN Veteran Jakarta)
* **Kategori / Cabang:** Web In Action
* **Tema Utama:** Designing Digital Futures
* **Sub-Tema Pilihan:** Open Government Data
* **Nama Tim:** Brazil
* **Mentor Penilai:** Adi Prabowo

---

## 🌟 Latar Belakang & Nilai Inovasi

Dokumen Anggaran Pendapatan dan Belanja Daerah (APBD) konvensional kerap tersaji dalam format PDF ratusan halaman dengan tabel angka ribuan baris dan akronim birokrasi kaku (*BTL, BL, PPKD, SP2D*). Akibatnya, masyarakat awam kesulitan memahami ke mana larinya uang pajak yang mereka bayarkan setiap hari dan apakah proyek fisik di lingkungan mereka berjalan tepat waktu.

**ANGIN.ID** hadir menjembatani jurang informasi tersebut dengan prinsip:
1. **Penerjemahan Personal (*Humanized Conversion*):** Mengubah nominal triliunan rupiah menjadi pecahan rupiah riil yang dibelanjakan dari gaji/pengeluaran bulanan warga.
2. **Visualisasi Data Interaktif (*Data Visualization with Recharts*):** Dashboard analitik dinamis dengan grafik tren multi-tahun (2024–2026), porsi 6 sektor, dan komposisi belanja daerah.
3. **Kawal Proyek Spasial (*Geo-spatial Civic Watchdog*):** Peta interaktif Leaflet untuk memantau titik proyek fisik, mendeteksi proyek yang molor melewati batas kontrak, dan memusatkan lokasi ke sekitar pengguna dengan 1-klik (*Geolocation*).
4. **Simulator Anggaran Partisipatif (*The City Architect*):** Ruang simulasi bagi warga untuk merancang APBD alternatif Rp 84,2 Triliun secara seimbang dan mengamati proyeksi langsung terhadap indeks kemacetan, kualitas udara (AQI), dan kapasitas beasiswa KJP.
5. **Partisipasi & Kotak Aspirasi Warga (*Citizen Feedback Hub*):** Kanal terpadu bagi warga untuk melayangkan usulan anggaran, mengadukan proyek terbengkalai, menerbitkan kode tiket pengawasan (`#ASP-2026-XXXX`), serta mendukung usulan warga lain untuk dibawa ke forum Musrenbang.
6. **Kamus Istilah APBD Warga (*Plain Language Micro-Glossary*):** Menerjemahkan istilah teknis anggaran (*Pagu, Belanja Modal, DBH, PSO, dll.*) menjadi bahasa sehari-hari yang membumi.

---

## 🚀 Fitur Unggulan

### 1. Kalkulator Pajak & Struk Resmi Warga (*Civic Receipt*)
* Slider gaji/pengeluaran bulanan interaktif.
* Menghitung estimasi kontribusi riil ke pos fasilitas publik (aspal jalan, puskesmas, subsidi Transjakarta & MRT).
* Cetak & unduh struk kasir (*thermal receipt*) digital format PNG beresolusi tinggi dengan nomor bukti unik untuk dibagikan ke media sosial.

### 2. Pohon Alur Anggaran (*Budget Flow Explorer*) & Grafik Interaktif
* **Grafik Interaktif Recharts:**
  * **Tren Multi-Tahun:** Membandingkan pertumbuhan anggaran per sektor pada tahun 2024, 2025, dan 2026.
  * **Donut Porsi 6 Sektor:** Visualisasi porsi belanja dengan detail dampak nyata yang dirasakan warga.
  * **Komposisi Jenis Belanja:** Membedah porsi Belanja Modal (proyek fisik) vs Belanja Pegawai (gaji birokrasi) vs Belanja Bansos & Subsidi.
* **Penelusuran Bertingkat 3 Langkah:** Sektor Makro ➔ Sub-Program ➔ Bukti Proyek Fisik & Audit Tender.

### 3. Kawal Proyek di Sekitarmu (*Interactive Radar Map*)
* Peta Leaflet dengan penanda (*custom pins*) status proyek: Hijau (Selesai), Kuning (Berjalan), Merah (Molor/Terlambat).
* Tombol **📍 Proyek Dekat Saya** berbasis Geolocation browser untuk memusatkan peta ke radius terdekat pengguna.
* Kartu Audit Proyek: menampilkan nilai pagu, kontraktor pelaksana, persentase realisasi, tenggat kontrak resmi, dan jumlah hari keterlambatan.
* **Mode Offline (Vector Fallback):** Menjamin peta skematik vektor Jakarta tetap dapat diklik dan disajikan saat presentasi tanpa koneksi internet.

### 4. The City Architect (Simulator APBD Partisipatif)
* Warga berperan sebagai perencana kota dengan menggeser pagu 6 sektor utama dalam batas kas Rp 84,2 Triliun.
* Pemodelan indikator prediktif berbasis data riil:
  * Indeks Kemacetan Jakarta (Baseline: 53%)
  * Indeks Kualitas Udara / Polusi AQI (Baseline: 142)
  * Rasio Belanja Layanan Publik vs Operasional Birokrasi
  * Persentase Kuota Beasiswa KJP Plus & Layanan Faskes Puskesmas
* Ekspor Kartu Manifesto Anggaran Warga berformat PNG resolusi tinggi.

### 5. Kotak Suara & Aspirasi Warga (*Citizen Feedback Hub*)
* Mengirimkan masukan dalam 3 kategori:
  * 💡 *Usulan Anggaran Publik* (fasilitas baru, penerangan, perbaikan jalan)
  * 🚨 *Laporan Proyek Molor* (keterlambatan pekerjaan fisik di lapangan)
  * ❓ *Pertanyaan Keterbukaan APBD* (verifikasi kuota bantuan sosial)
* Penerbitan Kode Tiket Pengawasan publik (contoh: `#ASP-2026-8921`).
* Feed publik transparan dengan status verifikasi (*Terkirim, Masuk Risalah Musrenbang, Ditindaklanjuti Dinas*) dan fitur dukungan/upvote warga.

### 6. Kamus Istilah APBD Warga (*Plain Language Micro-Glossary*)
* Menghilangkan hambatan istilah birokrasi: Pagu, Belanja Modal, DBH, Subsidi PSO, Realisasi Fisik, Musrenbang, dan BPJS PBI.
* Pencarian cepat dan filter kategori istilah dengan contoh kasus nyata di lapangan.

---

## 🛠️ Tech Stack & Arsitektur

* **Framework:** React 18 (TypeScript) + Vite
* **Styling & UI:** Tailwind CSS v3 + Lucide Icons + Antislop Design Standard
* **Data Visualization:** Recharts v3 (ResponsiveContainer, BarChart, PieChart) + Custom SVG Bezier Curves
* **Peta Spasial:** Leaflet + React-Leaflet + OpenStreetMap + Custom Schematic SVG Vector Fallback
* **Export Engine:** `html2canvas` (PNG Thermal Receipt & Manifesto Generator) + `canvas-confetti`
* **Command Palette:** `cmdk` (Pencarian Cepat Proyek via Ctrl + K)
* **Performance:** Code-Splitting via `React.lazy` & Vite `manualChunks` (Ukuran bundle utama hanya ~147 kB).

---

## 📂 Struktur Repositori

```
ANGIN/
├── src/
│   ├── components/
│   │   ├── BudgetFlowExplorer.tsx       # Modul 3-langkah penelusuran APBD
│   │   ├── InteractiveBudgetCharts.tsx  # Grafik interaktif Recharts (Tren multi-tahun & Donut)
│   │   ├── BudgetFlowMiniPreview.tsx    # Aliran anggaran kurva Sankey & toggle pajak/makro
│   │   ├── RadarMapPage.tsx             # Peta spasial Kawal Proyek + Geolocation + Offline Vector
│   │   ├── CityArchitectSimulator.tsx   # Simulator APBD alternatif warga & ekspor manifesto PNG
│   │   ├── CivicReceiptModal.tsx        # Modal Struk Kasir Pajak digital
│   │   ├── CitizenFeedbackModal.tsx     # Kotak suara & feed aspirasi warga publik
│   │   ├── BudgetGlossaryModal.tsx      # Kamus istilah APBD bahasa warga
│   │   ├── ProjectActionModal.tsx       # Lembar audit tender & aksi aduan publik
│   │   └── CommandSearchModal.tsx       # Pencarian cepat Ctrl + K
│   ├── data/
│   │   └── apbd-jakarta.json            # Dataset resmi APBD DKI Jakarta 2026
│   ├── App.tsx                          # Root container, navigation dock & view switcher
│   ├── main.tsx
│   └── index.css
├── anti-slop/
│   └── audit-001-2026-11-02.md          # Laporan audit copywriting anti-slop
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Panduan Menjalankan Proyek

### 1. Prasyarat
* Node.js v18+ atau v20+
* npm atau yarn

### 2. Instalasi Dependensi
```bash
git clone https://github.com/abcdefakhry/ANGIN.git
cd ANGIN
npm install
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka peramban di: `http://localhost:5173`.

### 4. Build Produksi
```bash
npm run build
```

### 5. Preview Build Produksi
```bash
npm run preview
```

---

## 👥 Tim Brazil — Web In Action 2026
* **KSM Multimedia — UPN Veteran Jakarta**
* Dikembangkan untuk mendorong partisipasi publik, akuntabilitas, dan keterbukaan anggaran daerah di era digital.
