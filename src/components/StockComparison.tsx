import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { ShariahStandard } from '../types';

interface CompareItem {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  marketCap: number;
  status: 'COMPLIANT' | 'NON_COMPLIANT';
  debtRatio: number;
  cashRatio: number;
  impureRatio: number;
  tangibleRatio: number;
  purificationFactor: number;
  reason?: string;
}

interface StockComparisonProps {
  initialTickers?: string[];
  standard: ShariahStandard;
  onSelectCompany: (ticker: string) => void;
}

export const StockComparison: React.FC<StockComparisonProps> = ({
  initialTickers = ['NVDA', 'AAPL', 'MSFT', 'JPM'],
  standard,
  onSelectCompany
}) => {
  const [tickers, setTickers] = useState<string[]>(initialTickers);
  const [newTickerInput, setNewTickerInput] = useState('');
  const [items, setItems] = useState<CompareItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers, standard })
      });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Comparison fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [tickers.join(','), standard]);

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const t = newTickerInput.toUpperCase().trim();
    if (t && !tickers.includes(t) && tickers.length < 5) {
      setTickers([...tickers, t]);
      setNewTickerInput('');
    }
  };

  const handleRemoveTicker = (tickerToRemove: string) => {
    if (tickers.length <= 1) return;
    setTickers(tickers.filter(t => t !== tickerToRemove));
  };

  const formatMcap = (val: number) => {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    return `$${(val / 1e6).toFixed(0)}M`;
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-slate-800/80 shadow-2xl shadow-black/5 dark:shadow-black/20 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-emerald-500" /> Side-by-Side Stock Comparison
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare Shariah ratios and compliance decisions across up to 5 companies under {standard}.
          </p>
        </div>

        {/* Add Ticker Form */}
        <form onSubmit={handleAddTicker} className="flex items-center gap-2">
          <input
            type="text"
            value={newTickerInput}
            onChange={(e) => setNewTickerInput(e.target.value)}
            placeholder="Add ticker (e.g. TSLA)..."
            className="px-3.5 py-2 text-xs font-mono bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            type="submit"
            disabled={tickers.length >= 5}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 disabled:opacity-50 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          Loading stock comparison matrix...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-800/80 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-mono">Metric / Feature</th>
                {items.map((item) => (
                  <th key={item.ticker} className="py-3 px-4 min-w-[160px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <button
                          onClick={() => onSelectCompany(item.ticker)}
                          className="font-bold text-sm text-slate-900 dark:text-white font-mono hover:text-emerald-500 transition-colors"
                        >
                          {item.ticker}
                        </button>
                        <div className="text-[11px] font-normal text-slate-500 truncate max-w-[120px]">
                          {item.name}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTicker(item.ticker)}
                        className="text-slate-400 hover:text-rose-500 text-xs p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/60 text-xs">
              
              {/* Row 1: Status */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                  Compliance Status
                </td>
                {items.map((item) => (
                  <td key={item.ticker} className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
                      item.status === 'COMPLIANT'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {item.status === 'COMPLIANT' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> HALAL
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> FAIL
                        </>
                      )}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Debt Ratio */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                  Debt Ratio (&lt;30%)
                </td>
                {items.map((item) => (
                  <td key={item.ticker} className="py-3 px-4 font-mono font-bold">
                    <span className={item.debtRatio < 0.30 ? 'text-emerald-500' : 'text-rose-500'}>
                      {(item.debtRatio * 100).toFixed(2)}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 3: Cash Ratio */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                  Interest Cash (&lt;30%)
                </td>
                {items.map((item) => (
                  <td key={item.ticker} className="py-3 px-4 font-mono font-bold">
                    <span className={item.cashRatio < 0.30 ? 'text-emerald-500' : 'text-rose-500'}>
                      {(item.cashRatio * 100).toFixed(2)}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Impure Revenue */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                  Impure Revenue (&le;5%)
                </td>
                {items.map((item) => (
                  <td key={item.ticker} className="py-3 px-4 font-mono font-bold">
                    <span className={item.impureRatio <= 0.05 ? 'text-emerald-500' : 'text-rose-500'}>
                      {(item.impureRatio * 100).toFixed(2)}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Tangible Assets */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                  Tangible Assets (&ge;20%)
                </td>
                {items.map((item) => (
                  <td key={item.ticker} className="py-3 px-4 font-mono font-bold">
                    <span className={item.tangibleRatio >= 0.20 ? 'text-emerald-500' : 'text-rose-500'}>
                      {(item.tangibleRatio * 100).toFixed(2)}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 6: Dividend Purification */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                  Purification Factor
                </td>
                {items.map((item) => (
                  <td key={item.ticker} className="py-3 px-4 font-mono text-teal-500 font-bold">
                    {(item.purificationFactor * 100).toFixed(2)}%
                  </td>
                ))}
              </tr>

              {/* Row 7: Market Cap */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                  Market Capitalization
                </td>
                {items.map((item) => (
                  <td key={item.ticker} className="py-3 px-4 font-mono">
                    {formatMcap(item.marketCap)}
                  </td>
                ))}
              </tr>

              {/* Row 8: Sector */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                  Primary Sector
                </td>
                {items.map((item) => (
                  <td key={item.ticker} className="py-3 px-4 text-slate-500">
                    {item.sector}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
