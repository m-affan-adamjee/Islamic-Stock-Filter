import React, { useState } from 'react';
import { 
  Calculator, 
  Droplet, 
  Heart, 
  CheckCircle2, 
  Printer, 
  Download, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { CompanyProfile } from '../types';

interface DividendPurificationCalculatorProps {
  company?: CompanyProfile;
}

export const DividendPurificationCalculator: React.FC<DividendPurificationCalculatorProps> = ({
  company
}) => {
  const [calcMode, setCalcMode] = useState<'payout' | 'shares'>('payout');
  const [totalDividendPayout, setTotalDividendPayout] = useState<number>(1000);
  const [sharesCount, setSharesCount] = useState<number>(500);
  const [dividendPerShare, setDividendPerShare] = useState<number>(
    company ? (company.price * (company.divYield / 100)) || 1.25 : 2.50
  );
  const [purificationFactorInput, setPurificationFactorInput] = useState<number>(
    company ? (company.screening.purification_factor * 100) || 1.20 : 1.20
  );

  const calculateAmount = () => {
    let totalIncome = 0;
    if (calcMode === 'payout') {
      totalIncome = totalDividendPayout;
    } else {
      totalIncome = sharesCount * dividendPerShare;
    }

    const purifyPercent = purificationFactorInput / 100;
    const purifyAmount = totalIncome * purifyPercent;
    const netHalalAmount = totalIncome - purifyAmount;

    return {
      totalIncome,
      purifyPercent,
      purifyAmount,
      netHalalAmount
    };
  };

  const results = calculateAmount();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-slate-800/80 shadow-2xl shadow-black/5 dark:shadow-black/20 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-emerald-500" /> Dividend Purification Calculator
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
              AAOIFI Cleansing Rule
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate exact dollar amounts to donate to charity for non-halal corporate income purification.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-3.5 py-2 rounded-xl bg-white/50 dark:bg-slate-800/80 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-semibold border border-white/20 dark:border-slate-700/80 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5 text-emerald-500" /> Print Receipt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Calculator Inputs */}
        <div className="space-y-6">
          
          {/* Mode Selector */}
          <div className="flex items-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-md p-1 rounded-xl border border-white/20 dark:border-slate-800/60">
            <button
              onClick={() => setCalcMode('payout')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                calcMode === 'payout'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md border border-white/20 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Total Dividend Payout ($)
            </button>
            <button
              onClick={() => setCalcMode('shares')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                calcMode === 'shares'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md border border-white/20 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Shares Owned × DPS
            </button>
          </div>

          {/* Dynamic Inputs */}
          {calcMode === 'payout' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Total Annual Dividend Payout Received ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400">$</span>
                <input
                  type="number"
                  value={totalDividendPayout}
                  onChange={(e) => setTotalDividendPayout(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-mono bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Number of Shares Owned
                </label>
                <input
                  type="number"
                  value={sharesCount}
                  onChange={(e) => setSharesCount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 text-sm font-mono bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dividend Per Share ($ DPS)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dividendPerShare}
                  onChange={(e) => setDividendPerShare(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 text-sm font-mono bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          )}

          {/* Purification Factor (%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Impure Revenue Purification Factor (%)
              </label>
              {company && (
                <span className="text-[11px] text-emerald-500 font-mono">
                  {company.ticker} Rate: {(company.screening.purification_factor * 100).toFixed(2)}%
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={purificationFactorInput}
                onChange={(e) => setPurificationFactorInput(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 text-sm font-mono bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400">%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-500" /> AAOIFI Purification Rule
            </h4>
            <p className="leading-relaxed">
              Purification is required ONLY for dividend payouts, not capital gains. The non-halal portion of dividend income represents interest or non-compliant subsidiary earnings that must be donated to charity without intention of spiritual reward (Thawab).
            </p>
          </div>

        </div>

        {/* Right Column: Output Summary Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/80 text-white space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-white/10 dark:border-slate-800/80 pb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="w-4 h-4" /> Cleansing Calculation Result
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Factor: {purificationFactorInput.toFixed(2)}%
            </span>
          </div>

          <div className="space-y-4">
            
            <div className="flex justify-between items-baseline p-3 rounded-xl bg-white/5 dark:bg-slate-900/50 backdrop-blur-md border border-white/10 dark:border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">Total Dividend Received</span>
              <span className="text-xl font-extrabold font-mono text-white">
                ${results.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-baseline p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md">
              <div>
                <span className="text-xs text-emerald-400 font-bold block">
                  Amount To Donate To Charity
                </span>
                <span className="text-[10px] text-slate-400">
                  (Purification Amount)
                </span>
              </div>
              <span className="text-2xl font-extrabold font-mono text-emerald-400">
                ${results.purifyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-baseline p-3 rounded-xl bg-white/5 dark:bg-slate-900/50 backdrop-blur-md border border-white/10 dark:border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">Net Halal Dividend Retained</span>
              <span className="text-lg font-bold font-mono text-teal-300">
                ${results.netHalalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

          </div>

          {/* Action guidance */}
          <div className="p-4 rounded-xl bg-white/5 dark:bg-slate-900/50 backdrop-blur-md border border-white/10 dark:border-slate-800/80 space-y-2 text-xs">
            <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> How To Give Purification
            </h5>
            <p className="text-slate-300 leading-relaxed">
              Donate ${results.purifyAmount.toFixed(2)} directly to public welfare projects (hospitals, clean water, relief funds). Do not claim it as Zakat or tax deduction.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
