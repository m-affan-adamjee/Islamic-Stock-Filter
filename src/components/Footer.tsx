import React from 'react';
import { MolletLogo } from './MolletLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <a
              href="https://molletcapital.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-opacity hover:opacity-90"
              title="Visit Mollet Capital Official Website (molletcapital.com)"
            >
              <MolletLogo size="md" />
            </a>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md pt-1">
              Mollet Capital Screener provides institutional-grade Shariah stock screening, primary business activity verification, AAOIFI compliance calculators, and AI audit memos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>AAOIFI Standard 21</span>
            <span>•</span>
            <span>Primary Sector Screening</span>
            <span>•</span>
            <span>MSCI & S&P Islamic Criteria</span>
            <span>•</span>
            <span>Gemini AI Audit Engine</span>
          </div>
        </div>

        <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-6 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong>Disclaimer:</strong> Mollet Capital Screener provides quantitative financial ratio screening and primary business activity evaluation based on public company financial data and AAOIFI (Accounting &amp; Auditing Organization for Islamic Financial Institutions) guidelines. Screening outputs do not constitute formal religious rulings (Fatwa) or personalized financial advice. Investors should consult qualified Shariah scholars and financial advisors before executing trades.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div>
              &copy; {new Date().getFullYear()} Mollet Capital. All rights reserved.
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
