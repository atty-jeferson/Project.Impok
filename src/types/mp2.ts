export type DividendTreatment = 'reinvest' | 'annual_payout';

export type AppMode = 'quick' | 'advanced';

export type DividendStatus = 'declared' | 'not_declared';
export type InflationStatus = 'historical' | 'projected';

export type RateAssumptionMode = 
  | 'latest_declared' 
  | 'historical_average' 
  | 'conservative' 
  | 'custom';

export type ActiveTabType = 
  | 'landing'
  | 'dashboard'
  | 'calculator' 
  | 'goal' 
  | 'strategies' 
  | 'ladder' 
  | 'scenarios' 
  | 'inflation' 
  | 'historical' 
  | 'sensitivity' 
  | 'montecarlo' 
  | 'compare' 
  | 'literacy'
  | 'how-it-works' 
  | 'facilitator'
  | 'methodology' 
  | 'sources' 
  | 'saved' 
  | 'settings';

export type ContributionPattern = 
  | 'fixed_monthly' 
  | 'increasing_annually' 
  | 'custom_monthly' 
  | 'lump_sum_annual' 
  | 'monthly_plus_lump';

export type DividendAssumptionType = 
  | 'conservative' 
  | 'base' 
  | 'optimistic' 
  | 'historical' 
  | 'custom';

export interface MonthlyRecord {
  monthIndex: number; // 1 to totalMonths
  yearNumber: number; // 1 to 5+
  monthOfYear: number; // 1 to 12 (1 = Jan, 12 = Dec)
  monthName: string;
  contribution: number;
  cumulativeContribution: number;
  beginningBalance: number;
  dividendRateAssumed: number;
  estimatedMonthlyDividend: number;
  endingBalance: number;
}

export interface YearlyRecord {
  year: number;
  calendarYear?: number;
  beginningBalance: number; // Balance at start of year
  annualContributions: number;
  cumulativeContributions: number;
  dividendRate: number; // Actual dividend rate used this year
  dividendStatus?: DividendStatus;
  dividendSource?: string;
  isHistoricalDividend?: boolean;
  inflationRate?: number;
  inflationStatus?: InflationStatus;
  dividendEarned: number;
  cumulativeDividends: number;
  reinvestedDividend: number; // Dividend added to balance (if compounded)
  annualPayoutAmount: number; // Dividend paid out (if annual payout chosen)
  totalAccumulatedValue: number; // Ending balance remaining in account
  realValueInflationAdjusted: number; // Purchasing power in today's pesos
  effectiveYield: number; // Percentage
  months: MonthlyRecord[];
}

export interface CalculationInputs {
  startingAmount: number;
  monthlyContribution: number;
  contributionPattern: ContributionPattern;
  annualIncreaseRatePercent?: number; // e.g. 5% step-up annually
  lumpSumMonth?: number; // 1 to 12
  lumpSumAmount?: number;
  customMonthlyContributions?: number[]; // array of 60 amounts
  customAnnualRates?: number[]; // custom rate per projection year e.g. [7.0, 7.0, 6.5, 6.5, 7.0]
  assumedDividendRate: number; // default annual dividend rate e.g. 7.12
  dividendTreatment: DividendTreatment;
  projectionYears: number; // default 5
  annualInflationRate: number; // e.g. 3.00
  startYear: number; // default start year e.g. 2024
  rateAssumptionMode?: RateAssumptionMode; // 'latest_declared' | 'historical_average' | 'conservative' | 'custom'
  customProjectionRate?: number;
}

export interface CalculationResults {
  inputs: CalculationInputs;
  projectedMaturityValue: number;
  totalContributions: number;
  totalDividendsEarned: number;
  totalDividendsPaidOut: number;
  totalReturnPercentage: number;
  annualizedReturnPercentage: number; // Simple CAGR on end balances
  moneyWeightedReturnPercentage: number; // Genuine Newton-Raphson XIRR on dated cashflows
  realValuePurchasingPower: number;
  purchasingPowerAdjustmentAmount: number; // Difference between future nominal and today's-peso purchasing power
  purchasingPowerAdjustmentPercent: number;
  yearlyRecords: YearlyRecord[];
  monthlyRecords: MonthlyRecord[];
  calculationDate?: string;
  validationErrors?: string[];
}

export interface GoalPlannerInputs {
  targetAmount: number;
  timeHorizonYears: number;
  initialAmount: number;
  assumedDividendRate: number;
  dividendTreatment: DividendTreatment;
  currentAffordableMonthly?: number;
}

export interface GoalPlannerResults {
  targetAmount: number;
  timeHorizonYears: number;
  initialAmount: number;
  assumedDividendRate: number;
  requiredMonthlyContribution: number;
  estimatedTotalContributions: number;
  estimatedDividends: number;
  projectedMaturityValue: number;
  affordableMonthly?: number;
  affordableProjectedValue?: number;
  shortfallOrSurplusAmount?: number;
}

export interface HistoricalRateRecord {
  year: number;
  dividendRate: number | null; // e.g. 7.12 or null if not yet declared
  regularSavingsRate?: number | null; // e.g. 6.62
  inflationRate: number | null; // BSP Philippine headline inflation e.g. 2.8 or null
  dividendStatus?: DividendStatus;
  inflationStatus?: InflationStatus;
  notes: string;
  sourceTitle: string;
  sourceUrl: string;
  publicationOrReport: string;
  pageNumber?: string;
  verificationDate: string;
  declarationDate: string;
  isEstimate?: boolean;
}

export interface Mp2AccountLadderItem {
  id: string;
  name: string;
  accountNumberMask?: string;
  startYear: number;
  startMonth: number;
  initialDeposit: number;
  monthlyContribution: number;
  assumedRate: number;
  dividendTreatment: DividendTreatment;
  maturityYear: number;
  maturityMonth?: number;
  projectedMaturityValue: number;
  totalContributions: number;
  totalDividends: number;
  notes?: string;
}

export interface AlternativeInvestmentOption {
  id: string;
  name: string;
  description: string;
  nominalAnnualReturn: number; // percentage
  taxRatePercent: number; // e.g. 20% for local bank interest
  riskLevel: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  liquidity: 'High' | 'Moderate' | 'Low';
  guaranteed: boolean;
  notes: string;
  rateType: 'historical_average' | 'current_market_rate' | 'illustrative_benchmark';
  volatilityWarning?: string;
}

export interface MonteCarloSimulationResult {
  simulationsCount: number;
  method: 'historical_bootstrap' | 'gaussian_parametric';
  mean: number;
  median: number;
  p5: number;
  p25: number;
  p75: number;
  p95: number;
  min: number;
  max: number;
  probabilityOfReachingGoal?: number;
  sampleDistribution: number[];
  sampledPathsCount: number;
}

export interface SavedScenario {
  id: string;
  title: string;
  createdAt: string;
  inputs: CalculationInputs;
  notes?: string;
}
