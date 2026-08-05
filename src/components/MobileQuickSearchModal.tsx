import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { STOCK_DATABASE } from '../data/mockDatabase';

interface MobileQuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (ticker: string) => void;
}

const POPULAR_TICKERS = [
  { ticker: 'NVDA', name: 'NVIDIA Corporation', status: 'COMPLIANT' },
  { ticker: 'AAPL', name: 'Apple Inc.', status: 'COMPLIANT' },
  { ticker: 'SPUS', name: 'SP Funds S&P 500 Shariah ETF', status: 'COMPLIANT', isEtf: true },
  { ticker: 'HLAL', name: 'Wahed FTSE USA Shariah ETF', status: 'COMPLIANT', isEtf: true },
  { ticker: 'TSLA', name: 'Tesla, Inc.', status: 'COMPLIANT' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', status: 'COMPLIANT' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', status: 'COMPLIANT' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', status: 'NON_COMPLIANT' }
];

export const MobileQuickSearchModal: React.FC<MobileQuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCompany
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter stocks based on query
  const searchResults = Object.values(STOCK_DATABASE).filter(s => {
    if (!query.trim()) return false;
    const q = query.toLowerCase().trim();
    return s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q);
  }).slice(0, 8);

  const handleSelect = (ticker: string) => {
    onSelectCompany(ticker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 animate-in slide-in-from-bottom duration-250">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Search className="w-4 h-4 text-[#851428]" />
            <span>Search Stock Audit</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter ticker or name (e.g. NVDA, SPUS, Apple)..."
              className="w-full pl-11 pr-10 py-3 text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#851428] shadow-sm font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Content */}
        <div className="p-4 overflow-y-auto space-y-4 max-h-[55vh]">
          
          {/* Live Search Results */}
          {query.trim() ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Search Results ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">
                    No matching stock in quick database
                  </p>
                  <button
                    onClick={() => handleSelect(query.toUpperCase().trim())}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#851428] text-white text-xs font-bold shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4" /> Run Live Shariah Audit for "{query.toUpperCase()}"
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((stock) => {
                    const isCompliant = stock.screening.status === 'COMPLIANT';
                    return (
                      <button
                        key={stock.ticker}
                        onClick={() => handleSelect(stock.ticker)}
                        className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl text-xs font-bold font-mono ${
                            isCompliant
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          }`}>
                            {stock.ticker}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {stock.name}
                              {stock.isHalalEtf && (
                                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                                  HALAL ETF
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {stock.sector} &bull; ${stock.price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isCompliant
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}>
                            {isCompliant ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {isCompliant ? 'Halal' : 'Prohibited'}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#851428] transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Popular Quick Tickers */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-[#851428]" /> Popular Audited Stocks &amp; ETFs
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_TICKERS.map((pt) => (
                  <button
                    key={pt.ticker}
                    onClick={() => handleSelect(pt.ticker)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-[#851428]/10 hover:border-[#851428]/40 border border-slate-200 dark:border-slate-800 text-left transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold font-mono text-sm text-slate-900 dark:text-white">
                        {pt.ticker}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        pt.status === 'COMPLIANT'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      }`}>
                        {pt.status === 'COMPLIANT' ? 'Halal' : 'Non-Halal'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                      {pt.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
