# Panduan Master & Cetak Biru Produk: ANGIN (Anggaran Indonesia)

> **Nama Produk:** **ANGIN** (Anggaran Indonesia)  
> **Tagline:** *"Dari Pajakmu, Jadi Apa untuk Kotamu?"*  
> **Kompetisi:** Web In Action (WIA) – Multimedia In Action 2026 (UPN Veteran Jakarta)  
> **Tema Utama:** *"From Visionaries to Architects of Change"* (Tagline: *Dream It. Build It. Change It.*)  
> **Subtema Pilihan:** Subtema 1 – **Open Government Data**  
> **Arsitektur Utama:** 100% Full Frontend (Static-First / Jamstack, Zero-Database, No-CRUD)  
> **Versi Dokumen:** 2.1.0 (Master Execution Guide & Strategic Decision Log)

---

## 1. Tentang ANGIN & Masalah Nyata yang Diselesaikan

### 1.1 Masalah Nyata di Masyarakat
Keterbukaan data anggaran pemerintah (APBD) di Indonesia selama ini gagal dipahami oleh masyarakat awam:
* **Format Kaku & Memusingkan:** Disajikan dalam dokumen PDF birokrasi ratusan halaman atau tabel angka mentah.
* **Terlalu Abstrak:** Angka triliunan rupiah (seperti APBD DKI Jakarta sebesar **Rp 84,2 Triliun**) tidak memiliki keterhubungan emosional dengan dompet warga.
* **Krisis Akuntabilitas Publik:** Warga rutin membayar pajak (potongan PPh di gaji, pajak resto PB1 10% saat jajan di kafe, pajak motor PKB tahunan), namun tetap bertanya: *"Pajak gue lari ke mana kalau jalanan depan rumah tetap bolong dan puskesmas masih antre berjam-jam?"*

### 1.2 Solusi ANGIN
**ANGIN** adalah platform web interaktif yang mengubah data triliunan rupiah APBD menjadi **pecahan rupiah nyata di tingkat akar rumput**. Warga tidak sekadar menonton data, melainkan diberdayakan menjadi *Architects of Change* yang memahami dan mengawasi pembangunan di kotanya.

---

## 2. Keputusan Strategis & Arsitektur Produk (Design Log)

Bagian ini mendokumentasikan alasan objektif di balik keputusan tim agar seluruh anggota dan dewan juri memahami arah produk secara konsisten:

### 2.1 Mengapa Fokus 100% pada APBD (Bukan APBN)?
1. **Prinsip Kedekatan Dampak (*Impact Proximity*):**
   * APBN (Pusat) mengurusi hal makro seperti pertahanan (alutsista TNI), pembayaran bunga utang negara, subsidi BBM/listrik BUMN, dan IKN.
   * APBD (Daerah) adalah instrumen fiskal yang paling langsung diinjak dan dirasakan warga: aspal jalanan, puskesmas kelurahan, normalisasi kali, dan subsidi bus TransJakarta.
2. **Menghindari Blunder Tata Kelola di Depan Juri:**
   * Jalan berlubang dan drainase kota adalah **100% kewenangan APBD Pemda**. Jika mencampuradukkan belanja kementerian pusat (APBN) ke proyek jalanan kota, juri yang paham desentralisasi fiskal akan menganggap tim tidak paham pembagian urusan pemerintahan.
3. **Peta Hanya Relevan di Level Daerah:**
   * Kita bisa menaruh titik pin fisik perbaikan jalan atau puskesmas di peta Jakarta/Depok. Kita tidak bisa menaruh pin lokasi untuk belanja bunga utang negara atau kapal selam di peta kota.
4. **Skala Angka yang Tepat:**
   * Angka APBD DKI (**Rp 84,2 Triliun**) adalah skala ideal: cukup besar untuk dibedah, namun cukup konkret untuk diurai hingga ke proyek aspal bernilai belasan miliar rupiah.

### 2.2 Mengapa 100% Full Frontend Tanpa Database & Tanpa CRUD?
1. **Karakteristik Data APBD Adalah *Read-Only*:**
   * Data anggaran tahun fiskal adalah data publik agregat yang tidak diubah setiap detik oleh pengguna umum.
   * Warga masyarakat adalah pengawas dan penerima manfaat, bukan administrator pemerintah yang berhak mengedit angka anggaran negara di database.
2. **Menghindari Jebakan Pemula (No Wasted Time on Admin CRUD):**
   * Membuat halaman login admin dan form input anggaran membutuhkan 40% waktu koding yang tidak dinilai oleh juri. Juri hanya menilai: *"Bagaimana pengalaman masyarakat awam saat mengonsumsi data tersebut?"*
3. **Ketahanan Panggung & Siap Offline (Guidebook Halaman 18 Poin c):**
   * Panitia secara tertulis menyarankan menyiapkan alternatif offline saat babak final di kampus UPNVJ.
   * Arsitektur *Static-First* (Jamstack) memastikan web berjalan **100% instan tanpa koneksi internet sama sekali**, bebas risiko *cold-start* server cloud gratisan yang sering macet saat presentasi.
4. **Penyimpanan Lokal:**
   * Fitur bookmark proyek dan riwayat struk disimpan aman di `localStorage` peramban pengguna.

### 2.3 Tiga Fungsi Nyata Peta Interaktif (Bukan Sekadar Hiasan Visual)
Peta **bukan gimik pelengkap**, melainkan jembatan antara angka teks di tabel menjadi wujud fisik di dunia nyata:
1. **Hyperlocal Discovery ("Ada Proyek Apa di Sekitar Gue?"):**
   * Warga tidak perlu membaca 500 baris tabel. Pengguna cukup mengarahkan peta ke sekitar kampus UPNVJ (Pondok Labu/Fatmawati) atau rumahnya untuk melihat pekerjaan fisik terdekat.
2. **Visual Status Radar (Bukan Cuma Warna):**
   * 🟢 **Hijau (Ikon Checklist):** Proyek selesai 100% tepat waktu.
   * 🟡 **Kuning (Ikon Jam Pasir):** Proyek sedang dikerjakan.
   * 🔴 **Merah (Ikon Peringatan):** Proyek terlambat dari jadwal / terindikasi mangkrak.
3. **Civic Watchdog (Alat Verifikasi Warga):**
   * Jika sistem mencatat perbaikan jalan selesai 100% senilai Rp 8 Miliar, warga yang tinggal di titik koordinat tersebut bisa memverifikasi langsung kondisi fisik di lapangan.

### 2.4 Mengapa React 18 + Vite (Bukan Next.js)?
1. **Bebas Masalah SSR / Hydration Error:**
   * Komponen peta (**Leaflet**) dan ekspor kanvas (**html2canvas**) wajib mengakses objek peramban (`window` dan `document`).
   * Di Next.js, ini sering memicu error merah `ReferenceError: window is not defined` saat Server-Side Rendering. Di Vite, seluruh komponen berjalan di *client-side* sehingga 100% langsung jalan tanpa kendala.
2. **Tanpa Kewajiban Menulis `'use client'` di Setiap Berkas:**
   * Karena semua komponen kita bersifat interaktif (slider, tabs, akordeon, modal), menggunakan Vite jauh lebih ergonomis dan bersih.
3. **Kecepatan Kompilasi (Build 3 Detik):**
   * Menggunakan esbuild/Vite yang sangat cepat dan stabil, meminimalkan risiko gagal deploy menjelang tenggat First Draft 1 November.

---

## 3. Rencana 5 Fitur Utama & Spesifikasi Fungsional

### Fitur 1: Kalkulator Alokasi Pajak (In-Hero Interactive Slider) `[SELESAI SPRINT 1]`
* **Cara Kerja:** Pengguna menggeser slider pendapatan/pengeluaran bulanan (rentang Rp 2.000.000 – Rp 20.000.000, nilai bawaan Rp 4.000.000).
* **Keluaran Instan:** Tiga kartu pecahan rupiah nyata yang dihitung proporsional dari formula APBD:
  * 🚧 **Perbaikan Jalan & Jembatan** (~2.2% dari kontribusi)
  * 🏥 **Subsidi Puskesmas & Faskes** (~3.0% dari kontribusi)
  * 🚌 **Subsidi Transportasi Publik TransJakarta/MRT** (~1.6% dari kontribusi)
* **Keterbukaan Sektor Lain:** Terdapat akordeon/tombol toggle untuk melihat alokasi sektor makro lainnya (Pendidikan 24%, Belanja Pegawai 28%, dll.) sehingga data terasa utuh dan akuntabel.
* **Progress Bar Dinamis:** Bar warna-warni yang secara reaktif menyesuaikan proporsinya mengikuti angka kalkulasi.

### Fitur 2: Struk Pajak Warga (*Civic Receipt Generator*) `[SELESAI SPRINT 1]`
* **Konsep UX:** Mengubah data kalkulasi yang kaku menjadi benda personal yang membanggakan warga (*delight factor*).
* **Tampilan UI:** Pop-up modal berdesain seperti **struk belanja kasir modern / minimarket** yang merinci kontribusi pengguna untuk fasilitas publik (misal: *1,8 meter aspal jalan*, *3 paket obat puskesmas*, *5 tiket busway*).
* **Fitur Ekspor & Confetti:** Dilengkapi tombol **`[ 📥 Unduh Gambar (PNG) ]`** menggunakan pustaka `html2canvas` yang siap dibagikan ke Instagram Story, X, atau WhatsApp, lengkap dengan animasi *confetti*.
* **Fitur Salin Ringkasan:** Memungkinkan menyalin rangkuman teks ke clipboard.

### Fitur 3: Penelusuran Alur Anggaran (*Budget Flow Explorer*) `[TARGET SPRINT 2]`
* **Multi-Level Drill-down:**
  * **Level 1 (Makro):** Total APBD Rp 84,2 Triliun dengan progress bar serapan anggaran (68% terserap per Q3).
  * **Level 2 (Sektoral):** Diagram alur proporsional (Sankey / Tree) memecah anggaran ke 6 sektor utama.
  * **Level 3 (Sub-Program):** Saat sektor *Infrastruktur & PU (Rp 16,0 T)* diklik, membelah menjadi program konkret (*Pengendalian Banjir Rp 5,8 T*, *Pemeliharaan Jalan Rp 4,2 T*, *Subsidi Transportasi Rp 4,5 T*).
  * **Level 4 (Proyek Fisik Nyata):** Saat *Pemeliharaan Jalan* diklik, muncul daftar paket pengerjaan nyata (*Jl. TB Simatupang*, *Jl. Fatmawati*, *Jl. Margonda*), nilai pagu tender, panjang jalan (km), nama kontraktor pelaksana, dan status progres pengerjaan.
* **Kartu Konversi Bahasa Manusia:** Box penerjemah angka nominal:  
  *"Rp 4,2 Triliun setara dengan pengaspalan mulus 1.150 km jalan raya di seluruh DKI Jakarta."*

### Fitur 4: Radar Peta Proyek Fisik (*Mini GIS Leaflet*) `[TARGET SPRINT 2]`
Peta interaktif berbasis Leaflet yang ringan dan fungsional dengan pin koordinat nyata, pop-up info proyek, filter status (selesai, berjalan, terlambat), dan filter wilayah.

### Fitur 5: Simulator Kota Warga (*The City Architect*) `[TARGET SPRINT 3]`
* **Konsep:** Memenuhi semangat tema *"From Visionaries to Architects of Change"*.
* **Cara Kerja:** Mini simulasi di mana warga memegang peran sebagai pengambil kebijakan kota:
  * Pengguna menggeser slider kebijakan: *Pangkas anggaran dinas/rapat hotel 30%* $\rightarrow$ *Alihkan dananya ke beasiswa mahasiswa & perbaikan jembatan*.
  * Indikator dampak langsung merespons secara dinamis (*Indeks Kualitas Udara naik*, *Tingkat Kemacetan turun*, *Jumlah beasiswa bertambah*).

### Fitur Pendukung Pro:
* **Command Palette (`Ctrl + K`):** Pencarian cepat instan untuk nama jalan, proyek, atau dinas tanpa perlu klik menu manual.
* **Sticky Context Breadcrumb:** Navigasi jalur atas (`DKI Jakarta > Infrastruktur > Pemeliharaan Jalan > Jl. TB Simatupang`) agar pengguna tidak tersesat dalam data.

---

## 4. Standar Desain, Estetika, & Aksesibilitas (Anti-Slop UI)

Web ini mematuhi panduan `antislop-ui` agar terlihat profesional, bersih, dan berbobot:

1. **Palet Warna Terarah & Kredibel (GovTech Modern):**
   * **Background Base:** `Slate-50` (`#F8FAFC`) / Card White (`#FFFFFF`).
   * **Primary Text:** `Slate-900` (`#0F172A`) & `Slate-600` (`#475569`).
   * **Primary Accent:** `Emerald-600` (`#059669`) / `Emerald-500` (`#10B981`) melambangkan transparansi rupiah.
   * **Status Accent:** `Amber-500` (sedang berjalan) & `Rose-500` (terlambat/peringatan).
   * **Aturan Anti-Slop:** Dilarang menggunakan gradien ungu-neon generik, tidak ada efek *glow* berlebih, dan tidak ada emoji dekoratif di dalam elemen UI resmi.
2. **Inklusivitas & Aksesibilitas (Human-Centered):**
   * **Navigasi Keyboard Penuh:** Slider, tombol, dan kartu proyek dapat diakses menggunakan tombol `Tab`, panah, dan `Enter`.
   * **Aman untuk Buta Warna (*Colorblind Safe*):** Status proyek tidak boleh hanya mengandalkan warna; wajib disertai ikon dan label teks yang eksplisit.
   * **Kontras Tinggi:** Rasio kontras teks di atas 4.5:1 (memenuhi standar WCAG AAA) agar nyaman dibaca di bawah terik matahari.

---

## 5. Skema Data Dummy Resmi (`src/data/apbd-jakarta.json`) `[SELESAI SPRINT 1]`

Telah diimplementasikan berkas `src/data/apbd-jakarta.json` yang memuat struktur data APBD DKI Jakarta 2026 (Rp 84,2 Triliun), 6 sektor utama, sub-program pengerjaan, hingga rincian paket proyek jalan nyata dengan koordinat GPS.

---

## 6. Log Status & Roadmap Kepatuhan Guidebook WIA 2026

### Status Pengerjaan Terkini:
* [x] **Sprint 1 (23 Oktober 2026) — SELESAI:**
  * Pemasangan dependensi inti (`html2canvas`, `canvas-confetti`, `leaflet`, `react-leaflet@4`, `recharts`, `cmdk`).
  * Pembuatan dataset mock resmi `src/data/apbd-jakarta.json`.
  * Implementasi komponen Modal Struk Pajak Kasir (`src/components/CivicReceiptModal.tsx`) dengan ekspor gambar PNG dan confetti.
  * Penyempurnaan Landing Page (`src/App.tsx`): Dropdown wilayah aktif, akordeon sektor makro, progress bar dinamis, dan section *The Reality Gap*.
  * Verifikasi kompilasi build sukses (`npm run build` dalam 4 detik, 0 error).
* [ ] **Sprint 2 (27 - 31 Oktober 2026) — SELANJUTNYA:**
  * Pembuatan Halaman Kedua: *Budget Flow Explorer* detail dengan rincian alur sektoral & daftar proyek jalan fisik.
  * Integrasi Leaflet Map interaktif dengan pin proyek nyata.
* [ ] **01 November 2026 — FIRST DRAFT SUBMISSION:**
  * **Kewajiban Guidebook Halaman 14:** Link Repository GitHub publik + Dokumen PDF <10 halaman (memuat screenshot 2 halaman wajib: Landing Page + 1 Halaman Lain).
* [ ] **03 - 07 November 2026 — REVIEW IT & EVALUASI:**
  * Evaluasi & masukan resmi dari mentor kompetisi.
* [ ] **08 - 10 November 2026 — FIX IT (REVISI):**
  * Perbaikan karya berdasarkan masukan mentor.
* [ ] **11 November 2026 — FINAL SUBMISSION:**
  * Pengumpulan Proposal PDF (maks 30 hal), Surat Orisinalitas bermaterai, dan video YouTube 5 menit.
* [ ] **28 November 2026 — FINAL ONSITE (PUNCAK):**
  * Pitching onsite 10 menit + live demo di hadapan dewan juri di UPN Veteran Jakarta.

---

## 7. Panduan Menjalankan Proyek di Komputer Lokal

```bash
# Masuk ke direktori proyek
cd C:\Users\ASUS\Documents\GitHub\ANGIN

# Jalankan server pengembangan
npm run dev
```
Buka peramban di alamat `http://localhost:5173`.
