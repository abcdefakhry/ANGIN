import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Filter,
  Wrench,
  GraduationCap,
  HeartPulse,
  Users,
  TreePine,
  Check,
  Building
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
  // Wizard Step State: 1 = Pilih Sektor, 2 = Pilih Sub-Program & Dampak, 3 = Bukti Proyek Lapangan
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Selected Sector & Sub-Program
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sec-infra');
  const [selectedSubProgramId, setSelectedSubProgramId] = useState<string>('sub-jalan');
  
  // Status Filter for Step 3: 'all' | 'delayed' | 'ongoing' | 'completed'
  const [statusFilter, setStatusFilter] = useState<'all' | 'delayed' | 'ongoing' | 'completed'>('all');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  const selectedSector = useMemo(() => {
    return apbdData.sectors.find((s) => s.id === selectedSectorId) || apbdData.sectors[0];
  }, [selectedSectorId]);

  const selectedSubProgram = useMemo(() => {
    return (
      selectedSector.sub_programs.find((sp) => sp.id === selectedSubProgramId) ||
      selectedSector.sub_programs[0] ||
      null
    );
  }, [selectedSector, selectedSubProgramId]);

  // Cast sub_programs projects to ProjectDetail[]
  const rawProjects = useMemo(() => {
    return (selectedSubProgram?.projects || []) as ProjectDetail[];
  }, [selectedSubProgram]);

  // Filter projects by status
  const filteredProjects = useMemo(() => {
    if (statusFilter === 'all') return rawProjects;
    if (statusFilter === 'delayed') {
      return rawProjects.filter((p) => p.status_color === 'red' || Boolean(p.days_delayed && p.days_delayed > 0));
    }
    if (statusFilter === 'ongoing') {
      return rawProjects.filter((p) => p.status_color === 'yellow');
    }
    if (statusFilter === 'completed') {
      return rawProjects.filter((p) => p.status_color === 'green' || p.progress === 100);
    }
    return rawProjects;
  }, [rawProjects, statusFilter]);

  // Icon mapping for each sector
  const getSectorIcon = (sectorId: string) => {
    switch (sectorId) {
      case 'sec-infra':
        return <Wrench className="w-5 h-5 text-emerald-600" />;
      case 'sec-pendidikan':
        return <GraduationCap className="w-5 h-5 text-slate-800" />;
      case 'sec-kesehatan':
        return <HeartPulse className="w-5 h-5 text-sky-600" />;
      case 'sec-pegawai':
        return <Building2 className="w-5 h-5 text-slate-600" />;
      case 'sec-sosial':
        return <Users className="w-5 h-5 text-amber-600" />;
      case 'sec-lingkungan':
        return <TreePine className="w-5 h-5 text-emerald-700" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* 0. NAVIGATION & TOP CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {onNavigateHome ? (
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer min-h-[44px] px-2"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Kembali ke Beranda</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">
            Total APBD DKI 2026: <strong className="text-slate-900 tabular-nums">Rp 84,2 Triliun</strong>
          </span>
          <button
            onClick={() => {
              setCurrentStep(1);
              setSelectedSectorId('sec-infra');
              setSelectedSubProgramId('sub-jalan');
              setStatusFilter('all');
            }}
            title="Kembali ke awal langkah 1"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[36px]"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Mulai Ulang</span>
          </button>
        </div>
      </div>

      {/* 1. STEPPER PROGRESS BAR (GUIDED DRILL-DOWN) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs font-bold mb-3">
          <span className="text-slate-600 text-xs font-semibold">
            Alur Penelusuran Anggaran
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] tabular-nums">
            Langkah {currentStep} dari 3
          </span>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {/* Step 1 Button */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] flex items-center justify-between gap-2 ${
              currentStep === 1
                ? 'bg-slate-900 border-slate-900 text-white font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="truncate">
              <div className={`text-[10px] ${currentStep === 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                1. Sektor Makro
              </div>
              <div className="truncate text-xs">
                {currentStep > 1 ? selectedSector.name : 'Pilih Sektor APBD'}
              </div>
            </div>
            {currentStep > 1 && <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
          </button>

          {/* Step 2 Button */}
          <button
            onClick={() => {
              if (selectedSector) setCurrentStep(2);
            }}
            className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] flex items-center justify-between gap-2 ${
              currentStep === 2
                ? 'bg-slate-900 border-slate-900 text-white font-bold'
                : currentStep > 2
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div className="truncate">
              <div className={`text-[10px] ${currentStep === 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                2. Sub-Program
              </div>
              <div className="truncate text-xs">
                {currentStep === 3 && selectedSubProgram ? selectedSubProgram.name : 'Rincian & Dampak'}
              </div>
            </div>
            {currentStep > 2 && <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
          </button>

          {/* Step 3 Button */}
          <button
            onClick={() => {
              if (selectedSubProgram) setCurrentStep(3);
            }}
            className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer min-h-[44px] flex items-center justify-between gap-2 ${
              currentStep === 3
                ? 'bg-slate-900 border-slate-900 text-white font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div className="truncate">
              <div className={`text-[10px] ${currentStep === 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                3. Bukti Lapangan
              </div>
              <div className="truncate text-xs">
                {rawProjects.length > 0 ? `${rawProjects.length} Titik Proyek` : 'Audit Tender'}
              </div>
            </div>
            {currentStep === 3 && <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STEP 1: PILIH SEKTOR MAKRO (1 DARI 6 KANTONG APBD) */}
      {/* ========================================================= */}
      {currentStep === 1 && (
        <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          <div className="text-center max-w-2xl mx-auto py-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dari Rp 84,2 Triliun, Mau Lihat Larinya ke Mana?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Seluruh anggaran belanja DKI Jakarta 2026 dibagi ke 6 bidang di bawah ini. Pilih salah satu sektor untuk menelusuri bagaimana uang tersebut mengalir sampai ke lingkunganmu.
            </p>
          </div>

          {/* 6 Sector Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apbdData.sectors.map((sector) => {
              const isSelected = sector.id === selectedSectorId;
              const projectCount = sector.sub_programs.reduce((acc, sp) => acc + sp.projects.length, 0);

              return (
                <div
                  key={sector.id}
                  onClick={() => {
                    setSelectedSectorId(sector.id);
                    if (sector.sub_programs.length > 0) {
                      setSelectedSubProgramId(sector.sub_programs[0].id);
                    }
                    setCurrentStep(2);
                  }}
                  className={`p-5 rounded-2xl border transition-colors cursor-pointer group flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div>
                    {/* Top Sector Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        {getSectorIcon(sector.id)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {projectCount > 0 && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md tabular-nums">
                            {projectCount} Proyek
                          </span>
                        )}
                        <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
                          {sector.percentage}% APBD
                        </span>
                      </div>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                      {sector.name}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {sector.description}
                    </p>
                  </div>

                  {/* Budget & Action Row */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Porsi Anggaran</div>
                      <div className="font-extrabold text-sm text-slate-900 tabular-nums">
                        {formatRupiah(sector.budget).replace(',00', '')}
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                      <span>Bedah Sektor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Proportional Flow Bar Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Proporsi 6 Sektor Makro APBD DKI Jakarta 2026:</span>
              <span className="text-slate-500 tabular-nums text-[11px]">100% Tersinkron (Rp 84,2 T)</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-lg overflow-hidden flex border border-slate-200">
              {apbdData.sectors.map((sec) => (
                <div
                  key={sec.id}
                  style={{ width: `${sec.percentage}%`, backgroundColor: sec.color }}
                  title={`${sec.name}: ${sec.percentage}%`}
                  className="h-full border-r border-white/20 last:border-r-0"
                />
              ))}
            </div>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* STEP 2: PILIH SUB-PROGRAM & DAMPAK BAHASA MANUSIA */}
      {/* ========================================================= */}
      {currentStep === 2 && (
        <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Header & Back Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
            <div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pilih Sektor Lain</span>
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Sektor: {selectedSector.name}</span>
              </h1>
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-2.5 rounded-xl border border-slate-100 sm:min-w-[180px]">
              <div className="text-[10px] font-bold text-slate-500">Pagu Sektor Ini</div>
              <div className="text-base font-extrabold text-slate-900 tabular-nums">
                {formatRupiah(selectedSector.budget)}
              </div>
              <div className="text-[10px] text-slate-500 tabular-nums">
                {selectedSector.percentage}% dari total APBD DKI
              </div>
            </div>
          </div>

          {/* Sub-Program Selector Header */}
          <div className="text-sm font-bold text-slate-800">
            Pilih Salah Satu Sub-Program di Sektor Ini:
          </div>

          {/* Sub-Programs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {selectedSector.sub_programs.length === 0 ? (
              <div className="sm:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2 text-xs text-slate-500">
                <p>Alokasi belanja rutin operasional dan gaji ASN/Guru/Nakes yang diatur oleh Peraturan Gubernur DKI Jakarta.</p>
                <div className="font-bold text-slate-800 tabular-nums">Total: {formatRupiah(selectedSector.budget)}</div>
              </div>
            ) : (
              selectedSector.sub_programs.map((sub) => {
                const isSubSelected = sub.id === selectedSubProgramId;
                const percentageOfSector = Math.round((sub.budget / selectedSector.budget) * 100);

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubProgramId(sub.id)}
                    className={`p-4 rounded-2xl border transition-colors cursor-pointer flex flex-col justify-between ${
                      isSubSelected
                        ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h2 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          {sub.name}
                        </h2>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums flex-shrink-0 ${
                          isSubSelected ? 'bg-emerald-200/60 text-emerald-900' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {percentageOfSector}% Sektor
                        </span>
                      </div>

                      <div className="text-xs font-extrabold text-emerald-800 tabular-nums">
                        {formatRupiah(sub.budget)}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{sub.projects.length} Paket Proyek Terdaftar</span>
                      <span className={`font-semibold ${isSubSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {isSubSelected ? 'Sedang Dipilih' : 'Klik untuk Pilih'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* HUMAN CONVERSION IMPACT CARD (PENTING UNTUK WARGA AWAM) */}
          {selectedSubProgram?.human_conversion && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-800">
                    Apa Artinya Pos Anggaran Ini Bagi Warga Jakarta?
                  </div>
                  <blockquote className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                    "{selectedSubProgram.human_conversion}"
                  </blockquote>
                </div>
              </div>
            </div>
          )}

          {/* Action to Step 3 */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer min-h-[44px]"
            >
              <span>Lanjut ke Bukti Proyek Lapangan ({rawProjects.length} Proyek)</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

        </section>
      )}

      {/* ========================================================= */}
      {/* STEP 3: BUKTI FISIK DI LAPANGAN & AUDIT TENDER */}
      {/* ========================================================= */}
      {currentStep === 3 && (
        <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Header & Back Action */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pilih Sub-Program Lain</span>
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Bukti Fisik: {selectedSubProgram?.name || selectedSector.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Paket pengerjaan dari dana rakyat. Klik kartu untuk membuka lembar audit dan aduan publik.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {(['all', 'delayed', 'ongoing', 'completed'] as const).map((filterKey) => {
                const label = 
                  filterKey === 'all' ? 'Semua' : 
                  filterKey === 'delayed' ? 'Molor' : 
                  filterKey === 'ongoing' ? 'Berjalan' : 'Selesai';

                const isActive = statusFilter === filterKey;
                return (
                  <button
                    key={filterKey}
                    onClick={() => setStatusFilter(filterKey)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-[11px] min-h-[32px] ${
                      isActive 
                        ? filterKey === 'delayed' ? 'bg-rose-600 text-white font-bold' : filterKey === 'completed' ? 'bg-emerald-600 text-white font-bold' : filterKey === 'ongoing' ? 'bg-amber-500 text-white font-bold' : 'bg-white text-slate-900 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of Physical Project Cards */}
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
              <p>Tidak ada paket pengerjaan fisik yang sesuai dengan filter ini pada sub-program terpilih.</p>
              <button
                onClick={() => setStatusFilter('all')}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Tampilkan Semua Paket
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((proj) => {
                const isDelayed = proj.status_color === 'red' || Boolean(proj.days_delayed && proj.days_delayed > 0);

                return (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-colors cursor-pointer group ${
                      isDelayed
                        ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h2 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {proj.title}
                      </h2>

                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 self-start sm:self-auto ${
                        proj.status_color === 'green'
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDelayed
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
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

                    {/* Metadata Row */}
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

                    {/* Progress Bar & Pagu */}
                    <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex-1 max-w-xs space-y-1">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${proj.progress}%` }}
                            className={`h-full rounded-full transition-[width] duration-300 ${
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
                        <div className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-0.5">
                          <span>Buka Audit Lengkap</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Delayed Alert Notice */}
                    {isDelayed && (
                      <div className="mt-2.5 pt-2 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-rose-700 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Terlambat {proj.days_delayed || 69} hari dari batas kontrak</span>
                        </span>
                        <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded">
                          Aduan Warga
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
              <span>Ganti Sub-Program</span>
            </button>

            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer min-h-[44px]"
            >
              <span>Telusuri Sektor Lainnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </section>
      )}

    </div>
  );
};
