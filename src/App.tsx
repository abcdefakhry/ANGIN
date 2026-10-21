import { useState } from 'react';
import { 
  ChevronDown, 
  MapPin, 
  ArrowRight, 
  Search, 
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Gaji default 4.000.000 (sesuai mockup)
  const [income, setIncome] = useState<number>(4000000);
  const [selectedRegion] = useState('DKI Jakarta');

  // Perhitungan proporsional alokasi pajak warga
  // Asumsi porsi kontribusi pajak lokal (~2.2% jalan, ~3.0% puskesmas, ~1.6% transportasi dari formula APBD)
  const perbaikanJalan = Math.round(income * 0.022);
  const subsidiPuskesmas = Math.round(income * 0.030);
  const subsidiTransportasi = Math.round(income * 0.016);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. TOP HEADER / NAVBAR (Sesuai Mockup) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand: ANGIN (Anggaran Indonesia) */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                {/* Isometric Cube icon seperti di mockup */}
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div className="flex items-baseline">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">ANGIN</span>
                <span className="text-xs font-semibold text-emerald-600 ml-0.5">.id</span>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-slate-700">
              <a href="#kalkulator" className="text-slate-900 hover:text-emerald-600 transition-colors">Kalkulator Pajak</a>
              <a href="#simulator" className="hover:text-emerald-600 transition-colors">Simulator APBD</a>
              <a href="#radar" className="hover:text-emerald-600 transition-colors">Radar Proyek</a>
              <a href="#data" className="hover:text-emerald-600 transition-colors">Data Terbuka</a>
            </nav>
          </div>

          {/* Right Action: Region Selector & Primary Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedRegion}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm shadow-emerald-200">
              Hitung Pajak Saya
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Headline & Description */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Pajakmu Triliunan, Tapi Jalan Depan Rumah Tetap Bolong?
            </h1>
            
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              <strong className="text-slate-800 font-semibold">ANGIN</strong> menerjemahkan data terbuka APBD menjadi angka riil pengeluaranmu. Cek alokasi pajakmu, simulasikan anggaran publik, dan pantau proyek fisik di sekitarmu.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition shadow-sm shadow-emerald-200">
                Telusuri Lengkap
              </button>

              <button className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-lg text-sm border border-slate-300 transition">
                Lihat Peta Proyek
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Data resmi APBD DKI Jakarta &amp; Satu Data Indonesia</span>
            </div>
          </div>

          {/* Right Column: Hero Interactive Simulator Card (Sama Persis Mockup) */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06),0_10px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-100">
              
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Simulasi Cepat Alokasi Pajak Anda
              </h2>

              {/* Slider Input Row */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-slate-600">Gaji / Pengeluaran:</span>
                  <span className="text-slate-900 font-bold text-base">{formatRupiah(income)} / bln</span>
                </div>

                <div className="relative pt-1">
                  <input
                    type="range"
                    min="2000000"
                    max="20000000"
                    step="500000"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>

              {/* 3 Metrics Cards (Sesuai mockup: Rp 88.000, Rp 120.000, Rp 64.000 saat 4 Juta) */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                
                {/* Metric 1 */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900">
                    {formatRupiah(perbaikanJalan)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-snug mt-2">
                    Penambalan &amp; Perbaikan Jalan
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900">
                    {formatRupiah(subsidiPuskesmas)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-snug mt-2">
                    Subsidi Puskesmas &amp; Faskes
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-amber-50/40 rounded-xl p-3.5 border border-amber-100/60 flex flex-col justify-between">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900">
                    {formatRupiah(subsidiTransportasi)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-snug mt-2">
                    Subsidi Transportasi Publik (TransJakarta &amp; MRT)
                  </div>
                </div>

              </div>

              {/* Breakdown Progress Bar */}
              <div className="mt-6 pt-1">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Breakdown progress
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  {/* Segment 1: Hijau emerald */}
                  <div style={{ width: '35%' }} className="bg-emerald-600 h-full"></div>
                  {/* Separator */}
                  <div style={{ width: '1.5%' }} className="bg-white h-full"></div>
                  {/* Segment 2: Dark Navy/Slate */}
                  <div style={{ width: '40%' }} className="bg-slate-800 h-full"></div>
                  {/* Separator */}
                  <div style={{ width: '1.5%' }} className="bg-white h-full"></div>
                  {/* Segment 3: Amber / Yellow Gold */}
                  <div style={{ width: '22%' }} className="bg-amber-500 h-full"></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. PREVIEW CARDS (Budget Flow & Mini GIS Project) SESUAI BAGIAN BAWAH MOCKUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card Kiri: Budget Flow Sankey Preview */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Budget flow</h3>
                <p className="text-xs text-slate-500">Aliran APBD DKI Jakarta ke sektor riil</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Rp 84,2 Triliun
              </span>
            </div>

            {/* Visual Flow Diagram Preview */}
            <div className="h-64 bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex flex-col justify-center relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-between text-xs">
                
                {/* Source Node */}
                <div className="w-28 bg-emerald-600 text-white rounded-lg p-3 font-semibold shadow-sm z-10">
                  <div className="text-[10px] text-emerald-100 font-normal">Gaji Warga</div>
                  <div>{formatRupiah(income)}</div>
                </div>

                {/* Connecting Streams SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <path d="M 120 128 C 190 128, 220 68, 310 68" fill="none" stroke="#10b981" strokeWidth="22" strokeOpacity="0.45" />
                  <path d="M 120 128 C 190 128, 220 128, 310 128" fill="none" stroke="#1e293b" strokeWidth="32" strokeOpacity="0.55" />
                  <path d="M 120 128 C 190 128, 220 188, 310 188" fill="none" stroke="#f59e0b" strokeWidth="20" strokeOpacity="0.55" />
                </svg>

                {/* Target Nodes */}
                <div className="space-y-2.5 z-10 pr-2">
                  <div className="bg-amber-100/90 border border-amber-300 text-amber-900 px-3 py-1.5 rounded text-[11px] font-medium">
                    Penambalan &amp; Perbaikan Jalan
                  </div>
                  <div className="bg-slate-800 text-white px-3 py-1.5 rounded text-[11px] font-medium">
                    Subsidi Puskesmas &amp; Faskes
                  </div>
                  <div className="bg-amber-500 text-white px-3 py-1.5 rounded text-[11px] font-medium">
                    Subsidi Transportasi (TJ &amp; MRT)
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
              <span>*Data disederhanakan untuk simulasi perorangan</span>
              <a href="#eksplorasi" className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Eksplorasi Detail <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card Kanan: Mini GIS Project Map Preview */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Mini GIS Project</h3>
                <p className="text-xs text-slate-500">Active public work</p>
              </div>

              {/* Selector Jakarta */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700">
                <Search className="w-3 h-3 text-slate-400" />
                <span>Jakarta</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Map Container Mockup */}
            <div className="h-64 rounded-xl relative overflow-hidden border border-slate-200 bg-[#e4e8ec]">
              {/* Map background style (osm-like tiles pattern) */}
              <div className="absolute inset-0 opacity-70 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-slate-400/50 font-bold text-2xl tracking-widest uppercase">Jakarta</span>
              </div>

              {/* Pin 1 (Hijau - Public Work) */}
              <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
                <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md ring-4 ring-emerald-200/80 group-hover:scale-110 transition">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className="mt-1 bg-white/95 px-1.5 py-0.5 rounded shadow text-[9px] font-semibold text-slate-700">
                  Jl. TB Simatupang
                </div>
              </div>

              {/* Pin 2 (Amber - Transport/Health) */}
              <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
                <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md ring-4 ring-amber-200/80 group-hover:scale-110 transition">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className="mt-1 bg-white/95 px-1.5 py-0.5 rounded shadow text-[9px] font-semibold text-slate-700">
                  Puskesmas Gambir
                </div>
              </div>

              {/* Pin 3 (Hijau) */}
              <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
                <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md ring-4 ring-emerald-200/80 group-hover:scale-110 transition">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div className="mt-1 bg-white/95 px-1.5 py-0.5 rounded shadow text-[9px] font-semibold text-slate-700">
                  TransJakarta K-13
                </div>
              </div>

              {/* Legend Box at Bottom Left (sesuai mockup) */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2.5 shadow-sm border border-slate-200 text-[10px] space-y-1">
                <div className="font-semibold text-slate-800 text-[11px]">Active public works</div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>Public Work</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Active public Work</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
              <span>Menampilkan proyek aktif terverifikasi LPSE</span>
              <a href="#peta" className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Buka Peta Penuh <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">ANGIN</span>
            <span>— Anggaran Indonesia (Inisiatif Open Government Data)</span>
          </div>
          <div>
            Dikembangkan untuk Web In Action (WIA) 2026 • UPN Veteran Jakarta
          </div>
        </div>
      </footer>

    </div>
  );
}
