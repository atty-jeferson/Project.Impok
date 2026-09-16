import {
  CalculationInputs,
  CalculationResults,
  GoalPlannerInputs,
  GoalPlannerResults,
  MonthlyRecord,
  YearlyRecord,
  Mp2AccountLadderItem,
} from '../types/mp2';
import { 
  getDividendRateForYear, 
  getInflationRateForYear, 
  LATEST_DECLARED_RATE 
} from './rateResolver';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DEFAULT_CALCULATION_INPUTS: CalculationInputs = {
  startingAmount: 10000,
  monthlyContribution: 5000,
  contributionPattern: 'fixed_monthly',
  annualIncreaseRatePercent: 5,
  lumpSumMonth: 1, // Default January for maximum dividend eligibility
  lumpSumAmount: 20000,
  assumedDividendRate: 7.12,
  rateAssumptionMode: 'latest_declared',
  dividendTreatment: 'reinvest',
  projectionYears: 5,
  annualInflationRate: 3.0,
  startYear: 2024,
};

/**
 * Validates and sanitizes calculation inputs.
 */
export function validateInputs(inputs: Partial<CalculationInputs>): {
  sanitized: CalculationInputs;
  errors: string[];
} {
  const errors: string[] = [];

  let startingAmount = Number(inputs.startingAmount);
  if (isNaN(startingAmount) || startingAmount < 0) {
    errors.push('Initial savings must be 0 or greater');
    startingAmount = 0;
  }

  let monthlyContribution = Number(inputs.monthlyContribution);
  if (isNaN(monthlyContribution) || monthlyContribution < 0) {
    errors.push('Monthly contribution must be 0 or greater');
    monthlyContribution = 0;
  }

  let assumedDividendRate = Number(inputs.assumedDividendRate);
  if (isNaN(assumedDividendRate) || assumedDividendRate < 0) {
    errors.push('Assumed dividend rate cannot be negative');
    assumedDividendRate = 6.50;
  } else if (assumedDividendRate > 25) {
    errors.push('Assumed dividend rate exceeds historical boundaries (max 25%)');
    assumedDividendRate = 25;
  }

  let projectionYears = Math.round(Number(inputs.projectionYears));
  if (isNaN(projectionYears) || projectionYears < 1) {
    errors.push('Projection years must be at least 1');
    projectionYears = 5;
  } else if (projectionYears > 30) {
    errors.push('Projection years capped at 30 years');
    projectionYears = 30;
  }

  let annualInflationRate = Number(inputs.annualInflationRate);
  if (isNaN(annualInflationRate)) {
    annualInflationRate = 3.0;
  } else if (annualInflationRate < -5 || annualInflationRate > 30) {
    errors.push('Inflation rate must be between -5% and 30%');
    annualInflationRate = Math.min(30, Math.max(-5, annualInflationRate));
  }

  let annualIncreaseRatePercent = Number(inputs.annualIncreaseRatePercent || 0);
  if (isNaN(annualIncreaseRatePercent) || annualIncreaseRatePercent < 0) {
    annualIncreaseRatePercent = 0;
  } else if (annualIncreaseRatePercent > 50) {
    annualIncreaseRatePercent = 50;
  }

  let lumpSumMonth = Math.round(Number(inputs.lumpSumMonth || 1));
  if (isNaN(lumpSumMonth) || lumpSumMonth < 1 || lumpSumMonth > 12) {
    lumpSumMonth = 1;
  }

  let lumpSumAmount = Number(inputs.lumpSumAmount || 0);
  if (isNaN(lumpSumAmount) || lumpSumAmount < 0) {
    lumpSumAmount = 0;
  }

  let startYear = Math.round(Number(inputs.startYear || 2024));
  if (isNaN(startYear) || startYear < 2011 || startYear > 2050) {
    startYear = 2024;
  }

  const sanitized: CalculationInputs = {
    startingAmount,
    monthlyContribution,
    contributionPattern: inputs.contributionPattern || 'fixed_monthly',
    annualIncreaseRatePercent,
    lumpSumMonth,
    lumpSumAmount,
    customMonthlyContributions: inputs.customMonthlyContributions,
    customAnnualRates: inputs.customAnnualRates,
    assumedDividendRate,
    dividendTreatment: inputs.dividendTreatment === 'annual_payout' ? 'annual_payout' : 'reinvest',
    projectionYears,
    annualInflationRate,
    startYear,
    rateAssumptionMode: inputs.rateAssumptionMode || 'latest_declared',
    customProjectionRate: inputs.customProjectionRate,
  };

  return { sanitized, errors };
}

/**
 * Calculates month-by-month and year-by-year MP2 projections
 * using official Pag-IBIG month-weighted Average Monthly Balance (AMB) rules.
 * 
 * Formula:
 * Annual Dividend = (Beginning Balance × Rate) + Σ [Monthly Remittance × (13 - Month#) / 12 × Rate]
 */
export function calculateMp2Projection(rawInputs: CalculationInputs): CalculationResults {
  const { sanitized: inputs, errors: validationErrors } = validateInputs(rawInputs);

  const {
    startingAmount,
    monthlyContribution,
    contributionPattern,
    annualIncreaseRatePercent = 0,
    lumpSumMonth = 1,
    lumpSumAmount = 0,
    customMonthlyContributions,
    customAnnualRates,
    assumedDividendRate,
    dividendTreatment,
    projectionYears,
    annualInflationRate,
    startYear,
  } = inputs;

  const inflationDecimal = annualInflationRate / 100;
  const totalMonths = projectionYears * 12;

  const monthlyRecords: MonthlyRecord[] = [];
  const yearlyRecords: YearlyRecord[] = [];

  // Cash flow array for genuine money-weighted return (XIRR) calculation
  // Negative = cash invested by member, Positive = cash received by member
  const cashFlows: { month: number; amount: number }[] = [];

  let currentBalance = startingAmount;
  let cumulativeContributions = startingAmount;
  let cumulativeDividendsEarned = 0;
  let cumulativeDividendsPaidOut = 0;

  if (startingAmount > 0) {
    cashFlows.push({ month: 0, amount: -startingAmount });
  }

  let cumulativeInflationDeflator = 1;

  for (let yearIdx = 0; yearIdx < projectionYears; yearIdx++) {
    const yearNumber = yearIdx + 1;
    const calendarYear = startYear + yearIdx;
    const yearStartBalance = currentBalance;
    let yearContributions = 0;

    // Check if custom rate specified for this year slot
    const customRateOverride = (customAnnualRates && customAnnualRates[yearIdx] !== undefined && !isNaN(customAnnualRates[yearIdx]))
      ? Math.max(0, customAnnualRates[yearIdx])
      : undefined;

    // Resolve dividend rate deterministically for this calendar year
    const resolvedDividend = getDividendRateForYear(
      calendarYear,
      assumedDividendRate,
      inputs.rateAssumptionMode || 'latest_declared',
      customRateOverride
    );
    const currentYearRate = resolvedDividend.rate;
    const rateDecimal = currentYearRate / 100;

    // Resolve inflation rate deterministically for this calendar year
    const resolvedInflation = getInflationRateForYear(calendarYear, annualInflationRate);
    const yearInflationRate = resolvedInflation.rate;
    cumulativeInflationDeflator *= (1 + yearInflationRate / 100);

    // Determine monthly contribution base for this year
    let monthlyRateForYear = monthlyContribution;
    if (contributionPattern === 'increasing_annually' && annualIncreaseRatePercent > 0) {
      monthlyRateForYear = monthlyContribution * Math.pow(1 + annualIncreaseRatePercent / 100, yearIdx);
    }

    const yearMonthlyRecords: MonthlyRecord[] = [];

    // Beginning of year balance earns full 12 months dividend
    const beginningBalanceDividend = yearStartBalance * rateDecimal;

    // Month by month processing for this year
    for (let m = 1; m <= 12; m++) {
      const globalMonthIdx = yearIdx * 12 + m;
      let monthContribution = 0;

      if (contributionPattern === 'custom_monthly' && customMonthlyContributions && customMonthlyContributions[globalMonthIdx - 1] !== undefined) {
        monthContribution = Math.max(0, customMonthlyContributions[globalMonthIdx - 1]);
      } else if (contributionPattern === 'lump_sum_annual') {
        monthContribution = (m === lumpSumMonth) ? (lumpSumAmount > 0 ? lumpSumAmount : monthlyContribution * 12) : 0;
      } else if (contributionPattern === 'monthly_plus_lump') {
        monthContribution = monthlyRateForYear + (m === lumpSumMonth ? lumpSumAmount : 0);
      } else {
        monthContribution = monthlyRateForYear;
      }

      yearContributions += monthContribution;
      cumulativeContributions += monthContribution;

      if (monthContribution > 0) {
        cashFlows.push({ month: globalMonthIdx, amount: -monthContribution });
      }

      // Official Pag-IBIG Dividend computation for monthly remittance:
      // Remittance in month m stays for (13 - m) months in the calendar year
      const monthsRemainingInYear = 13 - m;
      const monthContributionDividend = monthContribution * (monthsRemainingInYear / 12) * rateDecimal;

      const record: MonthlyRecord = {
        monthIndex: globalMonthIdx,
        yearNumber,
        monthOfYear: m,
        monthName: MONTH_NAMES[m - 1],
        contribution: monthContribution,
        cumulativeContribution: cumulativeContributions,
        beginningBalance: currentBalance,
        dividendRateAssumed: currentYearRate,
        estimatedMonthlyDividend: monthContributionDividend,
        endingBalance: currentBalance + monthContribution
      };

      currentBalance += monthContribution;
      yearMonthlyRecords.push(record);
      monthlyRecords.push(record);
    }

    // Total year dividend = Beginning Balance Dividend + Month-weighted Contribution Dividends
    const contributionsDividend = yearMonthlyRecords.reduce((sum, r) => sum + r.estimatedMonthlyDividend, 0);
    const yearDividendEarned = beginningBalanceDividend + contributionsDividend;
    cumulativeDividendsEarned += yearDividendEarned;

    let annualPayoutAmount = 0;
    let reinvestedDividend = 0;
    if (dividendTreatment === 'annual_payout') {
      annualPayoutAmount = yearDividendEarned;
      cumulativeDividendsPaidOut += annualPayoutAmount;
      // Balance remains as contributions sum only (no reinvestment)
      // Member receives positive cash flow at end of year
      const payoutMonth = (yearIdx + 1) * 12;
      cashFlows.push({ month: payoutMonth, amount: annualPayoutAmount });
    } else {
      // Reinvested: credited to balance at year end
      reinvestedDividend = yearDividendEarned;
      currentBalance += yearDividendEarned;
    }

    const totalAccumulatedValue = currentBalance;
    const realValueInflationAdjusted = totalAccumulatedValue / cumulativeInflationDeflator;
    const effectiveYield = yearStartBalance + (yearContributions / 2) > 0 
      ? (yearDividendEarned / (yearStartBalance + (yearContributions / 2))) * 100 
      : 0;

    yearlyRecords.push({
      year: yearNumber,
      calendarYear,
      beginningBalance: yearStartBalance,
      annualContributions: yearContributions + (yearIdx === 0 ? startingAmount : 0),
      cumulativeContributions,
      dividendRate: currentYearRate,
      dividendStatus: resolvedDividend.status,
      dividendSource: resolvedDividend.sourceTitle || resolvedDividend.explanation,
      isHistoricalDividend: resolvedDividend.isHistorical,
      inflationRate: yearInflationRate,
      inflationStatus: resolvedInflation.status,
      dividendEarned: yearDividendEarned,
      cumulativeDividends: cumulativeDividendsEarned,
      reinvestedDividend,
      annualPayoutAmount,
      totalAccumulatedValue,
      realValueInflationAdjusted,
      effectiveYield,
      months: yearMonthlyRecords,
    });
  }

  // Final maturity cash flow (positive return of principal + remaining reinvested dividends)
  const finalMaturityValue = currentBalance;
  cashFlows.push({ month: totalMonths, amount: finalMaturityValue });

  const projectedMaturityValue = currentBalance + (dividendTreatment === 'annual_payout' ? cumulativeDividendsPaidOut : 0);
  const totalReturnPercentage = cumulativeContributions > 0
    ? ((cumulativeDividendsEarned) / cumulativeContributions) * 100
    : 0;

  // Simple CAGR on ending value vs cumulative contributions
  let annualizedReturnPercentage = 0;
  if (cumulativeContributions > 0 && projectionYears > 0 && projectedMaturityValue > 0) {
    if (startingAmount > 0 && monthlyContribution === 0) {
      annualizedReturnPercentage = (Math.pow(projectedMaturityValue / startingAmount, 1 / projectionYears) - 1) * 100;
    } else {
      annualizedReturnPercentage = (Math.pow(projectedMaturityValue / cumulativeContributions, 1 / projectionYears) - 1) * 100;
    }
  }

  // Genuine Money-Weighted Return (XIRR) based on actual monthly cash flow dates
  const moneyWeightedReturnPercentage = calculateMoneyWeightedReturn(cashFlows, totalMonths);

  // Purchasing power in today's pesos (using compounding year-aware inflation factors)
  const realValuePurchasingPower = projectedMaturityValue / cumulativeInflationDeflator;
  const purchasingPowerAdjustmentAmount = projectedMaturityValue - realValuePurchasingPower;
  const purchasingPowerAdjustmentPercent = projectedMaturityValue > 0
    ? (purchasingPowerAdjustmentAmount / projectedMaturityValue) * 100
    : 0;

  return {
    inputs,
    projectedMaturityValue: Math.round(projectedMaturityValue * 100) / 100,
    totalContributions: Math.round(cumulativeContributions * 100) / 100,
    totalDividendsEarned: Math.round(cumulativeDividendsEarned * 100) / 100,
    totalDividendsPaidOut: Math.round(cumulativeDividendsPaidOut * 100) / 100,
    totalReturnPercentage: Math.round(totalReturnPercentage * 100) / 100,
    annualizedReturnPercentage: Math.round(annualizedReturnPercentage * 100) / 100,
    moneyWeightedReturnPercentage: Math.round(moneyWeightedReturnPercentage * 100) / 100,
    realValuePurchasingPower: Math.round(realValuePurchasingPower * 100) / 100,
    purchasingPowerAdjustmentAmount: Math.round(purchasingPowerAdjustmentAmount * 100) / 100,
    purchasingPowerAdjustmentPercent: Math.round(purchasingPowerAdjustmentPercent * 100) / 100,
    yearlyRecords,
    monthlyRecords,
    calculationDate: new Date().toISOString(),
    validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
  };
}

/**
 * Calculates genuine money-weighted annualized rate of return (XIRR)
 * using Newton-Raphson method on exact monthly cash flows.
 * 
 * NPV(r_monthly) = Σ [ CF_t / (1 + r_monthly)^t ] = 0
 * Annualized Rate = (1 + r_monthly)^12 - 1
 */
export function calculateMoneyWeightedReturn(
  cashFlows: { month: number; amount: number }[],
  maxMonths: number
): number {
  if (cashFlows.length < 2 || maxMonths <= 0) return 0;

  const totalInflows = cashFlows.filter(c => c.amount > 0).reduce((s, c) => s + c.amount, 0);
  const totalOutflows = Math.abs(cashFlows.filter(c => c.amount < 0).reduce((s, c) => s + c.amount, 0));

  if (totalOutflows === 0 || totalInflows === 0) return 0;
  if (totalInflows === totalOutflows) return 0;

  // Initial estimate for monthly rate
  let r = Math.pow(totalInflows / totalOutflows, 1 / maxMonths) - 1;
  if (isNaN(r) || !isFinite(r)) r = 0.005; // 0.5% per month (~6.1% annual)

  // Newton-Raphson iteration with bounds safety
  const maxIterations = 60;
  const tolerance = 1e-7;

  for (let iter = 0; iter < maxIterations; iter++) {
    let npv = 0;
    let dNpv = 0; // derivative of NPV with respect to r

    for (const cf of cashFlows) {
      const discount = Math.pow(1 + r, cf.month);
      if (discount === 0 || isNaN(discount)) continue;

      npv += cf.amount / discount;
      dNpv -= (cf.month * cf.amount) / (discount * (1 + r));
    }

    if (Math.abs(npv) < tolerance) {
      break;
    }

    if (Math.abs(dNpv) < 1e-12) {
      // Derivative too flat; shift slightly
      r += (npv > 0 ? 0.001 : -0.001);
      continue;
    }

    const step = npv / dNpv;
    r -= step;

    // Bound check: monthly rate between -50% and +100%
    if (r < -0.5) r = -0.49;
    if (r > 1.0) r = 0.99;
  }

  // Convert monthly rate to effective annualized rate: (1 + r)^12 - 1
  const annualized = (Math.pow(1 + r, 12) - 1) * 100;
  return isNaN(annualized) || !isFinite(annualized) ? 0 : annualized;
}

/**
 * Educational helper comparing contribution timing in Pag-IBIG AMB model:
 * January vs December vs Fixed Monthly remittances for the same total annual deposit.
 */
export function compareTimingEffect(
  annualTotalAmount: number = 60000,
  dividendRate: number = 6.50
): {
  annualTotal: number;
  dividendRate: number;
  januaryLumpSumDividend: number;
  decemberLumpSumDividend: number;
  monthlyEvenDividend: number;
  timingAdvantageJanVsDec: number;
  timingAdvantageJanVsMonthly: number;
} {
  const rateDecimal = dividendRate / 100;

  // Pag-IBIG AMB Month-weighting: Deposit in month m gets (13 - m)/12 weight
  // January: month 1 => 12/12 = 1.0 (earns full rate)
  const januaryLumpSumDividend = annualTotalAmount * (12 / 12) * rateDecimal;

  // December: month 12 => 1/12 = 0.0833 (earns 1/12 rate)
  const decemberLumpSumDividend = annualTotalAmount * (1 / 12) * rateDecimal;

  // Even monthly remittances: (12 payments of annualTotal / 12)
  // Average weight of 12 months = (12 + 11 + ... + 1) / (12 * 12) = 78 / 144 = 6.5 / 12 = 0.5417
  const monthlyRemittance = annualTotalAmount / 12;
  let monthlyEvenDividend = 0;
  for (let m = 1; m <= 12; m++) {
    monthlyEvenDividend += monthlyRemittance * ((13 - m) / 12) * rateDecimal;
  }

  return {
    annualTotal: annualTotalAmount,
    dividendRate,
    januaryLumpSumDividend: Math.round(januaryLumpSumDividend * 100) / 100,
    decemberLumpSumDividend: Math.round(decemberLumpSumDividend * 100) / 100,
    monthlyEvenDividend: Math.round(monthlyEvenDividend * 100) / 100,
    timingAdvantageJanVsDec: Math.round((januaryLumpSumDividend - decemberLumpSumDividend) * 100) / 100,
    timingAdvantageJanVsMonthly: Math.round((januaryLumpSumDividend - monthlyEvenDividend) * 100) / 100,
  };
}

/**
 * Solves for the required monthly contribution to reach a financial goal,
 * or evaluates what an affordable monthly amount will achieve.
 */
export function solveRequiredContribution(goalInputs: GoalPlannerInputs): GoalPlannerResults {
  const {
    targetAmount,
    timeHorizonYears,
    initialAmount,
    assumedDividendRate,
    dividendTreatment,
    currentAffordableMonthly = 0,
  } = goalInputs;

  const validTarget = Math.max(0, targetAmount);
  const validYears = Math.max(1, Math.min(30, timeHorizonYears));
  const validInitial = Math.max(0, initialAmount);
  const validRate = Math.max(0, assumedDividendRate);

  // If already at or above target with initial amount alone
  const zeroMonthlyCalc = calculateMp2Projection({
    startingAmount: validInitial,
    monthlyContribution: 0,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: validRate,
    dividendTreatment,
    projectionYears: validYears,
    annualInflationRate: 3.0,
    startYear: 2026,
  });

  if (zeroMonthlyCalc.projectedMaturityValue >= validTarget) {
    return {
      targetAmount: validTarget,
      timeHorizonYears: validYears,
      initialAmount: validInitial,
      assumedDividendRate: validRate,
      requiredMonthlyContribution: 0,
      estimatedTotalContributions: validInitial,
      estimatedDividends: zeroMonthlyCalc.totalDividendsEarned,
      projectedMaturityValue: zeroMonthlyCalc.projectedMaturityValue,
      affordableMonthly: currentAffordableMonthly,
      affordableProjectedValue: currentAffordableMonthly > 0 ? calculateMp2Projection({
        startingAmount: validInitial,
        monthlyContribution: currentAffordableMonthly,
        contributionPattern: 'fixed_monthly',
        assumedDividendRate: validRate,
        dividendTreatment,
        projectionYears: validYears,
        annualInflationRate: 3.0,
        startYear: 2026,
      }).projectedMaturityValue : zeroMonthlyCalc.projectedMaturityValue,
      shortfallOrSurplusAmount: zeroMonthlyCalc.projectedMaturityValue - validTarget,
    };
  }

  // Bisection search for required monthly contribution
  let low = 0;
  let high = validTarget / (validYears * 12);
  high = Math.max(high * 3, 500000); // safety headroom

  let bestMonthly = 0;

  for (let iter = 0; iter < 45; iter++) {
    const mid = (low + high) / 2;
    const testResult = calculateMp2Projection({
      startingAmount: validInitial,
      monthlyContribution: mid,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: validRate,
      dividendTreatment,
      projectionYears: validYears,
      annualInflationRate: 3.0,
      startYear: 2026,
    });

    if (Math.abs(testResult.projectedMaturityValue - validTarget) < 1) {
      bestMonthly = mid;
      break;
    }

    if (testResult.projectedMaturityValue < validTarget) {
      low = mid;
    } else {
      high = mid;
      bestMonthly = mid;
    }
  }

  // Round up to nearest 10 pesos for practical real-world Pag-IBIG remittance
  const requiredMonthlyContribution = Math.ceil(bestMonthly / 10) * 10;

  const finalCalc = calculateMp2Projection({
    startingAmount: validInitial,
    monthlyContribution: requiredMonthlyContribution,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: validRate,
    dividendTreatment,
    projectionYears: validYears,
    annualInflationRate: 3.0,
    startYear: 2026,
  });

  // Calculate affordable scenario if provided
  let affordableProjectedValue = 0;
  let shortfallOrSurplusAmount = 0;
  if (currentAffordableMonthly > 0) {
    const affordableCalc = calculateMp2Projection({
      startingAmount: validInitial,
      monthlyContribution: currentAffordableMonthly,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: validRate,
      dividendTreatment,
      projectionYears: validYears,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    affordableProjectedValue = affordableCalc.projectedMaturityValue;
    shortfallOrSurplusAmount = affordableProjectedValue - validTarget;
  }

  return {
    targetAmount: validTarget,
    timeHorizonYears: validYears,
    initialAmount: validInitial,
    assumedDividendRate: validRate,
    requiredMonthlyContribution,
    estimatedTotalContributions: finalCalc.totalContributions,
    estimatedDividends: finalCalc.totalDividendsEarned,
    projectedMaturityValue: finalCalc.projectedMaturityValue,
    affordableMonthly: currentAffordableMonthly,
    affordableProjectedValue,
    shortfallOrSurplusAmount,
  };
}

/**
 * Calculates MP2 Ladder projection for a specific staggered account
 * incorporating its startYear and startMonth.
 */
export function calculateLadderAccountProjection(
  item: Omit<Mp2AccountLadderItem, 'projectedMaturityValue' | 'totalContributions' | 'totalDividends'>
): Mp2AccountLadderItem {
  const {
    id,
    name,
    accountNumberMask,
    startYear,
    startMonth = 1,
    initialDeposit,
    monthlyContribution,
    assumedRate,
    dividendTreatment,
    maturityYear,
    notes,
  } = item;

  // Total calendar months from startYear/startMonth to maturityYear/same month
  const totalMonths = (maturityYear - startYear) * 12;
  const projectionYears = Math.max(1, Math.round(totalMonths / 12));

  // Custom monthly schedule accounting for startMonth
  // Months before startMonth have 0 deposit in year 1
  const customMonthly: number[] = [];
  for (let m = 1; m <= totalMonths; m++) {
    // If within year 1 and month index is less than startMonth, 0 contribution
    if (m < startMonth) {
      customMonthly.push(0);
    } else {
      customMonthly.push(monthlyContribution);
    }
  }

  const res = calculateMp2Projection({
    startingAmount: initialDeposit,
    monthlyContribution: 0,
    contributionPattern: 'custom_monthly',
    customMonthlyContributions: customMonthly,
    assumedDividendRate: assumedRate,
    dividendTreatment,
    projectionYears,
    annualInflationRate: 3.0,
    startYear,
  });

  return {
    id,
    name,
    accountNumberMask,
    startYear,
    startMonth,
    initialDeposit,
    monthlyContribution,
    assumedRate,
    dividendTreatment,
    maturityYear,
    maturityMonth: startMonth,
    projectedMaturityValue: res.projectedMaturityValue,
    totalContributions: res.totalContributions,
    totalDividends: res.totalDividendsEarned,
    notes,
  };
}

/**
 * Generates Sensitivity Heatmap Matrix (Monthly Contribution vs Dividend Rate)
 */
export function generateSensitivityMatrix(
  startingAmount: number,
  years: number = 5,
  dividendTreatment: 'reinvest' | 'annual_payout' = 'reinvest',
  monthlyContributions: number[] = [3000, 5000, 7500, 10000, 15000, 20000],
  dividendRates: number[] = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0]
) {
  const matrix: { monthly: number; rates: { [rate: number]: { maturityValue: number; totalDividends: number } } }[] = [];

  for (const monthly of monthlyContributions) {
    const row: { [rate: number]: { maturityValue: number; totalDividends: number } } = {};
    for (const rate of dividendRates) {
      const res = calculateMp2Projection({
        startingAmount,
        monthlyContribution: monthly,
        contributionPattern: 'fixed_monthly',
        assumedDividendRate: rate,
        dividendTreatment,
        projectionYears: years,
        annualInflationRate: 3.0,
        startYear: 2026,
      });
      row[rate] = {
        maturityValue: res.projectedMaturityValue,
        totalDividends: res.totalDividendsEarned,
      };
    }
    matrix.push({ monthly, rates: row });
  }

  return {
    monthlyContributions,
    dividendRates,
    matrix,
  };
}
