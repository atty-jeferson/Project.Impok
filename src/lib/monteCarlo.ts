import { MonteCarloSimulationResult } from '../types/mp2';
import { HISTORICAL_MP2_RATES } from '../data/historicalRates';

/**
 * Historical MP2 dividend rates available for bootstrap resampling
 */
const HISTORICAL_RATE_SAMPLES = HISTORICAL_MP2_RATES.map(r => r.dividendRate);

/**
 * Runs an Illustrative Monte Carlo Simulation with Historical Bootstrap Resampling
 * or Gaussian Parametric Distribution.
 * 
 * Historical Bootstrap:
 * - Uniformly resamples with replacement from the actual 2011-2024 declared dividend rates.
 * - Simulates 5,000 multi-year pathways.
 * - Reflects empirical historical performance without assuming a normal curve.
 * 
 * Notice: This is an illustrative scenario model based on historical rates,
 * NOT a forecast or prediction of future Pag-IBIG dividend declarations.
 */
export function runMonteCarloSimulation(
  startingAmount: number,
  monthlyContribution: number,
  years: number = 5,
  meanDividendRate: number = 6.64,
  standardDeviation: number = 0.85,
  dividendTreatment: 'reinvest' | 'annual_payout' = 'reinvest',
  targetGoalAmount?: number,
  simulationCount: number = 5000,
  method: 'historical_bootstrap' | 'gaussian_parametric' = 'historical_bootstrap'
): MonteCarloSimulationResult {
  const outcomes: number[] = new Array(simulationCount);

  // Box-Muller transform for Gaussian parametric option
  function randomNormal(mean: number, stdDev: number): number {
    let u1 = 0;
    let u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.max(0, mean + z0 * stdDev);
  }

  // Bootstrap sampling helper
  function sampleHistoricalRate(): number {
    const idx = Math.floor(Math.random() * HISTORICAL_RATE_SAMPLES.length);
    return HISTORICAL_RATE_SAMPLES[idx];
  }

  for (let s = 0; s < simulationCount; s++) {
    let currentBalance = startingAmount;
    let totalDividendsPaid = 0;

    for (let yr = 0; yr < years; yr++) {
      const annualRatePercent = method === 'historical_bootstrap'
        ? sampleHistoricalRate()
        : randomNormal(meanDividendRate, standardDeviation);

      const rateDecimal = annualRatePercent / 100;

      // Beginning balance earns full year
      const begDividend = currentBalance * rateDecimal;

      // Monthly contributions (assuming fixed monthly, Pag-IBIG AMB month weighting)
      // Remittance in month m gets (13 - m)/12 weight. Sum of (13-m)/12 for m=1..12 = 78/12 = 6.5
      const yearContributions = monthlyContribution * 12;
      const contributionsDividend = monthlyContribution * (78 / 12) * rateDecimal;

      const totalYearDividend = begDividend + contributionsDividend;

      if (dividendTreatment === 'annual_payout') {
        totalDividendsPaid += totalYearDividend;
        currentBalance += yearContributions;
      } else {
        currentBalance += yearContributions + totalYearDividend;
      }
    }

    const finalMaturity = currentBalance + (dividendTreatment === 'annual_payout' ? totalDividendsPaid : 0);
    outcomes[s] = Math.round(finalMaturity);
  }

  // Sort outcomes ascending
  outcomes.sort((a, b) => a - b);

  const getPercentile = (p: number) => {
    const idx = Math.min(Math.floor((p / 100) * simulationCount), simulationCount - 1);
    return outcomes[idx];
  };

  const p5 = getPercentile(5);
  const p25 = getPercentile(25);
  const median = getPercentile(50);
  const p75 = getPercentile(75);
  const p95 = getPercentile(95);
  const min = outcomes[0];
  const max = outcomes[simulationCount - 1];

  const sum = outcomes.reduce((acc, val) => acc + val, 0);
  const mean = Math.round(sum / simulationCount);

  let probabilityOfReachingGoal = 0;
  if (targetGoalAmount && targetGoalAmount > 0) {
    const successCount = outcomes.filter(val => val >= targetGoalAmount).length;
    probabilityOfReachingGoal = Math.round((successCount / simulationCount) * 1000) / 10;
  }

  // Sample 30 bins for distribution histogram visualization
  const binCount = 30;
  const binWidth = (max - min) / binCount || 1;
  const bins: number[] = new Array(binCount).fill(0);
  for (let i = 0; i < simulationCount; i++) {
    const b = Math.min(Math.floor((outcomes[i] - min) / binWidth), binCount - 1);
    bins[b]++;
  }

  return {
    simulationsCount: simulationCount,
    method,
    mean,
    median,
    p5,
    p25,
    p75,
    p95,
    min,
    max,
    probabilityOfReachingGoal,
    sampleDistribution: bins,
    sampledPathsCount: simulationCount,
  };
}
