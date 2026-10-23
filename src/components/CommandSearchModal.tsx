import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, MapPin, Building, FolderTree, X, ArrowRight } from 'lucide-react';
import apbdData from '../data/apbd-jakarta.json';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [search, setSearch] = useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten projects and sub-programs for quick search
  const allProjects = apbdData.sectors.flatMap((sec) =>
    sec.sub_programs.flatMap((sub) =>
      sub.projects.map((proj) => ({
        ...proj,
        sectorName: sec.name,
        subProgramName: sub.name,
      }))
    )
  );

  const filteredProjects = allProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.contractor.toLowerCase().includes(search.toLowerCase())
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('Rp', 'Rp ');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full">
          {/* Search Input Bar */}
          <div className="flex items-center px-4 border-b border-slate-200 h-14">
            <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari jalan, proyek, puskesmas, atau kontraktor (misal: Margonda, Fatmawati)..."
              className="w-full h-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Tidak ada proyek yang cocok dengan kata kunci "{search}".
              </div>
            ) : (
              filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    if (onSelectProject) onSelectProject(proj.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition">
                        {proj.title}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          proj.status_color === 'green'
                            ? 'bg-emerald-100 text-emerald-800'
                            : proj.status_color === 'red'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {proj.status} ({proj.progress}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{proj.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{proj.contractor}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="text-xs font-black text-slate-900">
                      {formatRupiah(proj.budget)}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold group-hover:underline flex items-center justify-end gap-0.5">
                      <span>Detail</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Filter Footer */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-slate-400" />
              <span>Menampilkan {filteredProjects.length} proyek fisik APBD</span>
            </span>
            <span className="text-[10px] text-slate-400">Gunakan panah &amp; Enter untuk memilih</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
