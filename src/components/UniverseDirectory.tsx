import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Database, 
  Layers, 
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { ShariahStandard } from '../types';

interface AuditedStock {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  exchange: string;
  price: number;
  marketCap: number;
  totalRevenue: number;
  shariahMetrics: {
    interest_bearing_debt: number;
    interest_earning_assets: number;
    impure_revenue: number;
    tangible_assets: number;
    total_assets: number;
  };
  dataSources?: {
    quoteSource: string;
    fundamentalsSource: string;
    crossSourceValidation?: {
      confidenceScore: string;
      sourcesAudited: string[];
    };
  };
  standardsAudit: Record<string, {
    status: 'COMPLIANT' | 'NON_COMPLIANT';
    debt_ratio: number;
    cash_ratio: number;
    impure_ratio: number;
    tangible_ratio: number;
    purification_factor: number;
    message: string;
    reason?: string;
  }>;
}

interface UniverseDirectoryProps {
  currentStandard: ShariahStandard;
  onSelectCompany: (ticker: string) => void;
}

export const UniverseDirectory: React.FC<UniverseDirectoryProps> = ({
  currentStandard,
  onSelectCompany
}) => {
  const [auditData, setAuditData] = useState<AuditedStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLIANT' | 'NON_COMPLIANT'>('ALL');
  const [selectedStandard, setSelectedStandard] = useState<ShariahStandard>(
    currentStandard === 'CUSTOM' ? 'AAOIFI' : currentStandard
  );
  const [customInputTicker, setCustomInputTicker] = useState('');
  const [addingTicker, setAddingTicker] = useState(false);
  const [addTickerMessage, setAddTickerMessage] = useState<string | null>(null);

  const fetchAuditMatrix = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/universe/audit');
      const data = await res.json();
      if (data.auditedStocks) {
        setAuditData(data.auditedStocks);
      }
    } catch (err) {
      console.error('Failed to fetch universe audit matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAndAuditTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputTicker.trim()) return;

    const tickerToAudit = customInputTicker.trim().toUpperCase();
    setAddingTicker(true);
    setAddTickerMessage(null);

    try {
      const res = await fetch('/api/universe/add-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: tickerToAudit })
      });

      const data = await res.json();

      if (data.success && data.auditedStock) {
        const newStock: AuditedStock = data.auditedStock;
        setAuditData((prev) => {
          const exists = prev.some((s) => s.ticker === newStock.ticker);
          if (exists) {
            return prev.map((s) => (s.ticker === newStock.ticker ? newStock : s));
          }
          return [newStock, ...prev];
        });

        setSearchTerm(newStock.ticker);
        setCustomInputTicker('');
        setAddTickerMessage(`Successfully audited ${newStock.ticker} (${newStock.name}) across all 5 Shariah standards!`);
        setTimeout(() => setAddTickerMessage(null), 5000);
      } else {
        setAddTickerMessage(`Could not audit ticker "${tickerToAudit}". Please check the symbol and try again.`);
      }
    } catch (err) {
      setAddTickerMessage(`Network or verification error while auditing ${tickerToAudit}.`);
    } finally {
      setAddingTicker(false);
    }
  };

  useEffect(() => {
    fetchAuditMatrix();
  }, []);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(auditData.map(s => s.sector)))], [auditData]);

  const filteredStocks = useMemo(() => {
    const q = deferredSearchTerm.trim().toLowerCase();

    return auditData
      .filter(stock => {
        const activeAudit = stock.standardsAudit[selectedStandard] || stock.standardsAudit['AAOIFI'];
        if (!activeAudit) return false;

        // Sector filter
        if (selectedSector !== 'ALL' && stock.sector !== selectedSector) return false;

        // Status filter
        if (statusFilter !== 'ALL' && activeAudit.status !== statusFilter) return false;

        if (!q) return true;

        // Fast match check
        const tLower = stock.ticker.toLowerCase();
        const nLower = stock.name.toLowerCase();
        const sLower = stock.sector.toLowerCase();

        return tLower.includes(q) || nLower.includes(q) || sLower.includes(q);
      })
      .sort((a, b) => {
        if (!q) return 0;
        const aT = a.ticker.toLowerCase();
        const bT = b.ticker.toLowerCase();
        if (aT === q) return -1;
        if (bT === q) return 1;
        if (aT.startsWith(q) && !bT.startsWith(q)) return -1;
        if (bT.startsWith(q) && !aT.startsWith(q)) return 1;
        return aT.localeCompare(bT);
      });
  }, [auditData, deferredSearchTerm, selectedStandard, selectedSector, statusFilter]);

  const compliantCount = useMemo(() => 
    auditData.filter(s => s.standardsAudit[selectedStandard]?.status === 'COMPLIANT').length,
    [auditData, selectedStandard]
  );
  
  const nonCompliantCount = useMemo(() => 
    auditData.filter(s => s.standardsAudit[selectedStandard]?.status === 'NON_COMPLIANT').length,
    [auditData, selectedStandard]
  );

  const formatMcap = (val: number) => {
    if (!val) return '$0';
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    return `$${(val / 1e6).toFixed(0)}M`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold font-mono">
            <ShieldCheck className="w-4 h-4 text-rose-400" /> System-Wide Multi-Source Compliance Matrix
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Cross-Validated Shariah Universe Directory
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Every stock across <strong>NASDAQ</strong> and <strong>NYSE</strong> (8,000+ US equities) can be cross-audited on demand. Below is our active matrix running real-time feeds from Google Finance, Yahoo Finance, and audited SEC EDGAR disclosures across 5 major international Islamic finance standards.
          </p>
        </div>

        {/* Dynamic Add & Audit Stock Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold font-mono text-rose-300">
            <Sparkles className="w-4 h-4 text-rose-400" /> Audit Any NASDAQ or NYSE Stock Live:
          </div>
          <form onSubmit={handleAddAndAuditTicker} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customInputTicker}
              onChange={(e) => setCustomInputTicker(e.target.value)}
              placeholder="Enter any US symbol (e.g. UBER, COIN, RBLX, PFE, MRNA, NKE, SBUX, SHOP)..."
              className="flex-1 px-3.5 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
            <button
              type="submit"
              disabled={addingTicker || !customInputTicker.trim()}
              className="px-5 py-2 rounded-xl bg-[#851428] hover:bg-rose-700 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-rose-950/50"
            >
              {addingTicker ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Cross-Auditing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-300" /> Audit &amp; Add Ticker
                </>
              )}
            </button>
          </form>
          {addTickerMessage && (
            <div className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border ${
              addTickerMessage.includes('Successfully')
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/60 border-rose-800/80 text-rose-300'
            }`}>
              {addTickerMessage}
            </div>
          )}
        </div>

        {/* Global Summary Stats Pills */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-slate-400 text-[11px] font-mono">Total Tracked Equities</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{auditData.length}</div>
          </div>
          <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-900/50">
            <div className="text-emerald-400 text-[11px] font-mono">Shariah Compliant</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{compliantCount} Stocks</div>
          </div>
          <div className="bg-rose-950/40 p-3.5 rounded-2xl border border-rose-900/50">
            <div className="text-rose-400 text-[11px] font-mono">Non-Compliant</div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{nonCompliantCount} Stocks</div>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-slate-400 text-[11px] font-mono">Real-Time Data Feeds</div>
            <div className="text-xs font-semibold font-mono text-rose-300 mt-1">Google + Yahoo + SEC</div>
          </div>
        </div>
      </div>

      {/* Controls & Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by ticker, name, or industry (e.g. BE, Bloom Energy, Semiconductors)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          {/* Standard Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 font-mono">Standard:</span>
            {(['AAOIFI', 'STRICT_RETAIL', 'MSCI', 'SP', 'DJ'] as ShariahStandard[]).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStandard(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                  selectedStandard === st
                    ? 'bg-[#851428] text-white shadow-md shadow-rose-900/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st === 'STRICT_RETAIL' ? 'Strict Retail' : st === 'SP' ? 'S&P Shariah' : st === 'DJ' ? 'Dow Jones' : st}
              </button>
            ))}
          </div>

        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          {/* Sector Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold font-mono">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs focus:outline-none"
            >
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          {/* Status Segment Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({auditData.length})
            </button>
            <button
              onClick={() => setStatusFilter('COMPLIANT')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                statusFilter === 'COMPLIANT'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" /> Compliant Only
            </button>
            <button
              onClick={() => setStatusFilter('NON_COMPLIANT')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                statusFilter === 'NON_COMPLIANT'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <XCircle className="w-3 h-3" /> Non-Compliant Only
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAuditMatrix}
            disabled={loading}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-mono"
            title="Re-fetch live multi-source audit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Matrix
          </button>

        </div>
      </div>

      {/* Main Audit Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500">
            Synthesizing Google Finance, Yahoo Finance &amp; SEC filings across {selectedStandard}...
          </p>
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="py-16 px-6 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No stocks matching "{searchTerm}" in current filtered view.</p>
          <p className="text-xs font-mono text-slate-500 max-w-md mx-auto">
            You can audit ANY company on NASDAQ or NYSE in real-time using our multi-source verification engine!
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setCustomInputTicker(searchTerm);
                handleAddAndAuditTicker({ preventDefault: () => {} } as any);
              }}
              disabled={addingTicker}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#851428] hover:bg-rose-700 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-rose-950/30"
            >
              <ShieldCheck className="w-4 h-4 text-rose-300" /> Run Live Multi-Source Audit on "{searchTerm.toUpperCase()}"
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Card Layout (sm screens) */}
          <div className="md:hidden space-y-3">
            {filteredStocks.map((stock) => {
              const audit = stock.standardsAudit[selectedStandard] || stock.standardsAudit['AAOIFI'];
              const isCompliant = audit?.status === 'COMPLIANT';

              return (
                <div 
                  key={stock.ticker}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold font-mono text-base text-slate-900 dark:text-white">
                          {stock.ticker}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-500">
                          ${stock.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                        {stock.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {stock.sector} &bull; MCap {formatMcap(stock.marketCap)}
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono shrink-0 ${
                      isCompliant 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {isCompliant ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> HALAL
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-500" /> PROHIBITED
                        </>
                      )}
                    </span>
                  </div>

                  {/* Shariah Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 text-center font-mono text-[11px]">
                    <div>
                      <div className="text-slate-400 text-[10px]">Debt</div>
                      <div className={`font-bold mt-0.5 ${audit.debt_ratio <= 0.30 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-500'}`}>
                        {(audit.debt_ratio * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Cash</div>
                      <div className={`font-bold mt-0.5 ${audit.cash_ratio <= 0.30 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-500'}`}>
                        {(audit.cash_ratio * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Impure Rev</div>
                      <div className={`font-bold mt-0.5 ${audit.impure_ratio <= 0.05 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-500'}`}>
                        {(audit.impure_ratio * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCompany(stock.ticker)}
                    className="w-full py-2.5 rounded-xl bg-[#851428] hover:bg-rose-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/20"
                  >
                    View Full Shariah Audit &rarr;
                  </button>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (md+ screens) */}
          <div className="hidden md:block overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-950/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">Company / Ticker</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Market Cap</th>
                  <th className="py-3.5 px-4">Debt / MCap</th>
                  <th className="py-3.5 px-4">Cash / MCap</th>
                  <th className="py-3.5 px-4">Impure Rev %</th>
                  <th className="py-3.5 px-4 text-center">{selectedStandard} Status</th>
                  <th className="py-3.5 px-4 text-right">Audit Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
                {filteredStocks.map((stock) => {
                  const audit = stock.standardsAudit[selectedStandard] || stock.standardsAudit['AAOIFI'];
                  const isCompliant = audit?.status === 'COMPLIANT';

                  return (
                    <tr key={stock.ticker} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Ticker & Name */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectCompany(stock.ticker)}
                          className="text-left group"
                        >
                          <div className="font-bold font-mono text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex items-center gap-1">
                            {stock.ticker}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-slate-500 max-w-[160px] truncate font-sans">
                            {stock.name}
                          </div>
                        </button>
                      </td>

                      {/* Sector */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        <div className="max-w-[150px] truncate" title={stock.sector}>
                          {stock.sector}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        ${stock.price.toFixed(2)}
                      </td>

                      {/* Market Cap */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {formatMcap(stock.marketCap)}
                      </td>

                      {/* Debt Ratio */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className={audit.debt_ratio <= 0.30 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                          {(audit.debt_ratio * 100).toFixed(2)}%
                        </span>
                      </td>

                      {/* Cash Ratio */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className={audit.cash_ratio <= 0.30 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                          {(audit.cash_ratio * 100).toFixed(2)}%
                        </span>
                      </td>

                      {/* Impure Ratio */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className={audit.impure_ratio <= 0.05 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                          {(audit.impure_ratio * 100).toFixed(2)}%
                        </span>
                      </td>

                      {/* Compliance Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                          isCompliant 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {isCompliant ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              COMPLIANT
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              NON-COMPLIANT
                            </>
                          )}
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectCompany(stock.ticker)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#851428] hover:text-white dark:hover:bg-rose-700 font-mono text-[11px] font-semibold transition-all"
                        >
                          Audit
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
};
