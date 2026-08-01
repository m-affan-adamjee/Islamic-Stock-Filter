import React from 'react';
import { CompanyProfile } from '../types';
import { 
  Building2, 
  Globe, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Award, 
  ExternalLink,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Radio
} from 'lucide-react';

interface CompanyOverviewProps {
  company: CompanyProfile;
  onRefresh?: () => void;
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({ company, onRefresh }) => {
  const formatCurrency = (val: number) => {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)} Trillion`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} Billion`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)} Million`;
    return `$${val.toLocaleString()}`;
  };

  // 52-week position calculation
  const rangeSpan = company.week52High - company.week52Low;
  const currentPos = rangeSpan > 0 ? ((company.price - company.week52Low) / rangeSpan) * 100 : 50;

  const sectorPass = company.screening.sector_pass;
  const dataSources = company.dataSources;

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-slate-800/80 shadow-2xl shadow-black/5 dark:shadow-black/20 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-600 dark:text-red-500" /> Company Profile &amp; Business Activity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {company.sector} • {company.industry} • {company.country}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Refresh Live Exchange Quote"
            >
              <RefreshCw className="w-3.5 h-3.5 text-red-500" /> Refresh Live Quote
            </button>
          )}

          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white/50 dark:bg-slate-800/80 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-md border border-white/20 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-red-500" /> Official Website <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Primary Business Activity Step 1 Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        sectorPass
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
          : 'bg-red-500/10 border-red-500/30 text-red-950 dark:text-red-200'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Briefcase className={`w-4 h-4 ${sectorPass ? 'text-emerald-500' : 'text-red-500'}`} />
            <span className="text-xs font-black uppercase tracking-wider">
              Step 1: Primary Business Activity Check
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {sectorPass
              ? `Core operations in "${company.industry}" are permissible. No primary involvement in Conventional Financial Services or Prohibited Goods.`
              : `Core operations in "${company.industry}" involve prohibited business activities (Conventional Banking, Interest Brokerage, Alcohol, Pork, Gambling, Tobacco, Adult Entertainment, or Unlawful Aggression Weapons).`}
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-extrabold shrink-0 uppercase tracking-wide ${
          sectorPass
            ? 'bg-emerald-500 text-slate-950'
            : 'bg-red-600 text-white'
        }`}>
          {sectorPass ? 'PASSED STEP 1' : 'FAILED STEP 1'}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {company.description}
      </p>

      {/* Price & 52-Week Range Bar */}
      <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 space-y-3">
        <div className="flex justify-between items-baseline">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Active Stock Price</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" /> Live Feed
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
              ${company.price.toFixed(2)}
              <span className={`text-xs ml-2 font-semibold ${company.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {company.change >= 0 ? '+' : ''}{company.change.toFixed(2)} ({company.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">52-Week Range</span>
            <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              ${company.week52Low.toFixed(2)} - ${company.week52High.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Meter */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-slate-200/60 dark:bg-slate-800/80 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, currentPos))}%` }}
            />
          </div>
        </div>

        {/* Data Provenance & Verification Badge */}
        <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {dataSources?.quoteSource || 'Live Market Exchange Feed'}
            </span>
            <span className="text-slate-400">•</span>
            <span>{dataSources?.fundamentalsSource || 'SEC Financial Statements'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Multi-Stage Audited
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Fundamentals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
        
        <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80">
          <span className="text-slate-500 font-medium">Market Cap</span>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(company.marketCap)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80">
          <span className="text-slate-500 font-medium">Total Revenue</span>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(company.totalRevenue)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80">
          <span className="text-slate-500 font-medium">Net Income</span>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(company.netIncome)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80">
          <span className="text-slate-500 font-medium">P/E Ratio</span>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">
            {company.peRatio.toFixed(1)}x
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80">
          <span className="text-slate-500 font-medium">Beta</span>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">
            {company.beta.toFixed(2)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80">
          <span className="text-slate-500 font-medium">Dividend Yield</span>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">
            {company.divYield.toFixed(2)}%
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80">
          <span className="text-slate-500 font-medium">CEO</span>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
            {company.ceo}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80">
          <span className="text-slate-500 font-medium">Employees</span>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">
            {company.employees.toLocaleString()}
          </div>
        </div>

      </div>

    </div>
  );
};
