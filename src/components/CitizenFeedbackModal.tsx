import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ThumbsUp, 
  MapPin, 
  Sparkles, 
  MessageSquare, 
  Filter, 
  Check, 
  Copy,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CitizenFeedbackItem {
  id: string;
  category: 'usulan' | 'laporan' | 'pertanyaan';
  wilayah: string;
  locationDetail: string;
  title: string;
  description: string;
  author: string;
  supportCount: number;
  status: 'Terkirim' | 'Masuk Risalah Musrenbang' | 'Diteruskan ke Dinas Terkait' | 'Ditinjau Bappeda DKI';
  date: string;
  hasSupported?: boolean;
}

interface CitizenFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'usulan' | 'laporan' | 'pertanyaan';
  defaultProjectTitle?: string;
}

const STORAGE_KEY = 'angin_citizen_aspirations_v1';

const INITIAL_ASPIRATIONS: CitizenFeedbackItem[] = [
  {
    id: 'ASP-2026-0812',
    category: 'laporan',
    wilayah: 'Jakarta Selatan',
    locationDetail: 'Jl. TB Simatupang & Simpang Fatmawati',
    title: 'Galian Saluran Air Terbengkalai dan Menyebabkan Penyempitan Jalan',
    description: 'Pekerjaan galian pipa dan saluran di TB Simatupang terpantau sepi aktivitas pada siang hari dan menyisakan penyempitan jalan. Mohon dinas terkait meninjau jadwal pelaksana kontrak.',
    author: 'Warga Pasar Minggu',
    supportCount: 42,
    status: 'Diteruskan ke Dinas Terkait',
    date: '2 hari lalu',
    hasSupported: false,
  },
  {
    id: 'ASP-2026-0794',
    category: 'usulan',
    wilayah: 'Jakarta Timur',
    locationDetail: 'Kec. Pulogadung & Cipinang',
    title: 'Penambahan Penerangan Jalan LED Hemat Energi di Sekitar Underpass',
    description: 'Kami mengusulkan alokasi APBD perubahan memasukkan penambahan 20 titik lampu jalan LED di bawah kolong jalan layang dan underpass demi keselamatan pengendara motor dan pejalan kaki malam hari.',
    author: 'Forum RW 04 Cipinang',
    supportCount: 68,
    status: 'Masuk Risalah Musrenbang',
    date: '4 hari lalu',
    hasSupported: false,
  },
  {
    id: 'ASP-2026-0751',
    category: 'pertanyaan',
    wilayah: 'Jakarta Barat',
    locationDetail: 'Kel. Rawa Buaya, Cengkareng',
    title: 'Klarifikasi Mekanisme Verifikasi DTKS untuk Penerima Beasiswa KJP',
    description: 'Bagaimana warga dapat memantau keterbukaan hasil seleksi desil penerima KJP Plus di kelurahan agar bantuan benar-benar diterima siswa prasejahtera yang berhak?',
    author: 'Ibu Rahayu',
    supportCount: 29,
    status: 'Ditinjau Bappeda DKI',
    date: '1 minggu lalu',
    hasSupported: false,
  },
  {
    id: 'ASP-2026-0720',
    category: 'usulan',
    wilayah: 'Jakarta Utara',
    locationDetail: 'Muara Baru, Penjaringan',
    title: 'Prioritas Anggaran Perkuatan Tanggul Rob dan Pompa Cadangan',
    description: 'Saat siklus pasang laut tinggi, air laut merembes ke gang pemukiman. Mohon belanja modal SDA memprioritaskan peremajaan pompa mobile berkapasitas 500 liter/detik.',
    author: 'Komunitas Nelayan Pesisir',
    supportCount: 85,
    status: 'Diteruskan ke Dinas Terkait',
    date: '1 minggu lalu',
    hasSupported: false,
  },
];

export const CitizenFeedbackModal: React.FC<CitizenFeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'usulan',
  defaultProjectTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'feed'>('submit');
  const [aspirations, setAspirations] = useState<CitizenFeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_ASPIRATIONS;
  });

  // Form State
  const [category, setCategory] = useState<'usulan' | 'laporan' | 'pertanyaan'>(defaultCategory);
  const [wilayah, setWilayah] = useState<string>('Jakarta Selatan');
  const [locationDetail, setLocationDetail] = useState<string>('');
  const [title, setTitle] = useState<string>(defaultProjectTitle ? `Aduan terkait: ${defaultProjectTitle}` : '');
  const [description, setDescription] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState<boolean>(false);

  // Filter state for Feed
  const [feedFilterWilayah, setFeedFilterWilayah] = useState<string>('Semua');
  const [feedFilterCategory, setFeedFilterCategory] = useState<string>('Semua');

  useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
    if (defaultProjectTitle) setTitle(`Aduan terkait: ${defaultProjectTitle}`);
  }, [defaultCategory, defaultProjectTitle]);

  // Persist aspirations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(aspirations));
    } catch {
      // ignore storage errors
    }
  }, [aspirations]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicketId = `ASP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newItem: CitizenFeedbackItem = {
      id: newTicketId,
      category,
      wilayah,
      locationDetail: locationDetail.trim() || wilayah,
      title: title.trim(),
      description: description.trim(),
      author: author.trim() || 'Warga Jakarta (Anonim)',
      supportCount: 1,
      status: 'Terkirim',
      date: 'Baru saja',
      hasSupported: true,
    };

    setAspirations([newItem, ...aspirations]);
    setSubmittedTicket(newTicketId);

    // Fire confetti celebration
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#059669', '#10b981', '#3b82f6', '#f59e0b'],
    });
  };

  const handleSupport = (id: string) => {
    setAspirations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const supported = !item.hasSupported;
          return {
            ...item,
            hasSupported: supported,
            supportCount: supported ? item.supportCount + 1 : Math.max(0, item.supportCount - 1),
          };
        }
        return item;
      })
    );
  };

  const handleCopyTicket = (ticket: string) => {
    navigator.clipboard.writeText(ticket);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocationDetail('');
    setAuthor('');
    setSubmittedTicket(null);
  };

  const wilayahOptions = [
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Timur',
    'Jakarta Utara',
    'Kepulauan Seribu',
  ];

  const filteredAspirations = aspirations.filter((item) => {
    const matchWilayah = feedFilterWilayah === 'Semua' || item.wilayah === feedFilterWilayah;
    const matchCategory = feedFilterCategory === 'Semua' || item.category === feedFilterCategory;
    return matchWilayah && matchCategory;
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
          aria-label="Tutup jendela aspirasi warga"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kanal Partisipasi Publik Warga</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kotak Suara &amp; Aspirasi APBD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Sampaikan usulan kebutuhan fasilitas, laporkan proyek yang bermasalah di sekitarmu, atau dukung aspirasi warga lain untuk diperjuangkan dalam Musrenbang.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-5 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('submit');
              if (submittedTicket) resetForm();
            }}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'submit'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Kirim Aspirasi Baru</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'feed'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Radar Aspirasi Warga ({aspirations.length})</span>
          </button>
        </div>

        {/* TAB 1: SUBMIT FORM */}
        {activeTab === 'submit' && (
          <div>
            {submittedTicket ? (
              /* Success Confirmation Card */
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Aspirasimu Berhasil Diterbitkan!</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                    Suaramu telah masuk ke radar publik ANGIN dan dicatat dengan nomor pengawasan warga:
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 font-mono font-bold text-sm text-emerald-800 mt-3 shadow-xs">
                    <span>{submittedTicket}</span>
                    <button
                      onClick={() => handleCopyTicket(submittedTicket)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Salin nomor tiket"
                    >
                      {copiedTicket ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('feed')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition cursor-pointer min-h-[44px]"
                  >
                    <span>Lihat di Radar Aspirasi Warga</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    onClick={resetForm}
                    className="w-full sm:w-auto text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 cursor-pointer"
                  >
                    Kirim Aspirasi Lainnya
                  </button>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* 1. Category Selector */}
                <div>
                  <label className="block font-bold text-slate-800 mb-2">Pilih Jenis Partisipasi:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory('usulan')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer min-h-[50px] ${
                        category === 'usulan'
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Usulan Anggaran</div>
                        <div className="text-[10px] text-slate-500">Usul fasilitas baru / rehab</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('laporan')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer min-h-[50px] ${
                        category === 'laporan'
                          ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Laporan Proyek</div>
                        <div className="text-[10px] text-slate-500">Proyek molor / jalan rusak</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('pertanyaan')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer min-h-[50px] ${
                        category === 'pertanyaan'
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">Pertanyaan APBD</div>
                        <div className="text-[10px] text-slate-500">Tanya transparansi data</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Wilayah & Location Detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Wilayah Kota Administrasi:</label>
                    <select
                      value={wilayah}
                      onChange={(e) => setWilayah(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[44px]"
                    >
                      {wilayahOptions.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Lokasi / Nama Jalan / RW (Opsional):</label>
                    <input
                      type="text"
                      placeholder="Contoh: Jl. RS Fatmawati / RW 05"
                      value={locationDetail}
                      onChange={(e) => setLocationDetail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[44px]"
                    />
                  </div>
                </div>

                {/* 3. Title */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Judul Aspirasi / Pokok Masalah:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Perbaikan Saluran Drainase Pencegah Genangan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[44px]"
                  />
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Penjelasan Detail Kebutuhan Warga:</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Jelaskan kondisi di lapangan, seberapa sering masalah terjadi, dan apa harapan warga terhadap anggaran pemerintah..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                </div>

                {/* 5. Author Name */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Nama / Inisial Pengirim (Boleh Anonim):</label>
                  <input
                    type="text"
                    placeholder="Contoh: Warga Tebet / Anonim"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[44px]"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    Privasi Anda terjaga. Masukan ini akan dimasukkan ke radar advokasi masyarakat terbuka.
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition cursor-pointer min-h-[44px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Terbitkan Aspirasi ke Radar Publik</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: LIVE FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-600 text-[11px]">Filter:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={feedFilterWilayah}
                  onChange={(e) => setFeedFilterWilayah(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-700"
                >
                  <option value="Semua">Semua Wilayah</option>
                  {wilayahOptions.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>

                <select
                  value={feedFilterCategory}
                  onChange={(e) => setFeedFilterCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-700"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="usulan">Usulan Anggaran</option>
                  <option value="laporan">Laporan Proyek</option>
                  <option value="pertanyaan">Pertanyaan APBD</option>
                </select>
              </div>
            </div>

            {/* List of Aspirations */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredAspirations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Belum ada aspirasi yang sesuai dengan filter wilayah atau kategori ini.
                </div>
              ) : (
                filteredAspirations.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                        <span className={`font-bold px-2 py-0.5 rounded-full ${
                          item.category === 'usulan'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.category === 'laporan'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.category === 'usulan' ? 'Usulan Warga' : item.category === 'laporan' ? 'Laporan Proyek' : 'Pertanyaan'}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">{item.date}</span>
                      </div>

                      {/* Status Badge */}
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{item.status}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{item.locationDetail} ({item.wilayah})</span>
                        <span className="mx-1">•</span>
                        <span className="italic">{item.author}</span>
                      </div>

                      {/* Support / Upvote Button */}
                      <button
                        onClick={() => handleSupport(item.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer min-h-[36px] ${
                          item.hasSupported
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title="Klik untuk mendukung aspirasi ini"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${item.hasSupported ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.supportCount} Dukungan</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Aspirasi dengan dukungan terbanyak dikompilasi menjadi dokumen masukan warga untuk pra-Musrenbang DKI Jakarta.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
