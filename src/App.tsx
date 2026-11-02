import { useState, useEffect } from 'react';
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
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Wrench,
  HeartPulse,
  BusFront
} from 'lucide-react';
import { CivicReceiptModal } from './components/CivicReceiptModal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { ProjectActionModal, ProjectDetail } from './components/ProjectActionModal';
import { BudgetFlowExplorer } from './components/BudgetFlowExplorer';
import { RadarMapPage } from './components/RadarMapPage';
import apbdData from './data/apbd-jakarta.json';

export default function App() {
  // Navigation View State: 'home' | 'explorer' | 'map'
  const [activeView, setActiveView] = useState<'home' | 'explorer' | 'map'>('home');

  // Gaji default 4.000.000 (sesuai mockup)
  const [income, setIncome] = useState<number>(4000000);
  const [selectedRegion, setSelectedRegion] = useState('DKI Jakarta');
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [showOtherSectors, setShowOtherSectors] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  
  // Modals state
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

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
    { name: 'DKI Jakarta', active: true, desc: 'APBD Rp 84,2 T • Data Penuh 2026' },
    { name: 'Kota Depok', active: false, desc: 'APBD Rp 4,5 T • Segera Hadir' },
    { name: 'Kota Surabaya', active: false, desc: 'APBD Rp 11,2 T • Segera Hadir' },
  ];

  // Shortcut Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick project lookup when clicked on map or search
  const handleOpenProjectById = (projId: string) => {
    for (const sec of apbdData.sectors) {
      for (const sub of sec.sub_programs) {
        const found = sub.projects.find((p) => p.id === projId);
        if (found) {
          setSelectedProject(found);
          return;
        }
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      
      {/* 1. MODAL STRUK PAJAK DIGITAL (CIVIC RECEIPT) */}
      <CivicReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        income={income}
        region={selectedRegion}
      />

      {/* 2. MODAL COMMAND SEARCH (Ctrl + K) */}
      <CommandSearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProject={(id) => handleOpenProjectById(id)}
      />

      {/* 3. MODAL DETAIL PROYEK & AKSI PENGAWASAN WARGA */}
      <ProjectActionModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* 4. TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand: ANGIN (Anggaran Indonesia) */}
          <div className="flex items-center gap-6 sm:gap-8">
            <a href="#" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white group-hover:bg-emerald-700 transition-colors">
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

            {/* Desktop Navigation Links / View Switcher */}
            <nav className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'home' 
                    ? 'bg-white text-slate-900 font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Beranda &amp; Kalkulator
              </button>

              <button 
                onClick={() => {
                  setActiveView('explorer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'explorer' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                <span>Pohon Alur APBD</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  activeView === 'explorer' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Rp 84,2 T
                </span>
              </button>

              <button 
                onClick={() => {
                  setActiveView('map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeView === 'map' 
                    ? 'bg-slate-900 text-white font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Radar Peta GIS</span>
              </button>

              {activeView === 'home' && (
                <a href="#reality-gap" className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-colors">
                  Mengapa ANGIN?
                </a>
              )}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Trigger (Mobile Icon Button with >=44px tap target & Desktop Ctrl+K pill) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-2 sm:px-3 sm:py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 justify-center cursor-pointer"
              title="Cari proyek (Ctrl + K)"
              aria-label="Pencarian Cepat"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline font-medium text-slate-600">Cari proyek...</span>
              <kbd className="hidden sm:inline-block text-[10px] font-sans font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                Ctrl K
              </kbd>
            </button>

            {/* Region Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
                aria-haspopup="listbox"
                aria-expanded={isRegionOpen}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xs:inline">{selectedRegion}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isRegionOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRegionOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400">
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
                      className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between transition-colors min-h-[44px] ${
                        reg.active 
                          ? 'hover:bg-slate-50 text-slate-800 font-semibold cursor-pointer' 
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
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Cetak Struk</span>
            </button>
          </div>

        </div>

        {/* Mobile View Switcher Tab Bar (< 768px) */}
        <div className="md:hidden flex border-t border-slate-200 bg-slate-50 px-2 py-1.5 gap-1.5">
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-1 cursor-pointer ${
              activeView === 'home'
                ? 'bg-white text-slate-900 border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Beranda</span>
          </button>
          <button
            onClick={() => {
              setActiveView('explorer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-1 cursor-pointer ${
              activeView === 'explorer'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pohon Alur</span>
          </button>
          <button
            onClick={() => {
              setActiveView('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-1 cursor-pointer ${
              activeView === 'map'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Radar Peta</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEW SWITCHER */}
      {activeView === 'explorer' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <BudgetFlowExplorer 
            onSelectProject={(project) => setSelectedProject(project)}
            onNavigateHome={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      ) : activeView === 'map' ? (
        <RadarMapPage 
          onSelectProject={(project) => setSelectedProject(project)}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <>
          {/* 5. HERO SECTION */}
      <section id="kalkulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Headline & Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Open Government Data • APBD {selectedRegion} 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.14]">
              Pajakmu Triliunan, Tapi Jalan Depan Rumah Tetap Bolong?
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              <strong className="text-slate-800 font-semibold">ANGIN</strong> menerjemahkan data terbuka APBD menjadi angka riil pengeluaranmu. Cek alokasi pajakmu, simulasikan anggaran publik, dan pantau proyek fisik di sekitarmu.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button 
                onClick={() => {
                  setActiveView('explorer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors min-h-[44px] cursor-pointer"
              >
                <span>Telusuri Aliran APBD</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => {
                  setActiveView('map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-3 rounded-xl text-sm border border-slate-300 transition-colors min-h-[44px] cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Buka Radar Peta GIS</span>
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Sumber resmi APBD DKI Jakarta &amp; Satu Data Indonesia (Tahun Anggaran 2026)</span>
            </div>
          </div>

          {/* Right Column: Hero Interactive Simulator Card */}
          <div className="lg:col-span-6">
            <div data-ui="tax-simulator" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200">
              
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
                  Simulasi Cepat Alokasi Pajak Anda
                </h2>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Interaktif
                </span>
              </div>

              {/* Slider Input Row */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                  <span className="text-slate-600">Gaji / Pengeluaran Bulanan:</span>
                  <span className="text-slate-900 font-extrabold text-sm sm:text-base bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 tabular-nums">
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
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-5">
                
                {/* Metric 1 */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex sm:flex-col justify-between items-center sm:items-start transition-colors">
                  <div className="order-2 sm:order-1 font-extrabold text-sm sm:text-base text-slate-900 tabular-nums">
                    {formatRupiah(perbaikanJalan)}
                  </div>
                  <div className="order-1 sm:order-2 text-xs text-slate-600 font-medium sm:mt-2">
                    Penambalan Jalan
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex sm:flex-col justify-between items-center sm:items-start transition-colors">
                  <div className="order-2 sm:order-1 font-extrabold text-sm sm:text-base text-slate-900 tabular-nums">
                    {formatRupiah(subsidiPuskesmas)}
                  </div>
                  <div className="order-1 sm:order-2 text-xs text-slate-600 font-medium sm:mt-2">
                    Subsidi Puskesmas
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex sm:flex-col justify-between items-center sm:items-start transition-colors">
                  <div className="order-2 sm:order-1 font-extrabold text-sm sm:text-base text-slate-900 tabular-nums">
                    {formatRupiah(subsidiTransportasi)}
                  </div>
                  <div className="order-1 sm:order-2 text-xs text-slate-600 font-medium sm:mt-2">
                    Subsidi Bus &amp; MRT
                  </div>
                </div>

              </div>

              {/* Dynamic Breakdown Progress Bar */}
              <div className="mt-5 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span>Proporsi 3 Sektor Fasilitas:</span>
                  <span className="text-slate-500 tabular-nums font-semibold text-[11px]">{formatRupiah(totalTrio)} / bln</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${(perbaikanJalan / totalTrio) * 100}%` }} 
                    className="bg-emerald-600 h-full transition-[width] duration-300"
                    title={`Jalan: ${formatRupiah(perbaikanJalan)}`}
                  ></div>
                  <div style={{ width: '2px' }} className="bg-white h-full"></div>
                  <div 
                    style={{ width: `${(subsidiPuskesmas / totalTrio) * 100}%` }} 
                    className="bg-slate-800 h-full transition-[width] duration-300"
                    title={`Puskesmas: ${formatRupiah(subsidiPuskesmas)}`}
                  ></div>
                  <div style={{ width: '2px' }} className="bg-white h-full"></div>
                  <div 
                    style={{ width: `${(subsidiTransportasi / totalTrio) * 100}%` }} 
                    className="bg-amber-500 h-full transition-[width] duration-300"
                    title={`Transportasi: ${formatRupiah(subsidiTransportasi)}`}
                  ></div>
                </div>
              </div>

              {/* Expandable Section: Lihat Sektor Lainnya (Zero Empty State - Celah 2.2) */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowOtherSectors(!showOtherSectors)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition py-2 cursor-pointer min-h-[44px]"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{showOtherSectors ? 'Sembunyikan Sektor Makro Lainnya' : 'Buka Rincian 6 Sektor APBD Lengkap (100% / Rp 84,2 T)'}</span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showOtherSectors ? 'rotate-180' : ''}`} />
                </button>

                {showOtherSectors && (
                  <div className="mt-2 p-3.5 bg-slate-50 rounded-xl space-y-2.5 text-xs border border-slate-200/80 animate-in fade-in duration-200">
                    <div className="text-[11px] text-slate-500 font-medium pb-1 border-b border-slate-200 flex justify-between">
                      <span>Porsi 6 Sektor Makro APBD DKI:</span>
                      <span className="font-bold text-slate-700">Total 100% (Rp 84,2 T)</span>
                    </div>

                    {apbdData.sectors.map((sec) => (
                      <div 
                        key={sec.id} 
                        onClick={() => setSelectedSectorId(selectedSectorId === sec.id ? null : sec.id)}
                        className={`p-2 rounded-lg border transition cursor-pointer ${
                          selectedSectorId === sec.id 
                            ? 'bg-white border-emerald-300 shadow-xs' 
                            : 'bg-white/60 border-slate-200/60 hover:bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-slate-800 font-bold flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sec.color }}></span>
                            <span>{sec.name}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{sec.percentage}%</span>
                            <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${selectedSectorId === sec.id ? 'rotate-90' : ''}`} />
                          </div>
                        </div>

                        {/* Sub-Programs Detail if Active */}
                        {selectedSectorId === sec.id && (
                          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] space-y-1.5 text-slate-600">
                            <p className="italic text-slate-500">{sec.description}</p>
                            {sec.sub_programs.length > 0 ? (
                              <div className="space-y-1 pt-1">
                                {sec.sub_programs.map((sub) => (
                                  <div key={sub.id} className="flex justify-between bg-slate-50 p-1.5 rounded">
                                    <span className="font-medium text-slate-700">• {sub.name}</span>
                                    <span className="font-bold text-slate-900">{formatRupiah(sub.budget)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400">Alokasi reguler APBD 2026</div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button: Trigger Modal Struk */}
              <div className="mt-5">
                <button
                  onClick={() => setIsReceiptOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-colors cursor-pointer min-h-[44px]"
                >
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Cetak Struk Pajak Kasir Saya</span>
                </button>
              </div>

              {/* Catatan Transparansi Formula (Footnote Disclosure Sesuai Celah 2.4) */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                <strong className="text-slate-500 font-semibold">Catatan Transparansi Fiskal:</strong> Angka di atas dihitung berdasarkan formula simulasi dari Pajak Daerah (PB1/PBJT Restoran 10% dan Pajak Kendaraan Bermotor) serta porsi Dana Bagi Hasil (DBH) Pajak Penghasilan (PPh) yang disalurkan kembali oleh Pemerintah Pusat ke kas APBD DKI Jakarta.
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. SECTION THE REALITY GAP (Mengapa Harus Ada ANGIN?) */}
      <section id="reality-gap" className="border-y border-slate-200 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-semibold text-emerald-700 mb-2">
              Keterbukaan data yang membumi
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mengubah Angka Birokrasi Jadi Bahasa Sehari-hari
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              APBD bukan cuma lembar pertanggungjawaban pemerintah, melainkan uang warga yang harus dipertanggungjawabkan kembali ke warga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
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
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
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

      {/* 7. PREVIEW CARDS (Budget Flow & Mini GIS Project) */}
      <section id="eksplorasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card Kiri: Budget Flow Sankey Preview (Adaptive Desktop vs Mobile - Celah 2.3) */}
          <div data-ui="sankey-preview" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Aliran Anggaran (Budget Flow)</h3>
                  <p className="text-xs text-slate-500">Aliran APBD DKI Jakarta ke sektor riil</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Rp 84,2 Triliun
                </span>
              </div>

              {/* DESKTOP VIEW (>= 768px): Horizontal SVG Stream */}
              <div className="hidden md:flex h-64 bg-slate-50 rounded-xl p-4 border border-slate-100 flex-col justify-center relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-between text-xs">
                  
                  {/* Source Node */}
                  <div className="w-28 bg-emerald-600 text-white rounded-lg p-3 font-semibold z-10">
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

              {/* MOBILE VIEW (< 768px): Vertical Stacked List with tap targets >= 44px */}
              <div className="md:hidden space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 mb-2">
                  Alokasi dari {formatRupiah(income)}:
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center min-h-[44px]">
                  <span className="font-semibold text-xs text-slate-800 flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Penambalan Jalan</span>
                  </span>
                  <span className="font-extrabold text-xs text-emerald-700 tabular-nums">{formatRupiah(perbaikanJalan)}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center min-h-[44px]">
                  <span className="font-semibold text-xs text-slate-800 flex items-center gap-2">
                    <HeartPulse className="w-3.5 h-3.5 text-slate-700" />
                    <span>Subsidi Puskesmas</span>
                  </span>
                  <span className="font-extrabold text-xs text-slate-900 tabular-nums">{formatRupiah(subsidiPuskesmas)}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center min-h-[44px]">
                  <span className="font-semibold text-xs text-slate-800 flex items-center gap-2">
                    <BusFront className="w-3.5 h-3.5 text-amber-600" />
                    <span>Subsidi Transportasi</span>
                  </span>
                  <span className="font-extrabold text-xs text-amber-700 tabular-nums">{formatRupiah(subsidiTransportasi)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
              <button 
                onClick={() => {
                  setActiveView('explorer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer py-1.5 px-3 bg-emerald-50 rounded-lg border border-emerald-200"
              >
                <span>Buka Alur Penuh (Rp 84,2 T)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsReceiptOpen(true)}
                className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer py-1"
              >
                Cetak Rincian Struk <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Kanan: Mini GIS Project Map Preview */}
          <div id="radar" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Radar Proyek Fisik (Mini GIS)</h3>
                  <p className="text-xs text-slate-500">Klik pin di peta untuk rincian &amp; aduan warga</p>
                </div>

                {/* Quick Map & Search Buttons */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => {
                      setActiveView('map');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Peta Lengkap</span>
                  </button>

                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer min-h-[36px]"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cari</span>
                  </button>
                </div>
              </div>

              {/* Map Container Mockup with Interactive Pins & Offline Vector Siluet (Celah 2.1) */}
              <div className="h-64 rounded-xl relative overflow-hidden border border-slate-200 bg-slate-100">
                
                {/* Jakarta SVG Vector Silhouette Map (Offline Fallback indicator) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <svg className="w-48 h-48 text-slate-600" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M 20,40 Q 30,20 50,25 T 80,35 Q 90,60 70,80 T 30,75 Z" />
                  </svg>
                </div>

                {/* Pin 1: TB Simatupang (Yellow / 80%) */}
                <div 
                  onClick={() => handleOpenProjectById('proj-tb-simatupang')}
                  className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
                >
                  <div className="w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center ring-4 ring-amber-200/80 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="mt-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-[9px] font-bold text-slate-800 whitespace-nowrap group-hover:bg-amber-50">
                    Jl. TB Simatupang (80%)
                  </div>
                </div>

                {/* Pin 2: Fatmawati (Green / 100%) */}
                <div 
                  onClick={() => handleOpenProjectById('proj-fatmawati')}
                  className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
                >
                  <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center ring-4 ring-emerald-200/80 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="mt-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-[9px] font-bold text-slate-800 whitespace-nowrap group-hover:bg-emerald-50">
                    Jl. Fatmawati (100%)
                  </div>
                </div>

                {/* Pin 3: Margonda (Red / 45% Terlambat - Trigger Aksi Aduan Warga Celah 2.5) */}
                <div 
                  onClick={() => handleOpenProjectById('proj-margonda')}
                  className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
                >
                  <div className="w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center ring-4 ring-rose-200 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="mt-1 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[9px] font-bold text-rose-800 whitespace-nowrap">
                    Jl. Margonda (45% Terlambat)
                  </div>
                </div>

                {/* Legend Box at Bottom Left */}
                <div className="absolute bottom-3 left-3 bg-white rounded-lg p-2.5 border border-slate-200 text-[10px] space-y-1 z-10">
                  <div className="font-bold text-slate-800 text-[11px]">Status Pengerjaan</div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>100% Selesai Tepat Waktu</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Sedang Dikerjakan</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    <span className="font-bold text-rose-700">Terlambat (Aksi Warga)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Dual Mode: Online Map &amp; Offline Vector Fallback</span>
              </span>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Cari Semua Proyek ({apbdData.sectors.reduce((acc, s) => acc + s.sub_programs.reduce((a, sp) => a + sp.projects.length, 0), 0)})
              </button>
            </div>

          </div>

        </div>
      </section>
      </>
      )}

      {/* FOOTER (Shown on non-map views) */}
      {activeView !== 'map' && (
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
      )}

    </div>
  );
}
