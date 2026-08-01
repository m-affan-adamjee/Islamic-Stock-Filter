import React from 'react';
import { CheckCircle2, XCircle, Info, HelpCircle } from 'lucide-react';

interface RatioCardProps {
  title: string;
  formula: string;
  currentValue: number; // e.g. 0.184 for 18.4%
  threshold: number; // e.g. 0.30 for 30%
  thresholdType: 'MAX' | 'MIN';
  isPass: boolean;
  explanation: string;
  denominatorUsed?: 'market_cap' | 'total_assets';
  isPurification?: boolean;
}

export const RatioCard: React.FC<RatioCardProps> = ({
  title,
  formula,
  currentValue,
  threshold,
  thresholdType,
  isPass,
  explanation,
  denominatorUsed,
  isPurification = false
}) => {
  const percentVal = (currentValue * 100).toFixed(2);
  const percentLimit = (threshold * 100).toFixed(1);

  // Calculate meter percentage capped between 0 and 100
  let meterPercent = 0;
  if (thresholdType === 'MAX') {
    meterPercent = Math.min(100, Math.max(0, (currentValue / (threshold * 1.5)) * 100));
  } else {
    meterPercent = Math.min(100, Math.max(0, (currentValue / threshold) * 100));
  }

  return (
    <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-slate-800/80 shadow-xl shadow-black/5 dark:shadow-black/30 hover:border-emerald-500/40 hover:bg-white/80 dark:hover:bg-slate-900/70 transition-all space-y-4">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <div className="group relative cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-[11px] rounded-xl bg-slate-900/90 text-white backdrop-blur-md border border-white/10 shadow-2xl z-30 font-mono">
                Formula: {formula}
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {isPurification 
              ? 'Cleansing Factor'
              : denominatorUsed === 'market_cap' 
                ? 'Denominator: Market Cap' 
                : 'Denominator: Total Assets'}
          </span>
        </div>

        {/* Status Badge */}
        {!isPurification ? (
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${
            isPass
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-sm shadow-rose-500/10'
          }`}>
            {isPass ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" /> FAIL
              </>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30 backdrop-blur-md">
            INFO
          </span>
        )}
      </div>

      {/* Numerical Comparison */}
      <div className="flex items-baseline justify-between border-t border-slate-200/50 dark:border-slate-800/80 pt-3">
        <div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            {percentVal}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Current Level
          </div>
        </div>

        {!isPurification && (
          <div className="text-right">
            <div className="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">
              {thresholdType === 'MAX' ? '≤' : '≥'} {percentLimit}%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              AAOIFI Limit
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar / Threshold Meter */}
      {!isPurification && (
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-slate-200/60 dark:bg-slate-800/80 overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                isPass ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50' : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${meterPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>0%</span>
            <span>Limit: {percentLimit}%</span>
          </div>
        </div>
      )}

      {/* Explanation note */}
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/80 pt-2">
        {explanation}
      </p>

    </div>
  );
};
