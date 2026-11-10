import React, { useState, useId, useMemo } from 'react';
import { 
  RotateCcw, 
  Car, 
  Wind, 
  GraduationCap, 
  HeartPulse, 
  Building2, 
  Users, 
  TreePine, 
  Wrench, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft,
  Info
} from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

interface CityArchitectSimulatorProps {
  onNavigateHome: () => void;
  onNavigateExplorer: () => void;
}

interface SectorBudget {
  id: string;
  name: string;
  icon: React.ElementType;
  defaultBudget: number; // in Triliun
  currentBudget: number; // in Triliun
  description: string;
  impactArea: string;
  color: string;
}

const TOTAL_APBD = 84.2; // Rp 84,2 Triliun

export default function CityArchitectSimulator({
  onNavigateHome,
  onNavigateExplorer,
}: CityArchitectSimulatorProps) {
  const recommendationCardId = useId();
  // Initial official DKI Jakarta 2026 APBD distribution
  const initialSectors: SectorBudget[] = [
    {
      id: 'pegawai',
      name: 'Belanja Pegawai & Operasional Birokrasi',
      icon: Users,
      defaultBudget: 23.5,
      currentBudget: 23.5,
      description: 'Gaji ASN, guru, tenaga medis, operasional kantor dinas, dan tunjangan kinerja.',
      impactArea: 'Efisiensi Birokrasi',
      color: 'slate',
    },
    {
      id: 'pendidikan',
      name: 'Pendidikan & Beasiswa (KJP/KJMU)',
      icon: GraduationCap,
      defaultBudget: 20.2,
      currentBudget: 20.2,
      description: 'Bantuan KJP Plus, beasiswa mahasiswa KJMU, rehab gedung sekolah, dan BOS.',
      impactArea: 'Kualitas SDM',
      color: 'blue',
    },
    {
      id: 'infrastruktur',
      name: 'Infrastruktur & Transportasi Publik',
      icon: Wrench,
      defaultBudget: 16.0,
      currentBudget: 16.0,
      description: 'Subsidi Transjakarta, MRT/LRT, perbaikan jalan raya, jembatan, dan trotoar.',
      impactArea: 'Kelancaran Lalu Lintas',
      color: 'emerald',
    },
    {
      id: 'kesehatan',
      name: 'Kesehatan, Faskes & Subsidi BPJS PBI',
      icon: HeartPulse,
      defaultBudget: 10.9,
      currentBudget: 10.9,
      description: 'Iuran BPJS warga miskin (PBI), operasional 44 Puskesmas kecamatan, dan obat gratis.',
      impactArea: 'Layanan Kesehatan',
      color: 'rose',
    },
    {
      id: 'bansos',
      name: 'Bantuan Sosial & Perlindungan Warga Rentan',
      icon: Building2,
      defaultBudget: 8.4,
      currentBudget: 8.4,
      description: 'Kartu Lansia Jakarta (KLJ), Kartu Anak Jakarta (KAJ), dan bantuan pangan sembako.',
      impactArea: 'Jaring Pengaman Sosial',
      color: 'amber',
    },
    {
      id: 'lingkungan',
      name: 'Lingkungan Hidup, RTH & Pengendalian Banjir',
      icon: TreePine,
      defaultBudget: 5.2,
      currentBudget: 5.2,
      description: 'Pengerukan kali/waduk, pompa banjir, pengolahan sampah Bantargebang, dan taman kota.',
      impactArea: 'Kualitas Udara & Banjir',
      color: 'teal',
    },
  ];

  const [sectors, setSectors] = useState<SectorBudget[]>(initialSectors);
  const [activePreset, setActivePreset] = useState<'default' | 'eco_transit' | 'human_first'>('default');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Calculate current sum of allocated budget
  const totalAllocated = useMemo(() => {
    return Number(sectors.reduce((sum, s) => sum + s.currentBudget, 0).toFixed(1));
  }, [sectors]);

  const budgetDelta = useMemo(() => {
    return Number((totalAllocated - TOTAL_APBD).toFixed(1));
  }, [totalAllocated]);

  // Handle individual slider change
  const handleBudgetChange = (sectorId: string, newValue: number) => {
    setActivePreset('default');
    setSectors((prev) =>
      prev.map((s) => (s.id === sectorId ? { ...s, currentBudget: Number(newValue.toFixed(1)) } : s))
    );
  };

  // Preset Handlers
  const applyPreset = (preset: 'default' | 'eco_transit' | 'human_first') => {
    setActivePreset(preset);
    if (preset === 'default') {
      setSectors(initialSectors);
    } else if (preset === 'eco_transit') {
      // Prioritaskan Transportasi Publik & Lingkungan, pangkas belanja birokrasi
      setSectors([
        { ...initialSectors[0], currentBudget: 18.0 }, // Pegawai dipangkas 5.5T
        { ...initialSectors[1], currentBudget: 21.0 }, // Pendidikan sedikit naik (+0.8T)
        { ...initialSectors[2], currentBudget: 22.5 }, // Infrastruktur naik drastis (+6.5T)
        { ...initialSectors[3], currentBudget: 11.5 }, // Kesehatan naik (+0.6T)
        { ...initialSectors[4], currentBudget: 7.2 },  // Bansos disesuaikan (-1.2T)
        { ...initialSectors[5], currentBudget: 4.0 },  // Lingkungan naik drastis (+4.0T = 9.2-5.2) -> 9.2
      ]);
    } else if (preset === 'human_first') {
      // Prioritaskan Pendidikan, Gizi, Kesehatan & Bansos
      setSectors([
        { ...initialSectors[0], currentBudget: 17.5 }, // Pegawai dipangkas (-6.0T)
        { ...initialSectors[1], currentBudget: 26.0 }, // Pendidikan naik drastis (+5.8T)
        { ...initialSectors[2], currentBudget: 12.5 }, // Infrastruktur fisik dikurangi (-3.5T)
        { ...initialSectors[3], currentBudget: 14.5 }, // Kesehatan naik (+3.6T)
        { ...initialSectors[4], currentBudget: 12.0 }, // Bansos naik (+3.6T)
        { ...initialSectors[5], currentBudget: 5.7 },  // Lingkungan (+0.5T)
      ]);
    }
  };

  // Helper values for calculations
  const infraBudget = sectors.find((s) => s.id === 'infrastruktur')?.currentBudget || 16.0;
  const lingBudget = sectors.find((s) => s.id === 'lingkungan')?.currentBudget || 5.2;
  const pendBudget = sectors.find((s) => s.id === 'pendidikan')?.currentBudget || 20.2;
  const kesBudget = sectors.find((s) => s.id === 'kesehatan')?.currentBudget || 10.9;
  const pegBudget = sectors.find((s) => s.id === 'pegawai')?.currentBudget || 23.5;

  // Predictive Metric 1: Kemacetan Jakarta (Baseline: 53%)
  const trafficIndex = useMemo(() => {
    const diff = infraBudget - 16.0;
    const calculated = 53 - diff * 1.8;
    return Math.max(28, Math.min(75, Math.round(calculated)));
  }, [infraBudget]);

  // Predictive Metric 2: Indeks Kualitas Udara / AQI Jakarta (Baseline: 142)
  const aqiIndex = useMemo(() => {
    const lingDiff = lingBudget - 5.2;
    const infraDiff = infraBudget - 16.0;
    const calculated = 142 - (lingDiff * 7 + infraDiff * 3);
    return Math.max(65, Math.min(190, Math.round(calculated)));
  }, [lingBudget, infraBudget]);

  // Predictive Metric 3: Rasio Efisiensi Anggaran Publik vs Gaji Birokrasi
  const publicSpendingRatio = useMemo(() => {
    const publicTotal = totalAllocated - pegBudget;
    return Math.round((publicTotal / (totalAllocated || 1)) * 100);
  }, [totalAllocated, pegBudget]);

  // Predictive Metric 4: Kapasitas Layanan Kesehatan & Beasiswa
  const educationGrowth = useMemo(() => {
    const diff = pendBudget - 20.2;
    return Math.round((diff / 20.2) * 100);
  }, [pendBudget]);

  const healthcareGrowth = useMemo(() => {
    const diff = kesBudget - 10.9;
    return Math.round((diff / 10.9) * 100);
  }, [kesBudget]);

  // Export Recommendation PNG
  const exportRecommendation = async () => {
    setIsExporting(true);
    try {
      const card = document.getElementById(recommendationCardId);
      if (!card) return;

      const canvas = await html2canvas(card, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Rancangan-Anggaran-Warga-ANGIN-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Gagal mengekspor gambar rekomendasi:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Recommendation Text
  const copyRecommendationText = () => {
    const text = `[RANCANGAN ANGGARAN WARGA JAKARTA 2026 - ANGIN.id]
Total Alokasi Rancangan: Rp ${totalAllocated} T (Status: ${budgetDelta === 0 ? 'Seimbang 100%' : budgetDelta > 0 ? `Defisit +Rp ${budgetDelta} T` : `Sisa Kas -Rp ${Math.abs(budgetDelta)} T`})

Rincian Prioritas Warga:
- Pendidikan & Beasiswa: Rp ${pendBudget} T (${Math.round((pendBudget / TOTAL_APBD) * 100)}%)
- Infrastruktur & Transit Publik: Rp ${infraBudget} T (${Math.round((infraBudget / TOTAL_APBD) * 100)}%)
- Belanja Operasional Birokrasi: Rp ${pegBudget} T (${Math.round((pegBudget / TOTAL_APBD) * 100)}%)
- Kesehatan & Faskes BPJS: Rp ${kesBudget} T (${Math.round((kesBudget / TOTAL_APBD) * 100)}%)
- Bantuan Sosial Warga Rentan: Rp ${sectors.find(s => s.id === 'bansos')?.currentBudget} T
- Pengendalian Banjir & RTH: Rp ${lingBudget} T

Proyeksi Dampak:
- Indeks Kemacetan: ${trafficIndex}% (Standar Pemprov: 53%)
- Indeks Polusi Udara (AQI): ${aqiIndex} (Standar Pemprov: 142)
- Rasio Belanja Layanan Publik: ${publicSpendingRatio}% dari APBD

Dibuat melalui simulator partisipatif ANGIN (Anggaran Indonesia) #SuaraWargaANGIN #KawalAPBD`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Simulasi Alokasi Warga</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-[-0.02em]">
            Rancang Prioritas APBD DKI Jakarta 2026
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Jika kamu memegang kendali atas alokasi anggaran belanja daerah sebesar{' '}
            <strong className="text-slate-900 font-bold tabular-nums">Rp 84,2 Triliun</strong>, sektor mana yang ingin kamu prioritaskan? Geser anggaran sektor di bawah dan amati proyeksi dampaknya secara langsung.
          </p>
        </div>

        {/* Quick Action Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('default')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
              activePreset === 'default'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Alokasi Resmi 2026</span>
          </button>

          <button
            onClick={() => applyPreset('eco_transit')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
              activePreset === 'eco_transit'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Fokus Transportasi &amp; Lingkungan</span>
          </button>

          <button
            onClick={() => applyPreset('human_first')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
              activePreset === 'human_first'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Fokus Pendidikan &amp; Bansos</span>
          </button>
        </div>
      </div>

      {/* TOP LIVE STATUS BAR (BUDGET METER & PREDICTIVE METRICS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Total Budget Constraint Box */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Batas Kapasitas Kas APBD DKI Jakarta</span>
              <span className="font-bold text-slate-800 tabular-nums">Kapasitas: Rp 84,2 T</span>
            </div>

            <div className="flex items-baseline justify-between mt-2 mb-3">
              <div>
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  Rp {totalAllocated.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500 ml-1">Triliun Teralokasi</span>
              </div>

              {budgetDelta === 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Seimbang 100%</span>
                </span>
              ) : budgetDelta > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Defisit +Rp {budgetDelta.toFixed(1)} T</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  <Info className="w-3.5 h-3.5" />
                  <span>Sisa Dana Rp {Math.abs(budgetDelta).toFixed(1)} T</span>
                </span>
              )}
            </div>

            {/* Visual Budget Constraint Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex border border-slate-200">
              {sectors.map((s) => {
                const widthPct = (s.currentBudget / TOTAL_APBD) * 100;
                const colorClass = 
                  s.id === 'pegawai' ? 'bg-slate-400' :
                  s.id === 'pendidikan' ? 'bg-blue-500' :
                  s.id === 'infrastruktur' ? 'bg-emerald-500' :
                  s.id === 'kesehatan' ? 'bg-rose-500' :
                  s.id === 'bansos' ? 'bg-amber-500' : 'bg-teal-500';

                return (
                  <div
                    key={s.id}
                    style={{ width: `${Math.max(0, widthPct)}%` }}
                    className={`${colorClass} transition-[width] duration-300`}
                    title={`${s.name}: Rp ${s.currentBudget} T (${((s.currentBudget/TOTAL_APBD)*100).toFixed(1)}%)`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Rasio Belanja Layanan Publik: <strong className="text-slate-800 font-bold tabular-nums">{publicSpendingRatio}%</strong></span>
            <span className="text-emerald-700 font-medium">Birokrasi Ramping: {100 - publicSpendingRatio}%</span>
          </div>
        </div>

        {/* Right: Live Predictive City Impact Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Card 1: Traffic Index */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-600">Kemacetan</span>
              <Car className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums font-mono">
                {trafficIndex}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {trafficIndex <= 45 ? (
                  <span className="text-emerald-700 font-bold">Lancar & Terintegrasi</span>
                ) : trafficIndex >= 60 ? (
                  <span className="text-rose-700 font-bold">Macet Kronis</span>
                ) : (
                  <span>Standar DKI (53%)</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Air Quality Index */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-600">Polusi (AQI)</span>
              <Wind className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums font-mono">
                {aqiIndex}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {aqiIndex <= 100 ? (
                  <span className="text-emerald-700 font-bold">Kategori Sedang / Sehat</span>
                ) : (
                  <span className="text-rose-700 font-bold">Udara Tidak Sehat</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Education & Scholarship Boost */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-600">Beasiswa KJP</span>
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums font-mono">
                {educationGrowth >= 0 ? `+${educationGrowth}%` : `${educationGrowth}%`}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {educationGrowth > 10 ? (
                  <span className="text-blue-700 font-bold">Cakupan KJP Penuh</span>
                ) : educationGrowth < 0 ? (
                  <span className="text-amber-700 font-bold">Kuota Terpangkas</span>
                ) : (
                  <span>Sesuai Eksisting</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Healthcare Reach */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-600">Layanan Faskes</span>
              <HeartPulse className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums font-mono">
                {healthcareGrowth >= 0 ? `+${healthcareGrowth}%` : `${healthcareGrowth}%`}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {healthcareGrowth > 10 ? (
                  <span className="text-rose-700 font-bold">Puskesmas 24 Jam Full</span>
                ) : (
                  <span>Kapasitas Standar</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SECTOR SLIDERS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Penyesuaian Anggaran 6 Sektor Utama
            </h2>
            <p className="text-xs text-slate-500">
              Geser slider atau atur nilai triliun rupiah di setiap sektor untuk melihat pergeseran alokasi belanja kota.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Total Harus Tepat Rp 84,2 Triliun</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            const percentage = ((sector.currentBudget / TOTAL_APBD) * 100).toFixed(1);
            const deltaFromDefault = (sector.currentBudget - sector.defaultBudget).toFixed(1);

            return (
              <div
                key={sector.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {sector.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {sector.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-extrabold text-slate-900 tabular-nums">
                      Rp {sector.currentBudget.toFixed(1)} T
                    </div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      {percentage}% APBD
                    </div>
                  </div>
                </div>

                {/* Slider Input */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Rp 2,0 T</span>
                    <span className="text-slate-600 font-semibold tabular-nums">
                      {Number(deltaFromDefault) === 0 ? (
                        'Sesuai APBD Resmi'
                      ) : Number(deltaFromDefault) > 0 ? (
                        <span className="text-emerald-700 font-bold">+Rp {deltaFromDefault} T dari resmi</span>
                      ) : (
                        <span className="text-rose-700 font-bold">-Rp {Math.abs(Number(deltaFromDefault))} T dari resmi</span>
                      )}
                    </span>
                    <span>Rp 35,0 T</span>
                  </div>

                  <input
                    type="range"
                    min={2.0}
                    max={35.0}
                    step={0.1}
                    value={sector.currentBudget}
                    onChange={(e) => handleBudgetChange(sector.id, parseFloat(e.target.value))}
                    className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECOMMENDATION CARD EXPORT SECTION */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <Share2 className="w-3.5 h-3.5" />
              <span>Aksi Nyata Warga Jakarta</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Simpan &amp; Bagikan Hasil Rancangan Anggaran Warga
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Jadikan hasil simulasi ini sebagai bahan masukan warga dalam pra-Musyawarah Perencanaan Pembangunan (Musrenbang) atau suarakan di media sosial untuk mendorong transparansi belanja kota.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={copyRecommendationText}
              className="bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copySuccess ? 'Tersalin ke Clipboard!' : 'Salin Teks Advokasi'}</span>
            </button>

            <button
              onClick={exportRecommendation}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Memproses Gambar...' : 'Unduh Lembar Rekomendasi (PNG)'}</span>
            </button>
          </div>
        </div>

        {/* Printable / Capturable Visual Recommendation Card */}
        <div 
          id={recommendationCardId}
          className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
        >
          {/* Header Card */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-base tracking-tight text-slate-900">ANGIN.id</span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Rancangan Anggaran Partisipatif
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Prioritas Pembangunan DKI Jakarta 2026 Pilihan Warga
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Disusun oleh Warga Jakarta melalui simulasi anggaran publik di platform ANGIN.
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs font-medium text-slate-500">Pagu Total</div>
              <div className="text-xl font-bold text-slate-900 tabular-nums font-mono">
                Rp {totalAllocated.toFixed(1)} T
              </div>
              <div className="text-xs text-slate-400">
                {budgetDelta === 0 ? 'Seimbang 100%' : budgetDelta > 0 ? `Defisit +Rp ${budgetDelta} T` : `Surplus Kas Rp ${Math.abs(budgetDelta)} T`}
              </div>
            </div>
          </div>

          {/* Allocation Breakdown Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sectors.map((s) => (
              <div key={s.id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                <div className="text-xs font-semibold text-slate-700 truncate">{s.name}</div>
                <div className="text-base font-bold text-slate-900 tabular-nums font-mono mt-1">
                  Rp {s.currentBudget.toFixed(1)} T
                </div>
                <div className="text-xs text-slate-500 tabular-nums font-mono">
                  {((s.currentBudget / TOTAL_APBD) * 100).toFixed(1)}% dari total APBD
                </div>
              </div>
            ))}
          </div>

          {/* Projected Outcomes Grid */}
          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-4">
            <div className="text-xs font-bold text-emerald-900 mb-2">
              Proyeksi Dampak Sosial &amp; Kualitas Hidup Warga:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-950">
              <div>
                <span className="text-slate-600 block text-xs">Indeks Kemacetan:</span>
                <strong className="text-sm font-bold tabular-nums font-mono text-emerald-900">{trafficIndex}%</strong>
                <span className="text-xs text-slate-500 block">Baseline Jakarta: 53%</span>
              </div>
              <div>
                <span className="text-slate-600 block text-xs">Kualitas Udara (AQI):</span>
                <strong className="text-sm font-bold tabular-nums font-mono text-emerald-900">{aqiIndex}</strong>
                <span className="text-xs text-slate-500 block">Baseline Jakarta: 142</span>
              </div>
              <div>
                <span className="text-slate-600 block text-xs">Fasilitas Warga vs Operasional Kantor:</span>
                <strong className="text-sm font-bold tabular-nums font-mono text-emerald-900">{publicSpendingRatio}% : {100 - publicSpendingRatio}%</strong>
                <span className="text-xs text-slate-500 block">Alokasi langsung ke warga</span>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>Diterbitkan melalui <strong>angin.id</strong> • Hak Inisiatif Keterbukaan Publik</span>
            <span>Web In Action (WIA) 2026</span>
          </div>
        </div>
      </div>

      {/* EXPLORE REAL DATA CALLOUT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Ingin membandingkan dengan data APBD asli Pemprov DKI?</h4>
          <p className="text-xs text-slate-500 mt-0.5">Telusuri aliran Rp 84,2 Triliun hingga ke level sub-program dan bukti fisik proyek di lapangan.</p>
        </div>
        <button
          onClick={onNavigateExplorer}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px] flex-shrink-0"
        >
          <span>Buka Pohon Alur APBD</span>
        </button>
      </div>
    </div>
  );
}
