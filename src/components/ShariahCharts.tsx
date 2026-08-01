import React, { useState } from 'react';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { CompanyProfile, HistoricalPoint } from '../types';
import { generateHistoricalData } from '../data/mockDatabase';
import { PieChart, BarChart2, TrendingUp, Calendar, Info } from 'lucide-react';

interface ShariahChartsProps {
  company: CompanyProfile;
}

export const ShariahCharts: React.FC<ShariahChartsProps> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'thresholds' | 'historical'>('breakdown');

  const shariah = company.shariahMetrics;
  const screening = company.screening;
  const historyData: HistoricalPoint[] = generateHistoricalData(company);

  // 1. Revenue breakdown data
  const halalRev = Math.max(0, shariah.total_revenue - shariah.impure_revenue);
  const revenueData = [
    { name: 'Halal Revenue', value: halalRev, color: '#10B981' },
    { name: 'Impure Non-Halal Income', value: shariah.impure_revenue, color: '#F43F5E' }
  ];

  // 2. Asset breakdown data
  const intangibleAssets = Math.max(0, shariah.total_assets - shariah.tangible_assets);
  const assetData = [
    { name: 'Tangible Physical Assets', value: shariah.tangible_assets, color: '#14B8A6' },
    { name: 'Intangible / Goodwill / Financial', value: intangibleAssets, color: '#6366F1' }
  ];

  // 3. Threshold Comparison Bar Chart data
  const thresholdBarData = [
    {
      metric: 'Debt Ratio',
      Actual: Math.round(screening.debt_ratio * 10000) / 100,
      Threshold: screening.thresholds.maxDebt * 100,
      unit: '%'
    },
    {
      metric: 'Interest Cash',
      Actual: Math.round(screening.cash_ratio * 10000) / 100,
      Threshold: screening.thresholds.maxCash * 100,
      unit: '%'
    },
    {
      metric: 'Impure Revenue',
      Actual: Math.round(screening.impure_ratio * 10000) / 100,
      Threshold: screening.thresholds.maxImpure * 100,
      unit: '%'
    },
    {
      metric: 'Tangible Assets',
      Actual: Math.round(screening.tangible_ratio * 10000) / 100,
      Threshold: screening.thresholds.minTangible * 100,
      unit: '%'
    }
  ];

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-slate-800/80 shadow-2xl shadow-black/5 dark:shadow-black/20 space-y-6">
      
      {/* Chart Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" /> Shariah Analytics & Visualizations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive ratio breakdowns and 5-quarter compliance trend lines
          </p>
        </div>

        <div className="flex items-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-md p-1 rounded-xl border border-white/20 dark:border-slate-800/60">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md border border-white/20 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" /> Breakdowns
          </button>

          <button
            onClick={() => setActiveTab('thresholds')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'thresholds'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md border border-white/20 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> vs AAOIFI Limits
          </button>

          <button
            onClick={() => setActiveTab('historical')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'historical'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md border border-white/20 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Quarterly Trends
          </button>
        </div>
      </div>

      {/* Tab 1: Donut & Pie Breakdowns */}
      {activeTab === 'breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Revenue Donut */}
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white text-center">
              Revenue Breakdown (Halal vs Impure)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => formatCurrency(Number(val))} 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '0.75rem', backdropFilter: 'blur(12px)' }}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              Total Revenue: <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(shariah.total_revenue)}</strong>
            </div>
          </div>

          {/* Assets Breakdown Pie */}
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white text-center">
              Asset Composition (Tangible vs Intangible)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => formatCurrency(Number(val))} 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '0.75rem', backdropFilter: 'blur(12px)' }}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              Total Assets: <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(shariah.total_assets)}</strong>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Bar Comparisons vs Limits */}
      {activeTab === 'thresholds' && (
        <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Actual Financial Ratios vs AAOIFI Limits (%)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Denominator: Market Cap
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={thresholdBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
                <Tooltip 
                  formatter={(val: any) => `${val}%`}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '0.75rem', backdropFilter: 'blur(12px)' }}
                />
                <Legend />
                <Bar dataKey="Actual" fill="#10B981" radius={[4, 4, 0, 0]} name="Company Level" />
                <Bar dataKey="Threshold" fill="#F43F5E" radius={[4, 4, 0, 0]} name="AAOIFI Limit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 3: Historical Line Trends & Timeline */}
      {activeTab === 'historical' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Quarterly Ratio Stability (Debt & Cash Ratios over Time)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
                  <Tooltip 
                    formatter={(val: any) => `${val}%`}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '0.75rem', backdropFilter: 'blur(12px)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="debtRatio" stroke="#3B82F6" strokeWidth={2} name="Debt Ratio (%)" />
                  <Line type="monotone" dataKey="cashRatio" stroke="#10B981" strokeWidth={2} name="Interest Cash Ratio (%)" />
                  <Line type="monotone" dataKey="impureRatio" stroke="#F59E0B" strokeWidth={2} name="Impure Revenue (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Timeline Badges */}
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Historical Quarterly Compliance Log
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {historyData.map((h, i) => (
                <div 
                  key={i}
                  className={`p-2.5 rounded-xl border text-center text-xs font-mono backdrop-blur-md space-y-1 ${
                    h.status === 'COMPLIANT'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  <div className="font-bold text-[11px] text-slate-300">{h.period}</div>
                  <div className="font-extrabold text-[10px]">
                    {h.status === 'COMPLIANT' ? 'HALAL' : 'FAIL'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Debt: {h.debtRatio}%
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
