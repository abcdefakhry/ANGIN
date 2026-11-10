import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
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
  Home,
  Workflow,
  Info,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import type { ProjectDetail } from './components/ProjectActionModal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { ProjectActionModal } from './components/ProjectActionModal';
import { BudgetFlowMiniPreview } from './components/BudgetFlowMiniPreview';
import { CitizenFeedbackModal } from './components/CitizenFeedbackModal';
import { BudgetGlossaryModal } from './components/BudgetGlossaryModal';
import apbdData from './data/apbd-jakarta.json';

const CivicReceiptModal = lazy(() => import('./components/CivicReceiptModal').then(m => ({ default: m.CivicReceiptModal })));
const BudgetFlowExplorer = lazy(() => import('./components/BudgetFlowExplorer').then(m => ({ default: m.BudgetFlowExplorer })));
const RadarMapPage = lazy(() => import('./components/RadarMapPage').then(m => ({ default: m.RadarMapPage })));
const CityArchitectSimulator = lazy(() => import('./components/CityArchitectSimulator'));

// Helper to create clean preview pins for mini-map
const createHomePreviewPin = (status_color: string, isDelayed: boolean) => {
  let bgColor = '#059669'; // Emerald
  let ringColor = 'rgba(5, 150, 105, 0.25)';
  let innerContent = '<div style="width: 7px; height: 7px; background: white; border-radius: 50%;"></div>';

  if (isDelayed || status_color === 'red') {
    bgColor = '#e11d48'; // Rose
    ringColor = 'rgba(225, 29, 72, 0.35)';
    innerContent = '<div style="color: white; font-size: 10px; font-weight: 900; line-height: 1;">!</div>';
  } else if (status_color === 'yellow') {
    bgColor = '#d97706'; // Amber
    ringColor = 'rgba(217, 119, 6, 0.25)';
    innerContent = '<div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>';
  }

  return L.divIcon({
    className: 'custom-home-preview-pin',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: ${ringColor};"></div>
        <div style="position: relative; width: 20px; height: 20px; border-radius: 50%; background: ${bgColor}; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(0,0,0,0.2);">
          ${innerContent}
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

export default function App() {
  // Navigation View State: 'home' | 'explorer' | 'map' | 'simulator'
  const [activeView, setActiveView] = useState<'home' | 'explorer' | 'map' | 'simulator'>('home');

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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<'usulan' | 'laporan' | 'pertanyaan'>('usulan');
  const [feedbackProjectTitle, setFeedbackProjectTitle] = useState<string | undefined>(undefined);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Flat list of projects with coordinates for the preview mini-map
  const projectsWithCoords = useMemo(() => {
    const list: ProjectDetail[] = [];
    for (const sec of apbdData.sectors) {
      for (const sub of sec.sub_programs) {
        for (const proj of sub.projects) {
          if (proj.coordinates && proj.coordinates.length === 2) {
            list.push(proj);
          }
        }
      }
    }
    return list;
  }, []);

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
      
      {/* 1. MODAL STRUK PAJAK DIGITAL (CIVIC RECEIPT) - LAZY LOADED */}
      {isReceiptOpen && (
        <Suspense fallback={null}>
          <CivicReceiptModal 
            isOpen={isReceiptOpen}
            onClose={() => setIsReceiptOpen(false)}
            income={income}
            region={selectedRegion}
          />
        </Suspense>
      )}

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
        onOpenCitizenFeedback={(proj) => {
          setFeedbackCategory('laporan');
          setFeedbackProjectTitle(proj.title);
          setIsFeedbackOpen(true);
        }}
      />

      {/* 4. MODAL KOTAK SUARA & ASPIRASI WARGA (MENTOR POINT #4) */}
      <CitizenFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        defaultCategory={feedbackCategory}
        defaultProjectTitle={feedbackProjectTitle}
      />

      {/* 5. MODAL KAMUS ISTILAH APBD WARGA (MENTOR POINT #2) */}
      <BudgetGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
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

            {/* Desktop Navigation Dock (Modern Icon-First, Smooth Hover-Expanded - antislop-ui) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 border border-slate-200/80 p-1 rounded-2xl">
              {/* 1. Beranda */}
              <button 
                onClick={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative flex items-center h-8 px-2.5 rounded-xl transition-[background-color,color,border-color] duration-200 cursor-pointer ${
                  activeView === 'home' 
                    ? 'bg-white text-slate-900 font-bold border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
                title="Beranda & Kalkulator Pajak"
                aria-label="Beranda"
              >
                <Home className={`w-4 h-4 flex-shrink-0 transition-colors ${activeView === 'home' ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
                <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-1.5 group-focus-visible:max-w-[120px] group-focus-visible:opacity-100 group-focus-visible:ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-out">
                  Beranda
                </span>
                {activeView === 'home' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                )}
              </button>

              {/* 2. Pohon Alur APBD */}
              <button 
                onClick={() => {
                  setActiveView('explorer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative flex items-center h-8 px-2.5 rounded-xl transition-[background-color,color,border-color] duration-200 cursor-pointer ${
                  activeView === 'explorer' 
                    ? 'bg-white text-slate-900 font-bold border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
                title="Pohon Alur APBD (Rp 84,2 Triliun)"
                aria-label="Pohon Alur APBD"
              >
                <Workflow className={`w-4 h-4 flex-shrink-0 transition-colors ${activeView === 'explorer' ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
                <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-1.5 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100 group-focus-visible:ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-out">
                  Pohon Alur APBD
                </span>
                {activeView === 'explorer' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                )}
              </button>

              {/* 3. Kawal Proyek */}
              <button 
                onClick={() => {
                  setActiveView('map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative flex items-center h-8 px-2.5 rounded-xl transition-[background-color,color,border-color] duration-200 cursor-pointer ${
                  activeView === 'map' 
                    ? 'bg-white text-slate-900 font-bold border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
                title="Kawal Proyek Pembangunan DKI Jakarta"
                aria-label="Kawal Proyek"
              >
                <MapPin className={`w-4 h-4 flex-shrink-0 transition-colors ${activeView === 'map' ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
                <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-1.5 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100 group-focus-visible:ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-out">
                  Kawal Proyek
                </span>
                {activeView === 'map' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                )}
              </button>

              {/* 4. Simulasi Kota */}
              <button 
                onClick={() => {
                  setActiveView('simulator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative flex items-center h-8 px-2.5 rounded-xl transition-[background-color,color,border-color] duration-200 cursor-pointer ${
                  activeView === 'simulator' 
                    ? 'bg-white text-slate-900 font-bold border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
                title="The City Architect: Simulasi APBD Warga"
                aria-label="Simulasi Kota"
              >
                <Sliders className={`w-4 h-4 flex-shrink-0 transition-colors ${activeView === 'simulator' ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
                <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-1.5 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100 group-focus-visible:ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-out">
                  Simulasi Kota
                </span>
                {activeView === 'simulator' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                )}
              </button>

              {/* 5. Suara Warga / Aspirasi (Mentor Saran #4) */}
              <button
                onClick={() => {
                  setFeedbackCategory('usulan');
                  setFeedbackProjectTitle(undefined);
                  setIsFeedbackOpen(true);
                }}
                className="group relative flex items-center h-8 px-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-[background-color,color] duration-200 cursor-pointer"
                title="Kotak Suara & Aspirasi Warga"
                aria-label="Suara Warga"
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-1.5 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100 group-focus-visible:ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-out">
                  Suara Warga
                </span>
              </button>

              {/* 6. Kamus APBD (Mentor Saran #2) */}
              <button
                onClick={() => setIsGlossaryOpen(true)}
                className="group relative flex items-center h-8 px-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-[background-color,color] duration-200 cursor-pointer"
                title="Kamus Istilah APBD Warga"
                aria-label="Kamus APBD"
              >
                <BookOpen className="w-4 h-4 flex-shrink-0 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-1.5 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100 group-focus-visible:ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-out">
                  Kamus APBD
                </span>
              </button>

              {/* 7. Mengapa ANGIN */}
              <button
                onClick={() => {
                  if (activeView !== 'home') {
                    setActiveView('home');
                    setTimeout(() => document.getElementById('reality-gap')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  } else {
                    document.getElementById('reality-gap')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative flex items-center h-8 px-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-[background-color,color] duration-200 cursor-pointer"
                title="Mengapa ANGIN? (Data & Krisis Akuntabilitas)"
                aria-label="Mengapa ANGIN?"
              >
                <Info className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-slate-900 transition-colors" />
                <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-1.5 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100 group-focus-visible:ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-out">
                  Mengapa ANGIN?
                </span>
              </button>
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
            <span>Kawal Proyek</span>
          </button>
          <button
            onClick={() => {
              setActiveView('simulator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-1 cursor-pointer ${
              activeView === 'simulator'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulasi</span>
          </button>
          <button
            onClick={() => {
              setFeedbackCategory('usulan');
              setFeedbackProjectTitle(undefined);
              setIsFeedbackOpen(true);
            }}
            className="flex-1 py-2 text-xs font-bold rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900"
            title="Kotak Suara Warga"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aspirasi</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEW SWITCHER */}
      <Suspense fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 py-16">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Memuat modul interaktif ANGIN...</p>
        </div>
      }>
        {activeView === 'explorer' ? (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <BudgetFlowExplorer 
              onSelectProject={(project) => setSelectedProject(project)}
              onNavigateHome={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenFeedback={() => {
                setFeedbackCategory('usulan');
                setFeedbackProjectTitle(undefined);
                setIsFeedbackOpen(true);
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
        ) : activeView === 'simulator' ? (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <CityArchitectSimulator 
              onNavigateHome={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateExplorer={() => {
                setActiveView('explorer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </main>
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
              <strong className="text-slate-800 font-semibold">ANGIN</strong> mengubah data APBD menjadi rincian rupiah yang kamu belanjakan. Telusuri ke mana larinya uang pajakmu dan pantau proyek fisik yang sedang dibangun di jalanan sekitarmu.
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
                <span>Kawal Proyek di Peta</span>
              </button>

              <button 
                onClick={() => {
                  setActiveView('simulator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors min-h-[44px] cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Simulasi Arsitek Kota</span>
              </button>

              <button 
                onClick={() => {
                  setFeedbackCategory('usulan');
                  setFeedbackProjectTitle(undefined);
                  setIsFeedbackOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-4 py-3 rounded-xl text-sm border border-emerald-200 transition-colors min-h-[44px] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Kotak Aspirasi Warga</span>
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
                    <span>{showOtherSectors ? 'Sembunyikan Sektor Lainnya' : 'Buka Rincian 6 Sektor APBD Lengkap (100% / Rp 84,2 T)'}</span>
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showOtherSectors ? 'rotate-180' : ''}`} />
                </button>

                {showOtherSectors && (
                  <div className="mt-2 p-3.5 bg-slate-50 rounded-xl space-y-2.5 text-xs border border-slate-200/80 animate-in fade-in duration-200">
                    <div className="text-[11px] text-slate-500 font-medium pb-1 border-b border-slate-200 flex justify-between">
                      <span>Porsi 6 Sektor Utama Anggaran DKI:</span>
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
                <strong className="text-slate-500 font-semibold">Cara Hitung Kontribusi Pajak:</strong> Angka ini dihitung dari pajak konsumsi harian (seperti makan di restoran 10%), pajak motor/mobil, dan bagi hasil pajak penghasilan warga yang dikembalikan ke kas kota Jakarta.
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
              APBD adalah uang warga Jakarta. Setiap rupiah harus terbuka dan terasa manfaatnya langsung bagi kehidupan sehari-hari.
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
                <h4 className="text-lg font-bold text-slate-900 mb-2">Rupiah Nyata hingga Titik Peta</h4>
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
          
          {/* Card Kiri: Interactive Sankey Mini Flow Preview */}
          <BudgetFlowMiniPreview 
            income={income}
            onOpenExplorer={() => {
              setActiveView('explorer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReceipt={() => setIsReceiptOpen(true)}
          />

          {/* Card Kanan: Kawal Proyek Map Preview */}
          <div id="radar" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Kawal Proyek di Sekitarmu</h3>
                  <p className="text-xs text-slate-500">Klik pin di peta untuk melihat progres atau kawal proyek molor</p>
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

              {/* Real Interactive Leaflet Mini-Map Preview (Live Spasial APBD) */}
              <div data-ui="map-preview" className="h-72 rounded-xl relative overflow-hidden border border-slate-200 bg-slate-100">
                <MapContainer
                  center={[-6.2400, 106.8200]}
                  zoom={11}
                  className="w-full h-full z-10"
                  zoomControl={false}
                  scrollWheelZoom={false}
                  dragging={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {projectsWithCoords.map((proj) => {
                    const isDelayed = proj.status_color === 'red' || Boolean(proj.days_delayed && proj.days_delayed > 0);
                    return (
                      <Marker
                        key={proj.id}
                        position={[proj.coordinates![0], proj.coordinates![1]]}
                        icon={createHomePreviewPin(proj.status_color, isDelayed)}
                      >
                        <Popup className="govtech-popup">
                          <div className="p-3 space-y-2 max-w-[240px]">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-semibold text-slate-500 truncate">{proj.location}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                                isDelayed ? 'bg-rose-100 text-rose-800' : proj.status_color === 'yellow' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isDelayed ? `${proj.days_delayed}h Molor` : proj.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 leading-snug">{proj.title}</h4>
                            <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Pagu:</span>
                                <span className="font-bold text-slate-900 tabular-nums">{formatRupiah(proj.budget)}</span>
                              </div>
                              <div className="flex justify-between mt-0.5">
                                <span className="text-slate-500">Progres:</span>
                                <span className="font-bold text-slate-800 tabular-nums">{proj.progress}%</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedProject(proj)}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Buka Lembar Audit</span>
                              <ArrowRight className="w-3 h-3 text-emerald-400" />
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>

                {/* Floating Map Legend (Bottom Left) */}
                <div className="absolute bottom-2.5 left-2.5 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-2 text-[10px] space-y-1 shadow-sm hidden sm:block">
                  <div className="font-bold text-slate-800 text-[10px]">Status Proyek ({projectsWithCoords.length})</div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Selesai</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 ml-1"></span>
                    <span>Berjalan</span>
                    <span className="w-2 h-2 rounded-full bg-rose-600 ml-1"></span>
                    <span className="text-rose-700 font-bold">Molor</span>
                  </div>
                </div>

                {/* Floating "Layar Penuh" Button (Bottom Right) */}
                <div className="absolute bottom-2.5 right-2.5 z-20">
                  <button
                    onClick={() => {
                      setActiveView('map');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-slate-900/90 hover:bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-sm min-h-[36px]"
                  >
                    <span>Layar Penuh</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Tersedia mode peta offline tanpa kuota internet</span>
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
      </Suspense>

      {/* FOOTER (Shown on non-map views) */}
      {activeView !== 'map' && (
        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">ANGIN</span>
              <span>(Anggaran Indonesia) • Inisiatif Keterbukaan Data Warga</span>
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
