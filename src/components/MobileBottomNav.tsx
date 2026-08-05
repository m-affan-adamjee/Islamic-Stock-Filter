import React from 'react';
import { 
  Home, 
  Search, 
  TrendingUp, 
  Database, 
  Bookmark, 
  ShieldCheck 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSearch: () => void;
  openWatchlist: () => void;
  watchlistCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  openSearch,
  openWatchlist,
  watchlistCount
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-2xl flex items-center justify-around">
      
      {/* 1. Home */}
      <button
        onClick={() => setActiveTab('landing')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'landing'
            ? 'text-[#851428] dark:text-rose-400 font-bold scale-105'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* 2. Stock Universe */}
      <button
        onClick={() => setActiveTab('universe')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'universe'
            ? 'text-[#851428] dark:text-rose-400 font-bold scale-105'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Database className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Directory</span>
      </button>

      {/* 3. Search Trigger (Highlighted Center Pill) */}
      <button
        onClick={openSearch}
        className="flex flex-col items-center justify-center -mt-3 p-2.5 rounded-full bg-[#851428] text-white shadow-lg shadow-rose-950/40 hover:bg-rose-700 active:scale-95 transition-all border-2 border-white dark:border-slate-900"
        title="Quick Search Stock Ticker"
      >
        <Search className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* 4. Audit Dashboard */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'dashboard'
            ? 'text-[#851428] dark:text-rose-400 font-bold scale-105'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Audit</span>
      </button>

      {/* 5. Saved Watchlist */}
      <button
        onClick={openWatchlist}
        className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
      >
        <Bookmark className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Saved</span>
        {watchlistCount > 0 && (
          <span className="absolute top-0 right-1.5 w-4 h-4 bg-[#851428] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
            {watchlistCount}
          </span>
        )}
      </button>

    </nav>
  );
};
