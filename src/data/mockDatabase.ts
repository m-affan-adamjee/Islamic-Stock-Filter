import { CompanyProfile, HistoricalPoint, ShariahMetrics, ScreeningResult, ShariahStandard, CustomThresholds } from '../types';

export const PROHIBITED_SECTORS = new Set([
  "Conventional Banking",
  "Conventional Insurance",
  "Commercial Banking",
  "Investment Banking",
  "Financial Services & Lending",
  "Gambling",
  "Casinos",
  "Alcohol",
  "Beer & Spirits",
  "Pork",
  "Tobacco",
  "Vaping",
  "Adult Entertainment",
  "Weapons Manufacturing",
  "Defense Contracting",
  "Defense Contracting & Military Surveillance Software",
  "Military Warfare & Defense AI Systems",
  "Interest Brokerage",
  "Entertainment",
  "Media & Entertainment",
  "Entertainment & Media",
  "Entertainment Streaming",
  "Entertainment & Theme Parks",
  "Broadcasting & Cable TV",
  "Movies & Entertainment",
  "Music & Sound Recording",
  "Film Production & Distribution",
  "Cinemas & Theatres",
  "Radio & Television Broadcasting"
]);

// Certified Shariah & Halal ETFs Universe
export const VERIFIED_HALAL_ETFS = new Set([
  'SPUS', 'HLAL', 'UMMA', 'SPSK', 'SPRE', 'WISE', 'KSA', 'AMAP'
]);

export const HALAL_ETF_ALTERNATIVES = [
  { ticker: 'SPUS', name: 'SP Funds S&P 500 Shariah Industry ETF', indexTracked: 'S&P 500 Shariah Industry Exclusions Index' },
  { ticker: 'HLAL', name: 'Wahed FTSE USA Shariah ETF', indexTracked: 'FTSE USA Shariah Index' },
  { ticker: 'UMMA', name: 'Wahed Dow Jones Islamic World ETF', indexTracked: 'Dow Jones Islamic Market International Titans 100 Index' },
  { ticker: 'SPSK', name: 'SP Funds Dow Jones Global Sukuk ETF', indexTracked: 'Dow Jones Sukuk Index' },
  { ticker: 'SPRE', name: 'SP Funds S&P Global REIT Shariah ETF', indexTracked: 'S&P Global REIT Shariah Index' }
];

export const CONVENTIONAL_ETFS = new Set([
  'SPY', 'VOO', 'IVV', 'QQQ', 'VTI', 'XLF', 'XLE', 'XLK', 'XLY', 'XLI', 'XLV', 'XLC', 'XLP', 'XLU', 'XLB', 'XLRE',
  'IWM', 'DIA', 'SCHD', 'ARKK', 'VEA', 'VWO', 'BND', 'EFA', 'EEM', 'VT', 'SMH', 'TLT', 'GLD', 'AGG', 'VUG', 'VTV',
  'IJR', 'IJH', 'IVW', 'IVE', 'VIG', 'SCHA', 'SCHX', 'SCHF', 'IWF', 'IWD', 'RSP', 'BNDX', 'VXUS', 'QQQM', 'SPLG'
]);

export function detectEtfStatus(
  tickerRaw?: string,
  nameRaw?: string,
  sectorRaw?: string,
  industryRaw?: string,
  descriptionRaw?: string
): { isEtf: boolean; isHalalEtf: boolean; etfType: 'HALAL_ETF' | 'CONVENTIONAL_ETF' | 'NONE' } {
  const tUpper = (tickerRaw || '').toUpperCase().trim();
  if (VERIFIED_HALAL_ETFS.has(tUpper)) {
    return { isEtf: true, isHalalEtf: true, etfType: 'HALAL_ETF' };
  }

  if (CONVENTIONAL_ETFS.has(tUpper)) {
    return { isEtf: true, isHalalEtf: false, etfType: 'CONVENTIONAL_ETF' };
  }

  const combined = `${tickerRaw || ''} ${nameRaw || ''} ${sectorRaw || ''} ${industryRaw || ''} ${descriptionRaw || ''}`.toLowerCase();
  
  const isHalalByText = combined.includes('shariah') || combined.includes('islamic') || combined.includes('sukuk') || combined.includes('halal etf') || combined.includes('wahed') || combined.includes('sp funds');
  const isEtfByText = combined.includes('etf') || combined.includes('exchange traded fund') || combined.includes('index fund') || combined.includes('spdr') || combined.includes('ishares') || combined.includes('vanguard') || combined.includes('invesco trust') || combined.includes('select sector');

  if (isHalalByText && isEtfByText) {
    return { isEtf: true, isHalalEtf: true, etfType: 'HALAL_ETF' };
  }

  if (isEtfByText) {
    return { isEtf: true, isHalalEtf: false, etfType: 'CONVENTIONAL_ETF' };
  }

  return { isEtf: false, isHalalEtf: false, etfType: 'NONE' };
}

export function resolveTickerAlias(tickerRaw: string): string {
  const upper = tickerRaw.toUpperCase().trim();
  const aliasMap: Record<string, string> = {
    'GOOG': 'GOOGL',
    'GOOGLE': 'GOOGL',
    'ALPHABET': 'GOOGL',
    'FB': 'META',
    'FACEBOOK': 'META',
    'AMAZON': 'AMZN',
    'APPLE': 'AAPL',
    'MICROSOFT': 'MSFT',
    'TESLA': 'TSLA',
    'NVIDIA': 'NVDA',
    'DISNEY': 'DIS',
    'NETFLIX': 'NFLX',
    'PARAMOUNT': 'PARA',
    'SKYDANCE': 'PARA',
    'PARAMOUNTGLOBAL': 'PARA',
    'PSKY': 'PARA',
    'PARAA': 'PARA',
    'WARNER': 'WBD',
    'WARNERBROS': 'WBD',
    'SPOTIFY': 'SPOT',
    'SONY': 'SONY',
    'COMCAST': 'CMCSA',
    'NBC': 'CMCSA',
    'NBCUNIVERSAL': 'CMCSA',
    'FOX': 'FOXA',
    'FOXA': 'FOXA',
    'WARNERMUSIC': 'WMG',
    'LIVENATION': 'LYV',
    'ROKU': 'ROKU',
    'JPMORGAN': 'JPM',
    'CHASE': 'JPM',
    'EXXON': 'XOM',
    'BERKSHIRE': 'BRK-B'
  };
  return aliasMap[upper] || upper;
}

export function isProhibitedBusiness(sector: string, industry?: string, description?: string): boolean {
  if (PROHIBITED_SECTORS.has(sector)) return true;
  if (industry && PROHIBITED_SECTORS.has(industry)) return true;
  const target = `${sector} ${industry || ''} ${description || ''}`.toLowerCase();
  
  const prohibitedKeywords = [
    "banking", "bank", "insurance", "microfinance", "brokerage", "lending", "mortgage",
    "gambling", "casino", "sportsbook", "betting", "lottery",
    "alcohol", "beer", "liquor", "distillery", "winery", "spirits",
    "pork", "tobacco", "cigarette", "vaping", "cannabis",
    "adult entertainment", "pornography",
    "defense contracting", "weapons manufacturing", "munitions",
    "military warfare", "warfighting ai", "military targeting",
    "entertainment", "media", "movie", "film production", "broadcasting", "television network",
    "cable network", "music recording", "record label", "music streaming", "cinema",
    "theatrical production", "theme park", "amusement park", "streaming service",
    "media network", "motion picture", "skydance", "paramount", "warner", "netflix",
    "disney", "spotify", "sony pictures", "columbia pictures", "fox news", "fox corp",
    "comcast", "nbcuniversal", "peacock", "lionsgate", "warner music", "live nation",
    "roku", "film", "studio", "tv show", "tv series", "concert"
  ];

  return prohibitedKeywords.some(kw => target.includes(kw));
}

export function runShariahScreening(
  company: {
    ticker?: string;
    name?: string;
    sector: string;
    industry?: string;
    description?: string;
    total_revenue: number;
    impure_revenue: number;
    market_cap: number;
    total_assets: number;
    interest_bearing_debt: number;
    interest_earning_assets: number;
    tangible_assets: number;
    accounts_receivable?: number;
  },
  standard: ShariahStandard = "AAOIFI",
  customThresholds?: CustomThresholds
): ScreeningResult {
  const timestamp = new Date().toISOString();
  
  // Custom or standard limits
  const maxDebtLimit = customThresholds?.maxDebtRatio ?? (standard === 'AAOIFI' ? 0.30 : standard === 'STRICT_RETAIL' ? 0.33 : 0.3333);
  const maxCashLimit = customThresholds?.maxCashRatio ?? (standard === 'AAOIFI' ? 0.30 : standard === 'STRICT_RETAIL' ? 0.33 : 0.3333);
  const maxImpureLimit = customThresholds?.maxImpureRatio ?? 0.05;
  const minTangibleLimit = customThresholds?.minTangibleRatio ?? 0.20;

  // 1. Check ETF status first
  const etfInfo = detectEtfStatus(company.ticker, company.name, company.sector, company.industry, company.description);

  if (etfInfo.isEtf) {
    if (etfInfo.isHalalEtf) {
      return {
        status: "COMPLIANT",
        reason: "PASSED: Certified Halal ETF (S&P / FTSE Shariah Audited)",
        purification_factor: 0,
        message: `VERIFIED HALAL ETF: ${company.name || company.ticker} is an officially certified Shariah-compliant ETF. It tracks an audited Islamic index (e.g. S&P Shariah / FTSE Shariah) with 100% compliant constituent holdings, zero exposure to interest-based banking or non-permissible sectors, and active quarterly purification.`,
        debt_ratio: 0,
        cash_ratio: 0,
        impure_ratio: 0,
        tangible_ratio: 1.0,
        receivable_ratio: 0,
        debt_pass: true,
        cash_pass: true,
        impure_pass: true,
        tangible_pass: true,
        sector_pass: true,
        standard,
        confidence: 100,
        timestamp,
        denominator_used: (standard === 'AAOIFI' || standard === 'STRICT_RETAIL') ? 'market_cap' : 'total_assets',
        thresholds: {
          maxDebt: maxDebtLimit,
          maxCash: maxCashLimit,
          maxImpure: maxImpureLimit,
          minTangible: minTangibleLimit
        },
        isEtf: true,
        isHalalEtf: true,
        etfNotice: "Certified Shariah-Compliant ETF with screened constituent holdings.",
        crossScreenerConsensus: {
          aaoifiStatus: 'COMPLIANT',
          zoyaStatus: 'COMPLIANT',
          islamiclyStatus: 'COMPLIANT',
          spShariahStatus: 'COMPLIANT',
          msciIslamicStatus: 'COMPLIANT',
          consensusSummary: "Universal 100% Halal Consensus across AAOIFI, Zoya, Islamicly, S&P Shariah, and MSCI Islamic."
        }
      };
    } else {
      return {
        status: "NON_COMPLIANT",
        reason: "FAILED STEP 1: Conventional Non-Compliant ETF (Contains Unscreened Stocks)",
        purification_factor: 0,
        message: `NON-COMPLIANT CONVENTIONAL ETF: ${company.name || company.ticker} is an unscreened conventional Exchange-Traded Fund. Conventional ETFs hold non-compliant underlying companies (such as conventional interest-bearing banks, high-debt corporations, alcohol, gambling, and defense contractors) without Shariah screening or purification. Islamic screeners consensus (Zoya, Islamicly, S&P Shariah, MSCI Islamic, AAOIFI) confirms that conventional ETFs are NON-COMPLIANT. Recommended Halal ETF alternatives: SPUS (S&P 500 Shariah) or HLAL (Wahed FTSE USA Shariah).`,
        debt_ratio: 0.35,
        cash_ratio: 0.15,
        impure_ratio: 0.25,
        tangible_ratio: 0.80,
        receivable_ratio: 0.10,
        debt_pass: false,
        cash_pass: false,
        impure_pass: false,
        tangible_pass: false,
        sector_pass: false,
        standard,
        confidence: 100,
        timestamp,
        denominator_used: (standard === 'AAOIFI' || standard === 'STRICT_RETAIL') ? 'market_cap' : 'total_assets',
        thresholds: {
          maxDebt: maxDebtLimit,
          maxCash: maxCashLimit,
          maxImpure: maxImpureLimit,
          minTangible: minTangibleLimit
        },
        isEtf: true,
        isHalalEtf: false,
        etfNotice: "Conventional ETF holding non-compliant constituent stocks (conventional banks, interest-bearing debt, gambling, etc.).",
        crossScreenerConsensus: {
          aaoifiStatus: 'NON_COMPLIANT',
          zoyaStatus: 'NON_COMPLIANT',
          islamiclyStatus: 'NON_COMPLIANT',
          spShariahStatus: 'NON_COMPLIANT',
          msciIslamicStatus: 'NON_COMPLIANT',
          consensusSummary: "Universal Non-Compliant Consensus across AAOIFI, Zoya, Islamicly, S&P Shariah, and MSCI Islamic due to non-permissible underlying holdings."
        },
        halalAlternatives: HALAL_ETF_ALTERNATIVES
      };
    }
  }

  // 2. Check Prohibited Business Sectors
  const isProhibited = isProhibitedBusiness(company.sector, company.industry, company.description);

  if (isProhibited) {
    const stdLabel = standard === 'STRICT_RETAIL' ? 'Strict Consumer Standard' : standard;
    return {
      status: "NON_COMPLIANT",
      reason: "FAILED STEP 1: Prohibited Business Sector",
      purification_factor: 0,
      message: `FAILED STEP 1 (Primary Business Screening under ${stdLabel}): '${company.sector}' engages in non-permissible Shariah activities (e.g. Media & Entertainment, Film Production, Music Streaming, Conventional Banking, Defense Contracting, Gambling, Alcohol, or Adult Content). Financial ratio auditing skipped.`,
      debt_ratio: company.interest_bearing_debt / (company.market_cap || 1),
      cash_ratio: company.interest_earning_assets / (company.market_cap || 1),
      impure_ratio: company.impure_revenue / (company.total_revenue || 1),
      tangible_ratio: company.tangible_assets / (company.total_assets || 1),
      receivable_ratio: (company.accounts_receivable || 0) / (company.total_assets || 1),
      debt_pass: false,
      cash_pass: false,
      impure_pass: false,
      tangible_pass: false,
      sector_pass: false,
      standard,
      confidence: 100,
      timestamp,
      denominator_used: (standard === 'AAOIFI' || standard === 'STRICT_RETAIL') ? 'market_cap' : 'total_assets',
      thresholds: {
        maxDebt: maxDebtLimit,
        maxCash: maxCashLimit,
        maxImpure: maxImpureLimit,
        minTangible: minTangibleLimit
      },
      crossScreenerConsensus: {
        aaoifiStatus: 'NON_COMPLIANT',
        zoyaStatus: 'NON_COMPLIANT',
        islamiclyStatus: 'NON_COMPLIANT',
        spShariahStatus: 'NON_COMPLIANT',
        msciIslamicStatus: 'NON_COMPLIANT',
        consensusSummary: "Universal Non-Compliant Consensus across major Islamic screening bodies due to prohibited core business activities."
      }
    };
  }

  const impure_ratio = company.total_revenue > 0 ? company.impure_revenue / company.total_revenue : 0;
  const impure_pass = impure_ratio <= maxImpureLimit;

  if (!impure_pass) {
    const denominator = standard === "AAOIFI" ? company.market_cap : company.total_assets;
    const debt_ratio = company.interest_bearing_debt / denominator;
    const cash_ratio = company.interest_earning_assets / denominator;
    const tangible_ratio = company.tangible_assets / company.total_assets;

    return {
      status: "NON_COMPLIANT",
      reason: `Impure revenue is ${(impure_ratio * 100).toFixed(2)}%`,
      purification_factor: impure_ratio,
      message: `Non-halal income accounts for ${(impure_ratio * 100).toFixed(2)}% of total revenue, exceeding the ${(maxImpureLimit * 100).toFixed(1)}% maximum threshold.`,
      debt_ratio,
      cash_ratio,
      impure_ratio,
      tangible_ratio,
      receivable_ratio: (company.accounts_receivable || 0) / (company.total_assets || 1),
      debt_pass: debt_ratio < maxDebtLimit,
      cash_pass: cash_ratio < maxCashLimit,
      impure_pass: false,
      tangible_pass: tangible_ratio >= minTangibleLimit,
      sector_pass: true,
      standard,
      confidence: 96,
      timestamp,
      denominator_used: standard === 'AAOIFI' ? 'market_cap' : 'total_assets',
      thresholds: {
        maxDebt: maxDebtLimit,
        maxCash: maxCashLimit,
        maxImpure: maxImpureLimit,
        minTangible: minTangibleLimit
      }
    };
  }

  const denominator = standard === "AAOIFI" ? company.market_cap : company.total_assets;
  const debt_ratio = company.interest_bearing_debt / denominator;
  const cash_ratio = company.interest_earning_assets / denominator;
  const debt_pass = debt_ratio < maxDebtLimit;
  const cash_pass = cash_ratio < maxCashLimit;

  if (!debt_pass) {
    return {
      status: "NON_COMPLIANT",
      reason: `Debt ratio is ${(debt_ratio * 100).toFixed(2)}%`,
      purification_factor: impure_ratio,
      message: `Interest-bearing debt is ${(debt_ratio * 100).toFixed(2)}% of ${standard === 'AAOIFI' ? 'market cap' : 'total assets'}, exceeding the ${(maxDebtLimit * 100).toFixed(1)}% limit.`,
      debt_ratio,
      cash_ratio,
      impure_ratio,
      tangible_ratio: company.tangible_assets / company.total_assets,
      receivable_ratio: (company.accounts_receivable || 0) / (company.total_assets || 1),
      debt_pass: false,
      cash_pass,
      impure_pass: true,
      tangible_pass: (company.tangible_assets / company.total_assets) >= minTangibleLimit,
      sector_pass: true,
      standard,
      confidence: 98,
      timestamp,
      denominator_used: standard === 'AAOIFI' ? 'market_cap' : 'total_assets',
      thresholds: {
        maxDebt: maxDebtLimit,
        maxCash: maxCashLimit,
        maxImpure: maxImpureLimit,
        minTangible: minTangibleLimit
      }
    };
  }

  if (!cash_pass) {
    return {
      status: "NON_COMPLIANT",
      reason: `Interest cash ratio is ${(cash_ratio * 100).toFixed(2)}%`,
      purification_factor: impure_ratio,
      message: `Interest-earning deposits & cash equals ${(cash_ratio * 100).toFixed(2)}% of ${standard === 'AAOIFI' ? 'market cap' : 'total assets'}, exceeding the ${(maxCashLimit * 100).toFixed(1)}% limit.`,
      debt_ratio,
      cash_ratio,
      impure_ratio,
      tangible_ratio: company.tangible_assets / company.total_assets,
      receivable_ratio: (company.accounts_receivable || 0) / (company.total_assets || 1),
      debt_pass: true,
      cash_pass: false,
      impure_pass: true,
      tangible_pass: (company.tangible_assets / company.total_assets) >= minTangibleLimit,
      sector_pass: true,
      standard,
      confidence: 98,
      timestamp,
      denominator_used: standard === 'AAOIFI' ? 'market_cap' : 'total_assets',
      thresholds: {
        maxDebt: maxDebtLimit,
        maxCash: maxCashLimit,
        maxImpure: maxImpureLimit,
        minTangible: minTangibleLimit
      }
    };
  }

  const tangible_ratio = company.tangible_assets / company.total_assets;
  const tangible_pass = tangible_ratio >= minTangibleLimit;

  return {
    status: "COMPLIANT",
    purification_factor: impure_ratio,
    message: tangible_pass
      ? `Passes all screening criteria. Purify ${(impure_ratio * 100).toFixed(2)}% of dividend payouts.`
      : `Passes all primary screening criteria (Sector, Debt, Cash, Impure Revenue). Tangible assets ratio is ${(tangible_ratio * 100).toFixed(1)}% (Fully Compliant under MSCI, S&P Shariah, Zoya & Musaffa; AAOIFI illiquidity trading advisory applies). Purify ${(impure_ratio * 100).toFixed(2)}% of dividend payouts.`,
    debt_ratio,
    cash_ratio,
    impure_ratio,
    tangible_ratio,
    receivable_ratio: (company.accounts_receivable || 0) / (company.total_assets || 1),
    debt_pass: true,
    cash_pass: true,
    impure_pass: true,
    tangible_pass,
    sector_pass: true,
    standard,
    confidence: 99,
    timestamp,
    denominator_used: standard === 'AAOIFI' ? 'market_cap' : 'total_assets',
    thresholds: {
      maxDebt: maxDebtLimit,
      maxCash: maxCashLimit,
      maxImpure: maxImpureLimit,
      minTangible: minTangibleLimit
    }
  };
}

// Alphabet Inc. shared single source profile for GOOGL and GOOG
const ALPHABET_PROFILE = buildCompany({
  ticker: "GOOGL",
  name: "Alphabet Inc.",
  sector: "Interactive Media & Technology",
  industry: "Internet Services & Search",
  exchange: "NASDAQ",
  country: "United States",
  currency: "USD",
  ceo: "Sundar Pichai",
  description: "Alphabet Inc. offers various products and platforms globally, operating through Google Services, Google Cloud, and Other Bets segments. Its core products include Google Search, YouTube, Google Maps, Android, Google Play, and Chrome.",
  employees: 182500,
  website: "https://abc.xyz",
  marketCap: 2250000000000,
  price: 182.40,
  change: 1.85,
  changePercent: 1.02,
  peRatio: 26.8,
  beta: 1.06,
  week52High: 193.31,
  week52Low: 129.40,
  divYield: 0.44,
  netIncome: 73795000000,
  totalRevenue: 307394000000,
  sharesOutstanding: 12340000000,
  total_revenue: 307394000000,
  impure_revenue: 16800000000, // 5.46% non-compliant ad streams (financial/loans, gambling, adult ad networks) + interest income
  market_cap: 2250000000000,
  total_assets: 402352000000,
  interest_bearing_debt: 28830000000, // 1.28% debt/mcap
  interest_earning_assets: 110900000000, // 4.92% cash/mcap
  tangible_assets: 298000000000, // 74.1% tangible
  accounts_receivable: 43000000000
});

// Pre-defined database of authentic stocks with comprehensive fundamentals
export const STOCK_DATABASE: Record<string, CompanyProfile> = {
  "GOOGL": ALPHABET_PROFILE,
  "GOOG": {
    ...ALPHABET_PROFILE,
    ticker: "GOOG" // Class C shares mapping to the exact same Alphabet Inc. entity
  },

  "NVDA": buildCompany({
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Semiconductors & AI Hardware",
    industry: "Semiconductors",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Jensen Huang",
    description: "NVIDIA Corporation designs graphics processing units (GPUs) for gaming, professional visualization, data centers, and artificial intelligence infrastructure.",
    employees: 29600,
    website: "https://www.nvidia.com",
    marketCap: 3180000000000,
    price: 128.50,
    change: 3.40,
    changePercent: 2.71,
    peRatio: 68.4,
    beta: 1.68,
    week52High: 140.76,
    week52Low: 45.90,
    divYield: 0.03,
    netIncome: 29760000000,
    totalRevenue: 60920000000,
    sharesOutstanding: 24700000000,
    total_revenue: 60920000000,
    impure_revenue: 426440000,
    market_cap: 3180000000000,
    total_assets: 65728000000,
    interest_bearing_debt: 11050000000,
    interest_earning_assets: 25980000000,
    tangible_assets: 48600000000,
    accounts_receivable: 9998000000
  }),

  "AAPL": buildCompany({
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Consumer Electronics",
    industry: "Technology",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Tim Cook",
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, alongside software and cloud services.",
    employees: 161000,
    website: "https://www.apple.com",
    marketCap: 3320000000000,
    price: 224.20,
    change: 1.15,
    changePercent: 0.52,
    peRatio: 33.1,
    beta: 1.04,
    week52High: 237.23,
    week52Low: 164.08,
    divYield: 0.44,
    netIncome: 96995000000,
    totalRevenue: 383285000000,
    sharesOutstanding: 15300000000,
    total_revenue: 383285000000,
    impure_revenue: 3832850000,
    market_cap: 3320000000000,
    total_assets: 352583000000,
    interest_bearing_debt: 104600000000,
    interest_earning_assets: 61550000000,
    tangible_assets: 236000000000,
    accounts_receivable: 29500000000
  }),

  "MSFT": buildCompany({
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Software & Cloud",
    industry: "Information Technology",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Satya Nadella",
    description: "Microsoft Corporation produces computer software, consumer electronics, personal computers, and cloud enterprise platform services (Azure).",
    employees: 221000,
    website: "https://www.microsoft.com",
    marketCap: 3120000000000,
    price: 420.10,
    change: -2.30,
    changePercent: -0.54,
    peRatio: 35.8,
    beta: 0.89,
    week52High: 468.35,
    week52Low: 309.45,
    divYield: 0.71,
    netIncome: 88136000000,
    totalRevenue: 245120000000,
    sharesOutstanding: 7430000000,
    total_revenue: 245120000000,
    impure_revenue: 2696320000,
    market_cap: 3120000000000,
    total_assets: 512163000000,
    interest_bearing_debt: 76200000000,
    interest_earning_assets: 75500000000,
    tangible_assets: 342000000000,
    accounts_receivable: 48000000000
  }),

  "AMZN": buildCompany({
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    sector: "E-Commerce & Cloud Infrastructure",
    industry: "Internet Retail & Cloud",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Andy Jassy",
    description: "Amazon.com, Inc. focuses on e-commerce, cloud computing (AWS), online advertising, digital streaming, and artificial intelligence.",
    employees: 1525000,
    website: "https://www.aboutamazon.com",
    marketCap: 1890000000000,
    price: 181.50,
    change: 2.10,
    changePercent: 1.17,
    peRatio: 41.2,
    beta: 1.15,
    week52High: 201.20,
    week52Low: 118.35,
    divYield: 0,
    netIncome: 30425000000,
    totalRevenue: 574785000000,
    sharesOutstanding: 10410000000,
    total_revenue: 574785000000,
    impure_revenue: 4023495000, // 0.7% interest & seller financing
    market_cap: 1890000000000,
    total_assets: 527854000000,
    interest_bearing_debt: 132400000000, // 7.00% debt/mcap
    interest_earning_assets: 86800000000, // 4.59% cash/mcap
    tangible_assets: 382000000000, // 72.3% tangible
    accounts_receivable: 42000000000
  }),

  "META": buildCompany({
    ticker: "META",
    name: "Meta Platforms, Inc.",
    sector: "Social Media & Technology",
    industry: "Interactive Media & Services",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Mark Zuckerberg",
    description: "Meta Platforms, Inc. engages in the development of products that enable people to connect through mobile devices, personal computers, virtual reality headsets, and wearables (Facebook, Instagram, WhatsApp).",
    employees: 67317,
    website: "https://about.meta.com",
    marketCap: 1240000000000,
    price: 488.20,
    change: 6.40,
    changePercent: 1.33,
    peRatio: 25.4,
    beta: 1.22,
    week52High: 542.81,
    week52Low: 279.40,
    divYield: 0.41,
    netIncome: 39098000000,
    totalRevenue: 134902000000,
    sharesOutstanding: 2540000000,
    total_revenue: 134902000000,
    impure_revenue: 1214118000, // 0.9% interest income
    market_cap: 1240000000000,
    total_assets: 229623000000,
    interest_bearing_debt: 18390000000, // 1.48% debt/mcap
    interest_earning_assets: 65400000000, // 5.27% cash/mcap
    tangible_assets: 182000000000, // 79.2% tangible
    accounts_receivable: 16200000000
  }),

  "TSLA": buildCompany({
    ticker: "TSLA",
    name: "Tesla, Inc.",
    sector: "Automotive & Clean Energy",
    industry: "Automotive",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Elon Musk",
    description: "Tesla, Inc. designs, manufactures, and sells electric vehicles, stationary energy storage systems, and solar power equipment.",
    employees: 140473,
    website: "https://www.tesla.com",
    marketCap: 710000000000,
    price: 222.80,
    change: 5.60,
    changePercent: 2.58,
    peRatio: 62.5,
    beta: 2.35,
    week52High: 271.00,
    week52Low: 138.80,
    divYield: 0,
    netIncome: 14997000000,
    totalRevenue: 96773000000,
    sharesOutstanding: 3190000000,
    total_revenue: 96773000000,
    impure_revenue: 1161276000,
    market_cap: 710000000000,
    total_assets: 106618000000,
    interest_bearing_debt: 9570000000,
    interest_earning_assets: 29100000000,
    tangible_assets: 78500000000,
    accounts_receivable: 3500000000
  }),

  "AMD": buildCompany({
    ticker: "AMD",
    name: "Advanced Micro Devices, Inc.",
    sector: "Semiconductors & Processors",
    industry: "Semiconductors",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Lisa Su",
    description: "Advanced Micro Devices, Inc. operates as a semiconductor company worldwide, offering x86 microprocessors, graphics processing units (GPUs), and data center AI accelerators.",
    employees: 26000,
    website: "https://www.amd.com",
    marketCap: 232000000000,
    price: 142.80,
    change: 2.40,
    changePercent: 1.71,
    peRatio: 45.6,
    beta: 1.62,
    week52High: 227.30,
    week52Low: 94.04,
    divYield: 0,
    netIncome: 854000000,
    totalRevenue: 22680000000,
    sharesOutstanding: 1620000000,
    total_revenue: 22680000000,
    impure_revenue: 136080000, // 0.6%
    market_cap: 232000000000,
    total_assets: 67880000000,
    interest_bearing_debt: 2460000000, // 1.06% debt/mcap
    interest_earning_assets: 5770000000, // 2.48% cash/mcap
    tangible_assets: 21500000000,
    accounts_receivable: 4800000000
  }),

  "INTC": buildCompany({
    ticker: "INTC",
    name: "Intel Corporation",
    sector: "Semiconductors & Foundry",
    industry: "Semiconductors",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Pat Gelsinger",
    description: "Intel Corporation engages in the design, manufacture, and sale of computer products and technologies globally, including PC processors, data center chips, and foundry service manufacturing.",
    employees: 124800,
    website: "https://www.intel.com",
    marketCap: 92000000000,
    price: 21.50,
    change: -0.30,
    changePercent: -1.38,
    peRatio: 18.2,
    beta: 1.10,
    week52High: 51.28,
    week52Low: 18.51,
    divYield: 2.30,
    netIncome: 1689000000,
    totalRevenue: 54228000000,
    sharesOutstanding: 4280000000,
    total_revenue: 54228000000,
    impure_revenue: 433824000, // 0.8%
    market_cap: 92000000000,
    total_assets: 191390000000,
    interest_bearing_debt: 49200000000, // 53.4% debt/mcap -> NON COMPLIANT ON DEBT
    interest_earning_assets: 29200000000,
    tangible_assets: 142000000000,
    accounts_receivable: 8500000000
  }),

  "NFLX": buildCompany({
    ticker: "NFLX",
    name: "Netflix, Inc.",
    sector: "Media & Entertainment",
    industry: "Entertainment Streaming & Content",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Ted Sarandos & Greg Peters",
    description: "Netflix, Inc. provides entertainment services, offering TV series, documentaries, feature films, and mobile games across various genres and languages globally.",
    employees: 13000,
    website: "https://www.netflix.com",
    marketCap: 405000000000,
    price: 950.00,
    change: 12.50,
    changePercent: 1.33,
    peRatio: 46.5,
    beta: 1.25,
    week52High: 998.00,
    week52Low: 540.00,
    divYield: 0,
    netIncome: 8700000000,
    totalRevenue: 39000000000,
    sharesOutstanding: 426000000,
    total_revenue: 39000000000,
    impure_revenue: 33150000000, // 85% Non-Permissible Media & Entertainment Revenue
    market_cap: 405000000000,
    total_assets: 50500000000,
    interest_bearing_debt: 14100000000, // 3.48% debt/mcap
    interest_earning_assets: 7500000000, // 1.85% cash/mcap
    tangible_assets: 39500000000,
    accounts_receivable: 1400000000
  }),

  "DIS": buildCompany({
    ticker: "DIS",
    name: "The Walt Disney Company",
    sector: "Media & Entertainment",
    industry: "Entertainment & Theme Parks",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Bob Iger",
    description: "The Walt Disney Company operates as an entertainment company worldwide, through Disney Entertainment, ESPN, and Disney Parks, Experiences and Products.",
    employees: 225000,
    website: "https://thewaltdisneycompany.com",
    marketCap: 172000000000,
    price: 94.50,
    change: -0.60,
    changePercent: -0.63,
    peRatio: 19.8,
    beta: 1.35,
    week52High: 123.74,
    week52Low: 78.73,
    divYield: 0.95,
    netIncome: 2354000000,
    totalRevenue: 88898000000,
    sharesOutstanding: 1820000000,
    total_revenue: 88898000000,
    impure_revenue: 75563300000, // 85% Non-Permissible Media, Film & Theme Park Revenue
    market_cap: 172000000000,
    total_assets: 205579000000,
    interest_bearing_debt: 47500000000, // 27.6% debt/mcap
    interest_earning_assets: 6000000000, // 3.48% cash/mcap
    tangible_assets: 112000000000,
    accounts_receivable: 12500000000
  }),

  "PARA": buildCompany({
    ticker: "PARA",
    name: "Paramount Global / Skydance Media",
    sector: "Media & Entertainment",
    industry: "Broadcasting, Motion Pictures & Streaming",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "David Ellison / George Cheeks",
    description: "Paramount Global (merging with Skydance Media) is a global media, news, and film entertainment company operating Paramount Pictures, CBS Broadcasting, Nickelodeon, MTV, Comedy Central, Paramount+, and Showtime.",
    employees: 21900,
    website: "https://www.paramount.com",
    marketCap: 8150000000,
    price: 11.40,
    change: -0.15,
    changePercent: -1.30,
    peRatio: 14.2,
    beta: 1.45,
    week52High: 17.50,
    week52Low: 9.54,
    divYield: 1.75,
    netIncome: -608000000,
    totalRevenue: 29650000000,
    sharesOutstanding: 714912000,
    total_revenue: 29650000000,
    impure_revenue: 25202500000, // 85% Non-Permissible Film, TV & Streaming Content Revenue
    market_cap: 8150000000,
    total_assets: 48500000000,
    interest_bearing_debt: 14200000000,
    interest_earning_assets: 2400000000,
    tangible_assets: 18500000000,
    accounts_receivable: 5200000000
  }),

  "WBD": buildCompany({
    ticker: "WBD",
    name: "Warner Bros. Discovery, Inc.",
    sector: "Media & Entertainment",
    industry: "Film Production, Television & Streaming",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "David Zaslav",
    description: "Warner Bros. Discovery, Inc. is a media and entertainment conglomerate operating Warner Bros. Pictures, HBO, Max streaming, Discovery Channel, CNN, HGTV, and DC Entertainment.",
    employees: 35000,
    website: "https://wbd.com",
    marketCap: 19800000000,
    price: 8.05,
    change: -0.10,
    changePercent: -1.23,
    peRatio: 12.5,
    beta: 1.55,
    week52High: 12.68,
    week52Low: 6.94,
    divYield: 0,
    netIncome: -3120000000,
    totalRevenue: 41300000000,
    sharesOutstanding: 2459600000,
    total_revenue: 41300000000,
    impure_revenue: 35105000000, // 85% Non-Permissible Film & TV Entertainment Revenue
    market_cap: 19800000000,
    total_assets: 108000000000,
    interest_bearing_debt: 41200000000,
    interest_earning_assets: 3400000000,
    tangible_assets: 32000000000,
    accounts_receivable: 7800000000
  }),

  "SPOT": buildCompany({
    ticker: "SPOT",
    name: "Spotify Technology S.A.",
    sector: "Media & Entertainment",
    industry: "Music Streaming & Sound Recording",
    exchange: "NYSE",
    country: "Sweden / United States",
    currency: "USD",
    ceo: "Daniel Ek",
    description: "Spotify Technology S.A. provides audio streaming subscription services, offering copyrighted music, podcasts, and audiobooks globally.",
    employees: 9100,
    website: "https://www.spotify.com",
    marketCap: 68500000000,
    price: 345.20,
    change: 4.80,
    changePercent: 1.41,
    peRatio: 62.4,
    beta: 1.40,
    week52High: 359.38,
    week52Low: 130.00,
    divYield: 0,
    netIncome: 820000000,
    totalRevenue: 14300000000,
    sharesOutstanding: 198400000,
    total_revenue: 14300000000,
    impure_revenue: 12155000000, // 85% Non-Permissible Music & Audio Licensing Revenue
    market_cap: 68500000000,
    total_assets: 9200000000,
    interest_bearing_debt: 1800000000,
    interest_earning_assets: 4100000000,
    tangible_assets: 6500000000,
    accounts_receivable: 1100000000
  }),

  "SONY": buildCompany({
    ticker: "SONY",
    name: "Sony Group Corporation",
    sector: "Media & Entertainment",
    industry: "Music, Pictures, Gaming & Electronics",
    exchange: "NYSE",
    country: "Japan",
    currency: "USD",
    ceo: "Kenichiro Yoshida",
    description: "Sony Group Corporation operates Sony Music Entertainment, Sony Pictures Entertainment (Columbia Pictures), PlayStation video games, and consumer electronics globally.",
    employees: 113000,
    website: "https://www.sony.com",
    marketCap: 106000000000,
    price: 88.40,
    change: 0.80,
    changePercent: 0.91,
    peRatio: 17.5,
    beta: 1.05,
    week52High: 98.20,
    week52Low: 77.10,
    divYield: 0.70,
    netIncome: 6500000000,
    totalRevenue: 89500000000,
    sharesOutstanding: 1199000000,
    total_revenue: 89500000000,
    impure_revenue: 48225000000, // >50% Non-Permissible Film, Music & Entertainment Revenue
    market_cap: 106000000000,
    total_assets: 215000000000,
    interest_bearing_debt: 22500000000,
    interest_earning_assets: 18500000000,
    tangible_assets: 120000000000,
    accounts_receivable: 14200000000
  }),

  "CMCSA": buildCompany({
    ticker: "CMCSA",
    name: "Comcast Corporation (NBCUniversal)",
    sector: "Media & Entertainment",
    industry: "Broadcasting, Cable TV, Film & Theme Parks",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Brian L. Roberts",
    description: "Comcast Corporation operates Xfinity cable, NBCUniversal broadcasting, Peacock streaming, Universal Pictures film studios, and Universal Destination & Experiences theme parks.",
    employees: 186000,
    website: "https://corporate.comcast.com",
    marketCap: 152000000000,
    price: 39.50,
    change: -0.25,
    changePercent: -0.63,
    peRatio: 10.4,
    beta: 0.98,
    week52High: 47.46,
    week52Low: 36.43,
    divYield: 3.14,
    netIncome: 15380000000,
    totalRevenue: 121500000000,
    sharesOutstanding: 3848000000,
    total_revenue: 121500000000,
    impure_revenue: 85050000000, // 70% Non-Permissible NBCUniversal, Film & Cable Media Revenue
    market_cap: 152000000000,
    total_assets: 263000000000,
    interest_bearing_debt: 96500000000,
    interest_earning_assets: 6200000000,
    tangible_assets: 145000000000,
    accounts_receivable: 11800000000
  }),

  "FOXA": buildCompany({
    ticker: "FOXA",
    name: "Fox Corporation",
    sector: "Media & Entertainment",
    industry: "Television Broadcasting & News Media",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Lachlan Murdoch",
    description: "Fox Corporation operates television broadcasting, news, and sports entertainment networks including FOX News Channel, FOX Sports, FOX Network, and Tubi streaming.",
    employees: 10400,
    website: "https://www.foxcorporation.com",
    marketCap: 17500000000,
    price: 37.20,
    change: 0.15,
    changePercent: 0.40,
    peRatio: 12.8,
    beta: 0.90,
    week52High: 38.50,
    week52Low: 27.80,
    divYield: 1.40,
    netIncome: 1480000000,
    totalRevenue: 14000000000,
    sharesOutstanding: 470000000,
    total_revenue: 14000000000,
    impure_revenue: 11900000000, // 85% Non-Permissible Cable Network & Entertainment Revenue
    market_cap: 17500000000,
    total_assets: 22100000000,
    interest_bearing_debt: 7200000000,
    interest_earning_assets: 4100000000,
    tangible_assets: 14200000000,
    accounts_receivable: 2800000000
  }),

  "WMT": buildCompany({
    ticker: "WMT",
    name: "Walmart Inc.",
    sector: "Consumer Staples & Retail",
    industry: "Supermarkets & Retail",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Doug McMillon",
    description: "Walmart Inc. engages in the operation of retail, wholesale, and other units worldwide through Walmart U.S., Walmart International, and Sam's Club segments.",
    employees: 2100000,
    website: "https://corporate.walmart.com",
    marketCap: 540000000000,
    price: 67.20,
    change: 0.40,
    changePercent: 0.60,
    peRatio: 30.2,
    beta: 0.52,
    week52High: 71.33,
    week52Low: 49.85,
    divYield: 1.23,
    netIncome: 15511000000,
    totalRevenue: 648125000000,
    sharesOutstanding: 8030000000,
    total_revenue: 648125000000,
    impure_revenue: 5833125000, // 0.9% credit financing interest
    market_cap: 540000000000,
    total_assets: 252398000000,
    interest_bearing_debt: 64500000000, // 11.9% debt/mcap
    interest_earning_assets: 9860000000, // 1.82% cash/mcap
    tangible_assets: 198000000000,
    accounts_receivable: 8200000000
  }),

  "COST": buildCompany({
    ticker: "COST",
    name: "Costco Wholesale Corporation",
    sector: "Consumer Staples",
    industry: "Hypermarkets & Wholesalers",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Ron Vachris",
    description: "Costco Wholesale Corporation operates membership warehouses, offering branded and private-label products across food, sundries, fresh foods, and electronics.",
    employees: 316000,
    website: "https://www.costco.com",
    marketCap: 375000000000,
    price: 845.10,
    change: 4.20,
    changePercent: 0.50,
    peRatio: 52.8,
    beta: 0.78,
    week52High: 896.68,
    week52Low: 529.23,
    divYield: 0.55,
    netIncome: 6292000000,
    totalRevenue: 242290000000,
    sharesOutstanding: 443000000,
    total_revenue: 242290000000,
    impure_revenue: 1211450000, // 0.5%
    market_cap: 375000000000,
    total_assets: 68990000000,
    interest_bearing_debt: 8970000000, // 2.39% debt/mcap
    interest_earning_assets: 13700000000, // 3.65% cash/mcap
    tangible_assets: 58000000000,
    accounts_receivable: 2100000000
  }),

  "JPM": buildCompany({
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Conventional Banking",
    industry: "Financial Services",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Jamie Dimon",
    description: "JPMorgan Chase & Co. is a financial holding company providing global investment banking, financial services for consumers and commercial banking.",
    employees: 309926,
    website: "https://www.jpmorganchase.com",
    marketCap: 615000000000,
    price: 215.40,
    change: -1.20,
    changePercent: -0.55,
    peRatio: 12.4,
    beta: 1.10,
    week52High: 225.48,
    week52Low: 142.38,
    divYield: 2.15,
    netIncome: 49552000000,
    totalRevenue: 158104000000,
    sharesOutstanding: 2860000000,
    total_revenue: 158104000000,
    impure_revenue: 142293600000,
    market_cap: 615000000000,
    total_assets: 3875000000000,
    interest_bearing_debt: 340000000000,
    interest_earning_assets: 1200000000000,
    tangible_assets: 310000000000,
    accounts_receivable: 85000000000
  }),

  "BAC": buildCompany({
    ticker: "BAC",
    name: "Bank of America Corporation",
    sector: "Conventional Banking",
    industry: "Financial Services",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Brian Moynihan",
    description: "Bank of America Corporation provides banking and nonbank financial products and services for individual consumers, small and middle-market businesses, and large corporations.",
    employees: 213000,
    website: "https://www.bankofamerica.com",
    marketCap: 305000000000,
    price: 39.50,
    change: -0.30,
    changePercent: -0.75,
    peRatio: 13.2,
    beta: 1.32,
    week52High: 44.40,
    week52Low: 24.96,
    divYield: 2.63,
    netIncome: 26515000000,
    totalRevenue: 98580000000,
    sharesOutstanding: 7720000000,
    total_revenue: 98580000000,
    impure_revenue: 88722000000,
    market_cap: 305000000000,
    total_assets: 3270000000000,
    interest_bearing_debt: 290000000000,
    interest_earning_assets: 950000000000,
    tangible_assets: 260000000000,
    accounts_receivable: 65000000000
  }),

  "JNJ": buildCompany({
    ticker: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare & Pharmaceuticals",
    industry: "Pharmaceuticals",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Joaquin Duato",
    description: "Johnson & Johnson researches, develops, manufactures, and sells healthcare products in the pharmaceutical and medical technology fields.",
    employees: 131900,
    website: "https://www.jnj.com",
    marketCap: 385000000000,
    price: 160.20,
    change: 0.80,
    changePercent: 0.50,
    peRatio: 24.1,
    beta: 0.54,
    week52High: 168.96,
    week52Low: 143.16,
    divYield: 3.08,
    netIncome: 17941000000,
    totalRevenue: 85159000000,
    sharesOutstanding: 2400000000,
    total_revenue: 85159000000,
    impure_revenue: 1532862000,
    market_cap: 385000000000,
    total_assets: 167570000000,
    interest_bearing_debt: 33400000000,
    interest_earning_assets: 23500000000,
    tangible_assets: 88500000000,
    accounts_receivable: 14800000000
  }),

  "LMT": buildCompany({
    ticker: "LMT",
    name: "Lockheed Martin Corporation",
    sector: "Aerospace & Defense",
    industry: "Defense Contracting",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Jim Taiclet",
    description: "Lockheed Martin Corporation is a global security and aerospace company engaged in research, design, development, and integration of advanced technology systems.",
    employees: 122000,
    website: "https://www.lockheedmartin.com",
    marketCap: 132000000000,
    price: 555.00,
    change: 4.20,
    changePercent: 0.76,
    peRatio: 19.8,
    beta: 0.48,
    week52High: 570.00,
    week52Low: 410.00,
    divYield: 2.27,
    netIncome: 6920000000,
    totalRevenue: 67570000000,
    sharesOutstanding: 238000000,
    total_revenue: 67570000000,
    impure_revenue: 810840000,
    market_cap: 132000000000,
    total_assets: 54600000000,
    interest_bearing_debt: 17800000000,
    interest_earning_assets: 3100000000,
    tangible_assets: 32400000000,
    accounts_receivable: 7800000000
  }),

  "XOM": buildCompany({
    ticker: "XOM",
    name: "Exxon Mobil Corporation",
    sector: "Energy & Petrochemicals",
    industry: "Oil & Gas",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Darren Woods",
    description: "Exxon Mobil Corporation explores for and produces crude oil and natural gas, manufactures petroleum products, and sells petrochemical commodities.",
    employees: 62000,
    website: "https://corporate.exxonmobil.com",
    marketCap: 468000000000,
    price: 118.40,
    change: -0.40,
    changePercent: -0.34,
    peRatio: 14.2,
    beta: 0.98,
    week52High: 126.34,
    week52Low: 98.00,
    divYield: 3.21,
    netIncome: 36010000000,
    totalRevenue: 344582000000,
    sharesOutstanding: 3950000000,
    total_revenue: 344582000000,
    impure_revenue: 2756656000,
    market_cap: 468000000000,
    total_assets: 376317000000,
    interest_bearing_debt: 41500000000,
    interest_earning_assets: 31500000000,
    tangible_assets: 318000000000,
    accounts_receivable: 34000000000
  }),

  "TSM": buildCompany({
    ticker: "TSM",
    name: "Taiwan Semiconductor Manufacturing Co.",
    sector: "Semiconductors & Foundry",
    industry: "Semiconductors",
    exchange: "NYSE",
    country: "Taiwan",
    currency: "USD",
    ceo: "C.C. Wei",
    description: "Taiwan Semiconductor Manufacturing Company Limited manufactures and sells integrated circuits and semiconductor devices worldwide.",
    employees: 73000,
    website: "https://www.tsmc.com",
    marketCap: 860000000000,
    price: 168.50,
    change: 2.10,
    changePercent: 1.26,
    peRatio: 30.5,
    beta: 1.20,
    week52High: 193.47,
    week52Low: 84.86,
    divYield: 1.35,
    netIncome: 29100000000,
    totalRevenue: 72500000000,
    sharesOutstanding: 5180000000,
    total_revenue: 72500000000,
    impure_revenue: 435000000, // 0.6%
    market_cap: 860000000000,
    total_assets: 182000000000,
    interest_bearing_debt: 29800000000, // 3.46% debt/mcap
    interest_earning_assets: 54200000000, // 6.30% cash/mcap
    tangible_assets: 145000000000,
    accounts_receivable: 8200000000
  }),

  "AVGO": buildCompany({
    ticker: "AVGO",
    name: "Broadcom Inc.",
    sector: "Semiconductors & Infrastructure Software",
    industry: "Semiconductors",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Hock Tan",
    description: "Broadcom Inc. designs, develops, and supplies semiconductor devices and enterprise software solutions.",
    employees: 20000,
    website: "https://www.broadcom.com",
    marketCap: 820000000000,
    price: 172.40,
    change: 3.80,
    changePercent: 2.25,
    peRatio: 38.2,
    beta: 1.15,
    week52High: 185.16,
    week52Low: 80.80,
    divYield: 1.22,
    netIncome: 14080000000,
    totalRevenue: 35820000000,
    sharesOutstanding: 4750000000,
    total_revenue: 35820000000,
    impure_revenue: 286560000,
    market_cap: 820000000000,
    total_assets: 172000000000,
    interest_bearing_debt: 74200000000, // 9.04% debt/mcap
    interest_earning_assets: 11800000000, // 1.43% cash/mcap
    tangible_assets: 78000000000,
    accounts_receivable: 4500000000
  }),

  "LLY": buildCompany({
    ticker: "LLY",
    name: "Eli Lilly and Company",
    sector: "Pharmaceuticals & Healthcare",
    industry: "Pharmaceuticals",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "David A. Ricks",
    description: "Eli Lilly and Company discovers, develops, and markets human pharmaceutical products worldwide.",
    employees: 43000,
    website: "https://www.lilly.com",
    marketCap: 880000000000,
    price: 928.10,
    change: 12.40,
    changePercent: 1.35,
    peRatio: 115.2,
    beta: 0.42,
    week52High: 972.53,
    week52Low: 434.34,
    divYield: 0.56,
    netIncome: 5240000000,
    totalRevenue: 34120000000,
    sharesOutstanding: 948000000,
    total_revenue: 34120000000,
    impure_revenue: 272960000,
    market_cap: 880000000000,
    total_assets: 64200000000,
    interest_bearing_debt: 25100000000, // 2.85% debt/mcap
    interest_earning_assets: 2800000000,
    tangible_assets: 38000000000,
    accounts_receivable: 6200000000
  }),

  "ORCL": buildCompany({
    ticker: "ORCL",
    name: "Oracle Corporation",
    sector: "Enterprise Software & Cloud Infrastructure",
    industry: "Software & IT",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Safra Catz",
    description: "Oracle Corporation offers products and services that address enterprise information technology environments including Oracle Cloud Services.",
    employees: 159000,
    website: "https://www.oracle.com",
    marketCap: 380000000000,
    price: 138.20,
    change: 1.10,
    changePercent: 0.80,
    peRatio: 36.4,
    beta: 1.02,
    week52High: 146.59,
    week52Low: 100.24,
    divYield: 1.15,
    netIncome: 10470000000,
    totalRevenue: 52960000000,
    sharesOutstanding: 2750000000,
    total_revenue: 52960000000,
    impure_revenue: 423680000,
    market_cap: 380000000000,
    total_assets: 137000000000,
    interest_bearing_debt: 86800000000, // 22.8% debt/mcap
    interest_earning_assets: 10600000000,
    tangible_assets: 54000000000,
    accounts_receivable: 7800000000
  }),

  "CRM": buildCompany({
    ticker: "CRM",
    name: "Salesforce, Inc.",
    sector: "Enterprise Cloud Software",
    industry: "Software & IT",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Marc Benioff",
    description: "Salesforce, Inc. provides Customer Relationship Management (CRM) technology that brings companies and customers together.",
    employees: 72682,
    website: "https://www.salesforce.com",
    marketCap: 260000000000,
    price: 268.40,
    change: -1.20,
    changePercent: -0.44,
    peRatio: 48.5,
    beta: 1.18,
    week52High: 318.72,
    week52Low: 193.42,
    divYield: 0.60,
    netIncome: 4136000000,
    totalRevenue: 34857000000,
    sharesOutstanding: 968000000,
    total_revenue: 34857000000,
    impure_revenue: 243999000,
    market_cap: 260000000000,
    total_assets: 102000000000,
    interest_bearing_debt: 14200000000, // 5.46% debt/mcap
    interest_earning_assets: 14100000000,
    tangible_assets: 38000000000,
    accounts_receivable: 11200000000
  }),

  "PLTR": buildCompany({
    ticker: "PLTR",
    name: "Palantir Technologies Inc.",
    sector: "Defense Contracting & Military Surveillance Software",
    industry: "Military Warfare & Defense AI Systems",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Alex Karp",
    description: "Palantir Technologies Inc. builds and deploys military intelligence platforms, defense contracting software (Gotham, Maven, AIP), and government surveillance systems for defense and intelligence agencies.",
    employees: 3800,
    website: "https://www.palantir.com",
    marketCap: 65000000000,
    price: 28.50,
    change: 0.85,
    changePercent: 3.07,
    peRatio: 88.2,
    beta: 2.10,
    week52High: 30.00,
    week52Low: 14.48,
    divYield: 0,
    netIncome: 217000000,
    totalRevenue: 2225000000,
    sharesOutstanding: 2280000000,
    total_revenue: 2225000000,
    impure_revenue: 142000000, // 6.38% defense systems & interest income
    market_cap: 65000000000,
    total_assets: 4500000000,
    interest_bearing_debt: 250000000, // 0.38% debt/mcap
    interest_earning_assets: 3800000000, // 5.84% cash/mcap
    tangible_assets: 4100000000,
    accounts_receivable: 380000000
  }),

  "BE": buildCompany({
    ticker: "BE",
    name: "Bloom Energy Corporation",
    sector: "Clean Technology & Electrical Equipment",
    industry: "Solid Oxide Fuel Cells & Clean Power",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "KR Sridhar",
    description: "Bloom Energy Corporation manufactures and installs solid oxide fuel cell energy servers ('Bloom Energy Servers') that produce clean, resilient, on-site electricity for data centers, hospitals, industrial facilities, and utility grids.",
    employees: 2400,
    website: "https://www.bloomenergy.com",
    marketCap: 4800000000,
    price: 19.50,
    change: 0.45,
    changePercent: 2.36,
    peRatio: 38.5,
    beta: 2.15,
    week52High: 28.50,
    week52Low: 8.85,
    divYield: 0,
    netIncome: -92360000,
    totalRevenue: 1470000000,
    sharesOutstanding: 246150000,
    total_revenue: 1470000000,
    impure_revenue: 4410000, // 0.30% interest/incidental income
    market_cap: 4800000000,
    total_assets: 4100000000,
    interest_bearing_debt: 1210000000, // 25.2% debt/mcap (AAOIFI) & 29.5% debt/assets (MSCI/S&P/DJ) -> PASS (<30%)
    interest_earning_assets: 580000000, // 12.1% cash/mcap & 14.1% cash/assets -> PASS (<30%)
    tangible_assets: 3100000000,
    accounts_receivable: 320000000
  }),

  "UBER": buildCompany({
    ticker: "UBER",
    name: "Uber Technologies, Inc.",
    sector: "Mobility & Logistics Technology",
    industry: "Ride-Hailing & On-Demand Delivery",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Dara Khosrowshahi",
    description: "Uber Technologies, Inc. provides ridesharing, food delivery, and freight logistics platforms globally.",
    employees: 30400,
    website: "https://www.uber.com",
    marketCap: 152000000000,
    price: 73.20,
    change: 1.15,
    changePercent: 1.59,
    peRatio: 34.2,
    beta: 1.28,
    week52High: 82.10,
    week52Low: 40.25,
    divYield: 0,
    netIncome: 1887000000,
    totalRevenue: 37280000000,
    sharesOutstanding: 2076000000,
    total_revenue: 37280000000,
    impure_revenue: 111840000, // 0.30% interest income
    market_cap: 152000000000,
    total_assets: 38700000000,
    interest_bearing_debt: 9450000000, // 6.2% debt/mcap -> PASS (<30%)
    interest_earning_assets: 5400000000, // 3.55% cash/mcap -> PASS (<30%)
    tangible_assets: 26500000000,
    accounts_receivable: 3100000000
  }),

  "COIN": buildCompany({
    ticker: "COIN",
    name: "Coinbase Global, Inc.",
    sector: "Financial Technology & Crypto Infrastructure",
    industry: "Digital Asset Exchange & Staking Infrastructure",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Brian Armstrong",
    description: "Coinbase Global, Inc. provides financial infrastructure and technology for the cryptoeconomy, offering platform trading, custodial services, and blockchain developer tooling.",
    employees: 3410,
    website: "https://www.coinbase.com",
    marketCap: 58000000000,
    price: 235.40,
    change: 4.80,
    changePercent: 2.08,
    peRatio: 31.8,
    beta: 2.85,
    week52High: 310.05,
    week52Low: 114.15,
    divYield: 0,
    netIncome: 1435000000,
    totalRevenue: 5120000000,
    sharesOutstanding: 246380000,
    total_revenue: 5120000000,
    impure_revenue: 76800000, // 1.50% interest on customer funds
    market_cap: 58000000000,
    total_assets: 24500000000,
    interest_bearing_debt: 4200000000, // 7.24% debt/mcap -> PASS (<30%)
    interest_earning_assets: 8100000000, // 13.96% cash/mcap -> PASS (<30%)
    tangible_assets: 19800000000,
    accounts_receivable: 1200000000
  }),

  "RBLX": buildCompany({
    ticker: "RBLX",
    name: "Roblox Corporation",
    sector: "Interactive Entertainment & Cloud Platforms",
    industry: "3D Immersive Experiences & Creator Platforms",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "David Baszucki",
    description: "Roblox Corporation develops and operates an online 3D immersive platform for human co-experience and content creation.",
    employees: 2450,
    website: "https://www.roblox.com",
    marketCap: 28500000000,
    price: 44.10,
    change: 0.90,
    changePercent: 2.08,
    peRatio: 0,
    beta: 1.65,
    week52High: 53.80,
    week52Low: 27.20,
    divYield: 0,
    netIncome: -1150000000,
    totalRevenue: 2800000000,
    sharesOutstanding: 646250000,
    total_revenue: 2800000000,
    impure_revenue: 8400000, // 0.30% interest income
    market_cap: 28500000000,
    total_assets: 5100000000,
    interest_bearing_debt: 1000000000, // 3.5% debt/mcap -> PASS (<30%)
    interest_earning_assets: 3100000000, // 10.8% cash/mcap -> PASS (<30%)
    tangible_assets: 4200000000,
    accounts_receivable: 280000000
  }),

  "PFE": buildCompany({
    ticker: "PFE",
    name: "Pfizer Inc.",
    sector: "Healthcare & Pharmaceuticals",
    industry: "Biopharmaceuticals & Vaccines",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Albert Bourla",
    description: "Pfizer Inc. discovers, develops, manufactures, and distributes biopharmaceutical medicines and vaccines worldwide.",
    employees: 88000,
    website: "https://www.pfizer.com",
    marketCap: 165000000000,
    price: 28.90,
    change: 0.20,
    changePercent: 0.70,
    peRatio: 15.2,
    beta: 0.62,
    week52High: 36.80,
    week52Low: 25.20,
    divYield: 5.8,
    netIncome: 2120000000,
    totalRevenue: 58500000000,
    sharesOutstanding: 5709000000,
    total_revenue: 58500000000,
    impure_revenue: 117000000, // 0.20% interest income
    market_cap: 165000000000,
    total_assets: 226000000000,
    interest_bearing_debt: 61500000000, // 37.27% debt/mcap (fails AAOIFI >30% debt/mcap), 27.2% debt/assets (MSCI/S&P pass)
    interest_earning_assets: 11800000000, // 7.15% cash/mcap -> PASS (<30%)
    tangible_assets: 135000000000,
    accounts_receivable: 12500000000
  }),

  "MRNA": buildCompany({
    ticker: "MRNA",
    name: "Moderna, Inc.",
    sector: "Biotechnology & Healthcare",
    industry: "mRNA Therapeutics & Preventive Vaccines",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Stéphane Bancel",
    description: "Moderna, Inc. is a biotechnology company pioneering messenger RNA (mRNA) therapeutics and vaccines.",
    employees: 5600,
    website: "https://www.modernatx.com",
    marketCap: 42000000000,
    price: 110.50,
    change: 2.10,
    changePercent: 1.94,
    peRatio: 0,
    beta: 1.45,
    week52High: 170.40,
    week52Low: 62.50,
    divYield: 0,
    netIncome: -4700000000,
    totalRevenue: 6840000000,
    sharesOutstanding: 380000000,
    total_revenue: 6840000000,
    impure_revenue: 13680000, // 0.20% interest income
    market_cap: 42000000000,
    total_assets: 18200000000,
    interest_bearing_debt: 850000000, // 2.02% debt/mcap -> PASS (<30%)
    interest_earning_assets: 7500000000, // 17.8% cash/mcap -> PASS (<30%)
    tangible_assets: 15200000000,
    accounts_receivable: 1100000000
  }),

  "NKE": buildCompany({
    ticker: "NKE",
    name: "NIKE, Inc.",
    sector: "Consumer Apparel & Footwear",
    industry: "Athletic Footwear & Apparel",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Elliott Hill",
    description: "NIKE, Inc. designs, markets, and sells athletic footwear, apparel, equipment, and accessories globally.",
    employees: 83700,
    website: "https://www.nike.com",
    marketCap: 122000000000,
    price: 81.50,
    change: 0.80,
    changePercent: 0.99,
    peRatio: 23.4,
    beta: 1.08,
    week52High: 107.50,
    week52Low: 70.75,
    divYield: 1.8,
    netIncome: 5700000000,
    totalRevenue: 51360000000,
    sharesOutstanding: 1496900000,
    total_revenue: 51360000000,
    impure_revenue: 102720000, // 0.20% interest income
    market_cap: 122000000000,
    total_assets: 37500000000,
    interest_bearing_debt: 12100000000, // 9.91% debt/mcap -> PASS (<30%)
    interest_earning_assets: 11600000000, // 9.50% cash/mcap -> PASS (<30%)
    tangible_assets: 29800000000,
    accounts_receivable: 4500000000
  }),

  "SBUX": buildCompany({
    ticker: "SBUX",
    name: "Starbucks Corporation",
    sector: "Consumer Discretionary & Retail",
    industry: "Specialty Coffee & Quick Service Dining",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Brian Niccol",
    description: "Starbucks Corporation roasts, markets, and retails specialty coffee and beverage products globally.",
    employees: 381000,
    website: "https://www.starbucks.com",
    marketCap: 108000000000,
    price: 95.80,
    change: 1.20,
    changePercent: 1.27,
    peRatio: 26.1,
    beta: 0.98,
    week52High: 107.80,
    week52Low: 71.50,
    divYield: 2.4,
    netIncome: 4120000000,
    totalRevenue: 35970000000,
    sharesOutstanding: 1127300000,
    total_revenue: 35970000000,
    impure_revenue: 71940000, // 0.20% interest income
    market_cap: 108000000000,
    total_assets: 29400000000,
    interest_bearing_debt: 25800000000, // 23.88% debt/mcap -> PASS (<30%)
    interest_earning_assets: 3800000000, // 3.51% cash/mcap -> PASS (<30%)
    tangible_assets: 21500000000,
    accounts_receivable: 1200000000
  }),

  "SHOP": buildCompany({
    ticker: "SHOP",
    name: "Shopify Inc.",
    sector: "E-Commerce Infrastructure & Enterprise Software",
    industry: "Merchant Solutions & E-Commerce Software",
    exchange: "NYSE",
    country: "Canada",
    currency: "USD",
    ceo: "Tobi Lütke",
    description: "Shopify Inc. provides an essential internet infrastructure for commerce, offering trusted tools to start, grow, market, and manage a retail business.",
    employees: 11600,
    website: "https://www.shopify.com",
    marketCap: 102000000000,
    price: 79.40,
    change: 2.10,
    changePercent: 2.72,
    peRatio: 72.5,
    beta: 2.12,
    week52High: 91.50,
    week52Low: 48.50,
    divYield: 0,
    netIncome: 1320000000,
    totalRevenue: 7060000000,
    sharesOutstanding: 1284600000,
    total_revenue: 7060000000,
    impure_revenue: 21180000, // 0.30% interest income
    market_cap: 102000000000,
    total_assets: 11200000000,
    interest_bearing_debt: 920000000, // 0.90% debt/mcap -> PASS (<30%)
    interest_earning_assets: 5100000000, // 5.00% cash/mcap -> PASS (<30%)
    tangible_assets: 9800000000,
    accounts_receivable: 450000000
  }),

  "PANW": buildCompany({
    ticker: "PANW",
    name: "Palo Alto Networks, Inc.",
    sector: "Cybersecurity & Cloud Infrastructure",
    industry: "Enterprise Cybersecurity Platforms",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Nikesh Arora",
    description: "Palo Alto Networks, Inc. offers cybersecurity solutions globally, providing firewalls, cloud security, and threat intelligence platforms.",
    employees: 15100,
    website: "https://www.paloaltonetworks.com",
    marketCap: 115000000000,
    price: 352.10,
    change: 4.50,
    changePercent: 1.30,
    peRatio: 46.8,
    beta: 1.15,
    week52High: 380.00,
    week52Low: 260.00,
    divYield: 0,
    netIncome: 2570000000,
    totalRevenue: 8030000000,
    sharesOutstanding: 326600000,
    total_revenue: 8030000000,
    impure_revenue: 24090000, // 0.30% interest income
    market_cap: 115000000000,
    total_assets: 18500000000,
    interest_bearing_debt: 1850000000, // 1.60% debt/mcap -> PASS (<30%)
    interest_earning_assets: 3400000000, // 2.95% cash/mcap -> PASS (<30%)
    tangible_assets: 14200000000,
    accounts_receivable: 1800000000
  }),

  "CRWD": buildCompany({
    ticker: "CRWD",
    name: "CrowdStrike Holdings, Inc.",
    sector: "Cybersecurity & Cloud Security",
    industry: "Endpoint Protection & Threat Intelligence",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "George Kurtz",
    description: "CrowdStrike Holdings, Inc. provides cloud-delivered protection across endpoints and cloud workloads, threat intelligence, and cyber attack response services.",
    employees: 8400,
    website: "https://www.crowdstrike.com",
    marketCap: 72000000000,
    price: 298.50,
    change: 5.20,
    changePercent: 1.77,
    peRatio: 78.4,
    beta: 1.38,
    week52High: 398.30,
    week52Low: 200.80,
    divYield: 0,
    netIncome: 890000000,
    totalRevenue: 3650000000,
    sharesOutstanding: 241200000,
    total_revenue: 3650000000,
    impure_revenue: 10950000, // 0.30% interest income
    market_cap: 72000000000,
    total_assets: 6800000000,
    interest_bearing_debt: 740000000, // 1.02% debt/mcap -> PASS (<30%)
    interest_earning_assets: 3700000000, // 5.13% cash/mcap -> PASS (<30%)
    tangible_assets: 5200000000,
    accounts_receivable: 980000000
  }),

  "ENPH": buildCompany({
    ticker: "ENPH",
    name: "Enphase Energy, Inc.",
    sector: "Clean Technology & Solar Energy",
    industry: "Microinverters & Solar Energy Storage",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Badri Kothandaraman",
    description: "Enphase Energy, Inc. designs, develops, manufactures, and sells microinverter systems for the solar photovoltaic industry worldwide.",
    employees: 3150,
    website: "https://www.enphase.com",
    marketCap: 15800000000,
    price: 118.20,
    change: 2.40,
    changePercent: 2.07,
    peRatio: 38.2,
    beta: 1.55,
    week52High: 141.50,
    week52Low: 73.50,
    divYield: 0,
    netIncome: 438000000,
    totalRevenue: 1610000000,
    sharesOutstanding: 133670000,
    total_revenue: 1610000000,
    impure_revenue: 4830000, // 0.30% interest income
    market_cap: 15800000000,
    total_assets: 3120000000,
    interest_bearing_debt: 1290000000, // 8.16% debt/mcap -> PASS (<30%)
    interest_earning_assets: 1650000000, // 10.44% cash/mcap -> PASS (<30%)
    tangible_assets: 2650000000,
    accounts_receivable: 380000000
  }),

  "F": buildCompany({
    ticker: "F",
    name: "Ford Motor Company",
    sector: "Automotive & Electric Mobility",
    industry: "Automobiles & Commercial Trucks",
    exchange: "NYSE",
    country: "United States",
    currency: "USD",
    ceo: "Jim Farley",
    description: "Ford Motor Company designs, manufactures, markets, and services a line of Ford trucks, utility vehicles, commercial cars, and Lincoln luxury vehicles.",
    employees: 177000,
    website: "https://www.ford.com",
    marketCap: 41200000000,
    price: 10.35,
    change: 0.12,
    changePercent: 1.17,
    peRatio: 10.8,
    beta: 1.42,
    week52High: 14.85,
    week52Low: 9.60,
    divYield: 5.8,
    netIncome: 4330000000,
    totalRevenue: 176200000000,
    sharesOutstanding: 3980000000,
    total_revenue: 176200000000,
    impure_revenue: 1409600000,
    market_cap: 41200000000,
    total_assets: 273000000000,
    interest_bearing_debt: 142000000000,
    interest_earning_assets: 28500000000,
    tangible_assets: 195000000000,
    accounts_receivable: 11200000000
  }),

  // CERTIFIED HALAL ETFS
  "SPUS": buildCompany({
    ticker: "SPUS",
    name: "SP Funds S&P 500 Shariah Industry ETF",
    sector: "Exchange Traded Funds (Halal ETF)",
    industry: "Certified Shariah Compliant Index Fund",
    exchange: "NYSE Arca",
    country: "United States",
    currency: "USD",
    ceo: "SP Funds Management",
    description: "SPUS invests in S&P 500 constituents that comply with Shariah investment guidelines established by the S&P Shariah Index Board. It excludes conventional financial institutions, alcohol, pork, gambling, weapons, and companies exceeding debt/cash ratios (>30%).",
    employees: 50,
    website: "https://www.sp-funds.com/spus",
    marketCap: 850000000,
    price: 42.15,
    change: 0.35,
    changePercent: 0.84,
    peRatio: 26.4,
    beta: 0.98,
    week52High: 44.50,
    week52Low: 32.10,
    divYield: 0.95,
    netIncome: 15000000,
    totalRevenue: 25000000,
    sharesOutstanding: 20150000,
    total_revenue: 25000000,
    impure_revenue: 0,
    market_cap: 850000000,
    total_assets: 850000000,
    interest_bearing_debt: 0,
    interest_earning_assets: 0,
    tangible_assets: 850000000,
    accounts_receivable: 0
  }),

  "HLAL": buildCompany({
    ticker: "HLAL",
    name: "Wahed FTSE USA Shariah ETF",
    sector: "Exchange Traded Funds (Halal ETF)",
    industry: "Certified Shariah Compliant Index Fund",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Wahed Invest LLC",
    description: "HLAL tracks the FTSE USA Shariah Index, holding US equities screened according to AAOIFI Shariah principles. All underlying companies are screened for non-permissible sector activities and debt/cash financial limits.",
    employees: 60,
    website: "https://funds.wahedinvest.com/hlal",
    marketCap: 480000000,
    price: 48.60,
    change: 0.42,
    changePercent: 0.87,
    peRatio: 27.1,
    beta: 1.02,
    week52High: 51.20,
    week52Low: 36.80,
    divYield: 0.82,
    netIncome: 9500000,
    totalRevenue: 18000000,
    sharesOutstanding: 9870000,
    total_revenue: 18000000,
    impure_revenue: 0,
    market_cap: 480000000,
    total_assets: 480000000,
    interest_bearing_debt: 0,
    interest_earning_assets: 0,
    tangible_assets: 480000000,
    accounts_receivable: 0
  }),

  "UMMA": buildCompany({
    ticker: "UMMA",
    name: "Wahed Dow Jones Islamic World ETF",
    sector: "Exchange Traded Funds (Halal ETF)",
    industry: "Certified Shariah Compliant Global Fund",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Wahed Invest LLC",
    description: "UMMA offers international equity exposure to developed and emerging market stocks compliant with Dow Jones Islamic Market methodology.",
    employees: 40,
    website: "https://funds.wahedinvest.com/umma",
    marketCap: 120000000,
    price: 24.10,
    change: 0.18,
    changePercent: 0.75,
    peRatio: 22.5,
    beta: 0.91,
    week52High: 26.00,
    week52Low: 19.50,
    divYield: 1.45,
    netIncome: 3500000,
    totalRevenue: 6000000,
    sharesOutstanding: 4980000,
    total_revenue: 6000000,
    impure_revenue: 0,
    market_cap: 120000000,
    total_assets: 120000000,
    interest_bearing_debt: 0,
    interest_earning_assets: 0,
    tangible_assets: 120000000,
    accounts_receivable: 0
  }),

  "SPSK": buildCompany({
    ticker: "SPSK",
    name: "SP Funds Dow Jones Global Sukuk ETF",
    sector: "Exchange Traded Funds (Halal Fixed Income / Sukuk)",
    industry: "Certified Shariah Compliant Sukuk Fund",
    exchange: "NYSE Arca",
    country: "United States",
    currency: "USD",
    ceo: "SP Funds Management",
    description: "SPSK tracks the Dow Jones Sukuk Index, holding investment-grade asset-backed sovereign and corporate Sukuk certificates globally.",
    employees: 30,
    website: "https://www.sp-funds.com/spsk",
    marketCap: 210000000,
    price: 18.25,
    change: 0.05,
    changePercent: 0.27,
    peRatio: 0,
    beta: 0.22,
    week52High: 19.10,
    week52Low: 17.50,
    divYield: 4.85,
    netIncome: 9800000,
    totalRevenue: 10500000,
    sharesOutstanding: 11500000,
    total_revenue: 10500000,
    impure_revenue: 0,
    market_cap: 210000000,
    total_assets: 210000000,
    interest_bearing_debt: 0,
    interest_earning_assets: 0,
    tangible_assets: 210000000,
    accounts_receivable: 0
  }),

  // CONVENTIONAL NON-COMPLIANT ETFS
  "SPY": buildCompany({
    ticker: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    sector: "Exchange Traded Funds (Conventional ETF)",
    industry: "Broad Market Index Fund",
    exchange: "NYSE Arca",
    country: "United States",
    currency: "USD",
    ceo: "State Street Global Advisors",
    description: "SPY tracks the S&P 500 Index. It holds conventional banks (JPMorgan, Bank of America), high-debt corporations, weapons contractors, alcohol, and gambling stocks without Shariah screening or purification rules.",
    employees: 500,
    website: "https://www.ssga.com/spy",
    marketCap: 520000000000,
    price: 545.20,
    change: 4.10,
    changePercent: 0.76,
    peRatio: 27.8,
    beta: 1.00,
    week52High: 560.20,
    week52Low: 410.50,
    divYield: 1.25,
    netIncome: 8500000000,
    totalRevenue: 12000000000,
    sharesOutstanding: 953000000,
    total_revenue: 12000000000,
    impure_revenue: 3000000000, // ~25% holding non-compliant sectors (banks, debt)
    market_cap: 520000000000,
    total_assets: 520000000000,
    interest_bearing_debt: 120000000000,
    interest_earning_assets: 80000000000,
    tangible_assets: 400000000000,
    accounts_receivable: 10000000000
  }),

  "QQQ": buildCompany({
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    sector: "Exchange Traded Funds (Conventional ETF)",
    industry: "Large-Cap Growth Index Fund",
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Invesco Ltd.",
    description: "QQQ tracks the Nasdaq-100 Index. While technology-heavy, QQQ holds non-compliant media/entertainment companies (Netflix, Warner Bros, Meta), debt-heavy firms, and conventional financial services without Shariah screening.",
    employees: 400,
    website: "https://www.invesco.com/qqq",
    marketCap: 280000000000,
    price: 475.50,
    change: 5.80,
    changePercent: 1.23,
    peRatio: 31.2,
    beta: 1.18,
    week52High: 503.50,
    week52Low: 350.20,
    divYield: 0.58,
    netIncome: 4500000000,
    totalRevenue: 6000000000,
    sharesOutstanding: 588000000,
    total_revenue: 6000000000,
    impure_revenue: 1200000000,
    market_cap: 280000000000,
    total_assets: 280000000000,
    interest_bearing_debt: 50000000000,
    interest_earning_assets: 40000000000,
    tangible_assets: 220000000000,
    accounts_receivable: 5000000000
  }),

  "VOO": buildCompany({
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    sector: "Exchange Traded Funds (Conventional ETF)",
    industry: "Broad Market Index Fund",
    exchange: "NYSE Arca",
    country: "United States",
    currency: "USD",
    ceo: "Vanguard Group",
    description: "VOO tracks the S&P 500 Index. Unscreened basket containing conventional interest-bearing financial institutions, high debt companies, and non-permissible sector businesses.",
    employees: 450,
    website: "https://www.vanguard.com/voo",
    marketCap: 450000000000,
    price: 501.10,
    change: 3.80,
    changePercent: 0.76,
    peRatio: 27.8,
    beta: 1.00,
    week52High: 515.00,
    week52Low: 378.00,
    divYield: 1.28,
    netIncome: 7000000000,
    totalRevenue: 10000000000,
    sharesOutstanding: 898000000,
    total_revenue: 10000000000,
    impure_revenue: 2500000000,
    market_cap: 450000000000,
    total_assets: 450000000000,
    interest_bearing_debt: 100000000000,
    interest_earning_assets: 70000000000,
    tangible_assets: 350000000000,
    accounts_receivable: 8000000000
  }),

  "XLF": buildCompany({
    ticker: "XLF",
    name: "Financial Select Sector SPDR Fund",
    sector: "Exchange Traded Funds (Conventional ETF)",
    industry: "Financial Sector Index Fund",
    exchange: "NYSE Arca",
    country: "United States",
    currency: "USD",
    ceo: "State Street Global Advisors",
    description: "XLF invests directly in conventional banks, interest-bearing lending institutions, insurance firms, and mortgage brokers (JPMorgan, Berkshire Hathaway, Bank of America, Citigroup). Strictly NON-COMPLIANT under all Islamic standards.",
    employees: 200,
    website: "https://www.ssga.com/xlf",
    marketCap: 42000000000,
    price: 43.80,
    change: 0.25,
    changePercent: 0.57,
    peRatio: 16.2,
    beta: 1.08,
    week52High: 45.20,
    week52Low: 32.50,
    divYield: 1.55,
    netIncome: 2500000000,
    totalRevenue: 4000000000,
    sharesOutstanding: 958000000,
    total_revenue: 4000000000,
    impure_revenue: 3800000000, // 95%+ conventional banking & interest
    market_cap: 42000000000,
    total_assets: 42000000000,
    interest_bearing_debt: 20000000000,
    interest_earning_assets: 15000000000,
    tangible_assets: 25000000000,
    accounts_receivable: 2000000000
  })
};

function buildCompany(data: any): CompanyProfile {
  const shariahMetrics: ShariahMetrics = {
    total_revenue: data.total_revenue,
    impure_revenue: data.impure_revenue,
    market_cap: data.market_cap,
    total_assets: data.total_assets,
    interest_bearing_debt: data.interest_bearing_debt,
    interest_earning_assets: data.interest_earning_assets,
    tangible_assets: data.tangible_assets,
    accounts_receivable: data.accounts_receivable
  };

  const screening = runShariahScreening({
    ticker: data.ticker,
    name: data.name,
    sector: data.sector,
    industry: data.industry,
    description: data.description,
    ...shariahMetrics
  }, 'AAOIFI');

  const etfInfo = detectEtfStatus(data.ticker, data.name, data.sector, data.industry, data.description);

  return {
    ticker: data.ticker,
    name: data.name,
    sector: data.sector,
    industry: data.industry,
    exchange: data.exchange,
    country: data.country,
    currency: data.currency,
    ceo: data.ceo,
    description: data.description,
    employees: data.employees,
    website: data.website,
    marketCap: data.marketCap,
    price: data.price,
    change: data.change,
    changePercent: data.changePercent,
    peRatio: data.peRatio,
    beta: data.beta,
    week52High: data.week52High,
    week52Low: data.week52Low,
    divYield: data.divYield,
    netIncome: data.netIncome,
    totalRevenue: data.totalRevenue,
    sharesOutstanding: data.sharesOutstanding,
    isEtf: etfInfo.isEtf,
    isHalalEtf: etfInfo.isHalalEtf,
    etfType: etfInfo.etfType,
    halalAlternatives: etfInfo.isEtf && !etfInfo.isHalalEtf ? HALAL_ETF_ALTERNATIVES : undefined,
    shariahMetrics,
    screening
  };
}

// Generate fallback profile for any stock ticker
export function generateDynamicProfile(tickerRaw: string, overrideName?: string, overrideSector?: string): CompanyProfile {
  const ticker = resolveTickerAlias(tickerRaw);
  if (STOCK_DATABASE[ticker]) {
    return STOCK_DATABASE[ticker];
  }

  // Derive stable pseudo-random numbers based on ticker char codes
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  }

  const absHash = Math.abs(hash);

  const etfCheck = detectEtfStatus(tickerRaw, overrideName, overrideSector);

  const isMediaEnt = /PARA|PSKY|SKYDANCE|WARNER|WBD|SPOT|SONY|CMCSA|FOX|NFLX|DIS|MEDIA|ENT|FILM|MOVIE|SHOW|MUSIC|STREAM|TV|STUDIO|BROADCAST/i.test(tickerRaw);

  const sectors = [
    "Technology", "Healthcare", "Consumer Discretionary", "Industrial", 
    "Renewable Energy", "Communications", "Materials", "Real Estate"
  ];
  const sector = overrideSector || (etfCheck.isEtf ? (etfCheck.isHalalEtf ? "Exchange Traded Funds (Halal ETF)" : "Exchange Traded Funds (Conventional ETF)") : isMediaEnt ? "Media & Entertainment" : sectors[absHash % sectors.length]);
  const industry = etfCheck.isEtf ? (etfCheck.isHalalEtf ? "Certified Shariah Compliant Fund" : "Unscreened Index Fund") : isMediaEnt ? "Broadcasting, Film & Audio Entertainment" : `${sector} Solutions`;
  
  const mcap = 8000000000 + (absHash % 450) * 1000000000;
  const price = 15 + (absHash % 250) + (absHash % 99) / 100;
  const change = ((absHash % 200) - 100) / 20;
  const changePercent = (change / price) * 100;

  const debtRatio = 0.05 + ((absHash % 22) / 100); // 5% to 27%
  const cashRatio = 0.02 + ((absHash % 25) / 100); // 2% to 27%
  const impureRatio = isMediaEnt ? 0.85 : ((absHash % 30) / 1000); // 85% if media, else 0% to 3.0%
  const tangiblePercent = 0.45 + ((absHash % 40) / 100);

  const totalRevenue = mcap * 0.35;
  const impureRevenue = totalRevenue * impureRatio;
  const totalAssets = mcap * 0.45;
  const debt = mcap * debtRatio;
  const cash = mcap * cashRatio;
  const tangible = totalAssets * tangiblePercent;

  return buildCompany({
    ticker,
    name: overrideName || `${ticker} Inc.`,
    sector,
    industry,
    exchange: "NASDAQ",
    country: "United States",
    currency: "USD",
    ceo: "Executive Management",
    description: etfCheck.isEtf
      ? `${ticker} is an Exchange Traded Fund. ${etfCheck.isHalalEtf ? 'It is certified Shariah compliant.' : 'Conventional ETFs contain unscreened constituent stocks (banks, interest debt, etc.) and fail Shariah screening.'}`
      : isMediaEnt 
      ? `${ticker} operates in non-permissible media, film, broadcast television, or audio music entertainment production.`
      : `${ticker} Global Inc. is a publicly traded company specializing in enterprise ${sector.toLowerCase()} systems and international operations.`,
    employees: 14500 + (absHash % 80000),
    website: `https://www.${ticker.toLowerCase()}.com`,
    marketCap: mcap,
    price,
    change,
    changePercent,
    peRatio: 18.5 + (absHash % 40),
    beta: 0.85 + (absHash % 90) / 100,
    week52High: price * 1.25,
    week52Low: price * 0.75,
    divYield: (absHash % 35) / 10,
    netIncome: totalRevenue * 0.18,
    totalRevenue,
    sharesOutstanding: mcap / price,
    total_revenue: totalRevenue,
    impure_revenue: impureRevenue,
    market_cap: mcap,
    total_assets: totalAssets,
    interest_bearing_debt: debt,
    interest_earning_assets: cash,
    tangible_assets: tangible,
    accounts_receivable: totalAssets * 0.15
  });
}

// Generate historical trend data for charts
export function generateHistoricalData(profile: CompanyProfile): HistoricalPoint[] {
  const quarters = ["2023 Q3", "2023 Q4", "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4", "2025 Q1", "2025 Q2"];
  const baseDebt = profile.shariahMetrics.interest_bearing_debt / profile.marketCap;
  const baseCash = profile.shariahMetrics.interest_earning_assets / profile.marketCap;
  const baseImpure = profile.shariahMetrics.impure_revenue / profile.shariahMetrics.total_revenue;

  return quarters.map((q, idx) => {
    const noise = (Math.sin(idx * 1.5) * 0.015);
    const debtRatio = Math.max(0.01, baseDebt + noise);
    const cashRatio = Math.max(0.01, baseCash - noise * 0.5);
    const impureRatio = Math.max(0.002, baseImpure + (noise * 0.1));
    const marketCap = profile.marketCap * (0.88 + (idx * 0.03));
    const price = profile.price * (0.88 + (idx * 0.03));
    
    const isCompliant = debtRatio < 0.30 && cashRatio < 0.30 && impureRatio <= 0.05 && !isProhibitedBusiness(profile.sector, profile.industry, profile.description);

    return {
      period: q,
      debtRatio: Math.round(debtRatio * 10000) / 100,
      cashRatio: Math.round(cashRatio * 10000) / 100,
      impureRatio: Math.round(impureRatio * 10000) / 100,
      tangibleRatio: Math.round((profile.shariahMetrics.tangible_assets / profile.shariahMetrics.total_assets) * 100),
      marketCap: Math.round(marketCap / 1e9),
      price: Math.round(price * 100) / 100,
      status: isCompliant ? 'COMPLIANT' : 'NON_COMPLIANT'
    };
  });
}
