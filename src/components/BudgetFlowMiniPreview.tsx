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
      icon: GraduationCap,
      pct: 24,
      macroVal: 'Rp 20,2 T',
      personalVal: formatRupiah(Math.round(monthlyTax * 0.24)),
      color: '#3b82f6', // Blue
      gradientFrom: '#3b82f6',
      gradientTo: '#60a5fa',
      targetY: 28,
      thickness: 20,
    },
    {
      id: 'infrastruktur',
      name: 'Jalan & Saluran Air',
      icon: Wrench,
      pct: 19,
      macroVal: 'Rp 16,0 T',
      personalVal: formatRupiah(Math.round(monthlyTax * 0.19)),
      color: '#059669', // Emerald
      gradientFrom: '#059669',
      gradientTo: '#34d399',
      targetY: 76,
      thickness: 18,
    },
    {
      id: 'kesehatan',
      name: 'Puskesmas & BPJS PBI',
      icon: HeartPulse,
      pct: 13,
      macroVal: 'Rp 10,9 T',
      personalVal: formatRupiah(Math.round(monthlyTax * 0.13)),
      color: '#e11d48', // Rose
      gradientFrom: '#e11d48',
      gradientTo: '#fb7185',
      targetY: 124,
      thickness: 15,
    },
    {
      id: 'transportasi',
      name: 'Subsidi Transjakarta',
      icon: BusFront,
      pct: 8,
      macroVal: 'Rp 6,7 T',
      personalVal: formatRupiah(Math.round(monthlyTax * 0.08)),
      color: '#d97706', // Amber
      gradientFrom: '#d97706',
      gradientTo: '#fbbf24',
      targetY: 172,
      thickness: 13,
    },
  ];

  // SVG Source Node Coordinates
  const sourceX = 125;
  const targetX = 295;
  const sourceCenterY = 100;

  return (
    <div 
      data-ui="sankey-preview" 
      className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between"
    >
      <div>
        {/* Card Header & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Aliran Anggaran (Budget Flow)</h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Sankey Mini
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualisasi penyerapan dana dari sumber ke sektor riil warga
            </p>
          </div>

          {/* Toggle Tab: Pajak Warga vs Total APBD */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setViewMode('tax')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer min-h-[32px] ${
                viewMode === 'tax'
                  ? 'bg-white text-slate-900 font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3 h-3 text-emerald-600" />
              <span>Pajak Pribadi</span>
            </button>

            <button
              onClick={() => setViewMode('macro')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer min-h-[32px] ${
                viewMode === 'macro'
                  ? 'bg-white text-slate-900 font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3 h-3 text-blue-600" />
              <span>APBD Rp 84,2 T</span>
            </button>
          </div>
        </div>

        {/* DESKTOP VIEW (>= 768px): Fluid Responsive SVG Sankey Stream */}
        <div className="hidden md:block bg-slate-50/80 rounded-xl p-3 border border-slate-100 relative overflow-hidden">
          <svg 
            viewBox="0 0 460 205" 
            className="w-full h-56 select-none"
          >
            <defs>
              {sectors.map((sec, i) => (
                <linearGradient key={sec.id} id={`stream-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={sec.gradientFrom} stopOpacity={hoveredIndex === i ? 0.75 : hoveredIndex !== null ? 0.15 : 0.45} />
                  <stop offset="100%" stopColor={sec.gradientTo} stopOpacity={hoveredIndex === i ? 0.85 : hoveredIndex !== null ? 0.2 : 0.55} />
                </linearGradient>
              ))}
            </defs>

            {/* Connecting Sankey Bezier Streams */}
            {sectors.map((sec, idx) => {
              // Offset source anchors evenly based on thickness
              const sourceOffset = (idx - 1.5) * 14;
              const y1 = sourceCenterY + sourceOffset;
              const y2 = sec.targetY;
              const halfThick = sec.thickness / 2;

              // Cubic bezier band (upper and lower curves)
              const pathD = `
                M ${sourceX} ${y1 - halfThick}
                C ${sourceX + 85} ${y1 - halfThick}, ${targetX - 85} ${y2 - halfThick}, ${targetX} ${y2 - halfThick}
                L ${targetX} ${y2 + halfThick}
                C ${targetX - 85} ${y2 + halfThick}, ${sourceX + 85} ${y1 + halfThick}, ${sourceX} ${y1 + halfThick}
                Z
              `;

              const isHighlighted = hoveredIndex === idx;
              const isDimmed = hoveredIndex !== null && !isHighlighted;

              return (
                <path
                  key={sec.id}
                  d={pathD}
                  fill={`url(#stream-grad-${idx})`}
                  className="transition-[opacity,fill] duration-200 cursor-pointer"
                  style={{ opacity: isDimmed ? 0.25 : 1 }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={onOpenExplorer}
                />
              );
            })}

            {/* Left Source Node (HTML in SVG foreignObject for crisp Tailwind typography) */}
            <foreignObject x="4" y="55" width="122" height="90">
              <div 
                className="w-full h-full bg-slate-900 text-white rounded-xl p-3 flex flex-col justify-between border border-slate-700 select-none cursor-pointer"
                onClick={onOpenReceipt}
                title="Klik untuk membuka Struk Pajak"
              >
                <div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{viewMode === 'tax' ? 'Pajak Bulanan' : 'Total APBD'}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-100 truncate mt-0.5">
                    {viewMode === 'tax' ? formatRupiah(monthlyTax) : 'Rp 84,2 Triliun'}
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 border-t border-slate-800 pt-1 flex justify-between items-center">
                  <span>{viewMode === 'tax' ? `Gaji ${formatRupiah(income)}` : 'DKI Jakarta 2026'}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
                </div>
              </div>
            </foreignObject>

            {/* Right Destination Target Nodes */}
            {sectors.map((sec, idx) => {
              const Icon = sec.icon;
              const isHighlighted = hoveredIndex === idx;
              const isDimmed = hoveredIndex !== null && !isHighlighted;

              return (
                <foreignObject key={sec.id} x="295" y={sec.targetY - 19} width="160" height="40">
                  <div
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={onOpenExplorer}
                    className={`w-full h-full rounded-lg px-2.5 py-1.5 flex items-center justify-between border transition-[border-color,background-color] duration-150 cursor-pointer ${
                      isHighlighted
                        ? 'bg-white border-slate-400'
                        : isDimmed
                        ? 'bg-slate-50/60 border-slate-200/50 opacity-60'
                        : 'bg-white border-slate-200'
                    }`}
                    title={`Klik untuk menelusuri sektor ${sec.name}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${sec.color}18`, color: sec.color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-[11px] font-bold text-slate-900 truncate leading-none">
                          {sec.name}
                        </div>
                        <div className="text-[9px] text-slate-500 tabular-nums mt-0.5">
                          {sec.pct}% alokasi
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-1">
                      <span className="text-[11px] font-extrabold text-slate-900 tabular-nums">
                        {viewMode === 'tax' ? sec.personalVal : sec.macroVal}
                      </span>
                    </div>
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>

        {/* MOBILE VIEW (< 768px): Vertical Stacked Progressive Flow */}
        <div className="md:hidden space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-1 pb-1 border-b border-slate-200">
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
                className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${sec.color}15`, color: sec.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {sec.name}
                    </div>
                    <div className="text-[10px] text-slate-500 tabular-nums">
                      Porsi {sec.pct}% APBD
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-slate-900 tabular-nums">
                    {viewMode === 'tax' ? sec.personalVal : sec.macroVal}
                  </div>
                  <div className="text-[9px] text-emerald-600 font-semibold flex items-center justify-end gap-0.5">
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
          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer py-1.5 px-3 bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
        >
          <span>Buka Alur Penuh (Rp 84,2 T)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button 
          onClick={onOpenReceipt}
          className="font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer py-1.5 px-2.5 transition-colors"
        >
          <Receipt className="w-3.5 h-3.5 text-slate-500" />
          <span>Cetak Rincian Struk</span>
        </button>
      </div>
    </div>
  );
}
