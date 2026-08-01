export type ShariahStandard = 'AAOIFI' | 'MSCI' | 'SP' | 'DJ' | 'CUSTOM';

export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT';

export interface ShariahMetrics {
  total_revenue: number; // in USD
  impure_revenue: number; // in USD (interest, alcohol, pork, conventional financial services, etc.)
  market_cap: number; // in USD
  total_assets: number; // in USD
  interest_bearing_debt: number; // short-term + long-term interest debt
  interest_earning_assets: number; // cash, cash equivalents & interest-bearing deposits/bonds
  tangible_assets: number; // physical assets, plant, equipment, inventory
  accounts_receivable: number; // trade receivables
}

export interface CustomThresholds {
  maxDebtRatio: number; // default 0.30
  maxCashRatio: number; // default 0.30
  maxImpureRatio: number; // default 0.05
  minTangibleRatio: number; // default 0.20
}

export interface ScreeningResult {
  status: ComplianceStatus;
  reason?: string;
  purification_factor: number; // percentage of dividend to purify (e.g., 0.012 = 1.2%)
  message: string;
  debt_ratio: number;
  cash_ratio: number;
  impure_ratio: number;
  tangible_ratio: number;
  receivable_ratio: number;
  debt_pass: boolean;
  cash_pass: boolean;
  impure_pass: boolean;
  tangible_pass: boolean;
  sector_pass: boolean;
  standard: ShariahStandard;
  confidence: number; // e.g., 98%
  timestamp: string;
  denominator_used: 'market_cap' | 'total_assets';
  thresholds: {
    maxDebt: number;
    maxCash: number;
    maxImpure: number;
    minTangible: number;
  };
}

export interface CompanyProfile {
  ticker: string;
  name: string;
  logoUrl?: string;
  sector: string;
  industry: string;
  exchange: string;
  country: string;
  currency: string;
  ceo: string;
  description: string;
  employees: number;
  website: string;
  marketCap: number;
  price: number;
  change: number;
  changePercent: number;
  peRatio: number;
  beta: number;
  week52High: number;
  week52Low: number;
  divYield: number;
  netIncome: number;
  totalRevenue: number;
  sharesOutstanding: number;
  shariahMetrics: ShariahMetrics;
  screening: ScreeningResult;
  dataSources?: {
    quoteSource: string;
    fundamentalsSource: string;
    lastUpdated: string;
    isRealTime: boolean;
    verificationStatus: 'MULTI_STAGE_VERIFIED' | 'REALTIME_AUDITED';
    crossSourceValidation?: {
      priceDivergencePercent: string;
      confidenceScore: string;
      validationMethod: string;
      primaryPrice: number;
      secondaryPrice: number;
      sourcesAudited: string[];
    };
  };
}

export interface HistoricalPoint {
  period: string; // e.g. "2023 Q1", "2023 Q2" ...
  debtRatio: number;
  cashRatio: number;
  impureRatio: number;
  tangibleRatio: number;
  marketCap: number;
  price: number;
  status: ComplianceStatus;
}

export interface WatchlistItem {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  status: ComplianceStatus;
  debtRatio: number;
  purificationFactor: number;
  addedAt: string;
}

export interface AIAuditAnalysis {
  ticker: string;
  companyName: string;
  summary: string;
  sectorAudit: string;
  debtStructureAnalysis: string;
  impureRevenueBreakdown: string;
  purificationGuidance: string;
  scholarlyConsensus: string;
  riskFactors: string[];
  recommendation: 'PASS' | 'FAIL' | 'REQUIRES_PURIFICATION';
  generatedAt: string;
}
