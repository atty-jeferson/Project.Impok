import { CalculationResults, CalculationInputs } from '../types/mp2';

/**
 * Exports projection results as a formatted CSV file
 */
export function exportResultsToCsv(results: CalculationResults, filename = 'mp2-projection-schedule.csv'): void {
  const lines: string[] = [];

  // Header summary
  lines.push('PHILIPPINE PAG-IBIG MP2 FINANCIAL PROJECTION REPORT');
  lines.push(`Generated On,"${new Date().toLocaleDateString('en-PH', { dateStyle: 'full' })}"`);
  lines.push(`Starting Amount,"₱${results.inputs.startingAmount.toLocaleString('en-PH')}"`);
  lines.push(`Monthly Contribution,"₱${results.inputs.monthlyContribution.toLocaleString('en-PH')}"`);
  lines.push(`Dividend Treatment,"${results.inputs.dividendTreatment === 'reinvest' ? 'Compounded (Reinvested)' : 'Annual Dividend Payout'}"`);
  lines.push(`Assumed Dividend Rate,"${results.inputs.assumedDividendRate.toFixed(2)}%"`);
  lines.push(`Assumed Inflation Rate,"${results.inputs.annualInflationRate.toFixed(2)}%"`);
  lines.push(`Projection Horizon,"${results.inputs.projectionYears} Years"`);
  lines.push(`Projected Maturity Value,"₱${results.projectedMaturityValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}"`);
  lines.push(`Total Contributions,"₱${results.totalContributions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}"`);
  lines.push(`Total Estimated Dividends,"₱${results.totalDividendsEarned.toLocaleString('en-PH', { minimumFractionDigits: 2 })}"`);
  lines.push(`Real Value (Today's Purchasing Power),"₱${results.realValuePurchasingPower.toLocaleString('en-PH', { minimumFractionDigits: 2 })}"`);
  lines.push('');

  // Year-by-year table
  lines.push('YEAR-BY-YEAR SUMMARY');
  lines.push('Year,Calendar Year,Annual Contributions,Cumulative Contributions,Dividend Earned,Cumulative Dividends,Annual Payout,Ending Balance,Real Value (Today\'s Pesos)');
  
  results.yearlyRecords.forEach(r => {
    lines.push([
      r.year,
      r.calendarYear || '-',
      r.annualContributions.toFixed(2),
      r.cumulativeContributions.toFixed(2),
      r.dividendEarned.toFixed(2),
      r.cumulativeDividends.toFixed(2),
      r.annualPayoutAmount.toFixed(2),
      r.totalAccumulatedValue.toFixed(2),
      r.realValueInflationAdjusted.toFixed(2)
    ].join(','));
  });

  lines.push('');
  lines.push('DISCLAIMER');
  lines.push('"This projection is an estimate for educational and planning purposes only. Actual MP2 dividends depend on official rates declared by Pag-IBIG Fund. Not official Pag-IBIG calculator."');

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(lines.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Encodes scenario parameters into URL query string for sharing
 */
export function encodeScenarioToUrl(inputs: CalculationInputs): string {
  const params = new URLSearchParams();
  params.set('sa', inputs.startingAmount.toString());
  params.set('mc', inputs.monthlyContribution.toString());
  params.set('rate', inputs.assumedDividendRate.toString());
  params.set('tx', inputs.dividendTreatment);
  params.set('yr', inputs.projectionYears.toString());
  params.set('inf', inputs.annualInflationRate.toString());
  params.set('pat', inputs.contributionPattern);
  if (inputs.annualIncreaseRatePercent) {
    params.set('inc', inputs.annualIncreaseRatePercent.toString());
  }
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Decodes scenario parameters from current URL if present
 */
export function decodeScenarioFromUrl(): Partial<CalculationInputs> | null {
  if (typeof window === 'undefined') return null;
  const search = window.location.search;
  if (!search) return null;

  try {
    const params = new URLSearchParams(search);
    const sa = params.get('sa');
    const mc = params.get('mc');
    const rate = params.get('rate');
    const tx = params.get('tx');
    const yr = params.get('yr');
    const inf = params.get('inf');
    const pat = params.get('pat');
    const inc = params.get('inc');

    if (!sa && !mc && !rate) return null;

    return {
      startingAmount: sa ? parseFloat(sa) : undefined,
      monthlyContribution: mc ? parseFloat(mc) : undefined,
      assumedDividendRate: rate ? parseFloat(rate) : undefined,
      dividendTreatment: (tx === 'annual_payout' ? 'annual_payout' : 'reinvest'),
      projectionYears: yr ? parseInt(yr, 10) : undefined,
      annualInflationRate: inf ? parseFloat(inf) : undefined,
      contributionPattern: pat as any,
      annualIncreaseRatePercent: inc ? parseFloat(inc) : undefined,
    };
  } catch (err) {
    console.error('Failed to parse URL scenario params', err);
    return null;
  }
}

export const generateShareableUrl = encodeScenarioToUrl;
export const loadInputsFromUrl = decodeScenarioFromUrl;
