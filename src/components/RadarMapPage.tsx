import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, 
  AlertTriangle, 
  SlidersHorizontal, 
  Wifi, 
  WifiOff, 
  X, 
  ExternalLink,
  RotateCcw,
  MapPin
} from 'lucide-react';
import { ProjectDetail } from './ProjectActionModal';
import apbdData from '../data/apbd-jakarta.json';

interface RadarMapPageProps {
  onSelectProject: (project: ProjectDetail) => void;
  onNavigateHome: () => void;
}

interface ExtendedProject extends ProjectDetail {
  sectorName: string;
  sectorColor: string;
  subProgramName: string;
}

// Map Center Controller Helper
function MapCenterController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export const RadarMapPage: React.FC<RadarMapPageProps> = ({
  onSelectProject,
  onNavigateHome,
}) => {
  // Extract all projects from APBD dataset with sector metadata
  const allProjects = useMemo<ExtendedProject[]>(() => {
    const list: ExtendedProject[] = [];
    for (const sector of apbdData.sectors) {
      for (const sub of sector.sub_programs) {
        for (const proj of sub.projects) {
          list.push({
            ...proj,
            sectorName: sector.name,
            sectorColor: sector.color,
            subProgramName: sub.name,
          });
        }
      }
    }
    return list;
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilayah, setSelectedWilayah] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | 'Terlambat' | 'Dalam Pengerjaan' | 'Selesai'>('Semua');
  const [selectedSector, setSelectedSector] = useState('Semua');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  // Offline Demonstration Toggle
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  // Map Navigation Focus State
  const defaultJakartaCenter: [number, number] = [-6.2088, 106.8456];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultJakartaCenter);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Sync with browser online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  // Wilayah List
  const wilayahOptions = [
    'Semua',
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Timur',
    'Jakarta Utara'
  ];

  // Sector List
  const sectorOptions = useMemo(() => {
    const names = Array.from(new Set(allProjects.map((p) => p.sectorName)));
    return ['Semua', ...names];
  }, [allProjects]);

  // Filtered Projects Logic
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Search matching title, contractor, location
      const queryMatch = 
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Wilayah matching
      const wilayahMatch = 
        selectedWilayah === 'Semua' || 
        p.location.toLowerCase().includes(selectedWilayah.toLowerCase().replace('jakarta ', ''));

      // Status matching
      let statusMatch = true;
      if (selectedStatus === 'Terlambat') {
        statusMatch = p.status_color === 'red' || (p.days_delayed && p.days_delayed > 0) || p.status.toLowerCase().includes('terlambat');
      } else if (selectedStatus === 'Dalam Pengerjaan') {
        statusMatch = p.status_color === 'yellow' || p.status.toLowerCase().includes('pengerjaan');
      } else if (selectedStatus === 'Selesai') {
        statusMatch = p.status_color === 'green' || p.status.toLowerCase().includes('selesai');
      }

      // Sector matching
      const sectorMatch = selectedSector === 'Semua' || p.sectorName === selectedSector;

      return queryMatch && wilayahMatch && statusMatch && sectorMatch;
    });
  }, [allProjects, searchQuery, selectedWilayah, selectedStatus, selectedSector]);

  // Key Statistics
  const totalPaguFiltered = useMemo(() => {
    return filteredProjects.reduce((acc, p) => acc + p.budget, 0);
  }, [filteredProjects]);

  const delayedCount = useMemo(() => {
    return allProjects.filter((p) => p.status_color === 'red' || (p.days_delayed && p.days_delayed > 0)).length;
  }, [allProjects]);

  // Create Leaflet DivIcon
  const createCustomPin = (proj: ExtendedProject, isSelected: boolean) => {
    const isDelayed = proj.status_color === 'red' || (proj.days_delayed && proj.days_delayed > 0);
    
    let bgColor = '#059669'; // Emerald
    let ringColor = 'rgba(5, 150, 105, 0.25)';
    let innerContent = '<div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>';

    if (isDelayed) {
      bgColor = '#e11d48'; // Rose
      ringColor = 'rgba(225, 29, 72, 0.35)';
      innerContent = '<div style="color: white; font-size: 11px; font-weight: 900; line-height: 1;">!</div>';
    } else if (proj.status_color === 'yellow') {
      bgColor = '#d97706'; // Amber
      ringColor = 'rgba(217, 119, 6, 0.25)';
      innerContent = '<div style="width: 7px; height: 7px; background: white; border-radius: 50%;"></div>';
    }

    const pinSize = isSelected ? 40 : 32;
    const innerSize = isSelected ? 26 : 22;

    return L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div style="position: relative; width: ${pinSize}px; height: ${pinSize}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: ${ringColor};"></div>
          <div style="position: relative; width: ${innerSize}px; height: ${innerSize}px; border-radius: 50%; background: ${bgColor}; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
            ${innerContent}
          </div>
        </div>
      `,
      iconSize: [pinSize, pinSize],
      iconAnchor: [pinSize / 2, pinSize / 2],
      popupAnchor: [0, -(pinSize / 2)],
    });
  };

  // Center map on specific project
  const handleFocusProject = (proj: ExtendedProject) => {
    if (proj.coordinates && proj.coordinates.length === 2) {
      setMapCenter([proj.coordinates[0], proj.coordinates[1]]);
      setMapZoom(15);
      setActiveProjectId(proj.id);
      setIsMobileDrawerOpen(false);
    }
  };

  // Reset to Jakarta default view
  const handleResetMap = () => {
    setMapCenter(defaultJakartaCenter);
    setMapZoom(12);
    setActiveProjectId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] w-full overflow-hidden bg-slate-50">
      
      {/* 1. TOP SUB-HEADER BAR */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer min-h-[44px] sm:min-h-0"
          >
            <span>&larr;</span>
            <span>Beranda</span>
          </button>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Radar Proyek Fisik APBD DKI 2026
            </h1>
            <span className="hidden sm:inline-block text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full tabular-nums">
              {filteredProjects.length} Titik Proyek Terpetakan
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Filter: Molor */}
          <button
            onClick={() => {
              if (selectedStatus === 'Terlambat') {
                setSelectedStatus('Semua');
              } else {
                setSelectedStatus('Terlambat');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer min-h-[44px] sm:min-h-0 ${
              selectedStatus === 'Terlambat'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Fokus Molor ({delayedCount})</span>
          </button>

          {/* Offline / Online Demonstration Mode Switcher */}
          <button
            onClick={() => setIsOfflineMode((prev) => !prev)}
            title="Klik untuk mensimulasikan mode pameran offline tanpa internet"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer min-h-[44px] sm:min-h-0 ${
              isOfflineMode 
                ? 'bg-amber-50 border-amber-300 text-amber-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold">Mode Offline (Vector)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xs:inline">Online (OSM)</span>
              </>
            )}
          </button>

          {/* Reset Map Center */}
          <button
            onClick={handleResetMap}
            title="Pusatkan kembali ke DKI Jakarta"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[44px] sm:min-h-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Reset Posisi</span>
          </button>
        </div>
      </div>

      {/* 2. BODY CONTENT: SPLIT SIDEBAR & MAP CANVAS */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* LEFT SIDEBAR: FILTERS & PROJECT DIRECTORY (Desktop Persistent, Mobile Drawer) */}
        <aside 
          className={`
            fixed md:relative inset-y-0 left-0 z-30 w-full xs:w-88 md:w-88 lg:w-96 bg-white border-r border-slate-200 
            flex flex-col transition-transform duration-200 md:translate-x-0
            ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Mobile Drawer Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Filter &amp; Daftar Proyek</span>
            </div>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Top: Search & Filters */}
          <div className="p-4 border-b border-slate-100 space-y-3.5 bg-white">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari jalan, kontraktor, proyek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Wilayah Horizontal Tabs */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 mb-1.5">Wilayah Kota Administrasi</div>
              <div className="flex gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
                {wilayahOptions.map((wil) => (
                  <button
                    key={wil}
                    onClick={() => setSelectedWilayah(wil)}
                    className={`px-2.5 py-1 rounded-md whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer min-h-[36px] flex items-center ${
                      selectedWilayah === wil
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {wil.replace('Jakarta ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 mb-1.5">Status Pengerjaan</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {(['Semua', 'Terlambat', 'Dalam Pengerjaan', 'Selesai'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors text-left flex items-center justify-between cursor-pointer min-h-[38px] ${
                      selectedStatus === st
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{st}</span>
                    <span className="w-2 h-2 rounded-full inline-block" style={{
                      backgroundColor: st === 'Terlambat' ? '#e11d48' : st === 'Dalam Pengerjaan' ? '#d97706' : st === 'Selesai' ? '#059669' : '#94a3b8'
                    }}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sector Selector */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 mb-1.5">Bidang Sektor</div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[40px]"
              >
                {sectorOptions.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Filter Summary Stats */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-[11px] text-slate-600">
            <span>Menampilkan <strong>{filteredProjects.length}</strong> proyek</span>
            <span className="font-bold tabular-nums text-slate-800">{formatRupiah(totalPaguFiltered)}</span>
          </div>

          {/* Scrollable Project Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
            {filteredProjects.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Tidak ada proyek yang sesuai dengan kombinasi filter di atas.
              </div>
            ) : (
              filteredProjects.map((proj) => {
                const isDelayed = proj.status_color === 'red' || (proj.days_delayed && proj.days_delayed > 0);
                const isSelected = activeProjectId === proj.id;

                return (
                  <div
                    key={proj.id}
                    onClick={() => handleFocusProject(proj)}
                    className={`pt-2.5 first:pt-0 p-2 rounded-xl transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-50/80 border border-emerald-300' 
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{proj.location}</span>
                        </span>
                        <h2 className="text-xs font-bold text-slate-900 leading-snug hover:text-emerald-700 transition-colors">
                          {proj.title}
                        </h2>
                      </div>

                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0 ${
                        isDelayed
                          ? 'bg-rose-100 text-rose-800'
                          : proj.status_color === 'yellow'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isDelayed ? `${proj.days_delayed} hr Molor` : proj.status}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{proj.contractor}</span>
                      <span className="font-bold text-slate-800 tabular-nums">{formatRupiah(proj.budget)}</span>
                    </div>

                    {/* Progress mini bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            isDelayed ? 'bg-rose-500' : proj.status_color === 'yellow' ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${proj.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 tabular-nums">
                        {proj.progress}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </aside>

        {/* RIGHT CANVAS: MAP AREA (Leaflet or Offline Vector Fallback) */}
        <main className="flex-1 relative h-full w-full overflow-hidden">
          
          {/* OFFLINE VECTOR FALLBACK MODE */}
          {isOfflineMode ? (
            <div data-ui="map-canvas" className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
              
              {/* Top Banner Explaining Offline Mode */}
              <div className="absolute top-4 inset-x-4 max-w-lg mx-auto bg-amber-950/90 border border-amber-600/50 rounded-xl p-3 text-amber-200 text-xs flex items-center gap-3 z-10">
                <WifiOff className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-amber-100">Mode Presentasi Offline (Tanpa Internet)</div>
                  <div>Peta beralih ke layer vektor skematik Jakarta. Seluruh titik proyek dan data audit tetap dapat diklik secara lokal.</div>
                </div>
              </div>

              {/* Jakarta Schematic SVG Map */}
              <div className="relative w-full max-w-2xl h-[420px] flex items-center justify-center">
                <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow">
                  {/* Jakarta Coastline / Sea */}
                  <rect x="0" y="0" width="800" height="160" fill="#0f172a" opacity="0.6" />
                  
                  {/* North Jakarta */}
                  <path 
                    d="M 160 160 Q 300 130 500 150 T 720 180 L 700 240 Q 450 220 200 230 Z" 
                    fill="#1e293b" 
                    stroke="#334155" 
                    strokeWidth="2"
                  />
                  <text x="440" y="200" fill="#64748b" fontSize="13" fontWeight="bold">JAKARTA UTARA</text>

                  {/* West Jakarta */}
                  <path 
                    d="M 120 230 L 280 235 L 300 370 L 140 380 Z" 
                    fill="#1e293b" 
                    stroke="#334155" 
                    strokeWidth="2"
                  />
                  <text x="170" y="310" fill="#64748b" fontSize="13" fontWeight="bold">JAKARTA BARAT</text>

                  {/* Central Jakarta */}
                  <path 
                    d="M 285 235 L 490 230 L 480 360 L 295 365 Z" 
                    fill="#334155" 
                    stroke="#475569" 
                    strokeWidth="2"
                  />
                  <text x="340" y="300" fill="#94a3b8" fontSize="13" fontWeight="bold">JAKARTA PUSAT</text>

                  {/* East Jakarta */}
                  <path 
                    d="M 495 230 L 710 240 L 720 480 L 485 450 Z" 
                    fill="#1e293b" 
                    stroke="#334155" 
                    strokeWidth="2"
                  />
                  <text x="560" y="360" fill="#64748b" fontSize="13" fontWeight="bold">JAKARTA TIMUR</text>

                  {/* South Jakarta */}
                  <path 
                    d="M 145 385 L 480 370 L 480 540 L 220 550 Z" 
                    fill="#1e293b" 
                    stroke="#334155" 
                    strokeWidth="2"
                  />
                  <text x="270" y="470" fill="#64748b" fontSize="13" fontWeight="bold">JAKARTA SELATAN</text>

                  {/* Project Dots in SVG Space */}
                  {filteredProjects.map((p) => {
                    if (!p.coordinates || p.coordinates.length !== 2) return null;
                    const lat = p.coordinates[0];
                    const lng = p.coordinates[1];

                    // Project coordinates onto 800x600 SVG canvas
                    // Lat range: -6.37 to -6.10 (North to South)
                    // Lng range: 106.70 to 106.98 (West to East)
                    const x = ((lng - 106.70) / (106.98 - 106.70)) * 620 + 90;
                    const y = ((-6.10 - lat) / (-6.10 - -6.37)) * 400 + 150;

                    const isDelayed = p.status_color === 'red' || (p.days_delayed && p.days_delayed > 0);
                    const color = isDelayed ? '#e11d48' : p.status_color === 'yellow' ? '#d97706' : '#059669';

                    return (
                      <g 
                        key={p.id} 
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => onSelectProject(p)}
                      >
                        <circle cx={x} cy={y} r="14" fill={color} opacity="0.3" />
                        <circle cx={x} cy={y} r="8" fill={color} stroke="#ffffff" strokeWidth="2" />
                        {isDelayed && (
                          <text x={x} y={y + 3.5} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">!</text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom Instructions */}
              <div className="absolute bottom-4 text-center text-xs text-slate-400">
                Klik salah satu titik lingkaran pada peta untuk membuka lembar audit proyek dan aduan warga.
              </div>

            </div>
          ) : (
            
            /* ONLINE LEAFLET INTERACTIVE MAP */
            <div data-ui="map-canvas" className="w-full h-full relative">
              <MapContainer
                center={defaultJakartaCenter}
                zoom={12}
                className="w-full h-full z-10"
                zoomControl={true}
                scrollWheelZoom={true}
              >
                <MapCenterController center={mapCenter} zoom={mapZoom} />
                
                {/* Clean OpenStreetMap Tile Layer */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Plot Pins for All Filtered Projects */}
                {filteredProjects.map((proj) => {
                  if (!proj.coordinates || proj.coordinates.length !== 2) return null;
                  const isDelayed = proj.status_color === 'red' || (proj.days_delayed && proj.days_delayed > 0);
                  const isSelected = activeProjectId === proj.id;

                  return (
                    <Marker
                      key={proj.id}
                      position={[proj.coordinates[0], proj.coordinates[1]]}
                      icon={createCustomPin(proj, isSelected)}
                      eventHandlers={{
                        click: () => {
                          setActiveProjectId(proj.id);
                        }
                      }}
                    >
                      <Popup className="govtech-popup">
                        <div className="p-3.5 space-y-2.5 max-w-[270px]">
                          {/* Popup Header */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-semibold text-slate-500 truncate">
                              {proj.location}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                              isDelayed 
                                ? 'bg-rose-100 text-rose-800' 
                                : proj.status_color === 'yellow'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isDelayed ? `${proj.days_delayed} Hari Molor` : proj.status}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-xs text-slate-900 leading-snug">
                            {proj.title}
                          </h3>

                          {/* Contractor & Budget */}
                          <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Kontraktor:</span>
                              <span className="font-medium truncate max-w-[140px] text-slate-800">{proj.contractor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Nilai Pagu:</span>
                              <span className="font-bold text-slate-900 tabular-nums">{formatRupiah(proj.budget)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Realisasi:</span>
                              <span className="font-bold text-slate-800 tabular-nums">{proj.progress}%</span>
                            </div>
                          </div>

                          {/* Delayed Notice Alert */}
                          {isDelayed && (
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-[10px] text-rose-800 flex items-start gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong>Melewati Target Kontrak:</strong> Terlambat {proj.days_delayed} hari. Warga berhak melayangkan aduan audit publik.
                              </div>
                            </div>
                          )}

                          {/* Action Button: Open Audit Modal */}
                          <button
                            onClick={() => onSelectProject(proj)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                          >
                            <span>Buka Lembar Audit &amp; Aduan</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Floating Legend Box (Bottom Left) */}
              <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 shadow-sm hidden sm:block">
                <div className="font-bold text-slate-800 text-[11px]">Legenda Status Proyek</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white"></span>
                  <span>Selesai Tepat Waktu (100%)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span>
                  <span>Sedang Dikerjakan</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-rose-600 border border-white flex items-center justify-center text-[9px] text-white font-black">!</span>
                  <span className="font-bold text-rose-700">Terlambat / Melewati Deadline</span>
                </div>
              </div>

            </div>
          )}

          {/* Mobile Bottom Float Button to Open Drawer */}
          <div className="md:hidden absolute bottom-4 inset-x-4 z-20 flex justify-center pointer-events-none">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="pointer-events-auto bg-slate-900 text-white font-bold text-xs py-3 px-5 rounded-full flex items-center gap-2 shadow-lg min-h-[44px] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Daftar &amp; Filter Proyek ({filteredProjects.length})</span>
            </button>
          </div>

        </main>

      </div>

    </div>
  );
};
