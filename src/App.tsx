import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { ComplianceBanner } from './components/ComplianceBanner';
import { RatioCard } from './components/RatioCard';
import { ShariahCharts } from './components/ShariahCharts';
import { AIAuditMemo } from './components/AIAuditMemo';
import { DividendPurificationCalculator } from './components/DividendPurificationCalculator';
import { CompanyOverview } from './components/CompanyOverview';
import { MethodologyModal } from './components/MethodologyModal';
import { StockComparison } from './components/StockComparison';
import { UniverseDirectory } from './components/UniverseDirectory';
import { ExportModal } from './components/ExportModal';
import { ApiDocsView } from './components/ApiDocsView';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';
import { CompanyProfile, ShariahStandard, WatchlistItem, CustomThresholds } from './types';
import { STOCK_DATABASE, runShariahScreening, generateDynamicProfile, resolveTickerAlias } from './data/mockDatabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentTicker, setCurrentTicker] = useState<string>('NVDA');
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(false);
  const [standard, setStandard] = useState<ShariahStandard>('AAOIFI');
  const [customThresholds, setCustomThresholds] = useState<CustomThresholds | undefined>(undefined);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Watchlist & Modals
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('mollet_screener_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [showAIAuditSection, setShowAIAuditSection] = useState<boolean>(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mollet_screener_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist:', e);
    }
  }, [watchlist]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetchCompany = () => setRefreshTrigger(prev => prev + 1);

  // Fetch company data whenever currentTicker or standard changes
  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoadingCompany(true);
      try {
        let url = `/api/company/${currentTicker}?standard=${standard}&t=${Date.now()}`;
        if (standard === 'CUSTOM' && customThresholds) {
          url += `&custom=${encodeURIComponent(JSON.stringify(customThresholds))}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        console.error('Failed to fetch company profile:', err);
        // Fallback local synthesis if API is warming up
        const resolved = resolveTickerAlias(currentTicker);
        const fallback = STOCK_DATABASE[resolved] || generateDynamicProfile(resolved);
        const scr = runShariahScreening(
          { sector: fallback.sector, ...fallback.shariahMetrics },
          standard,
          customThresholds
        );
        setCompany({ ...fallback, screening: scr });
      } finally {
        setLoadingCompany(false);
      }
    };

    fetchCompanyData();
  }, [currentTicker, standard, customThresholds, refreshTrigger]);

  const handleSelectCompany = (ticker: string) => {
    setCurrentTicker(ticker.toUpperCase().trim());
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWatchlist = (ticker: string) => {
    if (!company) return;
    const exists = watchlist.some(w => w.ticker === ticker);
    if (exists) {
      setWatchlist(watchlist.filter(w => w.ticker !== ticker));
    } else {
      const newItem: WatchlistItem = {
        ticker: company.ticker,
        name: company.name,
        sector: company.sector,
        price: company.price,
        changePercent: company.changePercent,
        status: company.screening.status,
        debtRatio: company.screening.debt_ratio,
        purificationFactor: company.screening.purification_factor,
        addedAt: new Date().toISOString()
      };
      setWatchlist([newItem, ...watchlist]);
    }
  };

  const isBookmarked = company ? watchlist.some(w => w.ticker === company.ticker) : false;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans flex flex-col ${darkMode ? 'dark' : ''}`}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectCompany={handleSelectCompany}
        standard={standard}
        setStandard={setStandard}
        watchlistCount={watchlist.length}
        openWatchlist={() => setIsWatchlistOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Tab 1: Landing Page */}
        {activeTab === 'landing' && (
          <LandingHero
            onSearch={handleSelectCompany}
            onExplorePopular={handleSelectCompany}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Tab 2: Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {loadingCompany || !company ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Executing Mollet Shariah Audit &amp; AAOIFI Ratio Screening for {currentTicker}...
                </p>
              </div>
            ) : (
              <>
                {/* 1. Compliance Banner */}
                <ComplianceBanner
                  company={company}
                  standard={standard}
                  onOpenAudit={() => setShowAIAuditSection(true)}
                  onOpenExport={() => setIsExportOpen(true)}
                  onToggleWatchlist={handleToggleWatchlist}
                  isBookmarked={isBookmarked}
                  onCompare={(t) => {
                    handleSelectCompany(t);
                    setActiveTab('compare');
                  }}
                />

                {/* 2. Shariah Financial Ratio Cards Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                      AAOIFI Financial Screening Ratios
                    </h2>
                    <span className="text-xs text-slate-500 font-mono">
                      Denominator: {company.screening.denominator_used === 'market_cap' ? 'Market Cap' : 'Total Assets'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    
                    {/* Ratio 1: Debt Ratio */}
                    <RatioCard
                      title="Interest Debt Ratio"
                      formula="Interest Debt / Market Cap"
                      currentValue={company.screening.debt_ratio}
                      threshold={company.screening.thresholds.maxDebt}
                      thresholdType="MAX"
                      isPass={company.screening.debt_pass}
                      explanation={`Interest debt represents ${(company.screening.debt_ratio * 100).toFixed(2)}% of ${company.screening.denominator_used === 'market_cap' ? 'market cap' : 'total assets'}. Limit is ${(company.screening.thresholds.maxDebt * 100).toFixed(1)}%.`}
                      denominatorUsed={company.screening.denominator_used}
                    />

                    {/* Ratio 2: Cash Ratio */}
                    <RatioCard
                      title="Interest Cash Ratio"
                      formula="Interest Cash / Market Cap"
                      currentValue={company.screening.cash_ratio}
                      threshold={company.screening.thresholds.maxCash}
                      thresholdType="MAX"
                      isPass={company.screening.cash_pass}
                      explanation={`Interest-earning deposits & cash accounts for ${(company.screening.cash_ratio * 100).toFixed(2)}%. Limit is ${(company.screening.thresholds.maxCash * 100).toFixed(1)}%.`}
                      denominatorUsed={company.screening.denominator_used}
                    />

                    {/* Ratio 3: Impure Revenue */}
                    <RatioCard
                      title="Impure Revenue Ratio"
                      formula="Non-Halal Rev / Total Rev"
                      currentValue={company.screening.impure_ratio}
                      threshold={company.screening.thresholds.maxImpure}
                      thresholdType="MAX"
                      isPass={company.screening.impure_pass}
                      explanation={`Non-halal & interest revenue is ${(company.screening.impure_ratio * 100).toFixed(2)}% of turnover. Maximum limit is ${(company.screening.thresholds.maxImpure * 100).toFixed(1)}%.`}
                    />

                    {/* Ratio 4: Tangible Assets */}
                    <RatioCard
                      title="Tangible Assets Ratio"
                      formula="Tangible Assets / Total Assets"
                      currentValue={company.screening.tangible_ratio}
                      threshold={company.screening.thresholds.minTangible}
                      thresholdType="MIN"
                      isPass={company.screening.tangible_pass}
                      explanation={`Tangible physical assets account for ${(company.screening.tangible_ratio * 100).toFixed(2)}% of total assets. Required minimum is ${(company.screening.thresholds.minTangible * 100).toFixed(1)}%.`}
                    />

                    {/* Ratio 5: Dividend Purification Factor */}
                    <RatioCard
                      title="Dividend Purification"
                      formula="Impure Rev / Total Rev"
                      currentValue={company.screening.purification_factor}
                      threshold={company.screening.purification_factor}
                      thresholdType="MAX"
                      isPass={true}
                      explanation={`Purify ${(company.screening.purification_factor * 100).toFixed(2)}% of dividend payouts by donating to charitable causes.`}
                      isPurification={true}
                    />

                  </div>
                </div>

                {/* 3. Recharts Visualizations */}
                <ShariahCharts company={company} />

                {/* 4. AI Shariah Audit Memo (Gemini 3.6 Flash) */}
                {(showAIAuditSection || true) && (
                  <AIAuditMemo company={company} standard={standard} />
                )}

                {/* 5. Company Fundamental Overview */}
                <CompanyOverview company={company} onRefresh={refetchCompany} />

                {/* 6. Dividend Purification Calculator */}
                <DividendPurificationCalculator company={company} />
              </>
            )}
          </div>
        )}

        {/* Tab 3: Stock Universe View */}
        {activeTab === 'universe' && (
          <UniverseDirectory
            currentStandard={standard}
            onSelectCompany={handleSelectCompany}
          />
        )}

        {/* Tab 4: Compare View */}
        {activeTab === 'compare' && (
          <StockComparison
            initialTickers={['NVDA', 'AAPL', 'MSFT', 'JPM']}
            standard={standard}
            onSelectCompany={handleSelectCompany}
          />
        )}

        {/* Tab 4: Purification Calculator Standalone View */}
        {activeTab === 'purification' && (
          <DividendPurificationCalculator company={company || undefined} />
        )}

        {/* Tab 5: Methodology View */}
        {activeTab === 'methodology' && (
          <MethodologyModal
            currentStandard={standard}
            onSelectStandard={setStandard}
            customThresholds={customThresholds}
            onUpdateCustomThresholds={setCustomThresholds}
          />
        )}

        {/* Tab 6: REST API Docs View */}
        {activeTab === 'api' && <ApiDocsView />}

      </main>

      {/* Export Modal */}
      {isExportOpen && company && (
        <ExportModal
          company={company}
          standard={standard}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Saved Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        items={watchlist}
        onRemove={(ticker) => setWatchlist(watchlist.filter(w => w.ticker !== ticker))}
        onSelect={handleSelectCompany}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
