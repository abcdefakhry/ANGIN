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
  Building2,
  Camera,
  UploadCloud,
  Trash2,
  ZoomIn,
  Loader2,
  RotateCcw
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
  imageUrl?: string;
}

interface CitizenFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'usulan' | 'laporan' | 'pertanyaan';
  defaultProjectTitle?: string;
}

const STORAGE_KEY = 'angin_citizen_aspirations_v2';
const LEGACY_STORAGE_KEY = 'angin_citizen_aspirations_v1';

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
    imageUrl: '/images/aspirasi/bukti-galian-saluran.jpg',
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
    imageUrl: '/images/aspirasi/bukti-underpass-gelap.jpg',
  },
  {
    id: 'ASP-2026-0751',
    category: 'pertanyaan',
    wilayah: 'Jakarta Barat',
    locationDetail: 'Kel. Rawa Buaya, Cengkareng',
    title: 'Klarifikasi Verifikasi Data Warga Miskin (DTKS) untuk Penerima Beasiswa KJP',
    description: 'Bagaimana warga dapat memantau transparansi data penerima KJP Plus di kelurahan agar bantuan benar-benar diterima siswa yang membutuhkan?',
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
    imageUrl: '/images/aspirasi/bukti-tanggul-rob.jpg',
  },
];

/**
 * Client-side HTML5 Canvas Image Compression (Option 1)
 * Resizes image to max 900x900 and exports as JPEG quality 0.75 (~60-100 KB)
 * Safely stored in localStorage without exceeding quotas or requiring external backend.
 */
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Berkas harus berupa gambar (JPG, PNG, WebP)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal memproses kanvas gambar'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Format berkas gambar tidak dapat dibaca'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas'));
    reader.readAsDataURL(file);
  });
};

export const CitizenFeedbackModal: React.FC<CitizenFeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'usulan',
  defaultProjectTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'feed'>('submit');
  const [aspirations, setAspirations] = useState<CitizenFeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CitizenFeedbackItem[];
        // Backfill imageUrl from INITIAL_ASPIRATIONS if missing for matching initial dummy items
        return parsed.map((item) => {
          const initMatch = INITIAL_ASPIRATIONS.find((init) => init.id === item.id);
          if (initMatch?.imageUrl && !item.imageUrl) {
            return { ...item, imageUrl: initMatch.imageUrl };
          }
          return item;
        });
      }
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);
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
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, [aspirations]);

  const handleResetToDefault = () => {
    setAspirations(INITIAL_ASPIRATIONS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASPIRATIONS));
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setImageError('Ukuran berkas asli maksimal 15 MB');
      return;
    }

    setImageError(null);
    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      setUploadedImage(compressed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses gambar';
      setImageError(msg);
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageError(null);
  };

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
      imageUrl: uploadedImage || undefined,
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
    setUploadedImage(null);
    setImageError(null);
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
            Sampaikan usulan kebutuhan fasilitas, laporkan proyek yang bermasalah di sekitarmu, atau dukung aspirasi warga lain untuk diperjuangkan dalam perencanaan anggaran kota (Musrenbang).
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

                {/* 5. Upload Foto Bukti Lapangan (Client-side HTML5 Canvas Compression) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Foto Bukti Lapangan (Opsional):</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Kompresi otomatis Canvas (~80 KB)
                    </span>
                  </div>

                  {uploadedImage ? (
                    <div className="relative rounded-xl border border-emerald-300 bg-emerald-50/40 p-3 flex items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={uploadedImage} 
                          alt="Pratinjau Bukti" 
                          className="w-16 h-16 rounded-lg object-cover border border-emerald-200 shadow-2xs flex-shrink-0 cursor-pointer"
                          onClick={() => setZoomImage({ url: uploadedImage, title: title || 'Pratinjau Bukti Lapangan' })}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">Foto siap dilampirkan</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Telah dikompresi ringan di peramban, aman disimpan di memori.
                          </p>
                          <button
                            type="button"
                            onClick={() => setZoomImage({ url: uploadedImage, title: title || 'Pratinjau Bukti Lapangan' })}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 mt-1 cursor-pointer"
                          >
                            <ZoomIn className="w-3 h-3" />
                            <span>Perbesar foto</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer flex-shrink-0"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20 rounded-xl p-4 cursor-pointer transition text-center group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isCompressing}
                          className="sr-only"
                        />
                        {isCompressing ? (
                          <div className="flex items-center gap-2 text-emerald-700 py-1">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="font-semibold text-xs">Mengompresi resolusi foto via Canvas...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:border-emerald-300 transition mb-2">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <div className="font-bold text-xs text-slate-700 group-hover:text-emerald-800">
                              Klik untuk pilih foto jalan berlubang, gorong-gorong, atau fasilitas
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              JPG, PNG, atau WebP • Otomatis diperkecil agar hemat memori lokal
                            </div>
                          </>
                        )}
                      </label>

                      {imageError && (
                        <div className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{imageError}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 6. Author Name */}
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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-600 text-[11px]">Filter:</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-700 transition cursor-pointer"
                  title="Muat ulang 4 data aspirasi bawaan lengkap dengan foto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Data Demo</span>
                </button>
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

                    {/* Image Attachment in Feed (Click to Zoom Lightbox) */}
                    {item.imageUrl && (
                      <div 
                        onClick={() => setZoomImage({ url: item.imageUrl!, title: item.title })}
                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group cursor-pointer max-h-48 shadow-2xs"
                      >
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-44 object-cover object-center group-hover:scale-102 transition duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-semibold">
                          <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                            <Camera className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Foto Bukti Lapangan</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg hover:bg-white/30 transition">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>Perbesar</span>
                          </span>
                        </div>
                      </div>
                    )}

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

      {/* LIGHTBOX MODAL FOR IMAGES */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setZoomImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Tutup pratinjau foto"
            >
              <X className="w-6 h-6" />
            </button>

            <img 
              src={zoomImage.url} 
              alt={zoomImage.title}
              className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10" 
            />

            <div className="mt-3 text-center text-white text-xs sm:text-sm font-semibold bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 max-w-xl">
              {zoomImage.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
