import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  ArrowRight,
  ShieldAlert,
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { CompanyProfile } from '../types';
import { STOCK_DATABASE } from '../data/mockDatabase';

interface LandingHeroProps {
  onSearch: (ticker: string) => void;
  onExplorePopular: (ticker: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSearch,
  onExplorePopular,
  onNavigateTab
}) => {
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompanyProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const heroClientCache = useRef<Map<string, CompanyProfile[]>>(new Map());

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live real-time search trigger
  useEffect(() => {
    const trimmed = heroSearchQuery.trim().toLowerCase();
    if (!trimmed) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // 1. Instant local filter for 0ms immediate feedback
    const localMatches = Object.values(STOCK_DATABASE).filter(c =>
      c.ticker.toLowerCase().startsWith(trimmed) ||
      c.name.toLowerCase().includes(trimmed) ||
      c.ticker.toLowerCase().includes(trimmed)
    ).slice(0, 10);

    if (localMatches.length > 0) {
      setSearchResults(localMatches);
      setShowDropdown(true);
    }

    // 2. Client cache check
    if (heroClientCache.current.has(trimmed)) {
      setSearchResults(heroClientCache.current.get(trimmed)!);
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
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data)) {
            heroClientCache.current.set(trimmed, data);
            setSearchResults(data);
            setShowDropdown(true);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Hero live search error:', err);
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
  }, [heroSearchQuery]);

  const handleSelectTicker = (ticker: string) => {
    onSearch(ticker);
    setHeroSearchQuery('');
    setShowDropdown(false);
  };

  const popularTickers = [
    { ticker: 'NVDA', name: 'NVIDIA', status: 'COMPLIANT', note: 'Halal (Semiconductors)' },
    { ticker: 'PLTR', name: 'Palantir', status: 'NON_COMPLIANT', note: 'Non-Halal (Defense Systems)' },
    { ticker: 'GOOGL', name: 'Alphabet / Google', status: 'NON_COMPLIANT', note: 'Non-Halal (Impure Ads > 5%)' },
    { ticker: 'DIS', name: 'Disney', status: 'NON_COMPLIANT', note: 'Non-Halal (Media & Entertainment)' },
    { ticker: 'NFLX', name: 'Netflix', status: 'NON_COMPLIANT', note: 'Non-Halal (Media & Streaming)' },
    { ticker: 'AAPL', name: 'Apple', status: 'COMPLIANT', note: 'Halal (Hardware & Services)' },
    { ticker: 'MSFT', name: 'Microsoft', status: 'COMPLIANT', note: 'Halal (Enterprise Software)' },
    { ticker: 'TSLA', name: 'Tesla', status: 'COMPLIANT', note: 'Halal (Clean Vehicles)' },
    { ticker: 'JPM', name: 'JPMorgan', status: 'NON_COMPLIANT', note: 'Non-Halal (Riba Banking)' },
    { ticker: 'AMD', name: 'AMD', status: 'COMPLIANT', note: 'Halal (Processors)' }
  ];

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-800 text-white p-8 sm:p-12 lg:p-16 shadow-2xl text-center flex flex-col items-center">
        {/* Background Subtle Corporate Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#851428]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#590d1a]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6 w-full flex flex-col items-center">
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#851428]/25 backdrop-blur-md border border-[#851428]/40 text-rose-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Mollet Capital Shariah Engine
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AAOIFI #21 &amp; Strict Consumer Standards
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
            Instant Shariah Audit &amp; Screening <br />
            <span className="bg-gradient-to-r from-rose-300 via-rose-100 to-white bg-clip-text text-transparent">
              For Any Stock on NASDAQ &amp; NYSE
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
            Type any stock ticker or company name below. Powered by live Google Finance &amp; Yahoo Finance real-time feeds with verified two-tier Islamic finance filters.
          </p>

          {/* MAIN CENTERED SEARCH BAR */}
          <div className="w-full max-w-2xl pt-4 relative" ref={searchContainerRef}>
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-800/90 backdrop-blur-2xl border-2 border-rose-500/40 focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-500/20 transition-all">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-rose-300" />
              <input
                type="text"
                value={heroSearchQuery}
                onChange={(e) => setHeroSearchQuery(e.target.value)}
                onFocus={() => heroSearchQuery.trim() && setShowDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && heroSearchQuery.trim()) {
                    handleSelectTicker(heroSearchQuery.trim());
                  }
                }}
                placeholder="Search any stock or company (e.g. Palantir, Google, Apple, NVDA, TSLA, AMD)..."
                className="w-full pl-13 pr-36 py-4 text-base sm:text-lg bg-transparent text-white placeholder-slate-400 focus:outline-none font-medium"
              />
              
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                <button
                  onClick={() => {
                    if (heroSearchQuery.trim()) {
                      handleSelectTicker(heroSearchQuery.trim());
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#851428] to-[#590d1a] hover:from-[#9c1831] hover:to-[#751123] text-white font-bold text-sm transition-all shadow-md flex items-center gap-1.5"
                >
                  Audit Stock <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LIVE AUTOCOMPLETE DROPDOWN */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 max-h-96 overflow-y-auto text-left">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.ticker}
                      onClick={() => handleSelectTicker(item.ticker)}
                      className="w-full text-left px-5 py-3.5 flex items-center justify-between hover:bg-[#851428]/25 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold font-mono text-sm text-rose-300 border border-slate-700">
                          {item.ticker}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-rose-200 transition-colors flex items-center gap-2">
                            {item.name}
                            <span className="text-xs text-slate-400 font-mono">({item.exchange})</span>
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                            {item.sector} • {item.industry}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 pl-3">
                        {item.screening.status === 'COMPLIANT' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Halal Compliant
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Non-Compliant
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    Searching live stock exchanges for "<strong className="text-white">{heroSearchQuery}</strong>"...
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-slate-400 mt-2 text-center">
              Supports 8,000+ US &amp; Global Equities (NASDAQ, NYSE, AMEX). Instant live metrics &amp; multi-standard audits.
            </p>
          </div>

          {/* Quick Stock Chips */}
          <div className="pt-4 flex flex-wrap justify-center gap-2 items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Popular Stock Audits:
            </span>
            {popularTickers.map((item) => (
              <button
                key={item.ticker}
                onClick={() => onExplorePopular(item.ticker)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all flex items-center gap-1.5 ${
                  item.status === 'COMPLIANT'
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/40'
                }`}
                title={item.note}
              >
                <span className="font-mono font-bold">{item.ticker}</span>
                <span className="text-[10px] opacity-80">({item.name})</span>
              </button>
            ))}
          </div>

        </div>

        {/* Floating Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10 w-full">
          <div>
            <div className="text-2xl font-black text-white font-mono">Live Feed</div>
            <div className="text-xs text-slate-400 font-medium">Real-time Quotes &amp; SEC Edgar</div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-300 font-mono">Step 1</div>
            <div className="text-xs text-slate-400 font-medium">Defense &amp; Business Activity Filter</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">AAOIFI &amp; Strict</div>
            <div className="text-xs text-slate-400 font-medium">Multi-Methodology Alignment</div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-300 font-mono">Purification</div>
            <div className="text-xs text-slate-400 font-medium">Dividend Cleansing Engine</div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-sans">
            Strict Multi-Standard Shariah Audit Framework
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Enforces strict Islamic jurisprudence starting with core business activities before inspecting financial leverage ratios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Primary Business Sector Filter */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-red-500/20 dark:border-slate-800/80 shadow-xl shadow-red-600/5 space-y-4 hover:border-red-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 backdrop-blur-md flex items-center justify-center border border-red-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 1: Primary Business Check
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                Mandatory
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Straightforward rejection of Conventional Banking, Military Defense Systems (e.g., Palantir), Alcohol, Pork, Gambling, Tobacco, Adult Content, or Offensive Weapons.
            </p>
          </div>

          {/* Card 2: Financial Ratio Audit */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-xl shadow-black/5 space-y-4 hover:border-red-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md flex items-center justify-center border border-slate-700">
              <ShieldCheck className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 2: Impure Revenue &amp; Ratio Screening
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Verifies that non-halal ad streams (e.g. Google YouTube ads for loans/gambling) &amp; interest income remain strictly below 5.0%, and interest debt &lt; 30-33%.
            </p>
          </div>

          {/* Card 3: Dividend Purification Engine */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-xl shadow-black/5 space-y-4 hover:border-red-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md flex items-center justify-center border border-slate-700">
              <Calculator className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Dividend Purification Engine
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculates exact dollar amounts required to cleanse impure interest earnings from dividend distributions according to standard AAOIFI purification factors.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Section Summary */}
      <section className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            Methodology Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-sans">
            AAOIFI &amp; Strict Consumer Standards Alignment
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI) and contemporary Islamic screeners mandate that equity investment screening must begin with primary business activity qualification before examining debt and cash leverage ratios.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('methodology')}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all shadow-md shadow-red-600/20"
            >
              Explore Full Methodology Rules
            </button>
          </div>
        </div>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Primary Business Sector Check</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Companies in Riba banking, defense contracting &amp; military surveillance (e.g. Palantir), alcohol, pork, gambling, or adult content fail straightaway.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Impure Revenue Audit (&le; 5%)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Non-halal ad streams (Google YouTube ad networks for interest loans) plus interest income must remain below 5% of revenue.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Debt &amp; Cash Ratio Verification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Interest-bearing debt and interest-earning deposits must remain below 30% (AAOIFI) or 33% (DJIM/Strict Consumer) of market capitalization.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
