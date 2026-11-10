import React, { useState } from 'react';
import { X, BookOpen, Search, Sparkles, ArrowRight } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  category: string;
  plainDefinition: string;
  officialDefinition: string;
  example: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Pagu Anggaran',
    category: 'Dasar Anggaran',
    plainDefinition: 'Batas maksimal uang kas rakyat yang boleh dipakai untuk suatu proyek atau dinas. Pengeluaran tidak boleh melampaui angka ini.',
    officialDefinition: 'Batas pengeluaran tertinggi yang dialokasikan kepada instansi untuk membiayai program tertentu.',
    example: 'Pagu perbaikan jalan TB Simatupang adalah Rp 14,8 Miliar.',
  },
  {
    term: 'Belanja Modal',
    category: 'Jenis Belanja',
    plainDefinition: 'Uang APBD yang langsung menjelma jadi wujud fisik nyata yang bisa dinikmati warga: jalan aspal, jembatan, sekolah baru, dan pompa banjir.',
    officialDefinition: 'Pengeluaran anggaran untuk perolehan aset tetap yang memberi manfaat lebih dari 12 bulan.',
    example: 'DKI mengalokasikan Rp 21,8 Triliun (26% APBD) untuk belanja modal fisik.',
  },
  {
    term: 'Belanja Operasional',
    category: 'Jenis Belanja',
    plainDefinition: 'Biaya rutin agar roda kota tetap berjalan: gaji guru, dokter puskesmas, perawat, ASN, serta biaya listrik dan pemeliharaan gedung dinas.',
    officialDefinition: 'Pengeluaran rutin untuk menjalankan tugas pokok dan fungsi instansi pemerintahan.',
    example: 'Termasuk gaji ribuan guru sekolah negeri dan nakes RSUD.',
  },
  {
    term: 'Dana Bagi Hasil (DBH)',
    category: 'Sumber Dana',
    plainDefinition: 'Pajak penghasilan (PPh) yang dipotong dari gaji warga dan disetor ke kas pusat, lalu sebagian dikembalikan lagi ke kas Jakarta untuk membiayai fasilitas kota.',
    officialDefinition: 'Dana APBN yang dibagihasilkan ke daerah berdasarkan porsi persentase ketentuan perundang-undangan.',
    example: 'Warga yang taat bayar pajak PPh turut menyumbang kas pembangunan DKI.',
  },
  {
    term: 'Subsidi PSO (Public Service Obligation)',
    category: 'Subsidi Warga',
    plainDefinition: 'Talangan subsidi dari pajak warga agar tarif tiket Transjakarta tetap murah Rp 3.500, meski biaya operasional aslinya mencapai Rp 14.000 per orang.',
    officialDefinition: 'Kompensasi selisih antara tarif keekonomian moda angkutan massal dengan tarif keterjangkauan daya beli masyarakat.',
    example: 'Subsidi PSO menjamin mobilitas harian jutaan pekerja ibu kota tetap hemat.',
  },
  {
    term: 'Realisasi Fisik vs Realisasi Keuangan',
    category: 'Pengawasan Proyek',
    plainDefinition: 'Realisasi fisik adalah seberapa persen bangunan/jalan yang sudah selesai di lapangan. Realisasi keuangan adalah berapa rupiah kas pemda yang sudah cair ke rekening kontraktor.',
    officialDefinition: 'Perbandingan antara progres capaian volume output di lapangan terhadap penyerapan anggaran kas (SP2D).',
    example: 'Jika realisasi keuangan sudah 90% tapi fisik baru 45%, warga patut curiga ada proyek molor.',
  },
  {
    term: 'Musrenbang',
    category: 'Partisipasi Warga',
    plainDefinition: 'Forum rembuk warga tahunan dari tingkat RT, RW, Kelurahan, hingga Provinsi tempat warga mengusulkan langsung kebutuhan lingkungan.',
    officialDefinition: 'Musyawarah Perencanaan Pembangunan daerah sebagai mekanisme penyerapan aspirasi dari bawah ke atas (bottom-up planning).',
    example: 'Usulan warga dari formulir ANGIN dapat dibawa sebagai dokumen advokasi Musrenbang.',
  },
  {
    term: 'BPJS PBI (Penerima Bantuan Iuran)',
    category: 'Jaminan Sosial',
    plainDefinition: 'Warga miskin dan rentan yang iuran jaminan kesehatannya 100% dibayarkan penuh oleh Pemprov DKI Jakarta sehingga gratis berobat di faskes.',
    officialDefinition: 'Peserta jaminan kesehatan fakir miskin yang iurannya dibayarkan oleh pemerintah daerah melalui APBD.',
    example: 'Memastikan tidak ada warga Jakarta yang ditolak rumah sakit karena terkendala biaya.',
  },
];

interface BudgetGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetGlossaryModal: React.FC<BudgetGlossaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  if (!isOpen) return null;

  const categories = ['Semua', ...Array.from(new Set(GLOSSARY_TERMS.map((t) => t.category)))];

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const matchSearch =
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.plainDefinition.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || t.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-7 overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Tutup kamus istilah APBD"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Kamus Bahasa Warga (Plain Language)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pahami Istilah Anggaran Tanpa Pusing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Menerjemahkan bahasa birokrasi keuangan yang rumit menjadi analogi kehidupan sehari-hari warga.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari istilah: Pagu, Belanja Modal, DBH, PSO..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
          {filteredTerms.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Istilah tidak ditemukan. Coba ketik kata kunci lain.
            </div>
          ) : (
            filteredTerms.map((t) => (
              <div
                key={t.term}
                className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2.5 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{t.term}</h3>
                  <span className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                    {t.category}
                  </span>
                </div>

                {/* Plain definition */}
                <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Maksudnya dalam Bahasa Warga:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {t.plainDefinition}
                  </p>
                </div>

                {/* Example */}
                <div className="text-[11px] text-slate-500 flex items-start gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Contoh Nyata:</strong> {t.example}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
