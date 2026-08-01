import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  FileText, 
  Bookmark, 
  Share2, 
  Clock, 
  ShieldCheck, 
  BarChart2,
  Droplet
} from 'lucide-react';
import { CompanyProfile, ShariahStandard } from '../types';

interface ComplianceBannerProps {
  company: CompanyProfile;
  standard: ShariahStandard;
  onOpenAudit: () => void;
  onOpenExport: () => void;
  onToggleWatchlist: (ticker: string) => void;
  isBookmarked: boolean;
  onCompare: (ticker: string) => void;
}

export const ComplianceBanner: React.FC<ComplianceBannerProps> = ({
  company,
  standard,
  onOpenAudit,
  onOpenExport,
  onToggleWatchlist,
  isBookmarked,
  onCompare
}) => {
  const isCompliant = company.screening.status === 'COMPLIANT';
  const isSectorFailed = company.screening.sector_pass === false;
  const purificationFactorPercent = (company.screening.purification_factor * 100).toFixed(2);

  return (
    <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl transition-all shadow-2xl ${
      isCompliant
        ? 'bg-slate-900/90 dark:bg-slate-950/90 border-emerald-500/40 text-white shadow-emerald-500/10'
        : 'bg-slate-900/90 dark:bg-slate-950/90 border-red-500/40 text-white shadow-red-500/15'
    }`}>
      {/* Background glow circle */}
      <div className={`absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40 ${
        isCompliant ? 'bg-emerald-500/30' : 'bg-red-600/35'
      }`} />
      <div className={`absolute -left-16 -bottom-16 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
        isCompliant ? 'bg-teal-500/20' : 'bg-rose-600/25'
      }`} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Status & Company Badges */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 text-sm font-extrabold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md ${
              isCompliant
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-red-600 text-white shadow-red-600/40'
            }`}>
              {isCompliant ? (
                <>
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> SHARIAH COMPLIANT
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 stroke-[2.5]" /> NON-COMPLIANT
                </>
              )}
            </span>

            {isSectorFailed && (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/20 text-red-200 border border-red-500/40 flex items-center gap-1.5">
                FAILED STEP 1: PROHIBITED BUSINESS ACTIVITY
              </span>
            )}

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 dark:bg-slate-800/60 backdrop-blur-md border border-white/10 dark:border-slate-700/60 text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> Standard: {standard}
            </span>

            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 dark:bg-slate-800/60 backdrop-blur-md border border-white/10 dark:border-slate-700/60 text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Updated: {new Date(company.screening.timestamp).toLocaleDateString()}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {company.ticker}
              </h1>
              <span className="text-xl sm:text-2xl text-slate-200 font-semibold">
                {company.name}
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {company.screening.message}
            </p>
          </div>

          {/* Purification note if compliant */}
          {isCompliant && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium backdrop-blur-md">
              <Droplet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Dividend Purification Factor: <strong className="font-mono text-emerald-400">{purificationFactorPercent}%</strong> of dividend payouts.
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          
          <button
            onClick={onOpenAudit}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs transition-all shadow-lg shadow-red-600/30 flex items-center gap-1.5 border border-white/20 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> AI Shariah Audit
          </button>

          <button
            onClick={() => onCompare(company.ticker)}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 dark:bg-slate-800/80 hover:bg-white/20 dark:hover:bg-slate-700/80 backdrop-blur-md text-white font-medium text-xs border border-white/10 dark:border-slate-700/80 transition-all flex items-center gap-1.5"
          >
            <BarChart2 className="w-4 h-4 text-red-400" /> Compare
          </button>

          <button
            onClick={onOpenExport}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 dark:bg-slate-800/80 hover:bg-white/20 dark:hover:bg-slate-700/80 backdrop-blur-md text-white font-medium text-xs border border-white/10 dark:border-slate-700/80 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-rose-300" /> Export Report
          </button>

          <button
            onClick={() => onToggleWatchlist(company.ticker)}
            className={`px-3.5 py-2.5 rounded-xl font-medium text-xs border backdrop-blur-md transition-all flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/10 dark:bg-slate-800/80 hover:bg-white/20 dark:hover:bg-slate-700/80 text-slate-300 border-white/10 dark:border-slate-700/80'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>

        </div>

      </div>
    </div>
  );
};
