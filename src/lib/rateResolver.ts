import { HISTORICAL_MP2_RATES, HISTORICAL_STATS } from '../data/historicalRates';
import { 
  DividendStatus, 
  InflationStatus, 
  RateAssumptionMode, 
  HistoricalRateRecord 
} from '../types/mp2';

export const LATEST_DECLARED_YEAR = 2025;
export const LATEST_DECLARED_RATE = 7.12; // 2025 official rate
export const DEFAULT_PROJECTION_INFLATION = 3.0; // 3.0% long-term BSP target midpoint

export interface ResolvedDividendRate {
  year: number;
  rate: number; // Effective rate for computation
  officialRate: number | null; // null if not yet declared
  status: DividendStatus;
  isHistorical: boolean;
  sourceTitle?: string;
  publicationOrReport?: string;
  declarationDate?: string;
  verificationDate?: string;
  notes?: string;
  assumptionMode?: RateAssumptionMode;
  explanation: string;
}

export interface ResolvedInflationRate {
  year: number;
  rate: number;
  officialRate: number | null;
  status: InflationStatus;
  isHistorical: boolean;
  source?: string;
  explanation: string;
}

export interface TimelineYearItem {
  yearIndex: number; // 0-based
  yearNumber: number; // 1-based (Year 1, Year 2...)
  calendarYear: number; // e.g. 2024, 2025
  dividend: ResolvedDividendRate;
  inflation: ResolvedInflationRate;
  hasCustomOverride: boolean;
}

/**
 * Returns the effective assumption rate based on the selected mode.
 */
export function getAssumptionRate(mode: RateAssumptionMode, customRate?: number): number {
  switch (mode) {
    case 'latest_declared':
      return LATEST_DECLARED_RATE; // 7.12%
    case 'historical_average':
      return HISTORICAL_STATS.averageDividend; // 6.67%
    case 'conservative':
      return 5.50;
    case 'custom':
      return typeof customRate === 'number' && !isNaN(customRate) ? Math.max(0, customRate) : LATEST_DECLARED_RATE;
    default:
      return LATEST_DECLARED_RATE;
  }
}

/**
 * Look up official record for a given calendar year if present in dataset.
 */
export function getHistoricalRecord(year: number): HistoricalRateRecord | undefined {
  return HISTORICAL_MP2_RATES.find(r => r.year === year);
}

/**
 * Resolves the dividend rate for a specific calendar year.
 * Deterministic:
 * - If declared in historical dataset (e.g. 2025 = 7.12%, 2024 = 7.15%), uses declared rate.
 * - If not declared (e.g. 2026, 2027) or future, uses the specified projection assumption.
 */
export function getDividendRateForYear(
  calendarYear: number,
  fallbackRate: number = LATEST_DECLARED_RATE,
  assumptionMode: RateAssumptionMode = 'latest_declared',
  customRateOverride?: number
): ResolvedDividendRate {
  // If user provided an explicit custom override for this specific projection slot
  if (typeof customRateOverride === 'number' && !isNaN(customRateOverride) && customRateOverride >= 0) {
    return {
      year: calendarYear,
      rate: customRateOverride,
      officialRate: null,
      status: 'not_declared',
      isHistorical: false,
      explanation: `Custom user assumption of ${customRateOverride.toFixed(2)}% applied for ${calendarYear}.`,
      assumptionMode: 'custom'
    };
  }

  const record = getHistoricalRecord(calendarYear);

  if (record && record.dividendRate !== null && record.dividendRate !== undefined && record.dividendStatus !== 'not_declared') {
    return {
      year: calendarYear,
      rate: record.dividendRate,
      officialRate: record.dividendRate,
      status: 'declared',
      isHistorical: true,
      sourceTitle: record.sourceTitle,
      publicationOrReport: record.publicationOrReport,
      declarationDate: record.declarationDate,
      verificationDate: record.verificationDate,
      notes: record.notes,
      explanation: `Using the published official MP2 rate for ${calendarYear} (${record.dividendRate.toFixed(2)}%).`
    };
  }

  // Not declared or future year
  const effectiveRate = fallbackRate;
  let explanation = '';
  if (calendarYear === 2026) {
    explanation = `2026 rate has not been declared yet. We're using your selected projection assumption of ${effectiveRate.toFixed(2)}%.`;
  } else {
    explanation = `Future projection year ${calendarYear}. Using your selected projection assumption of ${effectiveRate.toFixed(2)}%.`;
  }

  return {
    year: calendarYear,
    rate: effectiveRate,
    officialRate: null,
    status: 'not_declared',
    isHistorical: false,
    notes: record?.notes || `Official dividend declaration for ${calendarYear} is pending.`,
    assumptionMode,
    explanation
  };
}

/**
 * Resolves the inflation rate for a specific calendar year.
 */
export function getInflationRateForYear(
  calendarYear: number,
  fallbackInflation: number = DEFAULT_PROJECTION_INFLATION
): ResolvedInflationRate {
  const record = getHistoricalRecord(calendarYear);

  if (record && record.inflationRate !== null && record.inflationRate !== undefined && record.inflationStatus !== 'projected') {
    return {
      year: calendarYear,
      rate: record.inflationRate,
      officialRate: record.inflationRate,
      status: 'historical',
      isHistorical: true,
      source: 'Bangko Sentral ng Pilipinas (BSP) / PSA Official CPI Headline Inflation',
      explanation: `Official full-year Philippine headline inflation for ${calendarYear} (${record.inflationRate.toFixed(1)}%).`
    };
  }

  return {
    year: calendarYear,
    rate: fallbackInflation,
    officialRate: null,
    status: 'projected',
    isHistorical: false,
    source: 'BSP Medium-Term Inflation Target Assumption',
    explanation: `No official full-year inflation data yet for ${calendarYear}. Using projection assumption of ${fallbackInflation.toFixed(1)}%.`
  };
}

/**
 * Generates the full year-by-year timeline starting from the user's selected "Year I Started".
 */
export function generateMp2Timeline(
  startYear: number,
  projectionYears: number = 5,
  assumptionMode: RateAssumptionMode = 'latest_declared',
  customProjectionRate?: number,
  fallbackInflation: number = DEFAULT_PROJECTION_INFLATION,
  customAnnualRates?: number[]
): TimelineYearItem[] {
  const effectiveFallbackRate = getAssumptionRate(assumptionMode, customProjectionRate);
  const timeline: TimelineYearItem[] = [];

  for (let idx = 0; idx < projectionYears; idx++) {
    const calendarYear = startYear + idx;
    const customRate = customAnnualRates && customAnnualRates[idx] !== undefined && !isNaN(customAnnualRates[idx])
      ? customAnnualRates[idx]
      : undefined;

    const dividend = getDividendRateForYear(
      calendarYear, 
      effectiveFallbackRate, 
      assumptionMode, 
      customRate
    );
    const inflation = getInflationRateForYear(calendarYear, fallbackInflation);

    timeline.push({
      yearIndex: idx,
      yearNumber: idx + 1,
      calendarYear,
      dividend,
      inflation,
      hasCustomOverride: customRate !== undefined
    });
  }

  return timeline;
}
