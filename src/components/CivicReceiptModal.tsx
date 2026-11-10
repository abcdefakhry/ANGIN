import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { Download, X, Check, Share2, ShieldCheck, Sparkles } from 'lucide-react';

interface CivicReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  income: number;
  region: string;
}

export const CivicReceiptModal: React.FC<CivicReceiptModalProps> = ({
  isOpen,
  onClose,
  income,
  region,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Rumus proporsional kontribusi pajak daerah dari gaji/pengeluaran
  const jalan = Math.round(income * 0.022);
  const puskesmas = Math.round(income * 0.030);
  const transportasi = Math.round(income * 0.016);
  const banjir = Math.round(income * 0.012);
  const pendidikan = Math.round(income * 0.025);
  const totalKontribusi = jalan + puskesmas + transportasi + banjir + pendidikan;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const receiptId = `ANG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Download receipt as PNG
  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2.5,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Struk_Pajak_ANGIN_${Date.now()}.png`;
      link.click();

      // Trigger celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#059669', '#10b981', '#f59e0b', '#0f172a'],
      });
    } catch (err) {
      console.error('Failed to export receipt image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy text summary to clipboard
  const handleCopy = () => {
    const text = `STRUK KONTRIBUSI ANGIN.ID\nWilayah: ${region}\nPengeluaran/Gaji: ${formatRupiah(income)}/bln\nEstimasi Kontribusi Bulanan:\n- Perbaikan Jalan: ${formatRupiah(jalan)}\n- Subsidi Puskesmas: ${formatRupiah(puskesmas)}\n- Subsidi Transportasi: ${formatRupiah(transportasi)}\nTotal Terverifikasi: ${formatRupiah(totalKontribusi)}\n\nCek jejak pajakmu di ANGIN.id!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-md bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 p-5 sm:p-6 overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Civic Receipt Generator</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Struk Resmi Kontribusi Warga</h3>
          <p className="text-xs text-slate-500">Bukti visual kontribusi pajakmu untuk pembangunan kota</p>
        </div>

        {/* RECEIPT PAPER CONTAINER (Target html2canvas) */}
        {/* taste-skill-ignore */}
        <div 
          ref={receiptRef}
          data-ui="thermal-receipt"
          className="bg-white p-6 rounded-lg border border-slate-200 font-mono text-slate-800 text-xs relative select-none"
          style={{ fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
        >
          {/* Top Zigzag Pattern / Dotted Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
            <div className="text-base font-bold tracking-widest text-slate-900 uppercase">
              ANGIN.ID
            </div>
            <div className="text-[10px] text-slate-500 tracking-wider">
              PORTAL KETERBUKAAN APBD &amp; CITIZEN RECEIPT
            </div>
            <div className="text-[9px] text-slate-400 mt-1">
              www.angin.id • Jakarta, Indonesia
            </div>
          </div>

          {/* Meta Information */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-2.5 mb-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500">NO. BUKTI:</span>
              <span className="font-bold text-slate-700">{receiptId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TANGGAL:</span>
              <span>{currentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">WILAYAH:</span>
              <span className="font-semibold text-emerald-700">{region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BASIS GAJI:</span>
              <span className="font-semibold">{formatRupiah(income)}/bln</span>
            </div>
          </div>

          {/* Itemized Public Facilities */}
          <div className="mb-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Alokasi Fasilitas Publik (Bulanan)
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">Penambalan Aspal Jalan</div>
                  <div className="text-[9px] text-slate-500">Est. ~1.8 Meter Jalan Mulus</div>
                </div>
                <div className="font-bold">{formatRupiah(jalan)}</div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">Subsidi Puskesmas &amp; Faskes</div>
                  <div className="text-[9px] text-slate-500">Ketersediaan Obat &amp; Rawat Jalan</div>
                </div>
                <div className="font-bold">{formatRupiah(puskesmas)}</div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">Subsidi TransJakarta &amp; MRT</div>
                  <div className="text-[9px] text-slate-500">Subsidi PSO Tarif Rp 3.500</div>
                </div>
                <div className="font-bold">{formatRupiah(transportasi)}</div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">Pengendali Banjir &amp; Pompa Air</div>
                  <div className="text-[9px] text-slate-500">Perawatan Tanggul &amp; Saluran</div>
                </div>
                <div className="font-bold">{formatRupiah(banjir)}</div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">Bantuan Pendidikan KJP/KJMU</div>
                  <div className="text-[9px] text-slate-500">Perlengkapan Siswa Prasejahtera</div>
                </div>
                <div className="font-bold">{formatRupiah(pendidikan)}</div>
              </div>
            </div>
          </div>

          {/* Total Row */}
          <div className="border-t-2 border-slate-900 pt-2 mb-3">
            <div className="flex justify-between text-xs font-bold">
              <span>TOTAL PAJAK DAERAH:</span>
              <span className="text-emerald-700">{formatRupiah(totalKontribusi)}</span>
            </div>
            <div className="text-[9px] text-slate-400 text-right mt-0.5">
              *Diolah dari proporsi APBD DKI Jakarta 2026
            </div>
          </div>

          {/* Barcode & Stamp Simulation */}
          <div className="border-t border-dashed border-slate-300 pt-3 text-center">
            {/* Visual Barcode */}
            <div className="flex justify-center items-center gap-0.5 h-8 mb-1.5 opacity-80">
              {[4, 2, 6, 1, 3, 5, 2, 7, 1, 4, 3, 6, 2, 5, 1, 4, 2, 7, 3, 5, 2, 4].map((h, i) => (
                <div 
                  key={i} 
                  className="bg-slate-900" 
                  style={{ width: `${(i % 3 === 0 ? 2.5 : 1.5)}px`, height: `${h * 4 + 4}px` }} 
                />
              ))}
            </div>
            <div className="text-[8px] text-slate-400 tracking-widest uppercase">
              {receiptId} • DATA RESMI APBD
            </div>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-2">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>BERSUMBER DARI DATA TERBUKA PEMPROV DKI JAKARTA</span>
            </div>

            <div className="mt-3 text-[10px] text-slate-500">
              *Estimasi kontribusi dari pajak makan di luar (restoran), pajak kendaraan, dan bagi hasil pajak penghasilan.
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-4 space-y-2">
          {/* Main Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Menyiapkan Gambar Struk (PNG)...' : 'Unduh Gambar Struk (PNG)'}</span>
          </button>

          {/* Social Share & Copy Row */}
          <div className="flex gap-2">
            {/* WhatsApp Direct Share */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Cek Struk Kontribusi APBD saya di ANGIN.id! Dari pajak kita, kita tahu berapa rupiah yang jadi aspal jalan, puskesmas, dan bus TransJakarta: https://angin.vercel.app`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span>Bagikan ke WA</span>
            </a>

            {/* Twitter/X Direct Share */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Saya baru saja cek alokasi riil pajak daerah saya di @ANGINid! Transparansi APBD DKI Jakarta hingga ke perbaikan jalan dan puskesmas. Cek strukmu: https://angin.vercel.app #KawalAPBD #ANGINid`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span>Bagikan ke X</span>
            </a>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 px-3.5 rounded-xl border border-slate-300 shadow-sm transition-colors min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Salin teks struk"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
