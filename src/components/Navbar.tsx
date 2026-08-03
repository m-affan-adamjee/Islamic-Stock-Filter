import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BarChart2, 
  Calculator, 
  BookOpen, 
  Code, 
  Bookmark, 
  Sun, 
  Moon, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Database
} from 'lucide-react';
import { CompanyProfile, ShariahStandard } from '../types';
import { MolletLogo } from './MolletLogo';
import { STOCK_DATABASE } from '../data/mockDatabase';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectCompany: (ticker: string) => void;
  standard: ShariahStandard;
  setStandard: (standard: ShariahStandard) => void;
  watchlistCount: number;
  openWatchlist: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectCompany,
  standard,
  setStandard,
  watchlistCount,
  openWatchlist,
  darkMode,
  setDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompanyProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const clientSearchCache = useRef<Map<string, CompanyProfile[]>>(new Map());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // 1. Instant local filter for 0ms immediate responsiveness
    const localMatches = Object.values(STOCK_DATABASE).filter(c =>
      c.ticker.toLowerCase().startsWith(trimmed) ||
      c.name.toLowerCase().includes(trimmed) ||
      c.ticker.toLowerCase().includes(trimmed)
    ).slice(0, 10);

    if (localMatches.length > 0) {
      setSearchResults(localMatches);
      setShowDropdown(true);
    }

    // 2. Check client cache
    if (clientSearchCache.current.has(trimmed)) {
      setSearchResults(clientSearchCache.current.get(trimmed)!);
      setShowDropdown(true);
      setIsSearching(false);
      return;
    }

    // 3. Debounced API fetch with AbortController
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            clientSearchCache.current.set(trimmed, data);
            setSearchResults(data);
            setShowDropdown(true);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  const handleSelect = (ticker: string) => {
    onSelectCompany(ticker);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-all shadow-lg shadow-black/5 dark:shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo - Redirects to Mollet Capital Official Site */}
          <a
            href="https://molletcapital.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-opacity hover:opacity-90 flex items-center"
            title="Visit Mollet Capital Official Website (molletcapital.com)"
          >
            <MolletLogo size="md" />
          </a>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Search ticker or company (e.g. NVDA, AAPL, JPM, TSLA)..."
                className="w-full pl-10 pr-10 py-2 text-sm bg-slate-100/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#851428]/50 focus:border-[#851428] transition-all shadow-inner"
              />
              {isSearching ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#851428] border-t-transparent rounded-full animate-spin" />
              ) : searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              ) : null}
            </div>

            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100/50 dark:divide-slate-800/50 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.ticker}
                      onClick={() => handleSelect(item.ticker)}
                      className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#851428]/10 dark:hover:bg-[#851428]/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#851428]/10 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-center font-bold font-mono text-xs text-[#851428] dark:text-rose-400 border border-[#851428]/20">
                          {item.ticker.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">
                              {item.ticker}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {item.exchange}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.name} • {item.sector}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-md ${
                          item.screening.status === 'COMPLIANT'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.screening.status === 'COMPLIANT' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Halal
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-500" /> Non-Compliant
                            </>
                          )}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    No exact match found for &quot;{searchQuery}&quot;. Click to generate dynamic AAOIFI ratio check.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('universe')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'universe'
                  ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4" /> Stock Universe
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Compare
            </button>
            <button
              onClick={() => setActiveTab('purification')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'purification'
                  ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" /> Purification
            </button>
            <button
              onClick={() => setActiveTab('methodology')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'methodology'
                  ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Methodology
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'api'
                  ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Code className="w-4 h-4" /> API
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            
            {/* Standard Selector */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {(['AAOIFI', 'STRICT_RETAIL', 'MSCI', 'DJ'] as ShariahStandard[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setStandard(st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    standard === st
                      ? 'bg-[#851428] text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st === 'STRICT_RETAIL' ? 'Strict Retail' : st}
                </button>
              ))}
            </div>

            {/* Watchlist button */}
            <button
              onClick={openWatchlist}
              className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
              title="Saved Watchlist"
            >
              <Bookmark className="w-5 h-5" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#851428] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-black/20">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
