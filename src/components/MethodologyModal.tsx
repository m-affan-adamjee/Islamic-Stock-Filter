import React, { useState } from 'react';
import { 
  BookOpen, 
  Sliders, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ShariahStandard, CustomThresholds } from '../types';

interface MethodologyModalProps {
  currentStandard: ShariahStandard;
  onSelectStandard: (standard: ShariahStandard) => void;
  customThresholds?: CustomThresholds;
  onUpdateCustomThresholds?: (thresholds: CustomThresholds) => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  currentStandard,
  onSelectStandard,
  customThresholds,
  onUpdateCustomThresholds
}) => {
  const [maxDebt, setMaxDebt] = useState<number>(customThresholds?.maxDebtRatio ?? 0.30);
  const [maxCash, setMaxCash] = useState<number>(customThresholds?.maxCashRatio ?? 0.30);
  const [maxImpure, setMaxImpure] = useState<number>(customThresholds?.maxImpureRatio ?? 0.05);
  const [minTangible, setMinTangible] = useState<number>(customThresholds?.minTangibleRatio ?? 0.20);

  const standardsInfo = [
    {
      id: 'AAOIFI' as ShariahStandard,
      name: 'AAOIFI Standard No. 21',
      org: 'Accounting & Auditing Organization for Islamic Financial Institutions',
      denominator: 'Market Capitalization (24-mo avg or current)',
      debtLimit: '30.0%',
      cashLimit: '30.0%',
      impureLimit: '5.0%',
      tangibleLimit: '20.0%',
      badge: 'Global Default',
      desc: 'The most widely recognized international Islamic financial standard. Uses market cap to calculate debt and liquidity ratios.'
    },
    {
      id: 'ZOYA_MUSAFFA' as ShariahStandard,
      name: 'Zoya & Musaffa Strict Standard',
      org: 'Zoya & Musaffa Consumer Shariah Screening Board',
      denominator: 'Market Capitalization / Total Assets',
      debtLimit: '33.0%',
      cashLimit: '33.0%',
      impureLimit: '5.0%',
      tangibleLimit: '20.0%',
      badge: 'Strict Retail Filter',
      desc: 'Enforces strict primary business sector checks (excluding defense/military surveillance contracts, weapons software, gambling/loan ad networks) plus a 5% max impure income cap.'
    },
    {
      id: 'MSCI' as ShariahStandard,
      name: 'MSCI Islamic Index Criteria',
      org: 'MSCI Barra Islamic Index Series',
      denominator: 'Total Assets',
      debtLimit: '33.33%',
      cashLimit: '33.33%',
      impureLimit: '5.0%',
      tangibleLimit: '20.0%',
      badge: 'Institutional Favorite',
      desc: 'Uses Total Assets as the denominator for debt and liquidity ratios rather than market cap, preventing asset volatility bias.'
    },
    {
      id: 'SP' as ShariahStandard,
      name: 'S&P Shariah Index Series',
      org: 'Standard & Poor’s Financial Services',
      denominator: 'Market Capitalization (36-month avg)',
      debtLimit: '33.0%',
      cashLimit: '33.0%',
      impureLimit: '5.0%',
      tangibleLimit: 'N/A',
      badge: 'US Markets',
      desc: 'Employs a 36-month trailing average market cap to smooth out market spikes.'
    },
    {
      id: 'DJ' as ShariahStandard,
      name: 'Dow Jones Islamic Market Index',
      org: 'S&P Dow Jones Indices',
      denominator: 'Market Capitalization (24-month avg)',
      debtLimit: '33.0%',
      cashLimit: '33.0%',
      impureLimit: '5.0%',
      tangibleLimit: 'N/A',
      badge: 'Legacy Standard',
      desc: 'Pioneering Islamic equity index benchmark using a 33% threshold across interest debt and receivables.'
    },
    {
      id: 'CUSTOM' as ShariahStandard,
      name: 'Custom User Thresholds',
      org: 'Personal Shariah Audit Board',
      denominator: 'Configurable',
      debtLimit: `${(maxDebt * 100).toFixed(1)}%`,
      cashLimit: `${(maxCash * 100).toFixed(1)}%`,
      impureLimit: `${(maxImpure * 100).toFixed(1)}%`,
      tangibleLimit: `${(minTangible * 100).toFixed(1)}%`,
      badge: 'Flexible',
      desc: 'Define custom ratio constraints for personal investment mandates or strict scholarly opinions.'
    }
  ];

  const handleApplyCustom = () => {
    if (onUpdateCustomThresholds) {
      onUpdateCustomThresholds({
        maxDebtRatio: maxDebt,
        maxCashRatio: maxCash,
        maxImpureRatio: maxImpure,
        minTangibleRatio: minTangible
      });
    }
    onSelectStandard('CUSTOM');
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-slate-800/80 shadow-2xl shadow-black/5 dark:shadow-black/20 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-600 dark:text-red-500" /> Shariah Screening Methodologies &amp; Standards
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mollet Capital Screener enforces mandatory Step 1 Primary Business Sector check across all methodologies before evaluating financial ratios.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-600 text-white border border-red-500/30 backdrop-blur-md self-start sm:self-auto shadow-md shadow-red-600/20">
          Active: {currentStandard}
        </span>
      </div>

      {/* Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standardsInfo.map((st) => (
          <div
            key={st.id}
            onClick={() => st.id !== 'CUSTOM' && onSelectStandard(st.id)}
            className={`p-6 rounded-2xl border backdrop-blur-md transition-all cursor-pointer relative space-y-4 ${
              currentStandard === st.id
                ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500 text-slate-900 dark:text-white ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                : 'bg-white/40 dark:bg-slate-950/40 border-white/20 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {st.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {st.name}
                </h3>
              </div>
              {currentStandard === st.id && (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {st.desc}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
              <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/60 backdrop-blur-sm border border-white/20 dark:border-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Debt Limit</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{st.debtLimit}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/60 backdrop-blur-sm border border-white/20 dark:border-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Cash Limit</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{st.cashLimit}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/60 backdrop-blur-sm border border-white/20 dark:border-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Impure Revenue</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{st.impureLimit}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/60 backdrop-blur-sm border border-white/20 dark:border-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Denominator</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 truncate block">{st.denominator}</span>
              </div>
            </div>

            {st.id !== 'CUSTOM' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStandard(st.id);
                }}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  currentStandard === st.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-white/20 dark:border-slate-700/80'
                }`}
              >
                {currentStandard === st.id ? 'Selected Standard' : `Switch to ${st.id}`}
              </button>
            ) : null}

          </div>
        ))}
      </div>

      {/* Custom Threshold Sliders Box */}
      <div className="p-6 rounded-2xl bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/80 text-white space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-mono">Custom Rules Configuration</h3>
          </div>
          <button
            onClick={handleApplyCustom}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            Apply Custom Standard
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span>Max Debt Ratio</span>
              <span className="font-bold text-emerald-400">{(maxDebt * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.01"
              value={maxDebt}
              onChange={(e) => setMaxDebt(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span>Max Cash Ratio</span>
              <span className="font-bold text-emerald-400">{(maxCash * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.01"
              value={maxCash}
              onChange={(e) => setMaxCash(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span>Max Impure Revenue</span>
              <span className="font-bold text-emerald-400">{(maxImpure * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.005"
              value={maxImpure}
              onChange={(e) => setMaxImpure(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span>Min Tangible Assets</span>
              <span className="font-bold text-emerald-400">{(minTangible * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.01"
              value={minTangible}
              onChange={(e) => setMinTangible(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

        </div>
      </div>

    </div>
  );
};
