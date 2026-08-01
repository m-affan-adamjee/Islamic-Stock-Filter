import React from 'react';
import { 
  FileText, 
  Download, 
  Code, 
  Printer, 
  CheckCircle2, 
  XCircle,
  ShieldCheck
} from 'lucide-react';
import { CompanyProfile, ShariahStandard } from '../types';
import jsPDF from 'jspdf';

interface ExportModalProps {
  company: CompanyProfile;
  standard: ShariahStandard;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  company,
  standard,
  onClose
}) => {
  const isCompliant = company.screening.status === 'COMPLIANT';

  // 1. Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Ticker', company.ticker],
      ['Company Name', company.name],
      ['Primary Sector', company.sector],
      ['Compliance Status', company.screening.status],
      ['Screening Methodology', standard],
      ['Debt Ratio', `${(company.screening.debt_ratio * 100).toFixed(2)}%`],
      ['Interest Cash Ratio', `${(company.screening.cash_ratio * 100).toFixed(2)}%`],
      ['Impure Revenue Ratio', `${(company.screening.impure_ratio * 100).toFixed(2)}%`],
      ['Tangible Asset Ratio', `${(company.screening.tangible_ratio * 100).toFixed(2)}%`],
      ['Dividend Purification Factor', `${(company.screening.purification_factor * 100).toFixed(2)}%`],
      ['Market Capitalization ($)', company.marketCap.toString()],
      ['Timestamp', company.screening.timestamp]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NoorScreen_${company.ticker}_Shariah_Audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      metadata: {
        platform: 'NoorScreen Shariah Screener',
        version: '1.0.0',
        standard,
        timestamp: new Date().toISOString()
      },
      company
    }, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `NoorScreen_${company.ticker}_Audit.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text('NoorScreen — Shariah Compliance Certificate', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()} | Standard: ${standard}`, 14, 30);

    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(14, 34, 196, 34);

    doc.setFontSize(14);
    doc.setTextColor(15);
    doc.text(`${company.name} (${company.ticker})`, 14, 45);

    doc.setFontSize(11);
    doc.text(`Sector: ${company.sector}`, 14, 52);
    doc.text(`Market Cap: $${(company.marketCap / 1e9).toFixed(2)} Billion`, 14, 58);

    doc.setFontSize(14);
    if (isCompliant) {
      doc.setTextColor(16, 185, 129);
      doc.text('STATUS: SHARIAH COMPLIANT (HALAL)', 14, 72);
    } else {
      doc.setTextColor(244, 63, 94);
      doc.text('STATUS: NON-COMPLIANT', 14, 72);
    }

    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Message: ${company.screening.message}`, 14, 80);

    doc.line(14, 88, 196, 88);

    doc.setFontSize(12);
    doc.setTextColor(15);
    doc.text('AAOIFI Financial Ratios Summary:', 14, 98);

    const ratios = [
      `• Interest Debt Ratio: ${(company.screening.debt_ratio * 100).toFixed(2)}% (Max limit: <30%)`,
      `• Interest Cash & Securities: ${(company.screening.cash_ratio * 100).toFixed(2)}% (Max limit: <30%)`,
      `• Non-Halal / Impure Revenue: ${(company.screening.impure_ratio * 100).toFixed(2)}% (Max limit: <=5%)`,
      `• Tangible Assets Ratio: ${(company.screening.tangible_ratio * 100).toFixed(2)}% (Min limit: >=20%)`,
      `• Dividend Purification Factor: ${(company.screening.purification_factor * 100).toFixed(2)}%`
    ];

    let y = 106;
    ratios.forEach(r => {
      doc.text(r, 18, y);
      y += 7;
    });

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('Disclaimer: NoorScreen screening is for educational and quantitative financial calculation purposes under AAOIFI rules.', 14, 280);

    doc.save(`NoorScreen_Compliance_Report_${company.ticker}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/30 dark:border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Export Audit Report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Download Shariah compliance audit results for <strong>{company.ticker}</strong> ({standard} Standard).
        </p>

        <div className="space-y-3">
          
          <button
            onClick={handleExportPDF}
            className="w-full p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all flex items-center justify-between text-left group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  PDF Compliance Certificate
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Formatted PDF document with ratios and timestamps
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
          </button>

          <button
            onClick={handleExportCSV}
            className="w-full p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all flex items-center justify-between text-left group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center backdrop-blur-sm">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  CSV Spreadsheet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Raw tabular dataset for Excel analysis
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-500" />
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all flex items-center justify-between text-left group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center backdrop-blur-sm">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  JSON API Payload
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Machine-readable JSON schema export
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-500" />
          </button>

        </div>

      </div>
    </div>
  );
};
