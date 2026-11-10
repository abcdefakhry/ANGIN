import { useState } from 'react';
import { 
  GraduationCap, 
  Wrench, 
  HeartPulse, 
  BusFront, 
  ArrowRight, 
  Receipt,
  User,
  Building2
} from 'lucide-react';

interface BudgetFlowMiniPreviewProps {
  income: number;
  onOpenExplorer: () => void;
  onOpenReceipt: () => void;
}

export function BudgetFlowMiniPreview({
  income,
  onOpenExplorer,
  onOpenReceipt,
}: BudgetFlowMiniPreviewProps) {
  const [viewMode, setViewMode] = useState<'tax' | 'macro'>('tax');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Format currency helper
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Estimasi kontribusi pajak bulanan dari gaji
  // (Porsi PB1 + PKB + DBH PPh APBD DKI Jakarta ~9% dari penghasilan)
  const monthlyTax = Math.round(income * 0.09);

  // Definisi 4 sektor representatif aliran
  const sectors = [
    {
      id: 'pendidikan',
      name: 'Pendidikan & KJP',
      subtitle: 'Porsi 24% APBD',
      icon: GraduationCap,
      pct: 24,
      macroVal: 'Rp 20,2 T',
      personalVal: formatRupiah(Math.round(monthlyTax * 0.24)),
      color: '#3b82f6', // Blue
      gradientFrom: '#3b82f6',
      gradientTo: '#60a5fa',
      // SVG Ribbon Coordinates (in viewBox 0 0 100 230)
      yLeftTop: 100,
      yLeftBot: 108,
      yRightTop: 17,
      yRightBot: 33,
    },
    {
      id: 'infrastruktur',
      name: 'Jalan & Saluran Air',
      subtitle: 'Porsi 19% APBD',
      icon: Wrench,
      pct: 19,
      macroVal: 'Rp 16,0 T',
      personalVal: formatRupiah(Math.round(monthlyTax * 0.19)),
      color: '#059669', // Emerald
      gradientFrom: '#059669',
      gradientTo: '#34d399',
      yLeftTop: 108,
      yLeftBot: 115,
      yRightTop: 75,
      yRightBot: 89,
    },
    {
      id: 'kesehatan',
      name: 'Puskesmas & BPJS',
      subtitle: 'Subsidi PBI • 13% APBD',
      icon: HeartPulse,
      pct: 13,
      macroVal: 'Rp 10,9 T',
      personalVal: formatRupiah(Math.round(monthlyTax * 0.13)),
      color: '#e11d48', // Rose
      gradientFrom: '#e11d48',
      gradientTo: '#fb7185',
      yLeftTop: 115,
      yLeftBot: 122,
      yRightTop: 133,
      yRightBot: 145,
    },
    {
      id: 'transportasi',
      name: 'Subsidi Transjakarta',
      subtitle: 'Porsi 8% APBD',
      icon: BusFront,
      pct: 8,
      macroVal: 'Rp 6,7 T',
      personalVal: formatRupiah(Math.round(monthlyTax * 0.08)),
      color: '#d97706', // Amber
      gradientFrom: '#d97706',
      gradientTo: '#fbbf24',
      yLeftTop: 122,
      yLeftBot: 130,
      yRightTop: 191,
      yRightBot: 201,
    },
  ];

  return (
    <div 
      data-ui="sankey-preview" 
      className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between"
    >
      <div>
        {/* Card Header & Perspective Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Aliran Uang Anggaran
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau bagaimana uang pajak disalurkan ke fasilitas dan bantuan warga
            </p>
          </div>

          {/* Toggle Tab: Pajak Warga vs Total APBD */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto flex-shrink-0">
            <button
              onClick={() => setViewMode('tax')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[32px] whitespace-nowrap ${
                viewMode === 'tax'
                  ? 'bg-white text-slate-900 font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pajak Pribadi</span>
            </button>

            <button
              onClick={() => setViewMode('macro')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[32px] whitespace-nowrap ${
                viewMode === 'macro'
                  ? 'bg-white text-slate-900 font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>APBD Rp 84,2 T</span>
            </button>
          </div>
        </div>

        {/* DESKTOP & TABLET VIEW (>= 640px): 3-Column Hybrid Layout (No Text Clipping) */}
        <div className="hidden sm:flex items-center justify-between gap-1 sm:gap-2.5 bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100 min-h-[258px]">
          
          {/* Column 1: Source Node (Pajak Warga / APBD DKI) */}
          <div 
            onClick={onOpenReceipt}
            className="w-32 sm:w-36 flex-shrink-0 bg-slate-900 text-white rounded-xl p-3 sm:p-3.5 flex flex-col justify-between border border-slate-800 cursor-pointer select-none transition-colors hover:border-slate-700 min-h-[140px]"
            title="Klik untuk membuka Struk Pajak Warga"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{viewMode === 'tax' ? 'Pajak Bulanan' : 'Total APBD'}</span>
              </div>
              <div className="text-sm font-bold text-slate-100 tabular-nums">
                {viewMode === 'tax' ? formatRupiah(monthlyTax) : 'Rp 84,2 Triliun'}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 mt-2 flex justify-between items-center">
              <span>{viewMode === 'tax' ? `Gaji ${formatRupiah(income)}` : 'DKI Jakarta 2026'}</span>
              <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            </div>
          </div>

          {/* Column 2: Fluid Scalable SVG Stream Connector */}
          <div className="w-14 sm:w-16 md:w-20 flex-shrink-0 h-[230px] relative">
            <svg 
              viewBox="0 0 100 230" 
              preserveAspectRatio="none"
              className="w-full h-full select-none"
            >
              <defs>
                {sectors.map((sec, i) => (
                  <linearGradient key={sec.id} id={`svg-stream-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={sec.gradientFrom} stopOpacity={hoveredIndex === i ? 0.85 : hoveredIndex !== null ? 0.15 : 0.45} />
                    <stop offset="100%" stopColor={sec.gradientTo} stopOpacity={hoveredIndex === i ? 0.95 : hoveredIndex !== null ? 0.2 : 0.6} />
                  </linearGradient>
                ))}
              </defs>

              {sectors.map((sec, idx) => {
                const pathD = `
                  M 0 ${sec.yLeftTop}
                  C 45 ${sec.yLeftTop}, 55 ${sec.yRightTop}, 100 ${sec.yRightTop}
                  L 100 ${sec.yRightBot}
                  C 55 ${sec.yRightBot}, 45 ${sec.yLeftBot}, 0 ${sec.yLeftBot}
                  Z
                `;

                const isHighlighted = hoveredIndex === idx;
                const isDimmed = hoveredIndex !== null && !isHighlighted;

                return (
                  <path
                    key={sec.id}
                    d={pathD}
                    fill={`url(#svg-stream-grad-${idx})`}
                    className="transition-[opacity,fill] duration-200 cursor-pointer"
                    style={{ opacity: isDimmed ? 0.2 : isHighlighted ? 1 : 0.8 }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={onOpenExplorer}
                  />
                );
              })}
            </svg>
          </div>

          {/* Column 3: Full-Width Target Sector Cards (Tasteskill Hairline Grid Matrix) */}
          <div className="flex-1 min-w-0 cells-grid rounded-xl flex flex-col z-10">
            {sectors.map((sec, idx) => {
              const Icon = sec.icon;
              const isHighlighted = hoveredIndex === idx;
              const isDimmed = hoveredIndex !== null && !isHighlighted;

              return (
                <div
                  key={sec.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={onOpenExplorer}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2.5 transition-colors cursor-pointer select-none min-h-[46px] ${
                    isHighlighted
                      ? 'bg-slate-50'
                      : isDimmed
                      ? 'bg-white/70 opacity-60'
                      : 'bg-white hover:bg-slate-50/80'
                  }`}
                  title={`Klik untuk menelusuri sektor ${sec.name} di Pohon Alur`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${sec.color}15`, color: sec.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                        {sec.name}
                      </div>
                      <div className="text-[10px] text-slate-500 tabular-nums truncate">
                        {sec.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-1.5">
                    <span className="text-xs sm:text-[13px] font-bold text-slate-900 tabular-nums font-mono whitespace-nowrap">
                      {viewMode === 'tax' ? sec.personalVal : sec.macroVal}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* MOBILE VIEW (< 640px): Vertical Stacked Progressive Flow */}
        <div className="sm:hidden cells-grid rounded-xl flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold p-3 bg-slate-50">
            <span>
              {viewMode === 'tax' ? `Alokasi Pajak (${formatRupiah(monthlyTax)}/bln):` : 'Porsi APBD Rp 84,2 Triliun:'}
            </span>
            <span className="text-emerald-700 font-bold tabular-nums">
              {viewMode === 'tax' ? 'Dari Gaji Warga' : 'DKI Jakarta'}
            </span>
          </div>

          {sectors.map((sec) => {
            const Icon = sec.icon;
            return (
              <div 
                key={sec.id}
                onClick={onOpenExplorer}
                className="bg-white hover:bg-slate-50/80 p-3 flex items-center justify-between cursor-pointer min-h-[44px] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${sec.color}15`, color: sec.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 leading-tight truncate">
                      {sec.name}
                    </div>
                    <div className="text-[10px] text-slate-500 tabular-nums truncate">
                      {sec.subtitle}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-2">
                  <div className="text-xs font-bold text-slate-900 tabular-nums font-mono whitespace-nowrap">
                    {viewMode === 'tax' ? sec.personalVal : sec.macroVal}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-0.5">
                    <span>Lihat</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
        <button 
          onClick={onOpenExplorer}
          className="btn-tactile font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer py-2 px-3.5 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-200 transition-all min-h-[38px]"
        >
          <span>Buka Alur Penuh (Rp 84,2 T)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button 
          onClick={onOpenReceipt}
          className="btn-tactile font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded-xl hover:bg-slate-50 transition-all min-h-[38px]"
        >
          <Receipt className="w-3.5 h-3.5 text-slate-500" />
          <span>Cetak Rincian Struk</span>
        </button>
      </div>
    </div>
  );
}
