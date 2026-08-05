import React, { useState, useRef, useEffect } from 'react';
import { 
  Home,
  BarChart2, 
  Calculator, 
  BookOpen, 
  Bookmark, 
  Sun, 
  Moon, 
  TrendingUp,
  Database,
  ChevronDown,
  Menu,
  X,
  Layers,
  ShieldCheck,
  Search
} from 'lucide-react';
import { ShariahStandard } from '../types';
import { MolletLogo } from './MolletLogo';

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
  openSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  standard,
  setStandard,
  watchlistCount,
  openWatchlist,
  darkMode,
  setDarkMode,
  openSearch
}) => {
  const [screenerOpen, setScreenerOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const screenerRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (screenerRef.current && !screenerRef.current.contains(event.target as Node)) {
        setScreenerOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isScreenerActive = ['dashboard', 'universe', 'compare'].includes(activeTab);
  const isToolsActive = ['purification', 'methodology'].includes(activeTab);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setScreenerOpen(false);
    setToolsOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 dark:border-slate-800/60 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-all shadow-lg shadow-black/5 dark:shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavigate('landing')}
              className="transition-opacity hover:opacity-90 flex items-center text-left"
              title="Go to Home (Mollet Capital)"
            >
              <MolletLogo size="md" />
            </button>
          </div>

          {/* Desktop Sub-grouped Dropdown Navigation */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            
            {/* 1. Home */}
            <button
              onClick={() => handleNavigate('landing')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'landing'
                  ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* 2. Screener & Research Dropdown */}
            <div 
              className="relative" 
              ref={screenerRef}
              onMouseEnter={() => setScreenerOpen(true)}
              onMouseLeave={() => setScreenerOpen(false)}
            >
              <button
                onClick={() => setScreenerOpen(!screenerOpen)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isScreenerActive
                    ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Screener &amp; Markets</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${screenerOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {screenerOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-black/20 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      activeTab === 'dashboard'
                        ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#851428] dark:text-rose-400 group-hover:bg-[#851428] group-hover:text-white transition-colors">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Audit Dashboard</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Real-time stock audit &amp; compliance breakdown</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate('universe')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group mt-1 ${
                      activeTab === 'universe'
                        ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#851428] dark:text-rose-400 group-hover:bg-[#851428] group-hover:text-white transition-colors">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Stock Universe</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Search 10,000+ stocks &amp; Certified Halal ETFs</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate('compare')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group mt-1 ${
                      activeTab === 'compare'
                        ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#851428] dark:text-rose-400 group-hover:bg-[#851428] group-hover:text-white transition-colors">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Stock Comparison</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Side-by-side Shariah ratio comparison</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Tools & Methodology Dropdown */}
            <div 
              className="relative" 
              ref={toolsRef}
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isToolsActive
                    ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Tools &amp; Governance</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-black/20 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => handleNavigate('purification')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      activeTab === 'purification'
                        ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#851428] dark:text-rose-400 group-hover:bg-[#851428] group-hover:text-white transition-colors">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Dividend Purification</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Calculate exact non-permissible charity amounts</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate('methodology')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 group mt-1 ${
                      activeTab === 'methodology'
                        ? 'bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#851428] dark:text-rose-400 group-hover:bg-[#851428] group-hover:text-white transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Shariah Methodology</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">AAOIFI, MSCI &amp; Dow Jones screening standards</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </nav>

          {/* Action controls (Standard Switcher, Quick Search, Watchlist & Dark Mode) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Shariah Standard Selector */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
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

            {/* Quick Search Trigger (Mobile + Desktop header icon) */}
            {openSearch && (
              <button
                onClick={openSearch}
                className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
                title="Search Stock Ticker"
              >
                <Search className="w-5 h-5 text-[#851428] dark:text-rose-400" />
              </button>
            )}

            {/* Watchlist Drawer Button */}
            <button
              onClick={openWatchlist}
              className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
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
              className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Mobile Search Button in Drawer */}
          {openSearch && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSearch();
              }}
              className="w-full text-left px-4 py-3 rounded-xl bg-[#851428]/10 text-[#851428] dark:text-rose-400 font-bold text-sm flex items-center justify-between border border-[#851428]/20"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Search Stock Ticker (e.g. NVDA)
              </span>
              <span className="text-[10px] uppercase font-extrabold bg-[#851428] text-white px-2 py-0.5 rounded-md">Quick</span>
            </button>
          )}

          <button
            onClick={() => handleNavigate('landing')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 ${
              activeTab === 'landing' ? 'bg-[#851428]/10 text-[#851428]' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 text-[#851428]" /> Home Page
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-4 py-1">
              Screener &amp; Markets
            </div>
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 ${
                activeTab === 'dashboard' ? 'bg-[#851428]/10 text-[#851428] font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#851428]" /> Audit Dashboard
            </button>
            <button
              onClick={() => handleNavigate('universe')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 ${
                activeTab === 'universe' ? 'bg-[#851428]/10 text-[#851428] font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4 text-[#851428]" /> Stock Universe Directory
            </button>
            <button
              onClick={() => handleNavigate('compare')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 ${
                activeTab === 'compare' ? 'bg-[#851428]/10 text-[#851428] font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-[#851428]" /> Compare Stocks
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-4 py-1">
              Tools &amp; Governance
            </div>
            <button
              onClick={() => handleNavigate('purification')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 ${
                activeTab === 'purification' ? 'bg-[#851428]/10 text-[#851428] font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#851428]" /> Dividend Purification
            </button>
            <button
              onClick={() => handleNavigate('methodology')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 ${
                activeTab === 'methodology' ? 'bg-[#851428]/10 text-[#851428] font-bold' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#851428]" /> Shariah Methodology
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-2">
            <span className="text-xs text-slate-500 font-medium">Shariah Standard:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              {(['AAOIFI', 'STRICT_RETAIL', 'MSCI', 'DJ'] as ShariahStandard[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setStandard(st)}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg ${
                    standard === st ? 'bg-[#851428] text-white' : 'text-slate-500'
                  }`}
                >
                  {st === 'STRICT_RETAIL' ? 'Strict' : st}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
