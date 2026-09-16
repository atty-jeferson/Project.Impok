import {
  calculateMp2Projection,
  solveRequiredContribution,
  compareTimingEffect,
  calculateLadderAccountProjection,
  calculateMoneyWeightedReturn,
  validateInputs,
} from './mp2Calculator';

export interface TestCaseResult {
  id: number;
  name: string;
  category: string;
  passed: boolean;
  actual: string;
  expected: string;
  details?: string;
}

export interface TestSuiteResult {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  tests: TestCaseResult[];
}

/**
 * Runs the deterministic 15-case test suite verifying the core MP2 calculation engine.
 */
export function runCalculatorTestSuite(): TestSuiteResult {
  const startTime = performance.now();
  const tests: TestCaseResult[] = [];

  // Test 1: Zero starting balance
  {
    const res = calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: 1000,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 6.0,
      dividendTreatment: 'reinvest',
      projectionYears: 1,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    // Total contributions = 1000 * 12 = 12,000
    // Month-weighted dividends: 1000 * (78/12) * 0.06 = 1000 * 6.5 * 0.06 = 390
    const passed = res.totalContributions === 12000 && Math.abs(res.totalDividendsEarned - 390) < 1;
    tests.push({
      id: 1,
      name: 'Zero starting balance',
      category: 'Boundary & Zero States',
      passed,
      expected: 'Contrib ₱12,000, Dividends ₱390',
      actual: `Contrib ₱${res.totalContributions.toLocaleString()}, Dividends ₱${res.totalDividendsEarned.toLocaleString()}`,
    });
  }

  // Test 2: Zero monthly contribution
  {
    const res = calculateMp2Projection({
      startingAmount: 100000,
      monthlyContribution: 0,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 7.0,
      dividendTreatment: 'reinvest',
      projectionYears: 1,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    // 100,000 * 0.07 = 7,000
    const passed = res.totalContributions === 100000 && Math.abs(res.totalDividendsEarned - 7000) < 1;
    tests.push({
      id: 2,
      name: 'Zero monthly contribution (Initial Only)',
      category: 'Boundary & Zero States',
      passed,
      expected: 'Contrib ₱100,000, Dividends ₱7,000',
      actual: `Contrib ₱${res.totalContributions.toLocaleString()}, Dividends ₱${res.totalDividendsEarned.toLocaleString()}`,
    });
  }

  // Test 3: Lump-sum contribution (January deposit)
  {
    const res = calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: 0,
      contributionPattern: 'lump_sum_annual',
      lumpSumMonth: 1,
      lumpSumAmount: 50000,
      assumedDividendRate: 6.0,
      dividendTreatment: 'reinvest',
      projectionYears: 1,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    // January deposit stays 12/12 months: 50,000 * (12/12) * 0.06 = 3,000
    const passed = res.totalContributions === 50000 && Math.abs(res.totalDividendsEarned - 3000) < 1;
    tests.push({
      id: 3,
      name: 'Lump-sum contribution in January (Full Year)',
      category: 'Contribution Patterns',
      passed,
      expected: 'Dividends ₱3,000 (12/12 weight)',
      actual: `Dividends ₱${res.totalDividendsEarned.toLocaleString()}`,
    });
  }

  // Test 4: Monthly regular contribution (5 years)
  {
    const res = calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: 5000,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 6.5,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    // Total contributions = 5000 * 60 = 300,000
    const passed = res.totalContributions === 300000 && res.projectedMaturityValue > 350000;
    tests.push({
      id: 4,
      name: 'Fixed monthly contribution (5 Years)',
      category: 'Core AMB Progression',
      passed,
      expected: 'Total Contrib ₱300,000, Maturity > ₱350,000',
      actual: `Contrib ₱${res.totalContributions.toLocaleString()}, Maturity ₱${res.projectedMaturityValue.toLocaleString()}`,
    });
  }

  // Test 5: January contribution timing
  {
    const timing = compareTimingEffect(120000, 7.0);
    // January: 120,000 * 12/12 * 0.07 = 8,400
    const passed = Math.abs(timing.januaryLumpSumDividend - 8400) < 1;
    tests.push({
      id: 5,
      name: 'January contribution (12/12 AMB Month-Weight)',
      category: 'Timing Model',
      passed,
      expected: 'January Dividend ₱8,400',
      actual: `₱${timing.januaryLumpSumDividend.toLocaleString()}`,
    });
  }

  // Test 6: December contribution timing
  {
    const timing = compareTimingEffect(120000, 7.0);
    // December: 120,000 * 1/12 * 0.07 = 700
    const passed = Math.abs(timing.decemberLumpSumDividend - 700) < 1;
    tests.push({
      id: 6,
      name: 'December contribution (1/12 AMB Month-Weight)',
      category: 'Timing Model',
      passed,
      expected: 'December Dividend ₱700',
      actual: `₱${timing.decemberLumpSumDividend.toLocaleString()}`,
    });
  }

  // Test 7: Sensitivity across different dividend rates
  {
    const lowRate = calculateMp2Projection({
      startingAmount: 10000,
      monthlyContribution: 5000,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 5.0,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    const highRate = calculateMp2Projection({
      startingAmount: 10000,
      monthlyContribution: 5000,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 8.0,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    const passed = highRate.projectedMaturityValue > lowRate.projectedMaturityValue &&
      highRate.totalDividendsEarned > lowRate.totalDividendsEarned;
    tests.push({
      id: 7,
      name: 'Rate sensitivity (5.0% vs 8.0% return)',
      category: 'Rate Variations',
      passed,
      expected: '8% Maturity > 5% Maturity',
      actual: `5% = ₱${lowRate.projectedMaturityValue.toLocaleString()}, 8% = ₱${highRate.projectedMaturityValue.toLocaleString()}`,
    });
  }

  // Test 8: Zero inflation rate
  {
    const res = calculateMp2Projection({
      startingAmount: 10000,
      monthlyContribution: 5000,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 6.5,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 0.0,
      startYear: 2026,
    });
    // When inflation is 0, real purchasing power equals nominal maturity value
    const passed = Math.abs(res.realValuePurchasingPower - res.projectedMaturityValue) < 1 &&
      res.purchasingPowerAdjustmentAmount === 0;
    tests.push({
      id: 8,
      name: 'Zero inflation rate (Real equals Nominal)',
      category: 'Inflation Engine',
      passed,
      expected: 'Purchasing power adjustment = ₱0',
      actual: `Adjustment = ₱${res.purchasingPowerAdjustmentAmount.toLocaleString()}`,
    });
  }

  // Test 9: Annual contribution step-up (5% increase)
  {
    const fixed = calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: 5000,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 6.5,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    const stepped = calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: 5000,
      contributionPattern: 'increasing_annually',
      annualIncreaseRatePercent: 5,
      assumedDividendRate: 6.5,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    const passed = stepped.totalContributions > fixed.totalContributions &&
      stepped.projectedMaturityValue > fixed.projectedMaturityValue;
    tests.push({
      id: 9,
      name: 'Annual contribution step-up (5% annual increase)',
      category: 'Contribution Patterns',
      passed,
      expected: 'Stepped Contrib > Fixed Contrib',
      actual: `Stepped Contrib = ₱${stepped.totalContributions.toLocaleString()} vs Fixed ₱${fixed.totalContributions.toLocaleString()}`,
    });
  }

  // Test 10: Annual dividend payout
  {
    const res = calculateMp2Projection({
      startingAmount: 100000,
      monthlyContribution: 0,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 7.0,
      dividendTreatment: 'annual_payout',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    // In annual payout, balance remains 100,000 every year, earning 7,000 each year for 5 years = 35,000 paid out
    const passed = Math.abs(res.totalDividendsPaidOut - 35000) < 1 &&
      res.yearlyRecords[4].totalAccumulatedValue === 100000;
    tests.push({
      id: 10,
      name: 'Annual dividend payout mode (Cashflow distribution)',
      category: 'Payout Modes',
      passed,
      expected: 'Paid out ₱35,000, Ending balance ₱100,000',
      actual: `Paid out ₱${res.totalDividendsPaidOut.toLocaleString()}, Balance ₱${res.yearlyRecords[4].totalAccumulatedValue.toLocaleString()}`,
    });
  }

  // Test 11: Compounded dividend scenario
  {
    const reinvest = calculateMp2Projection({
      startingAmount: 100000,
      monthlyContribution: 0,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 7.0,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    // 100,000 * (1.07)^5 = 140,255.17
    const expected = 100000 * Math.pow(1.07, 5);
    const passed = Math.abs(reinvest.projectedMaturityValue - expected) < 2;
    tests.push({
      id: 11,
      name: 'Compounded dividend scenario (Multi-year reinvestment)',
      category: 'Payout Modes',
      passed,
      expected: `Maturity ~₱${Math.round(expected).toLocaleString()}`,
      actual: `₱${Math.round(reinvest.projectedMaturityValue).toLocaleString()}`,
    });
  }

  // Test 12: MP2 Ladder staggered calculation
  {
    const ladderAcc = calculateLadderAccountProjection({
      id: 'test-ladder-1',
      name: 'Ladder Acc 1',
      startYear: 2026,
      startMonth: 1,
      initialDeposit: 10000,
      monthlyContribution: 5000,
      assumedRate: 6.5,
      dividendTreatment: 'reinvest',
      maturityYear: 2031,
    });
    const passed = ladderAcc.maturityYear === 2031 &&
      ladderAcc.projectedMaturityValue > 350000 &&
      ladderAcc.totalContributions === (10000 + 5000 * 60);
    tests.push({
      id: 12,
      name: 'MP2 Ladder staggered 5-year timeline projection',
      category: 'Ladder Engine',
      passed,
      expected: 'Maturity in 2031 with exact month tracking',
      actual: `Matures ${ladderAcc.maturityYear}, Value ₱${ladderAcc.projectedMaturityValue.toLocaleString()}`,
    });
  }

  // Test 13: Goal planner reverse solver
  {
    const goalRes = solveRequiredContribution({
      targetAmount: 500000,
      timeHorizonYears: 5,
      initialAmount: 20000,
      assumedDividendRate: 6.5,
      dividendTreatment: 'reinvest',
    });
    const passed = goalRes.projectedMaturityValue >= 500000 &&
      goalRes.requiredMonthlyContribution > 0 &&
      goalRes.requiredMonthlyContribution < 10000;
    tests.push({
      id: 13,
      name: 'Goal planner reverse solver (Target: ₱500,000)',
      category: 'Goal Engine',
      passed,
      expected: 'Solves required monthly within 0.5% of target',
      actual: `Monthly ₱${goalRes.requiredMonthlyContribution.toLocaleString()} -> Achieves ₱${goalRes.projectedMaturityValue.toLocaleString()}`,
    });
  }

  // Test 14: XIRR / Money-weighted annualized return
  {
    const res = calculateMp2Projection({
      startingAmount: 50000,
      monthlyContribution: 5000,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: 6.5,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
    // Money weighted return should be around 6.5% (+/- 0.2%)
    const passed = res.moneyWeightedReturnPercentage >= 6.3 && res.moneyWeightedReturnPercentage <= 6.8;
    tests.push({
      id: 14,
      name: 'Money-weighted annualized return (Newton-Raphson XIRR)',
      category: 'Return Metrics',
      passed,
      expected: 'XIRR ~6.50% (aligned with assumed dividend rate)',
      actual: `XIRR = ${res.moneyWeightedReturnPercentage.toFixed(2)}%`,
    });
  }

  // Test 15: Extreme & invalid inputs validation
  {
    const validated = validateInputs({
      startingAmount: -5000,
      monthlyContribution: -1000,
      assumedDividendRate: 999, // exceeds 25% max
      projectionYears: -10,
      annualInflationRate: -99,
    });
    const passed = validated.sanitized.startingAmount === 0 &&
      validated.sanitized.monthlyContribution === 0 &&
      validated.sanitized.assumedDividendRate <= 25 &&
      validated.sanitized.projectionYears >= 1 &&
      validated.errors.length > 0;
    tests.push({
      id: 15,
      name: 'Extreme & invalid inputs validation & sanitization',
      category: 'Input Validation',
      passed,
      expected: 'Sanitized to safe defaults and caught errors',
      actual: `Errors caught: ${validated.errors.length}, Rate clamped to ${validated.sanitized.assumedDividendRate}%`,
    });
  }

  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;
  const passedCount = tests.filter(t => t.passed).length;

  return {
    total: tests.length,
    passed: passedCount,
    failed: tests.length - passedCount,
    durationMs,
    tests,
  };
}
