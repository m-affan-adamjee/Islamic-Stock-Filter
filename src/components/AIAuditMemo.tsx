import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  FileText,
  Clock
} from 'lucide-react';
import { CompanyProfile, AIAuditAnalysis, ShariahStandard } from '../types';

interface AIAuditMemoProps {
  company: CompanyProfile;
  standard: ShariahStandard;
}

export const AIAuditMemo: React.FC<AIAuditMemoProps> = ({ company, standard }) => {
  const [analysis, setAnalysis] = useState<AIAuditAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAIAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: company.ticker, standard })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('AI Analysis request error:', err);
      setError('Failed to reach AI Audit service. Showing rule-based audit memo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, [company.ticker, standard]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/80 text-white shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-red-400 p-0.5 flex items-center justify-center shadow-lg shadow-red-600/30">
            <div className="w-full h-full bg-slate-950/90 backdrop-blur-md rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-sans text-white">
                AI Shariah Audit Memo
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-300 border border-red-500/30 backdrop-blur-md">
                Gemini AI Audit Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Plain-language executive compliance audit for {company.name} ({company.ticker})
            </p>
          </div>
        </div>

        <button
          onClick={fetchAIAnalysis}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-white/10 dark:bg-slate-800/80 hover:bg-white/20 dark:hover:bg-slate-700/80 backdrop-blur-md border border-white/10 dark:border-slate-700/80 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-red-400' : ''}`} />
          {loading ? 'Auditing...' : 'Re-Run Audit'}
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">
            Analyzing financial statements &amp; debt structures via Gemini 3.6 Flash...
          </p>
          <p className="text-xs text-slate-500">
            Evaluating AAOIFI Standard No. 21 rules...
          </p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          
          {/* Executive Summary Banner */}
          <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Executive Summary
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Generated: {new Date(analysis.generatedAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {analysis.summary}
            </p>
          </div>

          {/* Audit Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Primary Sector Audit */}
            <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Primary Business Audit
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.sectorAudit}
              </p>
            </div>

            {/* Debt Structure */}
            <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Debt &amp; Cash Leverage
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.debtStructureAnalysis}
              </p>
            </div>

            {/* Impure Revenue */}
            <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Impure Revenue Breakdown
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.impureRevenueBreakdown}
              </p>
            </div>

            {/* Purification Advice */}
            <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Purification Guidance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.purificationGuidance}
              </p>
            </div>

          </div>

          {/* Scholarly Consensus */}
          <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/80 space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Fiqh Jurisprudence &amp; Scholar Consensus
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analysis.scholarlyConsensus}
            </p>
          </div>

          {/* Key Risk Factors */}
          {analysis.riskFactors && analysis.riskFactors.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-slate-800/80 space-y-2">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Key Shariah &amp; Market Risk Factors
              </h3>
              <ul className="space-y-1 text-xs text-slate-300">
                {analysis.riskFactors.map((rf, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};
