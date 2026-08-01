import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { WatchlistItem } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: WatchlistItem[];
  onRemove: (ticker: string) => void;
  onSelect: (ticker: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl h-full p-6 space-y-6 shadow-2xl flex flex-col border-l border-white/20 dark:border-slate-800/80 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Saved Watchlist ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
          >
            ✕
          </button>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.ticker}
                className="p-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-white/20 dark:border-slate-800/80 flex items-center justify-between gap-3 group hover:border-emerald-500/40 transition-all shadow-sm"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelect(item.ticker);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {item.ticker}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                      item.status === 'COMPLIANT'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {item.status === 'COMPLIANT' ? 'HALAL' : 'NON-COMPLIANT'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                    {item.name} • {item.sector}
                  </p>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Debt Ratio: {(item.debtRatio * 100).toFixed(1)}% | Purify: {(item.purificationFactor * 100).toFixed(2)}%
                  </div>
                </div>

                <button
                  onClick={() => onRemove(item.ticker)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/80 transition-all"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>Your watchlist is empty.</p>
              <p className="text-[11px] text-slate-500">
                Click the &quot;Save&quot; bookmark button on any stock to monitor it here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
