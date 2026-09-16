import { AlternativeInvestmentOption } from '../types/mp2';

export const ALTERNATIVE_INVESTMENTS: AlternativeInvestmentOption[] = [
  {
    id: 'mp2',
    name: 'Pag-IBIG MP2 Savings (User Assumption)',
    description: 'Government-backed voluntary savings program with tax-free annual dividends and capital guarantee under RA 9679.',
    nominalAnnualReturn: 6.50,
    taxRatePercent: 0, // 100% Tax-Free under Republic Act No. 9679
    riskLevel: 'Very Low',
    liquidity: 'Low',
    guaranteed: true,
    rateType: 'illustrative_benchmark',
    notes: 'Capital is 100% government guaranteed. 5-year lock-in period. Actual annual dividend rates fluctuate based on Pag-IBIG Fund net income.'
  },
  {
    id: 'digital_bank',
    name: 'High-Yield Digital Bank (Promotional / Current)',
    description: 'Digital bank savings accounts with daily interest crediting (Maya, SeaBank, CIMB, Tonik).',
    nominalAnnualReturn: 4.50,
    taxRatePercent: 20, // 20% BIR Final Withholding Tax
    riskLevel: 'Low',
    liquidity: 'High',
    guaranteed: true,
    rateType: 'current_market_rate',
    volatilityWarning: 'Promotional interest rates are subject to change anytime by the issuing bank based on market interest rates.',
    notes: 'Insured by PDIC up to ₱500,000 per depositor. Instant liquidity. Net effective yield is 3.60% after 20% final withholding tax.'
  },
  {
    id: 'retail_treasury_bonds',
    name: 'Retail Treasury Bonds (BTr RTBs)',
    description: 'Philippine Bureau of the Treasury sovereign debt securities with quarterly coupon payments.',
    nominalAnnualReturn: 6.125,
    taxRatePercent: 20, // 20% final withholding tax on coupon interest
    riskLevel: 'Very Low',
    liquidity: 'Moderate',
    guaranteed: true,
    rateType: 'current_market_rate',
    volatilityWarning: 'Fixed coupon for the bond term, but secondary market sale prior to maturity exposes investor to interest rate price fluctuations.',
    notes: 'Full faith and credit of the Republic of the Philippines. 20% withholding tax on interest brings 6.125% gross down to 4.90% net.'
  },
  {
    id: 'time_deposit',
    name: 'Bank Time Deposit (Commercial / Thrift)',
    description: 'Fixed-term deposit with a regulated bank locking funds for a predetermined rate.',
    nominalAnnualReturn: 4.00,
    taxRatePercent: 20, // 20% tax if under 5 years; tax exempt if 5+ years under TRAIN
    riskLevel: 'Low',
    liquidity: 'Moderate',
    guaranteed: true,
    rateType: 'current_market_rate',
    volatilityWarning: 'Early termination results in penalty fees and interest downgrade.',
    notes: 'Protected by PDIC up to ₱500,000. 20% final withholding tax applies to tenors under 5 years.'
  },
  {
    id: 'traditional_savings',
    name: 'Traditional Commercial Bank Savings',
    description: 'Standard passbook or ATM account at major brick-and-mortar Philippine banks (BDO, BPI, Metrobank).',
    nominalAnnualReturn: 0.125,
    taxRatePercent: 20,
    riskLevel: 'Very Low',
    liquidity: 'High',
    guaranteed: true,
    rateType: 'current_market_rate',
    volatilityWarning: 'Guaranteed negative real return when inflation exceeds 0.1%. Significant purchasing power erosion over time.',
    notes: 'Near zero nominal growth. Useful purely for day-to-day transactional liquidity and emergency cash reserves.'
  },
  {
    id: 'psei_index',
    name: 'Philippine Stock Index (PSEi Historical Benchmark)',
    description: 'Broad equity index tracking top 30 publicly listed Philippine corporations (via UITF / ETF).',
    nominalAnnualReturn: 7.50,
    taxRatePercent: 0, // UITFs capital gains generally tax-exempt for individuals; fund pays internal transaction taxes & 1-1.5% trust fee
    riskLevel: 'Very High',
    liquidity: 'High',
    guaranteed: false,
    rateType: 'historical_average',
    volatilityWarning: 'HIGH RISK & VOLATILITY: Equities are NOT guaranteed. Multi-year drawdowns of -20% to -40% are common during market corrections. Not directly comparable to fixed capital savings.',
    notes: 'Long-term equity investment requires high risk tolerance and a multi-year horizon to withstand market cycles.'
  },
  {
    id: 'custom',
    name: 'Custom Asset Assumption',
    description: 'User-specified comparison vehicle (e.g., credit cooperative share capital, REITs, offshore index).',
    nominalAnnualReturn: 6.00,
    taxRatePercent: 0,
    riskLevel: 'Moderate',
    liquidity: 'Moderate',
    guaranteed: false,
    rateType: 'illustrative_benchmark',
    volatilityWarning: 'Returns depend on the specific credit risk and dividend policies of the selected institution.',
    notes: 'Adjust nominal return and withholding tax rate to model any alternative financial instrument.'
  }
];
