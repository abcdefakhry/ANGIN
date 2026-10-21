# Panduan Proyek: ANGIN (Anggaran Indonesia)

> **Tagline:** *"Dari Pajakmu, Jadi Apa untuk Kotamu?"*  
> **Tujuan:** Kompetisi Web In Action (WIA) 2026 – UPN Veteran Jakarta  
> **Subtema:** Open Government Data  

---

## 1. Tentang ANGIN

**ANGIN** adalah platform web interaktif yang membantu warga memahami uang pajak daerah secara sederhana dan transparan. 

Biasanya, data APBD (Anggaran Pendapatan dan Belanja Daerah) disajikan dalam dokumen PDF ratusan halaman atau tabel rumit yang bikin pusing warga biasa. ANGIN hadir untuk mengubah angka triliunan rupiah (seperti APBD Jakarta sebesar **Rp 84,2 Triliun**) menjadi hitungan rupiah yang nyata dan terasa di dompet masing-masing warga.

---

## 2. Masalah Nyata yang Ingin Kita Selesaikan

Banyak dari kita atau teman-teman di sekitar sering bertanya:
* *"Tiap bulan gaji dipotong pajak, makan di kafe kena pajak 10%, bayar pajak motor tiap tahun, tapi kenapa jalan depan rumah masih berlubang?"*
* *"Uang pajak daerah sebenarnya dipakai buat apa saja sih?"*

Masalahnya bukan datanya tidak ada, tapi **cara penyampaiannya yang terlalu kaku dan abstrak**. Orang awam tidak butuh membaca ratusan halaman laporan birokrasi; mereka hanya ingin tahu timbal balik konkret apa yang kota berikan dari pajak yang sudah mereka bayar.

---

## 3. Rencana 5 Fitur Utama

### 1. Kalkulator Alokasi Pajak (Di Bagian Depan)
* **Cara kerja:** Pengguna tinggal menggeser slider pendapatan/pengeluaran bulanan (mulai Rp 2 juta sampai Rp 20 juta, default Rp 4 juta).
* **Hasilnya:** Langsung muncul perkiraan rupiah kontribusi mereka ke fasilitas publik:
  * Berapa rupiah untuk penambalan aspal jalan.
  * Berapa rupiah untuk subsidi faskes & puskesmas.
  * Berapa rupiah untuk subsidi tiket TransJakarta & MRT.

### 2. Penelusuran Alur Anggaran (*Budget Flow Explorer*)
* Menampilkan diagram pohon yang mudah dipahami: dari total APBD (Rp 84,2 Triliun), dialirkan ke sektor apa saja (Pendidikan, Infrastruktur, Kesehatan, Transportasi), lalu dipecah lagi sampai ke nama ruas jalan dan nama kontraktor pelaksananya.
* Angka triliunan diterjemahkan ke bahasa yang gampang dibayangkan, misalnya:  
  *"Rp 4,2 Triliun setara dengan mengaspal mulus 1.150 km jalan raya."*

### 3. Struk Pajak Warga (*Civic Receipt*)
* Fitur seru berupa **struk belanja kasir modern** (ala minimarket) yang merinci kontribusi pajak pengguna.
* Ada tombol **Unduh Gambar (PNG)** dan tombol bagikan, sehingga pengguna bisa memposting struk pajak mereka ke Instagram Story, X (Twitter), atau WhatsApp. Ini jadi nilai tambah yang menarik untuk juri dan mudah viral.

### 4. Radar Peta Proyek Fisik (*Mini GIS*)
* Peta interaktif Jakarta yang menampilkan titik-titik proyek aktif di sekitar warga.
* Menampilkan informasi nama proyek, nilai anggaran tender, siapa pelaksananya, dan progres pengerjaannya.
* Setiap titik status diberi tanda jelas: mana yang sedang dikerjakan, mana yang sudah selesai, dan mana yang perlu perhatian.

### 5. Simulator Kota Warga (*The City Architect*)
* Permainan simulasi sederhana di mana warga bisa mencoba jadi "pengelola kota".
* Pengguna bisa menggeser alokasi anggaran (misalnya: menambah anggaran taman kota dan mengurangi anggaran belanja dinas) lalu melihat dampaknya ke skor kemacetan dan kebersihan udara kota.

---

## 4. Standar Desain & Kerapian (Mudah Digunakan Siapa Saja)

Agar aplikasi ini nyaman dipakai semua orang dan dinilai bagus oleh juri, ada beberapa panduan sederhana:

1. **Warna Nyaman & Kontras Jelas:**
   * Warna utama menggunakan hijau segar (*Emerald*) dan abu-abu gelap (*Slate*).
   * Teks dibuat sangat jelas terbaca, tidak buram atau abu-abu pucat, sehingga tetap nyaman dibaca di layar HP saat di luar ruangan.
2. **Bisa Pakai Keyboard Sepenuhnya:**
   * Slider dan tombol bisa digeser/ditekan menggunakan tombol panah dan `Enter` di keyboard.
3. **Status yang Jelas (Bukan Cuma Warna):**
   * Status proyek tidak hanya ditandai dengan titik warna (hijau/kuning/merah), tapi selalu ditemani tulisan dan ikon yang jelas agar teman-teman yang memiliki gangguan penglihatan warna tetap paham.
4. **Bahasa Manusiawi:**
   * Semua teks di website menggunakan bahasa Indonesia yang ramah, sopan, dan mudah dipahami, tanpa singkatan birokrasi yang membingungkan.

---

## 5. Rencana Tahapan Pengerjaan

* **Tahap 1 (Selesai):** Struktur dasar proyek rapi di root, tampilan awal dengan slider kalkulator interaktif, dan kartu metrik rupiah.
* **Tahap 2 (Selanjutnya):** Pembuatan modal Struk Kasir Pajak (*Civic Receipt*) yang bisa diunduh jadi gambar PNG, serta visualisasi alur anggaran detail.
* **Tahap 3:** Integrasi peta interaktif (Leaflet) untuk Radar Proyek dengan filter wilayah Jakarta.
* **Tahap 4:** Fitur simulasi kebijakan (*City Architect*), perapian akhir, dan persiapan bahan presentasi untuk juri.

---

## 6. Cara Menjalankan Proyek di Komputer Lokal

```bash
# 1. Pastikan dependensi sudah terpasang
npm install

# 2. Jalankan server lokal
npm run dev
```
Buka browser di alamat `http://localhost:5173`.
