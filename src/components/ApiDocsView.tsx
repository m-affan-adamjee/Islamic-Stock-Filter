import React, { useState } from 'react';
import { Code, Copy, Check, Terminal, Play, Server } from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [testTicker, setTestTicker] = useState('NVDA');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/company/{ticker}',
      desc: 'Retrieve full fundamental profile & Shariah screening summary'
    },
    {
      method: 'GET',
      path: '/api/screen/{ticker}?standard=AAOIFI',
      desc: 'Calculate Shariah compliance status under specified standard'
    },
    {
      method: 'GET',
      path: '/api/search?q={query}',
      desc: 'Search companies by ticker symbol or corporate name'
    },
    {
      method: 'GET',
      path: '/api/history/{ticker}',
      desc: 'Retrieve 5-quarter historical ratio trend lines'
    },
    {
      method: 'POST',
      path: '/api/ai/analyze',
      desc: 'Generate Gemini 3.6 Flash AI Shariah audit memo'
    },
    {
      method: 'POST',
      path: '/api/compare',
      desc: 'Compare multi-company compliance matrix'
    }
  ];

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(`curl -X GET "${window.location.origin}${path.replace('{ticker}', 'NVDA').replace('{query}', 'NVIDIA')}"`);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const handleRunTest = async () => {
    setTestLoading(true);
    try {
      const res = await fetch(`/api/company/${testTicker.toUpperCase().trim()}`);
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ error: 'Endpoint call failed' });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/30 dark:border-slate-800/80 shadow-2xl shadow-black/5 dark:shadow-black/20 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-emerald-500" /> REST API &amp; Developer Documentation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Programmatically query Shariah compliance ratios, financial data, and AI audit memos.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md self-start sm:self-auto">
          OpenAPI 3.0 • JSON
        </span>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Server className="w-4 h-4 text-emerald-500" /> Available API Endpoints
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded-md backdrop-blur-md ${
                    ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {ep.path}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {ep.desc}
                </p>
              </div>

              <button
                onClick={() => handleCopy(ep.path)}
                className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-slate-800/80 hover:border-emerald-500 text-xs font-mono text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                {copiedEndpoint === ep.path ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied cURL
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" /> cURL Snippet
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Endpoint Tester */}
      <div className="p-6 rounded-2xl bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800/80 text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" /> Live Endpoint Console Tester
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={testTicker}
              onChange={(e) => setTestTicker(e.target.value)}
              className="px-3 py-1 text-xs font-mono bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/10 dark:border-slate-700/80 rounded-lg text-white w-24 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleRunTest}
              disabled={testLoading}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20"
            >
              <Play className="w-3 h-3 fill-slate-950" /> {testLoading ? 'Calling...' : 'Send GET'}
            </button>
          </div>
        </div>

        {testResult && (
          <pre className="p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 dark:border-slate-800/80 text-xs font-mono text-emerald-400 overflow-x-auto max-h-64 leading-relaxed">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        )}
      </div>

    </div>
  );
};
