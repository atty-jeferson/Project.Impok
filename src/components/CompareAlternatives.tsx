import React, { useState } from 'react';
import { ALTERNATIVE_INVESTMENTS } from '../data/alternativesData';
import { CalculationInputs } from '../types/mp2';
import { calculateMp2Projection } from '../lib/mp2Calculator';
import { PiggyBank, AlertCircle } from 'lucide-react';

interface CompareAlternativesProps {
  currentInputs: CalculationInputs;
}

export const CompareAlternatives: React.FC<CompareAlternativesProps> = ({ currentInputs }) => {
  const [customNominal, setCustomNominal] = useState<number>(6.5);
  const [customTax, setCustomTax] = useState<number>(20); // 20% default BIR tax

  const { startingAmount, monthlyContribution, projectionYears, assumedDividendRate, annualInflationRate } = currentInputs;

  // Function to compute alternative 5-year future value given nominal return and tax rate
  const computeAlternative = (nominalRate: number, taxPercent: number) => {
    const netRate = nominalRate * (1 - taxPercent / 100);
    // Compound projection with net annual rate
    const res = calculateMp2Projection({
      startingAmount,
      monthlyContribution,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: netRate,
      dividendTreatment: 'reinvest',
      projectionYears,
      annualInflationRate,
      startYear: 2026,
    });
    return {
      netRate,
      projectedValue: res.projectedMaturityValue,
      realValue: res.realValuePurchasingPower,
      dividendsOrInterest: res.totalDividendsEarned,
    };
  };

  const taxableBankBreakevenGross = assumedDividendRate / (1 - 0.20);

  return (
    <div id="compare-alternatives-section" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-md bg-blue-50 text-[#0B5CAB]">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F1E36]">
              MP2 vs. Philippine Alternative Savings & Investments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Neutral comparative analysis accounting for taxes, inflation, and risk profiles
            </p>
          </div>
        </div>
      </div>

      {/* Break-even Opportunity Analysis Box - Premium Result Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] border border-blue-900/40 shadow-xl">
        {/* Soft Atmospheric Radial Highlights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-white/10 text-sky-200 border border-white/10 uppercase tracking-wider">
              Break-Even Yield Analysis
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm max-w-xl leading-snug">
              At what rate would a taxable investment need to earn to match MP2?
            </h3>
            <p className="text-xs text-sky-100 max-w-2xl leading-relaxed">
              Because MP2 is <strong className="text-emerald-400">100% tax-free</strong> under Republic Act No. 9679, while traditional deposits and bonds pay <strong className="text-amber-400">20% final withholding tax</strong> to the BIR:
            </p>
          </div>

          <div className="text-center p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner shrink-0 min-w-[240px]">
            <div className="text-xs text-sky-200 font-bold uppercase tracking-wider">Required Taxable Gross Return</div>
            <div className="text-4xl sm:text-5xl font-black text-white font-mono-num mt-2 drop-shadow-md">
              {taxableBankBreakevenGross.toFixed(2)}%
            </div>
            <div className="text-[11px] text-sky-100 mt-2 font-medium">
              To match MP2's <strong className="text-sky-300">{assumedDividendRate.toFixed(2)}%</strong> tax-free yield
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-md border border-[#D9E3EC]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#EAF3FA] border-b border-[#D9E3EC] text-[#123B63] font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Vehicle</th>
              <th className="py-3 px-3 text-center">Assumed Gross Return</th>
              <th className="py-3 px-3 text-center">Tax Treatment</th>
              <th className="py-3 px-3 text-center">Net Effective Yield</th>
              <th className="py-3 px-3 text-right">Projected 5-Yr Value</th>
              <th className="py-3 px-3 text-right">Real Value (Today's ₱)</th>
              <th className="py-3 px-3 text-center">Risk Level*</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-mono-num text-[#172B3A]">
            {ALTERNATIVE_INVESTMENTS.map((alt) => {
              const isMp2 = alt.id === 'mp2';
              const isCustom = alt.id === 'custom';

              const nominal = isMp2 ? assumedDividendRate : (isCustom ? customNominal : alt.nominalAnnualReturn);
              const tax = isCustom ? customTax : alt.taxRatePercent;
              const outcome = computeAlternative(nominal, tax);

              return (
                <tr key={alt.id} className={`hover:bg-[#F5F9FC] transition ${isMp2 ? 'bg-[#EAF3FA]/60 font-semibold' : ''}`}>
                  <td className="py-3.5 px-3 font-sans">
                    <div className="font-bold text-[#123B63] flex items-center space-x-1.5">
                      {isMp2 && <span className="w-2 h-2 rounded-full bg-[#0B5CAB]"></span>}
                      <span>{alt.name}</span>
                    </div>
                    <div className="text-[11px] font-normal text-[#526575] mt-0.5 max-w-xs line-clamp-1">
                      {alt.description}
                    </div>
                  </td>

                  {/* Assumed Gross Return */}
                  <td className="py-3.5 px-3 text-center">
                    {isCustom ? (
                      <input
                        type="number"
                        step="0.1"
                        value={customNominal}
                        onChange={(e) => setCustomNominal(parseFloat(e.target.value) || 0)}
                        className="w-14 px-1 py-0.5 text-center bg-white border border-[#CBD5E1] rounded font-mono-num text-xs font-bold text-[#172B3A]"
                      />
                    ) : (
                      <span className="font-bold text-[#172B3A]">{nominal.toFixed(2)}%</span>
                    )}
                  </td>

                  {/* Tax Treatment */}
                  <td className="py-3.5 px-3 text-center font-sans">
                    {tax === 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0FAF4] text-[#21865B] border border-[#B7E5C7]">
                        0% Tax-Free
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#F1F5F9] text-[#526575] border border-[#CBD5E1]">
                        {tax}% BIR Withholding
                      </span>
                    )}
                  </td>

                  {/* Net Effective Yield */}
                  <td className="py-3.5 px-3 text-center font-bold text-[#172B3A]">
                    {outcome.netRate.toFixed(2)}%
                  </td>

                  {/* Projected 5-Yr Final Value */}
                  <td className={`py-3.5 px-3 text-right font-bold ${isMp2 ? 'text-[#0B5CAB]' : 'text-[#172B3A]'}`}>
                    ₱{outcome.projectedValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                  </td>

                  {/* Real Value */}
                  <td className="py-3.5 px-3 text-right text-[#526575]">
                    ₱{outcome.realValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                  </td>

                  {/* Risk Level */}
                  <td className="py-3.5 px-3 text-center font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      alt.riskLevel === 'Very Low' ? 'bg-[#F0FAF4] text-[#21865B] border-[#B7E5C7]' :
                      alt.riskLevel === 'Low' ? 'bg-[#EAF3FA] text-[#0B5CAB] border-blue-200' :
                      alt.riskLevel === 'Moderate' ? 'bg-[#FDF9F0] text-[#A66B00] border-[#E8D4A8]' :
                      'bg-red-50 text-[#C53030] border-red-200'
                    }`}>
                      {alt.riskLevel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Disclaimers & Notes */}
      <div className="p-4 bg-[#F8FAFC] border border-[#D9E3EC] rounded-md space-y-2 text-xs text-[#526575]">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-[#A66B00] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#172B3A]">*Important Disclaimer:</strong> Risk classifications and yield assumptions are illustrative benchmarks for general educational comparison only, not personalized investment advice. Unlike Pag-IBIG MP2 (which has capital protection guaranteed by the Philippine Government under RA 9679), market-linked equities or mutual funds involve potential volatility and risk of capital loss. Past performance does not guarantee future results.
          </div>
        </div>
      </div>

    </div>
  );
};
