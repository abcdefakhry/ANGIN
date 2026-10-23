# Panduan Master & Cetak Biru Produk: ANGIN (Anggaran Indonesia)

> **Nama Produk:** **ANGIN** (Anggaran Indonesia)  
> **Tagline:** *"Dari Pajakmu, Jadi Apa untuk Kotamu?"*  
> **Kompetisi:** Web In Action (WIA) – Multimedia In Action 2026 (UPN Veteran Jakarta)  
> **Tema Utama:** *"From Visionaries to Architects of Change"* (Tagline: *Dream It. Build It. Change It.*)  
> **Subtema Pilihan:** Subtema 1 – **Open Government Data**  
> **Arsitektur Utama:** 100% Full Frontend (Static-First / Jamstack, Zero-Database, No-CRUD)  
> **Target Deployment:** Vercel Production (`angin.vercel.app`) + Offline Presentation Backup  
> **Versi Dokumen:** 2.2.0 (Master PRD – Sesuai Evaluasi Kritis & Solusi 6 Celah)

---

## 1. Tentang ANGIN & Masalah Nyata yang Diselesaikan

### 1.1 Masalah Nyata di Masyarakat
Keterbukaan data anggaran pemerintah (APBD) di Indonesia selama ini gagal dipahami oleh masyarakat awam:
* **Format Kaku & Memusingkan:** Disajikan dalam dokumen PDF birokrasi ratusan halaman atau tabel angka mentah.
* **Terlalu Abstrak:** Angka triliunan rupiah (seperti APBD DKI Jakarta sebesar **Rp 84,2 Triliun**) tidak memiliki keterhubungan emosional dengan dompet warga.
* **Krisis Akuntabilitas Publik:** Warga rutin membayar pajak (potongan PPh di gaji, pajak resto PB1 10% saat jajan di kafe, pajak motor PKB tahunan), namun tetap bertanya: *"Pajak gue lari ke mana kalau jalanan depan rumah tetap bolong dan puskesmas masih antre berjam-jam?"*

### 1.2 Solusi ANGIN
**ANGIN** adalah platform web interaktif yang mengubah data triliunan rupiah APBD menjadi **pecahan rupiah nyata di tingkat akar rumput**. Warga tidak sekadar menonton data, melainkan diberdayakan menjadi *Architects of Change* yang memahami, mengawasi, dan mengambil aksi nyata terhadap pembangunan di kotanya.

---

## 2. Evaluasi Kritis & Solusi Perbaikan 6 Celah Utama

Untuk menjamin web ini kebal sanggahan di hadapan dewan juri profesional serta memenuhi standar juara 1, berikut 6 perbaikan konkret yang diintegrasikan ke dalam sistem:

### 2.1 Isu Peta Offline & Kewajiban Hosting Online
* **Solusi Tile Peta Offline (Dual Mode):**
  * *Online Mode:* Peta memuat tile CartoDB/OpenStreetMap standar via internet.
  * *Offline Fallback Mode:* Sebagai mitigasi panggung onsite (Guidebook Halaman 18), jika koneksi internet terputus (`!navigator.onLine` atau saat tile gagal dimuat), peta otomatis beralih ke **SVG Vector Map Jakarta** interaktif berbasis GeoJSON lokal yang sudah dibundel di dalam proyek. Titik-titik proyek tetap muncul di atas siluet peta Jakarta tanpa kotak abu-abu rusak.
* **Strategi Deployment Publik:**
  * Target hosting utama menggunakan **Vercel** (`angin.vercel.app`) dengan integrasi CI/CD automatic deployment dari branch `master` GitHub.

### 2.2 Sinkronisasi Anggaran 100% & Anti-Empty State
* **Kelengkapan 6 Sektor (Total 100% = Rp 84,2 Triliun):**
  1. 🎓 **Pendidikan & Beasiswa:** 24% (`Rp 20,2 Triliun`)
  2. 💼 **Belanja Pegawai (Gaji ASN/Guru/Nakes):** 28% (`Rp 23,5 Triliun`)
  3. 🏗️ **Infrastruktur & Pekerjaan Umum:** 19% (`Rp 16,0 Triliun`)
  4. 🏥 **Kesehatan & Faskes:** 13% (`Rp 10,9 Triliun`)
  5. 🛡️ **Bantuan Sosial & Perlindungan Warga:** 10% (`Rp 8,4 Triliun`)
  6. 🌿 **Lingkungan Hidup & Kebersihan Kota:** 6% (`Rp 5,2 Triliun`)  
  *(Total: 100% / Rp 84,2 T — Seluruh porsi APBD tersinkronisasi presisi tanpa ada anggaran bocor/hilang).*
* **Solusi Anti-Empty State (Semua Sektor Berisi Data Nyata):**
  * Sektor Pendidikan, Kesehatan, dan Bansos wajib diisi sub-program dan paket dummy riil:
    * *Pendidikan:* KJP Plus/KJMU (Rp 4,5 T) & Rehab Gedung Sekolah (Rp 3,8 T - Proyek: SDN 01 Pondok Labu).
    * *Kesehatan:* Iuran BPJS PBI (Rp 3,9 T) & Operasional Puskesmas (Rp 2,7 T - Proyek: Puskesmas Gambir).
    * *Bansos:* Kartu Lansia Jakarta (Rp 3,2 T - Proyek: Penyaluran Bantuan Tunai Jaksel) & Bantuan Sembako Pangan (Rp 2,8 T).
  * Dengan ini, sektor apa pun yang diklik juri akan membelah secara interaktif tanpa kartu kosong!

### 2.3 Strategi Responsif Layar Ponsel (Mobile-First)
* **Diagram Sankey Adaptif:**
  * Di layar desktop ($\ge$ 768px): Menampilkan diagram aliran horizontal multi-kolom yang dinamis.
  * Di layar mobile (< 768px): Diagram horizontal otomatis berubah menjadi **Vertical Accordion Drill-down / Stacked Bar List** yang ramah gulir vertikal dan nyaman disentuh jari (*tap target* $\ge$ 44px).
* **Pengganti `Ctrl + K` di Layar Sentuh:**
  * Tombol pintasan `Ctrl + K` tetap aktif untuk keyboard laptop/desktop.
  * Di navbar mobile disediakan ikon tombol kaca pembesar (Search Bar) mengambang yang langsung memunculkan modal pencarian cepat saat disentuh.

### 2.4 Akurasi Formula Pajak (Regulasi Fiskal APBD vs APBN)
* **Catatan Kaki Transparansi Formula (*Footnote Disclosure*):** Di bawah kartu kalkulator hero, dicantumkan teks edukasi hukum perpajakan:
  > *"Catatan Transparansi Fiskal: Angka di atas dihitung berdasarkan formula simulasi dari Pajak Daerah (PB1/PBJT Restoran 10% dan Pajak Kendaraan Bermotor) serta porsi Dana Bagi Hasil (DBH) Pajak Penghasilan (PPh) yang disalurkan kembali oleh Pemerintah Pusat ke kas APBD DKI Jakarta."*
* Hal ini membuktikan kepada juri bahwa tim paham administrasi keuangan publik Indonesia dan bukan sekadar asal tembak angka.

### 2.5 Menghadirkan Aksi Nyata Warga (*Actionable Output*)
Agar tidak berhenti sebagai tontonan data pasif tanpa perlu membangun sistem backend database yang rumit:
1. **Fitur "Aksi Aduan Suara Warga" (Tautan Langsung ke Kanal Resmi):**
   * Di proyek berstatus merah/terlambat (misal: *Jl. Margonda*), tersedia tombol: **`[ 📢 Teruskan ke Kanal Pengawasan Publik ]`**.
   * Tombol ini secara otomatis menyalin ringkasan data proyek (ID tender, lokasi, nama kontraktor, persentase keterlambatan) lalu membuka *pre-filled message* ke kanal Twitter/X pemda (@DKIJakarta / @dinasbmkikotajkt) atau link aduan LAPOR.go.id. Warga langsung melakukan aksi pengawasan sosial (*social pressure*).
2. **Fitur Ekspor Hasil Simulasi (*Civic Policy Card*):**
   * Di fitur *The City Architect*, setelah warga selesai menggeser simulasi anggaran kota, disediakan tombol **`[ 📄 Terbitkan Manifesto Anggaran Warga ]`** yang menghasilkan kartu infografis PNG hasil rancangan mereka untuk diviralkan ke media sosial.

### 2.6 Penyelarasan Penuh dengan Syarat Guidebook MIA 2026
1. **Kelengkapan Dokumen First Draft (Deadline 1 November 2026):**
   * Format penamaan berkas wajib: **`WIA_FDSMIA2025_NamaTim.pdf`** (maksimal 10 MB, maksimal 10 halaman) yang memuat lengkap 5 komponen wajib:
     1. Konsep Singkat Website (Latar belakang, tujuan, solusi APBD).
     2. Sitemap Diagram (Struktur hierarki halaman web).
     3. Wireframe / Mockup Sederhana (Desain antarmuka).
     4. Penjelasan Fitur Utama (5 modul utama ANGIN).
     5. Screenshot Minimal 2 Halaman (Landing Page + Budget Flow Explorer yang sudah berjalan).
2. **Roadmap Pengembangan Masa Depan (Bahan Video 11 Nov & Pitch Deck 28 Nov):**
   * **Fase 1 (Saat Ini):** Keterbukaan APBD DKI Jakarta, Visualisasi Proyek Fisik, & Civic Receipt.
   * **Fase 2 (Q1 2027):** Ekspansi ke kota penyangga (BODETABEK - Depok, Bekasi, Tangerang, Bogor) dan integrasi notifikasi aduan via WhatsApp Bot warga.
   * **Fase 3 (Q3 2027):** Integrasi AI Automated Anomaly Detection langsung dari portal LPSE pengadaan tender untuk deteksi dini proyek bermasalah.

---

## 3. Rencana 5 Fitur Utama & Spesifikasi Fungsional

### Fitur 1: Kalkulator Alokasi Pajak (In-Hero Interactive Slider) `[SELESAI SPRINT 1]`
* Slider pendapatan/pengeluaran bulanan (Rp 2 Juta – Rp 20 Juta).
* Pecahan alokasi instan: Perbaikan Jalan (~2.2%), Puskesmas (~3.0%), Transportasi (~1.6%).
* Akordeon sektor makro lainnya (Pendidikan 24%, Belanja Pegawai 28%, dll.).
* Progress bar dinamis yang reaktif mengikuti input slider.
* Footnote disclosure transparansi fiskal resmi.

### Fitur 2: Struk Pajak Warga (*Civic Receipt Generator*) `[SELESAI SPRINT 1]`
* Modal struk kasir minimarket modern personal dengan barcode dan stempel verifikasi.
* Tombol unduh gambar PNG menggunakan `html2canvas` + animasi *confetti*.
* Tombol salin ringkasan teks untuk dibagikan ke WhatsApp / medsos.

### Fitur 3: Penelusuran Alur Anggaran (*Budget Flow Explorer*) `[TARGET SPRINT 2]`
* Diagram alur proporsional adaptif (Desktop: Sankey Horizontal, Mobile: Vertical Accordion).
* Drill-down hingga Level 4: Makro 84,2 T $\rightarrow$ Sektor $\rightarrow$ Sub-Program $\rightarrow$ Proyek Fisik Jalan & Sekolah.
* Kartu konversi bahasa manusia (misal: *Rp 4,2 T = 1.150 km jalan raya*).

### Fitur 4: Radar Peta Proyek Fisik (*Mini GIS Leaflet*) `[TARGET SPRINT 2]`
* Peta interaktif Leaflet dengan dual mode (Online OpenStreetMap + Offline SVG Fallback).
* Pin status pengerjaan: Hijau (selesai), Kuning (berjalan), Merah (terlambat).
* Tombol aksi aduan suara warga pada proyek berstatus merah.

### Fitur 5: Simulator Kota Warga (*The City Architect*) `[TARGET SPRINT 3]`
* Simulasi pergeseran anggaran publik dengan dampak indikator kemacetan dan kualitas udara.
* Tombol ekspor *Manifesto Anggaran Warga* (PNG).

---

## 4. Arsitektur Teknis: 100% Full Frontend (Zero Database)

1. **Prinsip Read-Only:** Data anggaran adalah data agregat publik per tahun fiskal.
2. **Kesiapan Offline & Zero Cold-Start:** Memenuhi klausul alternatif offline Guidebook Hal. 18.
3. **Penyimpanan Lokal:** Memanfaatkan `localStorage` untuk bookmark proyek dan riwayat struk.
4. **Pilihan Stack:** React 18 + Vite (TypeScript) + Tailwind CSS + Shadcn UI + Lucide Icons + Leaflet + Recharts + html2canvas + cmdk.

---

## 5. Skema Data Dummy Resmi (`src/data/apbd-jakarta.json`) `[SELESAI SPRINT 1]`

Telah aktif dan mencakup 6 sektor lengkap (100% / Rp 84,2 T) dengan seluruh sub-program terisi anti-empty state (Infrastruktur, Pendidikan, Kesehatan, Pegawai, Bansos, Lingkungan Hidup).

---

## 6. Log Status & Roadmap Kepatuhan Guidebook WIA 2026

* [x] **Sprint 1 (23 Oktober 2026) — SELESAI:**
  * Pemasangan dependensi inti (`html2canvas`, `canvas-confetti`, `leaflet`, `react-leaflet@4`, `recharts`, `cmdk`).
  * Pembuatan dataset mock resmi 6 sektor 100% sinkron (`src/data/apbd-jakarta.json`).
  * Implementasi Modal Struk Kasir Pajak (`src/components/CivicReceiptModal.tsx`) dengan ekspor PNG & confetti.
  * Penyempurnaan Landing Page (`src/App.tsx`): Dropdown wilayah aktif, akordeon sektor makro, progress bar dinamis, section *The Reality Gap*, dan footnote transparansi fiskal resmi.
  * Verifikasi kompilasi build sukses (`npm run build` dalam 3,6 detik, 0 error).
* [ ] **Sprint 2 (27 - 31 Oktober 2026) — SELANJUTNYA:**
  * Halaman Kedua: *Budget Flow Explorer* detail dengan visual adaptif (desktop horizontal, mobile vertical accordion).
  * Integrasi Leaflet Map interaktif dengan offline SVG fallback dan tombol aksi aduan warga ke kanal pemda.
* [ ] **01 November 2026 — FIRST DRAFT SUBMISSION:**
  * Berkas PDF wajib: `WIA_FDSMIA2025_NamaTim.pdf` (< 10 MB, < 10 hal, 5 komponen wajib termasuk screenshot minimal 2 halaman).
* [ ] **03 - 07 November 2026 — REVIEW IT & EVALUASI:** Masukan mentor industri.
* [ ] **08 - 10 November 2026 — FIX IT (REVISI):** Perbaikan karya.
* [ ] **11 November 2026 — FINAL SUBMISSION:** Proposal PDF (maks 30 hal), Surat Orisinalitas bermaterai, dan video YouTube 5 menit (memuat roadmap 3 fase).
* [ ] **28 November 2026 — FINAL ONSITE PITCHING:** Presentasi 10 menit di UPN Veteran Jakarta.

---

## 7. Panduan Menjalankan Proyek di Komputer Lokal

```bash
# Masuk ke direktori proyek
cd C:\Users\ASUS\Documents\GitHub\ANGIN

# Jalankan server pengembangan
npm run dev
```
Buka peramban di alamat `http://localhost:5173`.
