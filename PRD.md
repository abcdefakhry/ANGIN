# Panduan Master & Cetak Biru Produk: ANGIN (Anggaran Indonesia)

> **Nama Produk:** **ANGIN** (Anggaran Indonesia)  
> **Tagline:** *"Dari Pajakmu, Jadi Apa untuk Kotamu?"*  
> **Kompetisi:** Web In Action (WIA) – Multimedia In Action 2026 (UPN Veteran Jakarta)  
> **Tema Utama:** *"From Visionaries to Architects of Change"* (Tagline: *Dream It. Build It. Change It.*)  
> **Subtema Pilihan:** Subtema 1 – **Open Government Data**  
> **Arsitektur Utama:** 100% Full Frontend (Static-First / Jamstack, Zero-Database, No-CRUD)  
> **Versi Dokumen:** 2.0.0 (Unified Master Document)

---

## 1. Tentang ANGIN & Masalah yang Diselesaikan

### 1.1 Masalah Nyata di Masyarakat
Keterbukaan data anggaran pemerintah (APBD) di Indonesia selama ini gagal dipahami oleh masyarakat awam:
* **Format Kaku & Memusingkan:** Disajikan dalam dokumen PDF birokrasi ratusan halaman atau tabel angka mentah.
* **Terlalu Abstrak:** Angka triliunan rupiah (seperti APBD DKI Jakarta sebesar **Rp 84,2 Triliun**) tidak memiliki keterhubungan emosional dengan dompet warga.
* **Krisis Akuntabilitas Publik:** Warga rutin membayar pajak (potongan PPh di gaji, pajak resto PB1 10% saat jajan di kafe, pajak motor PKB tahunan), namun tetap bertanya: *"Pajak gue lari ke mana kalau jalanan depan rumah tetap bolong dan puskesmas masih antre berjam-jam?"*

### 1.2 Solusi ANGIN
**ANGIN** adalah platform web interaktif yang mengubah data triliunan rupiah APBD menjadi **pecahan rupiah nyata di tingkat akar rumput**. Warga tidak sekadar menonton data, melainkan diberdayakan menjadi *Architects of Change* yang memahami dan mengawasi pembangunan di kotanya.

---

## 2. Rencana 5 Fitur Utama & Spesifikasi Fungsional

### Fitur 1: Kalkulator Alokasi Pajak (In-Hero Interactive Slider)
* **Cara Kerja:** Pengguna menggeser slider pendapatan/pengeluaran bulanan (rentang Rp 2.000.000 – Rp 20.000.000, nilai bawaan Rp 4.000.000).
* **Keluaran Instan:** Tiga kartu pecahan rupiah nyata yang dihitung proporsional dari formula APBD:
  * 🚧 **Perbaikan Jalan & Jembatan** (~2.2% dari kontribusi)
  * 🏥 **Subsidi Puskesmas & Faskes** (~3.0% dari kontribusi)
  * 🚌 **Subsidi Transportasi Publik TransJakarta/MRT** (~1.6% dari kontribusi)
* **Keterbukaan Sektor Lain:** Terdapat accordion/tombol toggle untuk melihat alokasi sektor makro lainnya (Pendidikan 24%, Belanja Pegawai 28%, dll.) sehingga data terasa utuh dan akuntabel.

### Fitur 2: Struk Pajak Warga (*Civic Receipt Generator*)
* **Konsep UX:** Mengubah data kalkulasi yang kaku menjadi benda personal yang membanggakan warga (*delight factor*).
* **Tampilan UI:** Pop-up modal berdesain seperti **struk belanja kasir modern / minimarket** yang merinci kontribusi pengguna untuk fasilitas publik (misal: *1,8 meter aspal jalan*, *3 paket obat puskesmas*, *5 tiket busway*).
* **Fitur Ekspor:** Dilengkapi tombol **`[ 📥 Unduh Gambar (PNG) ]`** menggunakan pustaka `html2canvas` yang siap dibagikan ke Instagram Story, X, atau WhatsApp.

### Fitur 3: Penelusuran Alur Anggaran (*Budget Flow Explorer*)
* **Multi-Level Drill-down:**
  * **Level 1 (Makro):** Total APBD Rp 84,2 Triliun dengan progress bar serapan anggaran (68% terserap per Q3).
  * **Level 2 (Sektoral):** Diagram alur proporsional (Sankey / Tree) memecah anggaran ke 6 sektor utama.
  * **Level 3 (Sub-Program):** Saat sektor *Infrastruktur & PU (Rp 16,0 T)* diklik, membelah menjadi program konkret (*Pengendalian Banjir Rp 5,8 T*, *Pemeliharaan Jalan Rp 4,2 T*, *Subsidi Transportasi Rp 4,5 T*).
  * **Level 4 (Proyek Fisik Nyata):** Saat *Pemeliharaan Jalan* diklik, muncul daftar paket pengerjaan nyata (*Jl. TB Simatupang*, *Jl. Fatmawati*, *Jl. Margonda*), nilai pagu tender, panjang jalan (km), nama kontraktor pelaksana, dan status progres pengerjaan.
* **Kartu Konversi Bahasa Manusia:** Box penerjemah angka nominal:  
  *"Rp 4,2 Triliun setara dengan pengaspalan mulus 1.150 km jalan raya di seluruh DKI Jakarta."*

### Fitur 4: Radar Peta Proyek Fisik (*Mini GIS Leaflet*)
Peta interaktif berbasis Leaflet yang ringan dan fungsional dengan 3 peran utama:
1. **Hyperlocal Discovery:** Warga bisa menyorot area sekitar kampus UPNVJ (Pondok Labu/Fatmawati) atau tempat tinggalnya untuk melihat proyek pembangunan terdekat.
2. **Visual Status Radar (Bukan Cuma Warna):**
   * 🟢 **Hijau (Ikon Checklist):** Proyek selesai 100% tepat waktu.
   * 🟡 **Kuning (Ikon Jam Pasir):** Proyek sedang dikerjakan.
   * 🔴 **Merah (Ikon Peringatan):** Proyek terlambat dari jadwal / terindikasi mangkrak.
3. **Civic Watchdog:** Titik koordinat GPS pasti agar warga sekitar bisa memverifikasi langsung kondisi fisik di lapangan.

### Fitur 5: Simulator Kota Warga (*The City Architect*)
* **Konsep:** Memenuhi semangat tema *"From Visionaries to Architects of Change"*.
* **Cara Kerja:** Mini simulasi di mana warga memegang peran sebagai pengambil kebijakan kota:
  * Pengguna menggeser slider kebijakan: *Pangkas anggaran dinas/rapat hotel 30%* $\rightarrow$ *Alihkan dananya ke beasiswa mahasiswa & perbaikan jembatan*.
  * Indikator dampak langsung merespons secara dinamis (*Indeks Kualitas Udara naik*, *Tingkat Kemacetan turun*, *Jumlah beasiswa bertambah*).

### Fitur Pendukung Pro:
* **Command Palette (`Ctrl + K`):** Pencarian cepat instan untuk nama jalan, proyek, atau dinas tanpa perlu klik menu manual.
* **Sticky Context Breadcrumb:** Navigasi jalur atas (`DKI Jakarta > Infrastruktur > Pemeliharaan Jalan > Jl. TB Simatupang`) agar pengguna tidak tersesat dalam data.

---

## 3. Standar Desain, Estetika, & Aksesibilitas (Anti-Slop UI)

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

## 4. Arsitektur Teknis: 100% Full Frontend (Zero Database)

### 4.1 Mengapa Tanpa Database & Tanpa CRUD?
1. **Karakteristik Data APBD Adalah Read-Only:** Data anggaran pemerintah tahun fiskal adalah data publik agregat yang tidak diubah setiap detik oleh pengguna umum. Menghindari pemborosan waktu membuat form login admin/CRUD yang tidak dinilai juri.
2. **Kebal Masalah Panggung & Siap Offline (Guidebook Halaman 18 Poin c):**
   * Panitia secara eksplisit menyarankan menyiapkan alternatif offline saat babak final.
   * Arsitektur Jamstack / Static-First memastikan web dapat dijalankan 100% lancar di laptop tanpa koneksi internet sama sekali. Bebas risiko *cold-start* server cloud yang lambat.
3. **Penyimpanan Lokal:** Fitur bookmark proyek dan riwayat struk disimpan aman di `localStorage` browser.

### 4.2 Tech Stack Definitif: React 18 + Vite (TypeScript)
* **Framework:** React 18 + Vite (TypeScript) — bebas dari masalah SSR hydration error pada Leaflet dan Canvas, build super cepat (3 detik).
* **Styling:** Tailwind CSS + Shadcn UI.
* **Ikon:** Lucide React.
* **Visualisasi & Diagram:** Recharts & `@nivo/sankey`.
* **Peta GIS:** Leaflet & `react-leaflet` (100% gratis, tanpa Google API Key).
* **Ekspor Gambar:** `html2canvas` (render struk PNG).
* **Animasi:** Framer Motion + `react-countup`.
* **Pencarian Cepat:** `cmdk`.

---

## 5. Skema Data Dummy Resmi (`src/data/apbd-jakarta.json`)

Data dummy terstruktur yang mencakup data makro hingga proyek fisik:

```json
{
  "province": "DKI Jakarta",
  "fiscal_year": 2026,
  "total_budget": 84200000000000,
  "realization_percentage": 68,
  "sectors": [
    {
      "id": "sec-infra",
      "name": "Infrastruktur & Pekerjaan Umum",
      "budget": 16000000000000,
      "percentage": 19,
      "color": "#059669",
      "sub_programs": [
        {
          "id": "sub-jalan",
          "name": "Pemeliharaan Jalan & Jembatan",
          "budget": 4200000000000,
          "human_conversion": "Setara dengan pengaspalan mulus 1.150 km jalan raya di seluruh DKI Jakarta.",
          "projects": [
            {
              "id": "proj-tb-simatupang",
              "title": "Peningkatan Jalan TB Simatupang",
              "location": "Jakarta Selatan",
              "budget": 14800000000,
              "length": "3.2 km",
              "contractor": "PT Citra Karya Abadi",
              "progress": 80,
              "status": "Dalam Pengerjaan",
              "status_color": "yellow",
              "coordinates": [-6.2928, 106.8285]
            },
            {
              "id": "proj-fatmawati",
              "title": "Pengaspalan Ulang Jl. RS Fatmawati",
              "location": "Jakarta Selatan (Dekat Kampus UPNVJ)",
              "budget": 8200000000,
              "length": "2.4 km",
              "contractor": "PT Sumber Aspal Makmur",
              "progress": 100,
              "status": "Selesai",
              "status_color": "green",
              "coordinates": [-6.3012, 106.7981]
            },
            {
              "id": "proj-margonda",
              "title": "Rekonstruksi Saluran & Jalan Margonda Akses",
              "location": "Perbatasan Jaksel - Depok",
              "budget": 9200000000,
              "length": "1.8 km",
              "contractor": "PT Sumber Beton Jaya",
              "progress": 45,
              "status": "Terlambat",
              "status_color": "red",
              "coordinates": [-6.3533, 106.8322]
            }
          ]
        },
        {
          "id": "sub-banjir",
          "name": "Normalisasi Sungai & Pengendalian Banjir",
          "budget": 5800000000000,
          "human_conversion": "Setara dengan pengerukan dan penguatan tanggul 45 km aliran sungai kritis.",
          "projects": [
            {
              "id": "proj-krukut",
              "title": "Pengerukan & Tanggul Kali Krukut",
              "location": "Pondok Labu, Jakarta Selatan",
              "budget": 12500000000,
              "length": "4.5 km",
              "contractor": "PT Bahtera Tirta Mandiri",
              "progress": 60,
              "status": "Dalam Pengerjaan",
              "status_color": "yellow",
              "coordinates": [-6.3120, 106.8010]
            }
          ]
        }
      ]
    },
    {
      "id": "sec-pendidikan",
      "name": "Pendidikan",
      "budget": 20200000000000,
      "percentage": 24,
      "color": "#1e293b",
      "sub_programs": []
    },
    {
      "id": "sec-kesehatan",
      "name": "Kesehatan & Fasilitas Medis",
      "budget": 10900000000000,
      "percentage": 13,
      "color": "#0284c7",
      "sub_programs": []
    },
    {
      "id": "sec-pegawai",
      "name": "Belanja Pegawai (Gaji & Operasional)",
      "budget": 23500000000000,
      "percentage": 28,
      "color": "#475569",
      "sub_programs": []
    }
  ]
}
```

---

## 6. Target Milestone & Kepatuhan Guidebook WIA 2026

| Batas Waktu | Tahapan Resmi | Kebutuhan Output Tim |
| :--- | :--- | :--- |
| **23 - 26 Okt 2026** | *Build It* (Sprint 1) | Pasang pustaka pendukung (`html2canvas`, `leaflet`, dll.), implementasikan Modal Struk Kasir Pajak & interaktivitas landing page. |
| **27 - 31 Okt 2026** | *Build It* (Sprint 2) | Bangun Halaman Kedua: *Budget Flow Explorer* detail dengan daftar proyek fisik & Leaflet Map. |
| **01 Nov 2026** | **First Draft Submission** | **Kewajiban Guidebook:** Link Repository GitHub publik (README rapi) + Dokumen PDF <10 halaman (memuat screenshot minimal 2 halaman: Landing Page + 1 Halaman Lain). |
| **03 - 07 Nov 2026** | *Review It & Evaluasi* | Sesi review dan feedback resmi dari mentor industri kompetisi. |
| **08 - 10 Nov 2026** | *Fix It (Revisi)* | Menyempurnakan web berdasarkan masukan mentor, polish UI/UX dan animasi. |
| **11 Nov 2026** | **Final Submission** | Unggah Proposal PDF (maks 30 hal), Surat Orisinalitas bermaterai, dan video pitching YouTube (maks 5 menit). |
| **28 Nov 2026** | **Final Onsite** | Pitching onsite 10 menit + live demo di kampus UPN Veteran Jakarta. |

---

## 7. Panduan Menjalankan Proyek di Komputer Lokal

```bash
# Masuk ke direktori proyek
cd C:\Users\ASUS\Documents\GitHub\ANGIN

# Pastikan dependensi terpasang
npm install

# Pasang dependensi tambahan untuk fitur struk, peta, dan chart
npm install html2canvas leaflet react-leaflet @types/leaflet recharts @nivo/sankey cmdk canvas-confetti @types/canvas-confetti

# Jalankan server pengembangan
npm run dev
```
Buka browser di alamat `http://localhost:5173`.
