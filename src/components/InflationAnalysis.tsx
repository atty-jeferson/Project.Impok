import React, { useState } from 'react';
import { CalculationResults } from '../types/mp2';
import { Scale, Info, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface InflationAnalysisProps {
  results: CalculationResults;
  onUpdateInflation: (rate: number) => void;
}

export const InflationAnalysis: React.FC<InflationAnalysisProps> = ({ results, onUpdateInflation }) => {
  const { projectedMaturityValue, inputs } = results;
  const years = inputs.projectionYears;

  const [customInflation, setCustomInflation] = useState<number>(inputs.annualInflationRate);

  // Compute real purchasing power for arbitrary inflation rate
  const computeRealValue = (nominal: number, inflationRate: number, yrs: number) => {
    return nominal / Math.pow(1 + inflationRate / 100, yrs);
  };

  const lowInfReal = computeRealValue(projectedMaturityValue, 2.0, years);
  const baseInfReal = computeRealValue(projectedMaturityValue, 3.0, years);
  const highInfReal = computeRealValue(projectedMaturityValue, 5.0, years);
  const activeReal = computeRealValue(projectedMaturityValue, customInflation, years);

  const purchasingPowerAdjustment = projectedMaturityValue - activeReal;
  const adjustmentPercentage = projectedMaturityValue > 0 ? (purchasingPowerAdjustment / projectedMaturityValue) * 100 : 0;

  // Real spread = nominal dividend rate minus inflation rate
  const realNetSpread = inputs.assumedDividendRate - customInflation;

  return (
    <div id="inflation-analysis-section" className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E3EC]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-[#EAF3FA] text-[#0B5CAB]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F1E36]">
              Inflation & Purchasing Power Analysis
            </h2>
            <p className="text-xs text-slate-500">
              Understanding future nominal pesos in today's purchasing-power terms
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-600 font-semibold">Test inflation:</span>
          {[2.0, 3.0, 4.0, 5.0].map((rate) => (
            <button
              type="button"
              key={rate}
              onClick={() => {
                setCustomInflation(rate);
                onUpdateInflation(rate);
              }}
              className={`px-2.5 py-1 text-xs rounded-md font-mono-num font-bold transition cursor-pointer ${
                customInflation === rate
                  ? 'bg-[#0B5CAB] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {rate.toFixed(1)}%
            </button>
          ))}
        </div>
      </div>

      {/* Educational Clarification Banner */}
      <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 space-y-1 leading-relaxed">
        <div className="font-bold text-blue-900 flex items-center space-x-1.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Understanding Today's-Peso Equivalent</span>
        </div>
        <p>
          Inflation does <strong>not</strong> deduct money from your MP2 balance. Your actual account balance will reach the full projected nominal amount of <strong>₱{projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</strong>. The purchasing-power adjustment simply converts future pesos into what goods and services cost in today's terms.
        </p>
        <p className="text-slate-600 text-[11px] pt-1">
          Example: A future ₱500,000 balance has the purchasing power of approximately ₱430,000 in today's pesos assuming 3.0% average annual inflation. This difference is an economic purchasing-power adjustment, not an administrative fee or loss.
        </p>
      </div>

      {/* 3 Core Metric Cards - Premium Result Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/40">
        {/* Soft Atmospheric Radial Highlights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Nominal Future Value */}
          <div className="text-center md:pr-6 space-y-2">
            <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
              Future Nominal Balance
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono-num drop-shadow-md">
              ₱{projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-sky-100">
              Exact peso amount credited to your account after {years} years
            </p>
          </div>

          {/* Real Value */}
          <div className="text-center md:px-6 pt-6 md:pt-0 space-y-2">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Today's-Peso Equivalent
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono-num drop-shadow-md">
              ₱{activeReal.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-sky-100">
              Purchasing power equivalent at {customInflation.toFixed(1)}% annual inflation
            </p>
          </div>

          {/* Purchasing Power Adjustment */}
          <div className="text-center md:pl-6 pt-6 md:pt-0 space-y-2">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Purchasing-Power Adj.
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono-num drop-shadow-md">
              ₱{purchasingPowerAdjustment.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-sky-100">
              General price inflation adjustment over {years} years ({adjustmentPercentage.toFixed(1)}%)
            </p>
          </div>

        </div>
      </div>

      {/* Multi-Scenario Inflation Comparative Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#0F1E36]">
          Purchasing Power Across Historical Inflation Regimes
        </h3>
        
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Inflation Scenario</th>
                <th className="p-3">Assumed Inflation</th>
                <th className="p-3 font-mono-num">Real Net Spread</th>
                <th className="p-3 font-mono-num">Future Nominal Value</th>
                <th className="p-3 font-mono-num">Today's-Peso Equivalent</th>
                <th className="p-3">Purchasing-Power Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-medium text-slate-900">Low Inflation (BSP Lower Target)</td>
                <td className="p-3 font-mono-num">2.0%</td>
                <td className="p-3 font-mono-num font-bold text-emerald-700">+{(inputs.assumedDividendRate - 2.0).toFixed(2)}%</td>
                <td className="p-3 font-mono-num">₱{projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
                <td className="p-3 font-mono-num font-bold text-slate-900">₱{lowInfReal.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
                <td className="p-3 text-slate-500">₱{(projectedMaturityValue - lowInfReal).toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr className="bg-blue-50/40 hover:bg-blue-50/60 font-medium">
                <td className="p-3 text-blue-900 font-semibold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Base Case (Long-term Target)</span>
                </td>
                <td className="p-3 font-mono-num text-blue-900">3.0%</td>
                <td className="p-3 font-mono-num font-bold text-emerald-700">+{(inputs.assumedDividendRate - 3.0).toFixed(2)}%</td>
                <td className="p-3 font-mono-num text-blue-900">₱{projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
                <td className="p-3 font-mono-num font-bold text-blue-900">₱{baseInfReal.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
                <td className="p-3 text-blue-700">₱{(projectedMaturityValue - baseInfReal).toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-medium text-slate-900">Elevated Inflation (Supply-Side Shock)</td>
                <td className="p-3 font-mono-num">5.0%</td>
                <td className="p-3 font-mono-num font-bold text-emerald-700">+{(inputs.assumedDividendRate - 5.0).toFixed(2)}%</td>
                <td className="p-3 font-mono-num">₱{projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
                <td className="p-3 font-mono-num font-bold text-slate-900">₱{highInfReal.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
                <td className="p-3 text-slate-500">₱{(projectedMaturityValue - highInfReal).toLocaleString('en-PH', { maximumFractionDigits: 0 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Real Spread Insight */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
        <Sparkles className="w-4 h-4 text-[#0B5CAB] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#0F1E36]">Real Wealth Generation: </span>
          With an assumed dividend rate of <strong>{inputs.assumedDividendRate.toFixed(2)}%</strong> and inflation of <strong>{customInflation.toFixed(1)}%</strong>, your MP2 savings earn a positive real spread of <strong className="text-emerald-700">+{realNetSpread.toFixed(2)}% annually</strong>. Because Pag-IBIG dividends are 100% tax-free, this entire real spread accrues directly to your balance.
        </div>
      </div>

    </div>
  );
};
