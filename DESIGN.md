---
name: ANGIN.id
description: Platform Pemantauan & Transparansi Anggaran Publik APBD DKI Jakarta 2026
colors:
  primary: "#059669"
  primary-hover: "#047857"
  primary-active: "#065f46"
  background: "#F8FAFC"
  surface: "#FFFFFF"
  text-main: "#0F172A"
  text-muted: "#64748B"
  text-subtle: "#94A3B8"
  border-subtle: "#E2E8F0"
  status-success: "#059669"
  status-warning: "#D97706"
  status-danger: "#E11D48"
typography:
  family-primary: "Plus Jakarta Sans, system-ui, sans-serif"
  family-receipt: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  numbers: "tabular-nums"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
---

# ANGIN.id Design System Specification

## 1. Overview
ANGIN.id (Anggaran Indonesia) adalah platform *civic technology / open government data* yang menerjemahkan data APBD DKI Jakarta 2026 (Rp 84,2 Triliun) menjadi visualisasi yang membumi, transparan, dan dapat diaudit oleh masyarakat awam.

### Surface Modes:
* **Persuade (Landing & Hero):** Membangun kesadaran fiskal warga melalui kalkulator kontribusi pajak interaktif dan cetak struk belanja pajak kasir.
* **Operate (Budget Flow Explorer & Radar GIS):** Memberikan antarmuka audit yang presisi, mudah dipindai (*scannable*), dan bebas distraksi untuk memantau alur anggaran dan titik fisik pengerjaan proyek di 5 kota administrasi.

---

## 2. Colors
Palet warna dirancang dengan pendekatan *GovTech / Civic Trust*: mengutamakan kredibilitas institusional tanpa terkesan kaku atau birokratis.

* **Primary Emerald (`#059669` / Tailwind `emerald-600`):** Simbol integritas, transparansi fiskal, dan kesejahteraan publik. Digunakan pada aksi primer (*primary CTAs*), penanda proyek selesai tepat waktu, dan aksen navigasi aktif.
* **Neutral Ground (`#F8FAFC` / Slate 50) & Surface (`#FFFFFF`):** Latar belakang bersih dan terang yang memaksimalkan keterbacaan data numerik.
* **Text Ink (`#0F172A` / Slate 900):** Teks judul dan angka primer dengan kontras tajam (WCAG AAA compliant).
* **Muted Ink (`#64748B` / Slate 500) & Subtle Ink (`#94A3B8` / Slate 400):** Teks sekunder, label kontraktor, dan keterangan waktu.
* **Status Colors (Audit Lapangan):**
  * **Success Emerald (`#059669`):** Proyek selesai 100% tepat waktu.
  * **Warning Amber (`#D97706`):** Proyek sedang dalam pengerjaan (50% - 99%).
  * **Critical Rose (`#E11D48`):** Proyek terlambat melampaui batas kontrak tender (memicu kanal aduan warga).

---

## 3. Typography
Menggunakan jenis huruf **Plus Jakarta Sans** yang modern, ramah, dan berstandar nasional.

* **Angka Finansial & Persentase:** Wajib memakai utilitas `tabular-nums` agar angka rupiah, persentase serapan, dan hari keterlambatan sejajar sempurna secara vertikal.
* **Batas Maksimal Ukuran:** Maksimal 5 tingkat skala tipografi per halaman (*Display, Title, Section Header, Body, Micro-label*).
* **Pengecualian Khusus Monospace (`data-ui="thermal-receipt"`):** Font *monospace* (`ui-monospace`, `Courier`) hanya diizinkan di dalam komponen Struk Pajak Digital (`CivicReceiptModal.tsx`) untuk mensimulasikan hasil cetak printer termal kasir minimarket di dunia nyata.

---

## 4. Layout
* **Grid Sistem:** Standar 12-kolom dengan batas lebar maksimal `max-w-7xl` (`1280px`) dan margin luar yang simetris di kedua sisi.
* **Radar Peta GIS:**
  * *Desktop:* Split-screen (Sidebar direktori dan filter di kiri selebar 360px, Kanvas Peta Leaflet dinamis memenuhi sisa layar).
  * *Mobile:* Kanvas peta penuh dengan *Bottom Sheet Drawer* mengambang untuk memfilter dan memilih proyek.
* **Konsistensi Touch Target:** Seluruh tombol dan kontrol navigasi mobile memiliki area sentuh minimal $44 \times 44\text{px}$ untuk kenyamanan pengoperasian satu tangan.

---

## 5. Elevation & Depth
Mematuhi aturan ketat *Anti-Slop*:
* **Elemen Diam (*Resting Cards*):** Tidak menggunakan drop shadow mengambang. Struktur dipisahkan menggunakan *single-pixel border* (`border border-slate-200`) atau variasi kontras warna permukaan (`bg-slate-50`).
* **Elemen Melayang (*Overlays Only*):** Bayangan (`shadow-lg`, `shadow-2xl`) secara eksklusif hanya diberikan kepada elemen yang benar-benar mengambang di atas dokumen (Modal Dialog, Drawer, Dropdown Menu).

---

## 6. Shapes
* **Cards & Containers:** Radius sudut `16px` (`rounded-2xl`) untuk kartu besar dan `12px` (`rounded-xl`) untuk kartu sekunder.
* **Buttons & Inputs:** Radius `8px` (`rounded-lg`) untuk tombol aksi dan kolom pencarian.
* **Status Badges & Pills:** Radius penuh `9999px` (`rounded-full`) untuk penanda status proyek dan filter wilayah.

---

## 7. Components
1. **Civic Tax Calculator (Hero):** Slider dinamis konversi pajak penghasilan warga ke meter pengaspalan jalan, subsidi puskesmas, dan transportasi publik.
2. **Civic Receipt Modal (`CivicReceiptModal`):** Struk kasir digital interaktif dengan barcode simulasi dan tombol ekspor PNG via `html2canvas`.
3. **Command Spotlight (`CommandSearchModal`):** Pencarian cepat instan proyek APBD dengan shortcut keyboard `Ctrl + K`.
4. **Project Audit Modal (`ProjectActionModal`):** Kartu verifikasi kontraktor, tenggat waktu tender, dan penghasil teks aduan otomatis ke LAPOR.go.id & Twitter @DKIJakarta.
5. **Budget Flow Explorer (`BudgetFlowExplorer`):** Penelusuran 4 tingkat hirarki anggaran dari makro hingga paket proyek lapangan.
6. **Radar Peta GIS (`RadarMapPage`):** Pemetaan titik fisik proyek APBD di seluruh DKI Jakarta dengan mode cadangan *offline vector* saat internet venue terputus.

---

## 8. Do's and Don'ts

### DO:
* Gunakan ikon SVG presisi dari Lucide React (`AlertTriangle`, `Receipt`, `MapPin`, `Search`).
* Sajikan angka rupiah dalam format resmi Bahasa Indonesia (`Rp 84.200.000.000.000` / `Rp 84,2 T`).
* Cantumkan nama kontraktor pemenang tender resmi dan batas waktu penyelesaian sebagai bukti audit riil.
* Gunakan transisi mikro yang cepat (`transition-colors duration-150`, `transition-transform`).

### DON'T:
* Dilarang menggunakan raw emoji sebagai ikon UI (❌ 💰, 🚨, 🚧).
* Dilarang menggunakan gradasi warna ungu-ke-biru generik (*AI slop gradient*).
* Dilarang menggunakan animasi berulang terus-menerus (`animate-bounce`, `animate-pulse`) yang mengalihkan perhatian dari data.
* Dilarang membuat *dead-click elements* atau *dummy data* kosong.
