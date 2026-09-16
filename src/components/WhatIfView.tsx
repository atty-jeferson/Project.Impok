import React, { useState } from 'react';
import {
  HelpCircle,
  TrendingUp,
  Percent,
  Coins,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sliders,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { CalculationInputs, CalculationResults, ActiveTabType } from '../types/mp2';
import { calculateMp2Projection } from '../lib/mp2Calculator';

interface WhatIfViewProps {
  currentInputs: CalculationInputs;
  onApplyRate: (rate: number) => void;
  onApplyMonthly: (monthly: number) => void;
  onNavigate: (tab: ActiveTabType) => void;
}

export const WhatIfView: React.FC<WhatIfViewProps> = ({
  currentInputs,
  onApplyRate,
  onApplyMonthly,
  onNavigate,
}) => {
  const [selectedExtraSavings, setSelectedExtraSavings] = useState<number>(500);

  const RATES = [
    {
      rate: 5.0,
      label: 'Mababang Rate (Conservative)',
      tag: '5.00%',
      desc: 'Kapag bumaba ang kita ng Fund o lumamig ang ekonomiya',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300'
    },
    {
      rate: 6.0,
      label: 'Katamtaman (Moderate)',
      tag: '6.00%',
      desc: 'Malapit sa 2021 declared rate (6.00%)',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      rate: 6.5,
      label: 'Historical Baseline',
      tag: '6.50%',
      desc: 'Malapit sa 14-year historical average (6.44%)',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      rate: 7.0,
      label: 'Mataas (Optimistic)',
      tag: '7.00%',
      desc: 'Malapit sa 2022-2024 recent declared rates (7.03% – 7.15%)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      rate: 8.0,
      label: 'Peak Performance',
      tag: '8.00%',
      desc: 'Katulad ng all-time high noong 2017 (8.11%)',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  // Calculate outcomes for each rate
  const rateScenarios = RATES.map((r) => {
    const proj = calculateMp2Projection({
      ...currentInputs,
      assumedDividendRate: r.rate,
    });
    return {
      ...r,
      projectedValue: proj.projectedMaturityValue,
      dividends: proj.totalDividendsEarned,
      contributions: proj.totalContributions,
    };
  });

  // Calculate "What if I save ₱500 / ₱1,000 more?"
  const currentProjection = calculateMp2Projection(currentInputs);
  const plusProjection = calculateMp2Projection({
    ...currentInputs,
    monthlyContribution: currentInputs.monthlyContribution + selectedExtraSavings,
  });
  const extraGain = plusProjection.projectedMaturityValue - currentProjection.projectedMaturityValue;
  const extraTotalSaved = selectedExtraSavings * 12 * currentInputs.projectionYears;
  const extraDividendsGained = extraGain - extraTotalSaved;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F1E36]">
              What If? (Mga Posibleng Scenario)
            </h1>
            <p className="text-xs text-slate-500">
              Tingnan kung paano magbabago ang ipon mo kapag nagbago ang rate o kapag nagdagdag ka ng kaunti
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-md font-mono-num">
          Kasalukuyang assumption: {currentInputs.assumedDividendRate.toFixed(2)}%
        </span>
      </div>

      {/* QUESTION 1: WHAT IF THE DIVIDEND RATE IS LOWER OR HIGHER? */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#0F1E36] flex items-center space-x-2">
            <Percent className="w-4 h-4 text-[#0B5CAB]" />
            <span>Paano kung mas mababa o mas mataas ang dividend rate?</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dahil nagbabago ang MP2 dividends kada taon, narito ang magiging resulta sa iba't ibang rate:
          </p>
        </div>

        {/* Rate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {rateScenarios.map((scen) => {
            const isCurrent = Math.abs(currentInputs.assumedDividendRate - scen.rate) < 0.05;
            return (
              <div
                key={scen.rate}
                className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-50/50 border-[#0B5CAB] ring-2 ring-blue-100 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black font-mono-num px-2 py-0.5 rounded border ${scen.badgeClass}`}>
                      {scen.tag}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-[#0B5CAB] bg-blue-100 px-1.5 py-0.5 rounded">
                        Kasalukuyang Gamit
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {scen.label}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {scen.desc}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">
                      Posibleng Maturity Value
                    </div>
                    <div className="text-lg font-black text-[#0F1E36] font-mono-num mt-0.5">
                      ₱{scen.projectedValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                      +₱{scen.dividends.toLocaleString('en-PH', { maximumFractionDigits: 0 })} dividends
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => onApplyRate(scen.rate)}
                  className={`mt-4 w-full py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-100 text-[#0B5CAB] cursor-default'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isCurrent ? 'Aktibong Assumption' : `Gamitin ang ${scen.tag}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Clear Trust Statement */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>These are scenarios, not predictions. </strong>
            Ang mga numerong ito ay mga halimbawa lamang para makita ang epekto ng iba't ibang posibleng dividend rates. Ang aktwal na rate ay iaanunsyo ng Pag-IBIG Fund kada taon base sa net income nito.
          </div>
        </div>
      </div>

      {/* QUESTION 2: WHAT IF YOU SAVE ₱500 OR ₱1,000 MORE? */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#0F1E36] flex items-center space-x-2">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Paano kung magdagdag ka ng ₱500 o ₱1,000 bawat buwan?</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kahit maliit na dagdag buwan-buwan, malaki ang epekto dahil sa compound interest:
          </p>
        </div>

        {/* Amount Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">Subukang magdagdag ng:</span>
          {[200, 500, 1000, 2000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setSelectedExtraSavings(amt)}
              className={`px-3 py-1 text-xs font-bold rounded-lg font-mono-num transition cursor-pointer ${
                selectedExtraSavings === amt
                  ? 'bg-[#0B5CAB] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              +₱{amt.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Impact Comparison Card - Premium Result Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] p-6 sm:p-8 rounded-3xl shadow-xl mt-4 border border-blue-900/40">
          {/* Soft Atmospheric Radial Highlights */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            <div className="text-center md:pr-6 space-y-2">
              <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">Kasalukuyang Plano</div>
              <div className="text-3xl font-black text-white font-mono-num drop-shadow-md">
                ₱{currentProjection.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-sky-100">
                ₱{currentInputs.monthlyContribution.toLocaleString()}/buwan
              </div>
            </div>

            <div className="text-center md:px-6 pt-6 md:pt-0 space-y-2">
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Plano na may +₱{selectedExtraSavings.toLocaleString()}/buwan
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono-num drop-shadow-md">
                ₱{plusProjection.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-emerald-300 font-semibold">
                ₱{(currentInputs.monthlyContribution + selectedExtraSavings).toLocaleString()}/buwan
              </div>
            </div>

            <div className="text-center md:pl-6 pt-6 md:pt-0 space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Kabuuang Karagdagang Lilitaw</div>
              <div className="text-3xl font-black text-amber-400 font-mono-num drop-shadow-md">
                +₱{extraGain.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-sky-100 leading-tight">
                (₱{extraTotalSaved.toLocaleString()} sariling hulog + ₱{extraDividendsGained.toLocaleString('en-PH', { maximumFractionDigits: 0 })} dagdag na dividend!)
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => onApplyMonthly(currentInputs.monthlyContribution + selectedExtraSavings)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <span>Gamitin ang ₱{(currentInputs.monthlyContribution + selectedExtraSavings).toLocaleString()}/buwan sa Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ADVANCED BRIDGE */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-[#0B5CAB]" />
            <span>Gusto mo bang himayin pa nang mas malalim?</span>
          </div>
          <p className="text-xs text-slate-500">
            Tingnan ang detalyadong Sensitivity Matrix o magpatakbo ng 1,000-path Monte Carlo Simulation.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('sensitivity')}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition cursor-pointer"
          >
            Sensitivity Matrix
          </button>
          <button
            type="button"
            onClick={() => onNavigate('montecarlo')}
            className="px-3 py-1.5 rounded-lg bg-[#0B5CAB] hover:bg-[#155E9E] text-white text-xs font-semibold transition cursor-pointer"
          >
            Monte Carlo
          </button>
        </div>
      </div>

    </div>
  );
};
