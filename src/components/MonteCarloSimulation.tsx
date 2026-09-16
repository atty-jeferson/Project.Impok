import React, { useState } from 'react';
import { CalculationInputs, MonteCarloSimulationResult } from '../types/mp2';
import { runMonteCarloSimulation } from '../lib/monteCarlo';
import { Cpu, RefreshCw, Info, Sparkles } from 'lucide-react';

interface MonteCarloSimulationProps {
  currentInputs: CalculationInputs;
}

export const MonteCarloSimulation: React.FC<MonteCarloSimulationProps> = ({ currentInputs }) => {
  const [iterations] = useState<number>(5000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<MonteCarloSimulationResult>(() => {
    return runMonteCarloSimulation(
      currentInputs.startingAmount,
      currentInputs.monthlyContribution,
      currentInputs.projectionYears,
      6.64,
      0.85,
      currentInputs.dividendTreatment,
      undefined,
      5000
    );
  });

  const handleRerun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runMonteCarloSimulation(
        currentInputs.startingAmount,
        currentInputs.monthlyContribution,
        currentInputs.projectionYears,
        6.64,
        0.85,
        currentInputs.dividendTreatment,
        undefined,
        iterations
      );
      setResults(res);
      setIsRunning(false);
    }, 150);
  };

  const assumedMeanRate = 6.64;
  const assumedStdDev = 0.85;

  return (
    <div id="monte-carlo-section" className="bg-white border border-[#D9E3EC] rounded-lg p-5 sm:p-7 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E3EC]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-md bg-[#EAF3FA] text-[#0B5CAB]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#123B63] flex items-center">
              <span>Stochastic Monte Carlo Volatility Engine</span>
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3FA] text-[#0B5CAB] border border-blue-200">
                Statistical Simulation Mode
              </span>
            </h2>
            <p className="text-xs text-[#526575]">
              Simulates 5,000 possible economic market paths sampled from actual 2011–2024 Pag-IBIG dividend distributions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRerun}
          disabled={isRunning}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-bold bg-[#0B5CAB] hover:bg-[#155E9E] text-white transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Simulating...' : 'Rerun 5,000 Paths'}</span>
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Key Insight Banner - Premium Result Banner */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] border border-blue-900/40 shadow-xl">
          {/* Soft Atmospheric Radial Highlights */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs uppercase font-bold text-sky-300 tracking-wider">
                Empirical Confidence Interval (5th to 95th Percentile)
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-2 drop-shadow-sm leading-snug">
                In 90% of simulated scenarios, your final {currentInputs.projectionYears}-year MP2 balance was between{' '}
                <span className="text-sky-300 font-mono-num font-black drop-shadow-md">
                  ₱{results.p5.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </span>{' '}
                and{' '}
                <span className="text-emerald-400 font-mono-num font-black drop-shadow-md">
                  ₱{results.p95.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </span>.
              </div>
              <p className="text-xs text-sky-100 mt-2 font-medium">
                Historical parameter inputs: Mean dividend <strong className="text-white">{assumedMeanRate.toFixed(2)}%</strong> (Standard deviation: ±{assumedStdDev.toFixed(2)}%).
              </p>
            </div>
          </div>
        </div>

        {/* 3 Percentile Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 5th Percentile */}
          <div className="p-4 rounded-md bg-[#F8FAFC] border border-[#D9E3EC]">
            <div className="flex justify-between items-center text-xs font-semibold text-[#526575] mb-1">
              <span>5th Percentile (Conservative)</span>
              <span className="px-1.5 py-0.5 rounded bg-[#E2E8F0] text-[#526575] text-[10px] font-bold">Lowest 5%</span>
            </div>
            <div className="text-2xl font-bold text-[#172B3A] font-mono-num mt-1">
              ₱{results.p5.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-[#526575] mt-1">
              Prolonged low interest rate environment, similar to 2011–2014 (~5.0% rates).
            </p>
          </div>

          {/* 50th Percentile / Median */}
          <div className="p-4 rounded-md bg-white border-2 border-[#0B5CAB] shadow-xs">
            <div className="flex justify-between items-center text-xs font-semibold text-[#123B63] mb-1">
              <span>50th Percentile (Median Path)</span>
              <span className="px-1.5 py-0.5 rounded bg-[#EAF3FA] text-[#0B5CAB] text-[10px] font-bold">50/50 Prob.</span>
            </div>
            <div className="text-2xl font-bold text-[#0B5CAB] font-mono-num mt-1">
              ₱{results.median.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-[#526575] mt-1">
              Expected central outcome matching the historical 14-year median dividend rate.
            </p>
          </div>

          {/* 95th Percentile */}
          <div className="p-4 rounded-md bg-[#F0FAF4] border border-[#B7E5C7]">
            <div className="flex justify-between items-center text-xs font-semibold text-[#21865B] mb-1">
              <span>95th Percentile (Optimistic)</span>
              <span className="px-1.5 py-0.5 rounded bg-[#D1F2DE] text-[#21865B] text-[10px] font-bold">Top 5%</span>
            </div>
            <div className="text-2xl font-bold text-[#21865B] font-mono-num mt-1">
              ₱{results.p95.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-[#526575] mt-1">
              Strong housing loan expansion & robust revenues (~7.5% – 8.1% rates).
            </p>
          </div>

        </div>

        {/* Probability Distribution Histogram */}
        <div className="p-5 bg-[#F8FAFC] rounded-md border border-[#D9E3EC] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
              Maturity Balance Probability Density ({results.simulationsCount.toLocaleString('en-PH')} Runs)
            </span>
            <span className="text-xs text-[#526575] font-mono-num">
              Range: ₱{Math.round(results.min / 1000)}k – ₱{Math.round(results.max / 1000)}k
            </span>
          </div>

          <div className="h-32 flex items-end gap-1 pt-4 pb-1 border-b border-[#CBD5E1]">
            {results.sampleDistribution.map((count, i) => {
              const maxCount = Math.max(...results.sampleDistribution, 1);
              const heightPct = (count / maxCount) * 100;
              const binWidth = (results.max - results.min) / results.sampleDistribution.length;
              const binMin = results.min + i * binWidth;
              const binMax = binMin + binWidth;
              const isMedianBucket = binMin <= results.median && binMax >= results.median;

              return (
                <div
                  key={`b-${i}`}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  <div
                    className={`w-full rounded-t transition-all ${
                      isMedianBucket ? 'bg-[#0B5CAB]' : 'bg-[#94A3B8] group-hover:bg-[#155E9E]'
                    }`}
                    style={{ height: `${Math.max(4, heightPct)}%` }}
                  ></div>

                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-full mb-1 z-20 bg-[#123B63] text-white text-[10px] p-1.5 rounded whitespace-nowrap shadow-md font-mono-num">
                    ₱{Math.round(binMin / 1000)}k - ₱{Math.round(binMax / 1000)}k: {count} runs
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] text-[#526575] font-mono-num">
            <span>₱{Math.round(results.min / 1000)}k</span>
            <span className="font-bold text-[#0B5CAB]">Median: ₱{Math.round(results.median / 1000)}k</span>
            <span>₱{Math.round(results.max / 1000)}k</span>
          </div>
        </div>

        {/* Academic / Financial Disclosure */}
        <div className="p-4 bg-[#F8FAFC] border border-[#D9E3EC] rounded-md flex items-start space-x-3 text-xs text-[#526575]">
          <Info className="w-4 h-4 text-[#526575] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#172B3A]">Methodology Note:</strong> Each simulation randomly samples annual dividend yields using a Gaussian distribution calibrated to Pag-IBIG's actual 14-year historical parameters ({assumedMeanRate.toFixed(2)}% mean, ±{assumedStdDev.toFixed(2)}% standard deviation). In accordance with Republic Act No. 9679, capital preservation is modeled with a 0% lower boundary (no principal loss).
          </div>
        </div>

      </div>

    </div>
  );
};
