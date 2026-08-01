import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  BookOpen, 
  ArrowRight,
  ShieldAlert,
  Building2,
  TrendingUp
} from 'lucide-react';
import { MolletLogo } from './MolletLogo';

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
  const popularTickers = [
    { ticker: 'NVDA', name: 'NVIDIA', status: 'COMPLIANT', sector: 'Semiconductors' },
    { ticker: 'AAPL', name: 'Apple', status: 'COMPLIANT', sector: 'Consumer Electronics' },
    { ticker: 'MSFT', name: 'Microsoft', status: 'COMPLIANT', sector: 'Software' },
    { ticker: 'TSLA', name: 'Tesla', status: 'COMPLIANT', sector: 'Clean Energy' },
    { ticker: 'JPM', name: 'JPMorgan', status: 'NON_COMPLIANT', sector: 'Conventional Banking' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', status: 'COMPLIANT', sector: 'Healthcare' },
    { ticker: 'LMT', name: 'Lockheed Martin', status: 'NON_COMPLIANT', sector: 'Weapons & Defense' },
    { ticker: 'XOM', name: 'Exxon Mobil', status: 'COMPLIANT', sector: 'Energy' }
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-800 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Background Subtle Corporate Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#851428]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#590d1a]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#851428]/25 backdrop-blur-md border border-[#851428]/40 text-rose-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Mollet Capital Institutional Engine
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AAOIFI Standard No. 21
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
            Institutional Shariah Screening With <span className="bg-gradient-to-r from-rose-300 via-rose-100 to-white bg-clip-text text-transparent">Business & Financial Precision</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
            Mollet Capital Screener evaluates global equities with mandatory two-tier screening: <strong className="text-white font-semibold">Step 1 Primary Business Sector Check</strong> (filtering Conventional Financial Services &amp; Prohibited Goods) followed by <strong className="text-white font-semibold">Step 2 AAOIFI Ratio Audit</strong>.
          </p>

          {/* Quick Search trigger buttons */}
          <div className="pt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
              Featured Stock Audits:
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
              >
                <span className="font-mono font-bold">{item.ticker}</span>
                <span className="text-[10px] opacity-80">({item.sector})</span>
              </button>
            ))}
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onExplorePopular('NVDA')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#851428] via-[#751123] to-[#590d1a] hover:from-[#9c1831] hover:to-[#751123] text-white font-bold text-sm transition-all shadow-lg shadow-black/30 flex items-center gap-2 border border-white/20"
            >
              Analyze NVIDIA (NVDA) <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onExplorePopular('JPM')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm border border-white/15 transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Test Prohibited Banking (JPM)
            </button>
          </div>
        </div>

        {/* Floating Quick Stats Card */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10 dark:border-slate-800/80">
          <div>
            <div className="text-2xl font-black text-white font-mono">$3.4T+</div>
            <div className="text-xs text-slate-400 font-medium">Equities Evaluated</div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-300 font-mono">Step 1</div>
            <div className="text-xs text-slate-400 font-medium">Business Activity Filter</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">AAOIFI #21</div>
            <div className="text-xs text-slate-400 font-medium">Financial Ratio Standards</div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-300 font-mono">Instant</div>
            <div className="text-xs text-slate-400 font-medium">AI Audit Memo Reports</div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-sans">
            Strict Two-Tier Shariah Audit Framework
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Mollet Capital Screener enforces strict Islamic jurisprudence starting with core business activities before inspecting financial leverage ratios.
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
              Straightforward rejection of Conventional Banking, Interest Brokerage, Insurance, Alcohol, Pork, Gambling, Tobacco, Adult Entertainment, or Offensive Weapons.
            </p>
          </div>

          {/* Card 2: Financial Ratio Audit */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-xl shadow-black/5 space-y-4 hover:border-red-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md flex items-center justify-center border border-slate-700">
              <ShieldCheck className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step 2: Financial Ratio Screening
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict quantitative evaluation against AAOIFI &amp; MSCI limits: Debt-to-Market Cap (&lt;30%), Interest Cash (&lt;30%), Non-Halal Revenue (&le;5%), Tangible Assets (&ge;20%).
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
              Calculates exact dollar amounts required to cleanse impure interest earnings from dividend distributions according to AAOIFI purification factors.
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
            AAOIFI Standard No. 21 Compliance Rules
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI) mandates that equity investment screening must begin with primary business activity qualification before examining debt and cash leverage ratios.
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
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Primary Business Activity Check</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Companies in Riba banking, conventional insurance, alcohol, pork, gambling, tobacco, adult content or offensive weapons fail straightaway.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Debt &amp; Cash Ratio Verification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Interest-bearing debt and interest-earning deposits must each remain below 30% of market capitalization (AAOIFI).</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Non-Halal Revenue Purification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Impure revenue must be &le; 5.0% of total revenue. Any impure fraction must be cleansed through charitable donations.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
