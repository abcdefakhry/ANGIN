import React, { useState, useMemo } from 'react';
import { 
  Building, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Layers,
  Info,
  Filter,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import apbdData from '../data/apbd-jakarta.json';
import { ProjectDetail } from './ProjectActionModal';

interface BudgetFlowExplorerProps {
  onSelectProject: (project: ProjectDetail) => void;
  onNavigateHome?: () => void;
}

export const BudgetFlowExplorer: React.FC<BudgetFlowExplorerProps> = ({
  onSelectProject,
  onNavigateHome
}) => {
  // Default selected sector: Infrastruktur (agar langsung memikat juri)
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sec-infra');
  // Default selected sub-program: Pemeliharaan Jalan
  const [selectedSubProgramId, setSelectedSubProgramId] = useState<string | null>('sub-jalan');
  // Filter status proyek: 'all' | 'delayed' | 'ongoing' | 'completed'
  const [statusFilter, setStatusFilter] = useState<'all' | 'delayed' | 'ongoing' | 'completed'>('all');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  const selectedSector = apbdData.sectors.find((s) => s.id === selectedSectorId) || apbdData.sectors[0];
  const selectedSubProgram = selectedSector.sub_programs.find((sp) => sp.id === selectedSubProgramId) || selectedSector.sub_programs[0];

  // Cast sub_programs projects to ProjectDetail[]
  const rawProjects = (selectedSubProgram?.projects || []) as ProjectDetail[];

  // Filter projects by status
  const filteredProjects = useMemo(() => {
    if (statusFilter === 'all') return rawProjects;
    if (statusFilter === 'delayed') {
      return rawProjects.filter((p) => p.status_color === 'red' || (p.days_delayed && p.days_delayed > 0));
    }
    if (statusFilter === 'ongoing') {
      return rawProjects.filter((p) => p.status_color === 'yellow');
    }
    if (statusFilter === 'completed') {
      return rawProjects.filter((p) => p.status_color === 'green' || p.progress === 100);
    }
    return rawProjects;
  }, [rawProjects, statusFilter]);

  // Total projects in current sector
  const totalSectorProjects = useMemo(() => {
    return selectedSector.sub_programs.reduce((acc, sp) => acc + sp.projects.length, 0);
  }, [selectedSector]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* 0. TOP ACTION / BACK BUTTON */}
      {onNavigateHome && (
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer group min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda &amp; Kalkulator Pajak</span>
          </button>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Eksplorasi Transparansi APBD DKI Jakarta 2026
          </span>
        </div>
      )}

      {/* 1. TOP MACRO BANNER: TOTAL APBD & SERAPAN ANGGARAN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 relative overflow-hidden">
        {/* Decorative subtle background aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Dokumen Resmi APBD DKI Jakarta • Tahun Anggaran 2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Pohon Aliran Anggaran Publik
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Telusuri bagaimana uang pajak rakyat sebesar <strong className="text-slate-900 font-bold">Rp 84,2 Triliun</strong> dialirkan dari porsi makro hingga menjadi paket aspal jalanan, puskesmas, dan penanggulangan banjir.
            </p>
          </div>

          {/* Quick Macro Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex-shrink-0 min-w-[280px]">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total APBD DKI 2026
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              Rp 84,2 Triliun
            </div>

            {/* Serapan Realisasi Bar */}
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Realisasi Serapan (Q3):</span>
                </span>
                <span className="font-bold text-slate-900">{apbdData.realization_percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div 
                  style={{ width: `${apbdData.realization_percentage}%` }}
                  className="h-full bg-emerald-600 rounded-full transition-[width] duration-700"
                />
              </div>
              <div className="text-[10px] text-slate-400 text-right">
                Rp 57,2 Triliun terserap per Oktober 2026
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Proportional Macro Flow Bar (100% APBD Breakdown) */}
        <div className="pt-5 pb-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Aliran Proporsi 6 Sektor Makro APBD DKI:</span>
            <span className="text-slate-500 tabular-nums font-semibold text-[11px]">Total 100% (Rp 84,2 T)</span>
          </div>

          {/* Horizontal multi-color bar */}
          <div className="h-5 w-full bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
            {apbdData.sectors.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSectorId(sec.id);
                  if (sec.sub_programs.length > 0) {
                    setSelectedSubProgramId(sec.sub_programs[0].id);
                  } else {
                    setSelectedSubProgramId(null);
                  }
                }}
                style={{ 
                  width: `${sec.percentage}%`,
                  backgroundColor: sec.color
                }}
                title={`${sec.name}: ${sec.percentage}% (${formatRupiah(sec.budget)})`}
                className={`h-full transition-opacity relative group cursor-pointer border-r border-white/30 last:border-r-0 ${
                  sec.id === selectedSectorId ? 'brightness-110 ring-2 ring-slate-900/40 z-10' : 'hover:brightness-110 opacity-90 hover:opacity-100'
                }`}
              >
                <span className="sr-only">{sec.name} {sec.percentage}%</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-y-1 gap-x-3 text-[11px] text-slate-500 mt-2 font-medium">
            {apbdData.sectors.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSectorId(sec.id);
                  if (sec.sub_programs.length > 0) {
                    setSelectedSubProgramId(sec.sub_programs[0].id);
                  } else {
                    setSelectedSubProgramId(null);
                  }
                }}
                className={`flex items-center gap-1.5 transition cursor-pointer ${
                  sec.id === selectedSectorId ? 'font-bold text-slate-900 underline underline-offset-4' : 'hover:text-slate-900'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sec.color }} />
                <span>{sec.name} ({sec.percentage}%)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Breadcrumbs Navigation */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium overflow-x-auto py-1">
            <span className="text-slate-400">Jalur Bedah:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md whitespace-nowrap">
              DKI Jakarta (Rp 84,2 T)
            </span>
            <span className="text-slate-400">/</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md whitespace-nowrap">
              {selectedSector.name} ({selectedSector.percentage}%)
            </span>
            {selectedSubProgram && (
              <>
                <span className="text-slate-400">/</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                  {selectedSubProgram.name}
                </span>
              </>
            )}
          </div>

          <button 
            onClick={() => {
              setSelectedSectorId('sec-infra');
              setSelectedSubProgramId('sub-jalan');
              setStatusFilter('all');
            }}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold transition cursor-pointer min-h-[36px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Infrastruktur</span>
          </button>
        </div>
      </div>

      {/* 2. LEVEL 2: 6 SECTOR CARDS (INTERACTIVE GRID) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Langkah 1: Pilih Sektor Utama APBD (Total 100%)
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Klik sektor untuk membuka rincian sub-program</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {apbdData.sectors.map((sector) => {
            const isSelected = sector.id === selectedSectorId;
            return (
              <button
                key={sector.id}
                onClick={() => {
                  setSelectedSectorId(sector.id);
                  if (sector.sub_programs.length > 0) {
                    setSelectedSubProgramId(sector.sub_programs[0].id);
                  } else {
                    setSelectedSubProgramId(null);
                  }
                }}
                className={`text-left p-4 rounded-2xl border transition-colors duration-150 flex flex-col justify-between min-h-[124px] cursor-pointer group ${
                  isSelected
                    ? 'bg-white border-2 border-emerald-600 ring-2 ring-emerald-600/20'
                    : 'bg-white border border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: sector.color }}
                    />
                    <span className={`text-xs font-black ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {sector.percentage}%
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                    {sector.name}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-slate-900 tabular-nums">
                    {formatRupiah(sector.budget).replace(',00', '')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. LEVEL 3 & 4: SPLIT PANEL (SUB-PROGRAMS & REAL PROJECTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 Cols): Sub-Programs List */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Langkah 2: Sub-Program
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                {selectedSector.name}
              </h4>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums">
              {formatRupiah(selectedSector.budget)}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed italic">
            {selectedSector.description}
          </p>

          {/* Sub-Programs Accordion / List */}
          <div className="space-y-2.5 pt-2">
            {selectedSector.sub_programs.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 border border-slate-200 space-y-2">
                <FileSpreadsheet className="w-6 h-6 text-slate-400 mx-auto" />
                <p>Alokasi belanja rutin operasional dan gaji ASN/Guru/Nakes yang diatur oleh Peraturan Gubernur DKI Jakarta.</p>
                <div className="font-bold text-slate-700 text-xs tabular-nums">Total: {formatRupiah(selectedSector.budget)}</div>
              </div>
            ) : (
              selectedSector.sub_programs.map((sub) => {
                const isSubSelected = sub.id === selectedSubProgramId;
                const percentageOfSector = Math.round((sub.budget / selectedSector.budget) * 100);
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubProgramId(sub.id)}
                    className={`p-4 rounded-2xl border transition-colors duration-150 cursor-pointer ${
                      isSubSelected
                        ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-slate-900 leading-snug">
                          {sub.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {sub.projects.length > 0 
                            ? `${sub.projects.length} paket pengerjaan terpetakan` 
                            : 'Program berskala terpusat'}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-extrabold text-xs text-emerald-800 tabular-nums">
                          {formatRupiah(sub.budget)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold tabular-nums">
                          {percentageOfSector}% dari sektor
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar within Sector */}
                    <div className="mt-3 pt-2 border-t border-slate-200">
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${percentageOfSector}%` }}
                          className="h-full bg-emerald-600 rounded-full transition-[width] duration-300"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
            <span>Total Proyek di Sektor Ini:</span>
            <span className="font-bold text-slate-700">{totalSectorProjects} Paket Terdaftar</span>
          </div>
        </div>

        {/* Right Column (7 Cols): Physical Projects & Human Conversion Card */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* HUMAN CONVERSION INSIGHT CARD (Fitur Cerdas Penilaian Guidebook) */}
          {selectedSubProgram?.human_conversion && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-800 mb-0.5">
                    Konversi dampak riil warga
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                    "{selectedSubProgram.human_conversion}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PHYSICAL PROJECTS LIST */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Langkah 3: Bukti Fisik di Lapangan
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Paket Pengerjaan: {selectedSubProgram?.name || selectedSector.name}
                </h4>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                    statusFilter === 'all' ? 'bg-white text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setStatusFilter('delayed')}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                    statusFilter === 'delayed' ? 'bg-rose-600 text-white font-bold' : 'text-rose-600 hover:text-rose-800'
                  }`}
                >
                  Terlambat
                </button>
                <button
                  onClick={() => setStatusFilter('ongoing')}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                    statusFilter === 'ongoing' ? 'bg-amber-500 text-white font-bold' : 'text-amber-700 hover:text-amber-900'
                  }`}
                >
                  Berjalan
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                    statusFilter === 'completed' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  Selesai
                </button>
              </div>
            </div>

            {/* List of Projects */}
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <span>Tidak ada paket dengan filter ini. Cobalah ganti filter status atau pilih sub-program lainnya.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((proj) => {
                  const isDelayed = proj.status_color === 'red' || Boolean(proj.days_delayed && proj.days_delayed > 0);
                  return (
                    <div
                      key={proj.id}
                      onClick={() => onSelectProject(proj)}
                      className={`p-4 rounded-2xl border transition-colors duration-150 cursor-pointer group ${
                        isDelayed
                          ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                          : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition">
                            {proj.title}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span 
                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 self-start sm:self-auto ${
                            proj.status_color === 'green'
                              ? 'bg-emerald-100 text-emerald-800'
                              : isDelayed
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {proj.status_color === 'green' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isDelayed ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{proj.status} ({proj.progress}%)</span>
                        </span>
                      </div>

                      {/* Location & Contractor */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{proj.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{proj.contractor}</span>
                        </span>
                        {proj.target_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Tenggat: {proj.target_date}</span>
                          </span>
                        )}
                      </div>

                      {/* Progress Bar & Contract Value */}
                      <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex-1 max-w-xs space-y-1">
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${proj.progress}%` }}
                              className={`h-full rounded-full transition-[width] duration-500 ${
                                proj.status_color === 'green'
                                  ? 'bg-emerald-600'
                                  : isDelayed
                                  ? 'bg-rose-600'
                                  : 'bg-amber-500'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="font-extrabold text-xs sm:text-sm text-slate-900 tabular-nums">
                            {formatRupiah(proj.budget)}
                          </div>
                          <div className="text-[11px] font-bold text-emerald-600 group-hover:underline flex items-center gap-0.5">
                            <span>Buka Audit</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      {/* Delayed Alert Callout */}
                      {isDelayed && (
                        <div className="mt-2.5 pt-2 border-t border-rose-200 flex items-center justify-between text-[11px] text-rose-700 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Terlambat {proj.days_delayed || 69} hari dari batas kontrak</span>
                          </span>
                          <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded">
                            Teruskan Aduan Publik
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
