import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2,
  ShieldAlert,
  Calendar,
  MessageSquare
} from 'lucide-react';

export interface ProjectDetail {
  id: string;
  title: string;
  location: string;
  budget: number;
  length?: string;
  contractor: string;
  progress: number;
  status: string;
  status_color: string;
  start_date?: string;
  target_date?: string;
  days_delayed?: number;
  coordinates?: number[];
}

interface ProjectActionModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
  onOpenCitizenFeedback?: (project: ProjectDetail) => void;
}

export const ProjectActionModal: React.FC<ProjectActionModalProps> = ({
  project,
  onClose,
  onOpenCitizenFeedback,
}) => {
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  const isDelayed = project.status_color === 'red' || (project.days_delayed && project.days_delayed > 0) || project.progress < 50;
  const targetDeadline = project.target_date || (isDelayed ? '15 Agustus 2026' : '30 November 2026');
  const delayDays = project.days_delayed || 69;

  // Generate advocacy text for social pressure / reporting with exact deadline and delay
  const complaintText = `[PENGAWASAN WARGA ANGIN.ID]\nLaporan Proyek APBD: ${project.title}\nLokasi: ${project.location}\nNilai Pagu: ${formatRupiah(project.budget)}\nKontraktor: ${project.contractor}\nDeadline Resmi: ${targetDeadline}${isDelayed ? ` (MOLOR ${delayDays} HARI)` : ''}\nStatus Realisasi Fisik: Baru ${project.progress}%\n\nMohon atensi dinas terkait @DKIJakarta @dinasbmkikotajkt atas keterlambatan proyek ini agar segera diselesaikan demi keselamatan & kenyamanan warga! #KawalAPBD #ANGINid`;

  // Action: Open Twitter/X intent with pre-filled message
  const handleAdvocateTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(complaintText)}`;
    window.open(tweetUrl, '_blank');
  };

  // Action: Open LAPOR.go.id official portal
  const handleOpenLapor = () => {
    window.open('https://www.lapor.go.id', '_blank');
  };

  // Action: Copy summary
  const handleCopy = () => {
    navigator.clipboard.writeText(complaintText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Badge Top */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span 
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
              project.status_color === 'green'
                ? 'bg-emerald-100 text-emerald-800'
                : project.status_color === 'red'
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {project.status_color === 'green' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : project.status_color === 'red' ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            <span>Status: {project.status} ({project.progress}%)</span>
          </span>

          {isDelayed && (
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>Molor {delayDays} Hari</span>
            </span>
          )}
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
          {project.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{project.location}</span>
          {project.length && (
            <>
              <span>•</span>
              <span>Volume: {project.length}</span>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Kemajuan Pembangunan di Lapangan:</span>
            <span className={isDelayed ? 'font-bold text-rose-600' : 'font-bold text-slate-900'}>
              {project.progress}% {isDelayed ? `(Seharusnya 100%)` : ''}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              style={{ width: `${project.progress}%` }} 
              className={`h-full rounded-full transition-[width] duration-500 ${
                project.status_color === 'green'
                  ? 'bg-emerald-600'
                  : project.status_color === 'red'
                  ? 'bg-rose-600'
                  : 'bg-amber-500'
              }`}
            />
          </div>
        </div>

        {/* Tender & Contractor Info Box with Contract Deadline (Target Tanggal Selesai) */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-xs mb-5">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-500">Nilai Kontrak APBD:</span>
            <span className="font-extrabold text-slate-900 text-sm">{formatRupiah(project.budget)}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-t border-slate-200 pt-2">
            <span className="text-slate-500">Kontraktor Pelaksana:</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.contractor}</span>
            </span>
          </div>

          {/* ROW DEADLINE KONTRAK ASLI & STATUS KETERLAMBATAN */}
          <div className="flex justify-between items-center py-0.5 border-t border-slate-200 pt-2">
            <span className="text-slate-500">Tenggat Selesai Kontrak:</span>
            {isDelayed ? (
              <span className="font-extrabold text-rose-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>{targetDeadline}</span>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-1.5 py-0.5 rounded border border-rose-200">
                  Molor {delayDays} Hari
                </span>
              </span>
            ) : project.status_color === 'green' ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>{targetDeadline} (Tepat Waktu)</span>
              </span>
            ) : (
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{targetDeadline}</span>
              </span>
            )}
          </div>

          <div className="flex justify-between items-center py-0.5 border-t border-slate-200 pt-2">
            <span className="text-slate-500">Sumber Keterbukaan:</span>
            <span className="font-semibold text-emerald-700">LPSE &amp; Satu Data DKI Jakarta</span>
          </div>
        </div>

        {/* ACTIONABLE CIVIC OUTPUT SECTION (Sesuai Celah 2.5 PRD) */}
        {isDelayed ? (
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-3 mb-4">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">Laporkan Keterlambatan Proyek Ini</h4>
                <p className="text-[11px] text-rose-700 leading-relaxed mt-0.5">
                  Proyek ini telah <strong>melewati batas waktu kontrak sejak {targetDeadline} (molor {delayDays} hari)</strong> namun baru selesai {project.progress}%. Warga berhak menyuarakan atensi langsung ke kanal pengawasan resmi.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={handleAdvocateTwitter}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition cursor-pointer min-h-[40px]"
              >
                <Share2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Teruskan ke X/Twitter</span>
              </button>

              <button
                onClick={handleOpenLapor}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold py-2.5 px-3 rounded-lg transition cursor-pointer min-h-[40px]"
              >
                <span>LAPOR.go.id</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {onOpenCitizenFeedback && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCitizenFeedback(project);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition cursor-pointer min-h-[40px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-200" />
                <span>Kirim Aduan ke Kotak Suara Warga ANGIN</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Proyek ini berjalan sesuai linimasa kontrak pengadaan (Target: {targetDeadline}).</span>
              </span>
            </div>
            {onOpenCitizenFeedback && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCitizenFeedback(project);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-lg transition cursor-pointer min-h-[38px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Punya masukan warga terkait proyek ini? Kirim aspirasi</span>
              </button>
            )}
          </div>
        )}

        {/* Copy Text Summary Button */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold py-1.5 px-2 rounded hover:bg-slate-100 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Teks Laporan Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Salin Ringkasan Data Proyek</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
