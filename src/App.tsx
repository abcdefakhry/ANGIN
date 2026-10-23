import { useState } from 'react';
import { 
  ChevronDown, 
  MapPin, 
  ArrowRight, 
  Search, 
  ShieldCheck,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Sparkles
} from 'lucide-react';
import { CivicReceiptModal } from './components/CivicReceiptModal';
import apbdData from './data/apbd-jakarta.json';

export default function App() {
  // Gaji default 4.000.000 (sesuai mockup)
  const [income, setIncome] = useState<number>(4000000);
  const [selectedRegion, setSelectedRegion] = useState('DKI Jakarta');
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [showOtherSectors, setShowOtherSectors] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Perhitungan proporsional alokasi pajak warga
  // Asumsi porsi kontribusi pajak lokal (~2.2% jalan, ~3.0% puskesmas, ~1.6% transportasi dari formula APBD)
  const perbaikanJalan = Math.round(income * 0.022);
  const subsidiPuskesmas = Math.round(income * 0.030);
  const subsidiTransportasi = Math.round(income * 0.016);
  const totalTrio = perbaikanJalan + subsidiPuskesmas + subsidiTransportasi;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  const regions = [
    { name: 'DKI Jakarta', active: true, desc: 'APBD Rp 84,2 T • Data Penuh' },
    { name: 'Kota Depok', active: false, desc: 'APBD Rp 4,5 T • Segera Hadir' },
    { name: 'Kota Surabaya', active: false, desc: 'APBD Rp 11,2 T • Segera Hadir' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      
      {/* MODAL STRUK PAJAK DIGITAL (CIVIC RECEIPT) */}
      <CivicReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        income={income}
        region={selectedRegion}
      />

      {/* 1. TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand: ANGIN (Anggaran Indonesia) */}
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-emerald-200 group-hover:bg-emerald-700 transition">
                {/* Isometric Cube icon */}
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
            </a>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-slate-700">
              <a href="#kalkulator" className="text-slate-900 hover:text-emerald-600 transition-colors">Kalkulator Pajak</a>
              <a href="#eksplorasi" className="hover:text-emerald-600 transition-colors">Simulator APBD</a>
              <a href="#radar" className="hover:text-emerald-600 transition-colors">Radar Proyek</a>
              <a href="#reality-gap" className="hover:text-emerald-600 transition-colors">Mengapa ANGIN?</a>
            </nav>
          </div>

          {/* Right Action: Region Selector & Primary Button */}
          <div className="flex items-center gap-3 relative">
            
            {/* Region Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isRegionOpen}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedRegion}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isRegionOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Region Dropdown Menu */}
              {isRegionOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Pilih Wilayah APBD
                  </div>
                  {regions.map((reg) => (
                    <button
                      key={reg.name}
                      disabled={!reg.active}
                      onClick={() => {
                        setSelectedRegion(reg.name);
                        setIsRegionOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                        reg.active 
                          ? 'hover:bg-slate-50 text-slate-800 font-semibold' 
                          : 'opacity-50 cursor-not-allowed text-slate-400'
                      }`}
                    >
                      <div>
                        <div>{reg.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{reg.desc}</div>
                      </div>
                      {reg.name === selectedRegion && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Navbar Button: Open Civic Receipt Modal */}
            <button 
              onClick={() => setIsReceiptOpen(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-sm shadow-emerald-200 cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Cetak Struk Pajak</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="kalkulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Headline & Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Open Government Data • APBD {selectedRegion} 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Pajakmu Triliunan, Tapi Jalan Depan Rumah Tetap Bolong?
            </h1>
            
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              <strong className="text-slate-800 font-semibold">ANGIN</strong> menerjemahkan data terbuka APBD menjadi angka riil pengeluaranmu. Cek alokasi pajakmu, simulasikan anggaran publik, dan pantau proyek fisik di sekitarmu.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a 
                href="#eksplorasi"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition shadow-sm shadow-emerald-200 cursor-pointer"
              >
                <span>Telusuri Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a 
                href="#radar"
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-lg text-sm border border-slate-300 transition cursor-pointer"
              >
                Lihat Peta Proyek
              </a>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Data resmi APBD DKI Jakarta &amp; Satu Data Indonesia (Tahun Anggaran 2026)</span>
            </div>
          </div>

          {/* Right Column: Hero Interactive Simulator Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06),0_10px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-100">
              
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Simulasi Cepat Alokasi Pajak Anda
                </h2>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                  Real-time
                </span>
              </div>

              {/* Slider Input Row */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-slate-600">Gaji / Pengeluaran Bulanan:</span>
                  <span className="text-slate-900 font-extrabold text-base bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                    {formatRupiah(income)} <span className="text-xs font-normal text-slate-500">/ bln</span>
                  </span>
                </div>

                <div className="relative pt-1">
                  <input
                    type="range"
                    min="2000000"
                    max="20000000"
                    step="500000"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-label="Slider Gaji Bulanan"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                    <span>Rp 2 Juta</span>
                    <span>Rp 10 Juta</span>
                    <span>Rp 20 Juta</span>
                  </div>
                </div>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                
                {/* Metric 1 */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900">
                    {formatRupiah(perbaikanJalan)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-snug mt-2">
                    Penambalan &amp; Perbaikan Jalan
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900">
                    {formatRupiah(subsidiPuskesmas)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-snug mt-2">
                    Subsidi Puskesmas &amp; Faskes
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-amber-50/40 rounded-xl p-3.5 border border-amber-100/60 flex flex-col justify-between hover:border-amber-200 transition">
                  <div className="font-extrabold text-sm sm:text-base text-slate-900">
                    {formatRupiah(subsidiTransportasi)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-snug mt-2">
                    Subsidi Transportasi (TJ &amp; MRT)
                  </div>
                </div>

              </div>

              {/* Dynamic Breakdown Progress Bar */}
              <div className="mt-5 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span>Proporsi Alokasi 3 Sektor Fasilitas:</span>
                  <span className="text-slate-500 font-mono text-[11px]">{formatRupiah(totalTrio)} / bln</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  {/* Segment 1: Hijau emerald (Jalan) */}
                  <div 
                    style={{ width: `${(perbaikanJalan / totalTrio) * 100}%` }} 
                    className="bg-emerald-600 h-full transition-all duration-300"
                    title={`Jalan: ${formatRupiah(perbaikanJalan)}`}
                  ></div>
                  <div style={{ width: '2px' }} className="bg-white h-full"></div>
                  {/* Segment 2: Dark Navy/Slate (Puskesmas) */}
                  <div 
                    style={{ width: `${(subsidiPuskesmas / totalTrio) * 100}%` }} 
                    className="bg-slate-800 h-full transition-all duration-300"
                    title={`Puskesmas: ${formatRupiah(subsidiPuskesmas)}`}
                  ></div>
                  <div style={{ width: '2px' }} className="bg-white h-full"></div>
                  {/* Segment 3: Amber / Yellow Gold (Transportasi) */}
                  <div 
                    style={{ width: `${(subsidiTransportasi / totalTrio) * 100}%` }} 
                    className="bg-amber-500 h-full transition-all duration-300"
                    title={`Transportasi: ${formatRupiah(subsidiTransportasi)}`}
                  ></div>
                </div>
              </div>

              {/* Expandable Section: Lihat Sektor Lainnya */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowOtherSectors(!showOtherSectors)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{showOtherSectors ? 'Sembunyikan Sektor Makro Lainnya' : 'Lihat Alokasi Sektor Makro Lainnya (Pendidikan, Gaji, dll.)'}</span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showOtherSectors ? 'rotate-180' : ''}`} />
                </button>

                {showOtherSectors && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-200/70 animate-in fade-in duration-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">
                      Porsi sektor makro dari total APBD DKI Rp 84,2 Triliun:
                    </div>
                    {apbdData.sectors.map((sec) => (
                      <div key={sec.id} className="flex justify-between items-center py-0.5">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sec.color }}></span>
                          <span>{sec.name}</span>
                        </span>
                        <span className="font-bold text-slate-900">{sec.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button: Trigger Modal Struk */}
              <div className="mt-5">
                <button
                  onClick={() => setIsReceiptOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl shadow transition cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Cetak Struk Pajak Kasir Saya</span>
                </button>
              </div>

              {/* Catatan Transparansi Formula (Footnote Disclosure) Sesuai Celah 2.4 */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                <strong className="text-slate-500 font-semibold">Catatan Transparansi Fiskal:</strong> Angka di atas dihitung berdasarkan formula simulasi dari Pajak Daerah (PB1/PBJT Restoran 10% dan Pajak Kendaraan Bermotor) serta porsi Dana Bagi Hasil (DBH) Pajak Penghasilan (PPh) yang disalurkan kembali oleh Pemerintah Pusat ke kas APBD DKI Jakarta.
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION THE REALITY GAP (Mengapa Harus Ada ANGIN?) */}
      <section id="reality-gap" className="border-y border-slate-200/80 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
              Keterbukaan Data yang Membumi
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mengubah Angka Birokrasi Jadi Bahasa Sehari-hari
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              APBD bukan cuma lembar pertanggungjawaban pemerintah, melainkan uang warga yang harus dipertanggungjawabkan kembali ke warga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Sisi Kiri: Cara Lama */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Laporan Konvensional</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Dokumen PDF 400+ Halaman</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tabel angka mentah berformat ribuan baris, singkatan birokrasi kaku (*BTL, BL, PPKD*), dan tidak ada korelasi langsung dengan jalanan yang dilewati warga setiap hari.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                "Warga sulit mengawasi karena bahasa laporan dibuat untuk auditor, bukan untuk rakyat."
              </div>
            </div>

            {/* Sisi Kanan: Cara ANGIN */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pendekatan ANGIN</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Visual, Personal, &amp; Spasial</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cukup geser slider penghasilanmu, lihat pecahan rupiah nyata yang kamu danai, telusuri alur anggarannya hingga ke nama kontraktor dan titik koordinat jalan di peta.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>100% Data Resmi Pemprov DKI Jakarta (Tahun 2026)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PREVIEW CARDS (Budget Flow & Mini GIS Project) */}
      <section id="eksplorasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card Kiri: Budget Flow Sankey Preview */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Aliran Anggaran (Budget Flow)</h3>
                  <p className="text-xs text-slate-500">Aliran APBD DKI Jakarta ke sektor riil</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/40">
                  Rp 84,2 Triliun
                </span>
              </div>

              {/* Visual Flow Diagram Preview */}
              <div className="h-64 bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-between text-xs">
                  
                  {/* Source Node */}
                  <div className="w-28 bg-emerald-600 text-white rounded-lg p-3 font-semibold shadow-sm z-10">
                    <div className="text-[10px] text-emerald-100 font-normal">Gaji Warga</div>
                    <div className="text-sm font-bold">{formatRupiah(income)}</div>
                  </div>

                  {/* Connecting Streams SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <path d="M 120 128 C 190 128, 220 68, 310 68" fill="none" stroke="#10b981" strokeWidth="22" strokeOpacity="0.45" />
                    <path d="M 120 128 C 190 128, 220 128, 310 128" fill="none" stroke="#1e293b" strokeWidth="32" strokeOpacity="0.55" />
                    <path d="M 120 128 C 190 128, 220 188, 310 188" fill="none" stroke="#f59e0b" strokeWidth="20" strokeOpacity="0.55" />
                  </svg>

                  {/* Target Nodes */}
                  <div className="space-y-2.5 z-10 pr-2">
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded text-[11px] font-semibold">
                      Jalan: {formatRupiah(perbaikanJalan)}
                    </div>
                    <div className="bg-slate-800 text-white px-3 py-1.5 rounded text-[11px] font-semibold">
                      Puskesmas: {formatRupiah(subsidiPuskesmas)}
                    </div>
                    <div className="bg-amber-500 text-white px-3 py-1.5 rounded text-[11px] font-semibold">
                      Transportasi: {formatRupiah(subsidiTransportasi)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>*Terhubung langsung dengan simulasi gaji</span>
              <button 
                onClick={() => setIsReceiptOpen(true)}
                className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                Cetak Rincian Struk <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Kanan: Mini GIS Project Map Preview */}
          <div id="radar" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Radar Proyek Fisik (Mini GIS)</h3>
                  <p className="text-xs text-slate-500">Pantau proyek pembangunan aktif di sekitarmu</p>
                </div>

                {/* Selector Jakarta */}
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span>Jakarta Selatan</span>
                </div>
              </div>

              {/* Map Container Mockup */}
              <div className="h-64 rounded-xl relative overflow-hidden border border-slate-200 bg-[#e4e8ec]">
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-slate-400/40 font-black text-3xl tracking-widest uppercase">Jakarta</span>
                </div>

                {/* Pin 1: TB Simatupang */}
                <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md ring-4 ring-amber-200/80 group-hover:scale-110 transition">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div className="mt-1 bg-white/95 px-2 py-0.5 rounded shadow text-[9px] font-bold text-slate-800">
                    Jl. TB Simatupang (80%)
                  </div>
                </div>

                {/* Pin 2: Fatmawati (Dekat UPNVJ) */}
                <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
                  <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md ring-4 ring-emerald-200/80 group-hover:scale-110 transition">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div className="mt-1 bg-white/95 px-2 py-0.5 rounded shadow text-[9px] font-bold text-slate-800">
                    Jl. Fatmawati (100%)
                  </div>
                </div>

                {/* Pin 3: Kali Krukut Pondok Labu */}
                <div className="absolute bottom-1/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md ring-4 ring-amber-200/80 group-hover:scale-110 transition">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div className="mt-1 bg-white/95 px-2 py-0.5 rounded shadow text-[9px] font-bold text-slate-800">
                    Tanggul Krukut (60%)
                  </div>
                </div>

                {/* Legend Box at Bottom Left */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2.5 shadow-sm border border-slate-200 text-[10px] space-y-1">
                  <div className="font-bold text-slate-800 text-[11px]">Status Pengerjaan</div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>100% Selesai Tepat Waktu</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Sedang Dikerjakan</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Menampilkan proyek aktif terverifikasi LPSE</span>
              <span className="font-bold text-slate-400">Peta Penuh (Sprint 2)</span>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm">ANGIN</span>
            <span>— Anggaran Indonesia (Inisiatif Open Government Data)</span>
          </div>
          <div>
            Dikembangkan untuk Web In Action (WIA) 2026 • KSM Multimedia UPN Veteran Jakarta
          </div>
        </div>
      </footer>

    </div>
  );
}
