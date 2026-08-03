import { CompanyProfile, ShariahMetrics } from '../types';
import { runShariahScreening } from '../data/mockDatabase';

export function parseFormattedNumber(str: string | undefined | null): number {
  if (!str) return 0;
  const cleanStr = str.replace(/[\$,%]/g, '').trim();
  if (!cleanStr || cleanStr === '-') return 0;
  const match = cleanStr.match(/^([0-9\.\-]+)\s*([KMBTkmbt]?)$/);
  if (!match) return parseFloat(cleanStr) || 0;
  const val = parseFloat(match[1]);
  if (isNaN(val)) return 0;
  const unit = match[2].toUpperCase();
  if (unit === 'K') return val * 1e3;
  if (unit === 'M') return val * 1e6;
  if (unit === 'B') return val * 1e9;
  if (unit === 'T') return val * 1e12;
  return val;
}

export interface GoogleFinanceResult {
  ticker: string;
  exchange: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  totalRevenue: number;
  netIncome: number;
  sharesOutstanding: number;
  week52High: number;
  week52Low: number;
  beta: number;
  divYield: number;
  interestExpense: number;
  interestIncome: number;
  operatingIncome: number;
  shariahMetrics?: ShariahMetrics;
  source: string;
}

/**
 * Fetches real-time financial metrics directly from Google Finance (quote & financials).
 */
export async function fetchLiveGoogleFinanceStock(ticker: string): Promise<GoogleFinanceResult | null> {
  const exchanges = ['NASDAQ', 'NYSE', 'AMEX', 'LON'];

  for (const ex of exchanges) {
    const url = `https://www.google.com/finance/quote/${encodeURIComponent(ticker)}:${ex}?hl=en`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!res.ok) continue;
      const html = await res.text();

      // Extract key stats: <div class="SwQK7">Label</div><div class="dO6ijd">Value</div>
      const stats: Record<string, string> = {};
      const statRegex = /<div class="SwQK7">([^<]+)<\/div>\s*<div class="dO6ijd">([^<]+)<\/div>/g;
      let m;
      while ((m = statRegex.exec(html)) !== null) {
        stats[m[1].trim()] = m[2].trim();
      }

      // Check if valid data was found
      if (Object.keys(stats).length === 0) continue;

      // Financials table
      const finMap: Record<string, string> = {};
      const rowRegex = /<tr[^>]*>\s*<td[^>]*>(?:<div[^>]*>)+([^<]+)(?:<\/div>)+<\/td>\s*<td[^>]*>(?:<div[^>]*>)+([^<]+)(?:<\/div>)+<\/td>/g;
      let rMatch;
      while ((rMatch = rowRegex.exec(html)) !== null) {
        finMap[rMatch[1].trim()] = rMatch[2].trim();
      }

      // Extract price
      const dollarMatches = html.match(/<span>\$([0-9,]+\.[0-9]{2})<\/span>/);
      const price = dollarMatches ? parseFloat(dollarMatches[1].replace(/,/g, '')) : (parseFormattedNumber(stats['Open']) || parseFormattedNumber(stats['High']) || 0);

      // Title/Name
      const titleM = html.match(/<title>([^\(]+)\(([^\)]+)\)/);
      let name = titleM ? titleM[1].trim() : ticker;
      name = name.replace(/&amp;/g, '&');

      const marketCap = parseFormattedNumber(stats['Mkt. cap']);
      const peRatio = parseFormattedNumber(stats['P/E ratio']);
      const sharesOutstanding = parseFormattedNumber(stats['Shares outstanding']);
      const week52High = parseFormattedNumber(stats['52-wk high']);
      const week52Low = parseFormattedNumber(stats['52-wk low']);
      const beta = parseFormattedNumber(stats['Beta']);
      const divYield = parseFormattedNumber(stats['Dividend']);

      // Quarterly revenue/net income from Google Finance table (Annualized = Quarterly * 4 if < 100B)
      const qRevenue = parseFormattedNumber(finMap['Revenue']);
      const qNetIncome = parseFormattedNumber(finMap['Net income']);
      const qInterestExpense = Math.abs(parseFormattedNumber(finMap['Interest expense']));
      const qInterestIncome = parseFormattedNumber(finMap['Interest and investment income']);
      const qOperatingIncome = parseFormattedNumber(finMap['Operating income']);

      // Google Finance displays quarterly financials; multiply by 4 to get TTM unless already annual scale
      const totalRevenue = qRevenue > 0 ? (qRevenue < 100e9 ? qRevenue * 4 : qRevenue) : 0;
      const netIncome = qNetIncome !== 0 ? (Math.abs(qNetIncome) < 50e9 ? qNetIncome * 4 : qNetIncome) : 0;

      return {
        ticker,
        exchange: ex,
        name,
        price,
        change: 0,
        changePercent: 0,
        marketCap,
        peRatio,
        totalRevenue,
        netIncome,
        sharesOutstanding,
        week52High,
        week52Low,
        beta,
        divYield,
        interestExpense: qInterestExpense * 4,
        interestIncome: qInterestIncome * 4,
        operatingIncome: qOperatingIncome * 4,
        source: `Google Finance Real-Time Feed (${ex})`
      };
    } catch (e) {
      console.warn(`Google Finance fetch error for ${ticker} on ${ex}:`, e);
    }
  }

  return null;
}
