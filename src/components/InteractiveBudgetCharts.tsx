import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Layers, 
  Calendar, 
  Info, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Data Tren APBD DKI Jakarta 3 Tahun (dalam Triliun Rupiah)
interface YearSectorData {
  year: string;
  total: number;
  pendidikan: number;
  infrastruktur: number;
  pegawai: number;
  kesehatan: number;
  bansos: number;
  lingkungan: number;
}

const MULTI_YEAR_DATA: YearSectorData[] = [
  {
    year: '2024',
    total: 79.5,
    pendidikan: 17.8,
    infrastruktur: 14.2,
    pegawai: 22.8,
    kesehatan: 9.8,
    bansos: 7.8,
    lingkungan: 4.6,
  },
  {
    year: '2025',
    total: 81.7,
    pendidikan: 19.1,
    infrastruktur: 15.1,
    pegawai: 23.1,
    kesehatan: 10.4,
    bansos: 8.1,
    lingkungan: 4.9,
  },
  {
    year: '2026',
    total: 84.2,
    pendidikan: 20.2,
    infrastruktur: 16.0,
    pegawai: 23.5,
    kesehatan: 10.9,
    bansos: 8.4,
    lingkungan: 5.2,
  },
];

// Data Porsi 6 Sektor APBD 2026 untuk Donut Chart
const SECTORS_2026_DONUT = [
  { name: 'Pegawai & Birokrasi', key: 'pegawai', value: 23.5, percentage: 28, color: '#64748b', humanImpact: 'Gaji nakes, guru, ASN dan biaya operasional kantor dinas.' },
  { name: 'Pendidikan & KJP', key: 'pendidikan', value: 20.2, percentage: 24, color: '#3b82f6', humanImpact: 'Bantuan 840.000 siswa KJP Plus & beasiswa mahasiswa KJMU.' },
  { name: 'Infrastruktur & Transit', key: 'infrastruktur', value: 16.0, percentage: 19, color: '#059669', humanImpact: '350 km aspal jalan, drainase air, & subsidi tarif bus/MRT.' },
  { name: 'Kesehatan & BPJS PBI', key: 'kesehatan', value: 10.9, percentage: 13, color: '#e11d48', humanImpact: '5,2 juta warga gratis berobat di Puskesmas & premi BPJS.' },
  { name: 'Bansos & Warga Rentan', key: 'bansos', value: 8.4, percentage: 10, color: '#d97706', humanImpact: 'Kartu Lansia Jakarta (KLJ) & sembako pangan bersubsidi.' },
  { name: 'Lingkungan & RTH', key: 'lingkungan', value: 5.2, percentage: 6, color: '#0d9488', humanImpact: 'Pengolahan sampah Bantargebang & pemeliharaan 324 RPTRA.' },
];

// Data Komposisi Jenis Belanja (Standar Akuntansi Pemerintah)
const EXPENDITURE_TYPES = [
  { type: 'Belanja Pegawai & Gaji', budget: 23.5, pct: 28, desc: 'Gaji pokok, tunjangan guru, tenaga kesehatan, dan aparatur dinas.' },
  { type: 'Belanja Barang & Jasa', budget: 19.1, pct: 23, desc: 'Pemeliharaan AC, sewa server, konsumsi rapat dinas, dan utilitas kantor.' },
  { type: 'Belanja Modal (Fasilitas Fisik)', budget: 21.8, pct: 26, desc: 'Pembangunan jalan, jembatan, gedung sekolah, rumah pompa, dan trotoar.' },
  { type: 'Belanja Bantuan Sosial & Subsidi', budget: 18.9, pct: 22, desc: 'KJP Plus, KJMU, Kartu Lansia Jakarta, dan subsidi PSO Transjakarta.' },
  { type: 'Belanja Tidak Terduga (BTT)', budget: 0.9, pct: 1, desc: 'Dana darurat bencana alam, kebakaran, dan tanggap darurat kota.' },
];

interface InteractiveBudgetChartsProps {
  onSelectSector?: (sectorKey: string) => void;
  onOpenGlossary?: () => void;
}

export const InteractiveBudgetCharts: React.FC<InteractiveBudgetChartsProps> = ({
  onSelectSector,
  onOpenGlossary,
}) => {
  const [chartMode, setChartMode] = useState<'trends' | 'donut' | 'categories'>('trends');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [activeDonutIndex, setActiveDonutIndex] = useState<number>(1); // Default Pendidikan

  // Filtered Trend Data
  const trendData = useMemo(() => {
    if (selectedYear === 'all') return MULTI_YEAR_DATA;
    return MULTI_YEAR_DATA.filter((d) => d.year === selectedYear);
  }, [selectedYear]);

  // Sector Visibility Toggles for Multi-Year Bar Chart
  const [visibleSectors, setVisibleSectors] = useState<{ [key: string]: boolean }>({
    pendidikan: true,
    infrastruktur: true,
    pegawai: true,
    kesehatan: true,
    bansos: false,
    lingkungan: false,
  });

  const toggleSector = (key: string) => {
    setVisibleSectors((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeDonutSector = SECTORS_2026_DONUT[activeDonutIndex] || SECTORS_2026_DONUT[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xs">
      {/* Top Header & Visual Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Grafik Visualisasi Interaktif APBD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Eksplorasi Analitik Anggaran DKI Jakarta
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Pilah dan bandingkan alokasi belanja berdasarkan tahun anggaran, porsi sektor, dan jenis belanja secara dinamis.
          </p>
        </div>

        {/* View Switcher Buttons (Mobile-friendly min-h-[44px]) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setChartMode('trends')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
              chartMode === 'trends'
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tren Multi-Tahun</span>
          </button>

          <button
            onClick={() => setChartMode('donut')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
              chartMode === 'donut'
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Porsi 6 Sektor</span>
          </button>

          <button
            onClick={() => setChartMode('categories')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
              chartMode === 'categories'
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Jenis Belanja</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: TREN MULTI-TAHUN (2024 - 2026) BAR CHART */}
      {/* ======================================================== */}
      {chartMode === 'trends' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-slate-700">Tahun Anggaran:</span>
              <div className="flex gap-1">
                {(['all', '2024', '2025', '2026'] as const).map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer min-h-[36px] ${
                      selectedYear === y
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {y === 'all' ? 'Semua (2024-2026)' : y}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Glossary Shortcut */}
            {onOpenGlossary && (
              <button
                onClick={onOpenGlossary}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-xs cursor-pointer min-h-[36px]"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Kamus Istilah APBD Warga</span>
              </button>
            )}
          </div>

          {/* Sector Toggles */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-500">Tampilkan Sektor:</span>
            {[
              { key: 'pendidikan', label: 'Pendidikan', color: '#3b82f6' },
              { key: 'infrastruktur', label: 'Infrastruktur', color: '#059669' },
              { key: 'pegawai', label: 'Birokrasi/Gaji', color: '#64748b' },
              { key: 'kesehatan', label: 'Kesehatan', color: '#e11d48' },
              { key: 'bansos', label: 'Bansos', color: '#d97706' },
              { key: 'lingkungan', label: 'Lingkungan', color: '#0d9488' },
            ].map((sec) => {
              const isVisible = visibleSectors[sec.key];
              return (
                <button
                  key={sec.key}
                  onClick={() => toggleSector(sec.key)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer min-h-[34px] text-[11px] font-medium ${
                    isVisible
                      ? 'bg-white text-slate-900 border-slate-300 font-bold shadow-2xs'
                      : 'bg-slate-100/60 text-slate-400 border-transparent opacity-60'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: isVisible ? sec.color : '#cbd5e1' }}
                  />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Responsive Recharts Bar Chart */}
          <div className="w-full h-72 sm:h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `Rp ${val} T`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    const num = typeof value === 'number' ? value : Number(value) || 0;
                    return [`Rp ${num.toFixed(1)} Triliun`, name];
                  }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    borderRadius: '0.75rem',
                    border: 'none',
                    fontSize: '12px',
                    padding: '8px 12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                {visibleSectors.pegawai && <Bar dataKey="pegawai" name="Birokrasi & Gaji" fill="#64748b" radius={[4, 4, 0, 0]} />}
                {visibleSectors.pendidikan && <Bar dataKey="pendidikan" name="Pendidikan & KJP" fill="#3b82f6" radius={[4, 4, 0, 0]} />}
                {visibleSectors.infrastruktur && <Bar dataKey="infrastruktur" name="Infrastruktur & Transit" fill="#059669" radius={[4, 4, 0, 0]} />}
                {visibleSectors.kesehatan && <Bar dataKey="kesehatan" name="Kesehatan & BPJS" fill="#e11d48" radius={[4, 4, 0, 0]} />}
                {visibleSectors.bansos && <Bar dataKey="bansos" name="Bansos & Pangan" fill="#d97706" radius={[4, 4, 0, 0]} />}
                {visibleSectors.lingkungan && <Bar dataKey="lingkungan" name="Lingkungan & Banjir" fill="#0d9488" radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <span>
              <strong>Fakta Tren:</strong> Total APBD DKI meningkat dari <strong>Rp 79,5 T (2024)</strong> menjadi <strong>Rp 84,2 T (2026)</strong>. Porsi alokasi pendidikan konsisten di atas 20% sesuai amanat UU.
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: PORSI 6 SEKTOR (DONUT CHART) & DAMPAK TERASA */}
      {/* ======================================================== */}
      {chartMode === 'donut' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-in fade-in duration-200">
          {/* Left: Recharts Donut Chart */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SECTORS_2026_DONUT}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    onClick={(_, index) => setActiveDonutIndex(index)}
                    cursor="pointer"
                  >
                    {SECTORS_2026_DONUT.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={activeDonutIndex === index ? '#0f172a' : '#ffffff'}
                        strokeWidth={activeDonutIndex === index ? 3 : 1.5}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`Rp ${Number(val).toFixed(1)} Triliun`, 'Pagu']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Klik salah satu irisan donat untuk melihat dampak riilnya ke warga
            </div>
          </div>

          {/* Right: Selected Sector Humanized Impact Card (Plain Language) */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: activeDonutSector.color }}
                />
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeDonutSector.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-slate-900 tabular-nums">
                  Rp {activeDonutSector.value} T
                </span>
                <span className="text-xs text-slate-500 ml-1">({activeDonutSector.percentage}%)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dampak Nyata yang Dirasakan Warga:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                "{activeDonutSector.humanImpact}"
              </p>
            </div>

            {/* Quick Sector Selector Pills */}
            <div className="pt-2">
              <div className="text-[10px] font-bold text-slate-400 mb-1.5">Pilih Sektor Lain:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {SECTORS_2026_DONUT.map((sec, idx) => (
                  <button
                    key={sec.name}
                    onClick={() => setActiveDonutIndex(idx)}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-semibold transition cursor-pointer min-h-[38px] ${
                      activeDonutIndex === idx
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate">{sec.name.split('&')[0]}</div>
                    <div className="text-[10px] opacity-75">{sec.percentage}%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Link to Drill Down */}
            {onSelectSector && (
              <button
                onClick={() => onSelectSector(activeDonutSector.key)}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer min-h-[40px] mt-2 shadow-xs"
              >
                <span>Telusuri Rincian Sektor {activeDonutSector.name.split('&')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: KOMPOSISI JENIS BELANJA (STANDAR AKUNTANSI) */}
      {/* ======================================================== */}
      {chartMode === 'categories' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <strong>Keterbukaan Tata Kelola:</strong> Sesuai Standar Akuntansi Pemerintahan (SAP), belanja APBD DKI Jakarta dibagi menjadi 5 pos utama. Warga berhak mengawasi berapa persen anggaran yang menjadi aset fisik publik versus biaya rutin birokrasi.
          </div>

          <div className="space-y-3">
            {EXPENDITURE_TYPES.map((item) => (
              <div key={item.type} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.type}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                      Rp {item.budget.toFixed(1)} Triliun
                    </span>
                    <span className="text-xs text-slate-500 ml-1">({item.pct}% APBD)</span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.pct * 2.5}%` }}
                    className={`h-full rounded-full ${
                      item.type.includes('Modal')
                        ? 'bg-emerald-600'
                        : item.type.includes('Bantuan Sosial')
                        ? 'bg-blue-600'
                        : item.type.includes('Pegawai')
                        ? 'bg-slate-600'
                        : item.type.includes('Barang')
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
