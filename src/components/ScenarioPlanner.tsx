import React, { useState } from 'react';
import { CalculationInputs } from '../types/mp2';
import { calculateMp2Projection } from '../lib/mp2Calculator';
import { GitCompare, Clock, ArrowRight, Sparkles, TrendingUp, Check, AlertCircle } from 'lucide-react';

interface ScenarioPlannerProps {
  currentInputs: CalculationInputs;
  onApplyRate: (rate: number) => void;
}

export const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({ currentInputs, onApplyRate }) => {
  // Explicitly required illustrative scenarios: 5.0%, 6.0%, 6.5%, 7.0%, 8.0%
  const illustrativeRates = [5.0, 6.0, 6.5, 7.0, 8.0];

  const scenarioCalculations = illustrativeRates.map((rate) => {
    const calc = calculateMp2Projection({
      ...currentInputs,
      assumedDividendRate: rate,
    });
    return {
      rate,
      calc,
      isActive: Math.abs(currentInputs.assumedDividendRate - rate) < 0.01,
      label:
        rate === 5.0
          ? 'Conservative (Historical Low 2020 / Pandemic)'
          : rate === 6.0
          ? 'Moderate (Below Historical 14-yr Average)'
          : rate === 6.5
          ? 'Baseline (Near 14-year Average 6.44%)'
          : rate === 7.0
          ? 'Strong (Consistent with 2022–2024 Declared Rates)'
          : 'High Growth (Historical Peak 2017 / 8.11%)',
    };
  });

  // What-If Interactive Simulators State
  const [extraMonthlyContribution, setExtraMonthlyContribution] = useState<number>(2500);
  const [rateDropFrom, setRateDropFrom] = useState<number>(7.0);
  const [rateDropTo, setRateDropTo] = useState<number>(5.5);

  // What-if calculations
  const increasedContributionResult = calculateMp2Projection({
    ...currentInputs,
    monthlyContribution: currentInputs.monthlyContribution + extraMonthlyContribution,
  });
  const currentResult = calculateMp2Projection(currentInputs);
  const wealthGainedFromIncrease = increasedContributionResult.projectedMaturityValue - currentResult.projectedMaturityValue;

  const dividendDropResultA = calculateMp2Projection({ ...currentInputs, assumedDividendRate: rateDropFrom });
  const dividendDropResultB = calculateMp2Projection({ ...currentInputs, assumedDividendRate: rateDropTo });
  const dividendDropDifference = dividendDropResultA.projectedMaturityValue - dividendDropResultB.projectedMaturityValue;

  // Start Now vs Delay 1 Year
  const startNowResult = calculateMp2Projection({
    startingAmount: currentInputs.startingAmount,
    monthlyContribution: currentInputs.monthlyContribution,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: currentInputs.assumedDividendRate,
    dividendTreatment: 'reinvest',
    projectionYears: 5,
    annualInflationRate: 3.0,
    startYear: 2026,
  });

  const startLaterResult = calculateMp2Projection({
    startingAmount: currentInputs.startingAmount,
    monthlyContribution: currentInputs.monthlyContribution,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: currentInputs.assumedDividendRate,
    dividendTreatment: 'reinvest',
    projectionYears: 4,
    annualInflationRate: 3.0,
    startYear: 2027,
  });

  const delayOpportunityCost = startNowResult.projectedMaturityValue - startLaterResult.projectedMaturityValue;
  const delayDividendsLost = startNowResult.totalDividendsEarned - startLaterResult.totalDividendsEarned;

  return (
    <div id="scenario-planner-section" className="space-y-8">
      
      {/* 1. Header & Illustrative Scenarios Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#0F1E36]">
                Illustrative Rate Scenarios
              </h1>
              <p className="text-xs text-slate-500">
                Mathematical modeling across representative dividend yields — not predicted returns
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Your Active Assumption:</span>
            <span className="font-bold text-[#0B5CAB] font-mono-num">{currentInputs.assumedDividendRate.toFixed(2)}%</span>
          </div>
        </div>

        {/* Warning / Labeling Disclosure */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            <strong>Terminology Note:</strong> The scenarios below are <em>illustrative rate scenarios</em> designed for stress-testing and planning sensitivity. They are mathematical outputs based on your active contributions and are not promised, guaranteed, or predicted returns. Pag-IBIG declares rates annually based on net distributable earnings.
          </p>
        </div>

        {/* Scenarios Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Illustrative Scenario</th>
                <th className="py-3 px-4 text-center font-mono-num">Assumed Rate</th>
                <th className="py-3 px-4 text-right font-mono-num">Total Saved</th>
                <th className="py-3 px-4 text-right font-mono-num">Earned Dividends</th>
                <th className="py-3 px-4 text-right font-mono-num">Projected Maturity</th>
                <th className="py-3 px-4 text-right font-mono-num">Today's-Peso (3% Inf)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono-num">
              {scenarioCalculations.map((sc) => {
                const isSelected = sc.isActive;
                return (
                  <tr
                    key={sc.rate}
                    className={`transition ${
                      isSelected
                        ? 'bg-blue-50/70 font-semibold text-slate-900'
                        : 'hover:bg-slate-50/60 text-slate-700'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans font-medium">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-[#0B5CAB]' : 'bg-slate-300'
                          }`}
                        />
                        <span className={isSelected ? 'text-[#0B5CAB] font-bold' : 'text-slate-800'}>
                          {sc.rate.toFixed(1)}% Scenario
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5 ml-4">
                        {sc.label}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className={isSelected ? 'text-[#0B5CAB]' : 'text-slate-800'}>
                        {sc.rate.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-600">
                      ₱{sc.calc.totalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      +₱{sc.calc.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                      ₱{sc.calc.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-600">
                      ₱{sc.calc.realValuePurchasingPower.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    </td>

                    <td className="py-3.5 px-4 text-center font-sans">
                      {isSelected ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#0B5CAB] text-white text-xs font-bold shadow-xs">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onApplyRate(sc.rate)}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer"
                        >
                          Apply Rate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Interactive "What If?" Stress-Testing Simulator Panel - Premium Result Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-blue-900/40">
        {/* Soft Atmospheric Radial Highlights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">
              Interactive "What If?" Sensitivity Tests
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 mt-1">
              Real-time sensitivity analysis for key personal finance decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            {/* What If 1: Increase Monthly Contribution */}
            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  What if I save +₱{extraMonthlyContribution.toLocaleString('en-PH')} more per month?
                </div>
                <p className="text-[11px] text-sky-100 mt-1.5">
                  Increasing from ₱{currentInputs.monthlyContribution.toLocaleString('en-PH')} to ₱{(currentInputs.monthlyContribution + extraMonthlyContribution).toLocaleString('en-PH')}/month
                </p>
              </div>

              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                <div className="text-[11px] text-emerald-100 font-medium">Extra Maturity Value</div>
                <div className="text-2xl font-black text-emerald-400 font-mono-num drop-shadow-md">
                  +₱{wealthGainedFromIncrease.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-emerald-200 mt-1">
                  ₱{(extraMonthlyContribution * 12 * currentInputs.projectionYears).toLocaleString()} extra saved + dividends
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-sky-200 font-semibold">Test boost:</span>
                <div className="flex gap-1.5">
                  {[1000, 2500, 5000].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setExtraMonthlyContribution(val)}
                      className={`px-2 py-1 text-xs rounded-lg font-mono-num font-bold transition cursor-pointer border shadow-sm ${
                        extraMonthlyContribution === val
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-white/10 text-sky-100 border-white/15 hover:bg-white/20'
                      }`}
                    >
                      +₱{val / 1000}k
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* What If 2: Rate Fluctuations */}
            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                  What if dividends drop from {rateDropFrom.toFixed(1)}% to {rateDropTo.toFixed(1)}%?
                </div>
                <p className="text-[11px] text-sky-100 mt-1.5">
                  Assessing return variance if economic cycles compress yields
                </p>
              </div>

              <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-center">
                <div className="text-[11px] text-sky-200 font-medium">Potential Dividend Variance</div>
                <div className="text-2xl font-black text-white font-mono-num drop-shadow-md">
                  ₱{dividendDropDifference.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-sky-200 mt-1">
                  Principal remains 100% intact under RA 9679 guarantee
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-sky-200 font-semibold">
                <span>Change to:</span>
                <div className="flex gap-1.5">
                  {[5.0, 5.5, 6.0].map(r => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRateDropTo(r)}
                      className={`px-2 py-1 text-xs rounded-lg font-mono-num font-bold transition cursor-pointer border shadow-sm ${
                        rateDropTo === r
                          ? 'bg-sky-500 text-white border-sky-400'
                          : 'bg-white/10 text-sky-100 border-white/15 hover:bg-white/20'
                      }`}
                    >
                      {r.toFixed(1)}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* What If 3: Delay Cost */}
            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  What if I delay starting by 1 year?
                </div>
                <p className="text-[11px] text-sky-100 mt-1.5">
                  Starting today (5-yr horizon) vs waiting 12 months (4-yr horizon)
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                <div className="text-[11px] text-amber-200 font-medium">Lost Dividend Compounding</div>
                <div className="text-2xl font-black text-amber-400 font-mono-num drop-shadow-md">
                  -₱{delayDividendsLost.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-amber-200 mt-1">
                  Total maturity difference: ₱{delayOpportunityCost.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="text-[11px] text-sky-100 leading-relaxed pt-1">
                Delaying reduces compounding time, resulting in significantly lower tax-free earnings.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
