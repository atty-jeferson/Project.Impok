import React, { useState } from 'react';
import { GoalPlannerInputs } from '../types/mp2';
import { solveRequiredContribution, calculateMp2Projection } from '../lib/mp2Calculator';
import { Target, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalPlannerProps {
  onApplyToCalculator: (monthly: number, initial: number, rate: number) => void;
}

export const GoalPlanner: React.FC<GoalPlannerProps> = ({ onApplyToCalculator }) => {
  // Mode selection: 'solve_monthly' (I want ₱X, how much to save?) vs 'solve_maturity' (I can afford ₱Y, what will I reach?)
  const [planningMode, setPlanningMode] = useState<'solve_monthly' | 'solve_maturity'>('solve_monthly');

  const [goalInputs, setGoalInputs] = useState<GoalPlannerInputs>({
    targetAmount: 500000,
    timeHorizonYears: 5,
    initialAmount: 20000,
    assumedDividendRate: 6.50,
    dividendTreatment: 'reinvest',
    currentAffordableMonthly: 5000,
  });

  const GOAL_PRESETS = [
    { label: '₱250,000', value: 250000, desc: 'Emergency / Downpayment' },
    { label: '₱500,000', value: 500000, desc: 'Major Milestone' },
    { label: '₱1,000,000', value: 1000000, desc: '1-Million Club' },
    { label: '₱2,000,000', value: 2000000, desc: 'Retirement Nest Egg' },
  ];

  const results = solveRequiredContribution(goalInputs);

  // What the affordable amount achieves
  const affordableProjection = calculateMp2Projection({
    startingAmount: goalInputs.initialAmount,
    monthlyContribution: goalInputs.currentAffordableMonthly || 0,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: goalInputs.assumedDividendRate,
    dividendTreatment: goalInputs.dividendTreatment,
    projectionYears: goalInputs.timeHorizonYears,
    annualInflationRate: 3.0,
    startYear: 2026,
  });

  // Progress towards goal with affordable monthly amount
  const progressPercent = goalInputs.targetAmount > 0
    ? Math.min(100, Math.round((affordableProjection.projectedMaturityValue / goalInputs.targetAmount) * 100))
    : 0;

  const differenceAmount = affordableProjection.projectedMaturityValue - goalInputs.targetAmount;
  const isSurplus = differenceAmount >= 0;

  const triggerCelebration = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F1E36]">
              May target ka bang gustong maabot?
            </h1>
            <p className="text-xs text-slate-500">
              Alamin kung magkano ang kailangang itabi bawat buwan para sa iyong pangarap
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPlanningMode('solve_monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
              planningMode === 'solve_monthly'
                ? 'bg-white text-[#0B5CAB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            "May target akong ₱500k"
          </button>
          <button
            type="button"
            onClick={() => setPlanningMode('solve_maturity')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
              planningMode === 'solve_maturity'
                ? 'bg-white text-[#0B5CAB] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            "Ito lang ang kaya ko kada buwan"
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form Controls (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-5">
          
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {planningMode === 'solve_monthly' ? 'Define Your Target Milestone' : 'Define Your Monthly Savings Budget'}
          </h2>

          {/* Target Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Target Savings Goal
              </label>
              <span className="text-xs font-bold text-[#0B5CAB] font-mono-num">
                ₱{goalInputs.targetAmount.toLocaleString('en-PH')}
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-sm">
                ₱
              </span>
              <input
                type="number"
                step="10000"
                min="10000"
                value={goalInputs.targetAmount || ''}
                onChange={(e) => setGoalInputs({ ...goalInputs, targetAmount: Math.max(1000, parseFloat(e.target.value) || 0) })}
                className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold font-mono-num text-[#0F1E36] focus:border-[#0B5CAB] focus:ring-1 focus:ring-[#0B5CAB] focus:outline-none"
              />
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {GOAL_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setGoalInputs({ ...goalInputs, targetAmount: p.value })}
                  className={`p-1.5 rounded-md border text-center transition cursor-pointer ${
                    goalInputs.targetAmount === p.value
                      ? 'bg-blue-50 border-[#0B5CAB] text-[#0B5CAB] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <div className="text-xs font-mono-num">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Affordable Monthly Contribution */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Current Affordable Monthly Budget
              </label>
              <span className="text-xs font-bold text-[#0B5CAB] font-mono-num">
                ₱{(goalInputs.currentAffordableMonthly || 0).toLocaleString('en-PH')} / mo
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-sm">
                ₱
              </span>
              <input
                type="number"
                step="500"
                min="0"
                value={goalInputs.currentAffordableMonthly || ''}
                onChange={(e) => setGoalInputs({ ...goalInputs, currentAffordableMonthly: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold font-mono-num text-[#0F1E36] focus:border-[#0B5CAB] focus:ring-1 focus:ring-[#0B5CAB] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Test how close your actual monthly capacity gets to the target.
            </p>
          </div>

          {/* Initial Deposit & Time Horizon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 mb-1 block">
                Starting Balance
              </label>
              <input
                type="number"
                step="5000"
                min="0"
                value={goalInputs.initialAmount || ''}
                onChange={(e) => setGoalInputs({ ...goalInputs, initialAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold font-mono-num text-[#0F1E36] focus:border-[#0B5CAB] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 mb-1 block">
                Time Horizon
              </label>
              <select
                value={goalInputs.timeHorizonYears}
                onChange={(e) => setGoalInputs({ ...goalInputs, timeHorizonYears: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-[#0F1E36] bg-white focus:border-[#0B5CAB] focus:outline-none"
              >
                <option value={1}>1 Year (Short-term)</option>
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={5}>5 Years (Official MP2 Term)</option>
                <option value={10}>10 Years (2 MP2 Cycles)</option>
              </select>
            </div>
          </div>

          {/* Assumed Dividend Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Assumed Annual Dividend Rate
              </label>
              <span className="text-xs font-bold text-[#0B5CAB] font-mono-num">
                {goalInputs.assumedDividendRate.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.0"
              step="0.05"
              value={goalInputs.assumedDividendRate}
              onChange={(e) => setGoalInputs({ ...goalInputs, assumedDividendRate: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B5CAB]"
            />
          </div>

        </div>

        {/* Right Column: Goal Solver Results & Progress Visualizer (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Primary Result Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5 border border-blue-900/40">
            {/* Soft Atmospheric Radial Highlights */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  {planningMode === 'solve_monthly' ? 'Required Monthly Contribution' : 'Projected Value from Affordable Budget'}
                </span>
                <span className="text-[11px] text-sky-100 font-semibold bg-white/10 px-2 py-1 rounded-md border border-white/10">
                  {goalInputs.timeHorizonYears}-Year Target
                </span>
              </div>

              {planningMode === 'solve_monthly' ? (
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono-num drop-shadow-md tracking-tight">
                    ₱{results.requiredMonthlyContribution.toLocaleString('en-PH')}
                    <span className="text-base font-normal text-sky-200 ml-1.5">/ month</span>
                  </div>
                  <p className="text-xs text-sky-100 mt-2 leading-relaxed">
                    Remitting <strong>₱{results.requiredMonthlyContribution.toLocaleString()}</strong> every month for {goalInputs.timeHorizonYears} years yields <strong className="text-emerald-400">₱{results.projectedMaturityValue.toLocaleString()}</strong> at maturity.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono-num drop-shadow-md tracking-tight">
                    ₱{affordableProjection.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-xs text-sky-100 mt-2 leading-relaxed">
                    At your current budget of <strong>₱{(goalInputs.currentAffordableMonthly || 0).toLocaleString()}/month</strong>, you will reach <strong className="text-emerald-400">₱{affordableProjection.projectedMaturityValue.toLocaleString()}</strong>.
                  </p>
                </div>
              )}

              {/* Progress Bar Visualizer */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex justify-between text-xs text-sky-100 font-medium">
                  <span>Goal Achievement Progress</span>
                  <span className="font-bold text-sky-300">{progressPercent}% of Target</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex border border-white/5">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className={`h-full transition-all duration-500 ${
                      progressPercent >= 100 ? 'bg-emerald-400' : 'bg-sky-400'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-sky-200 pt-1">
                  <span>Affordable: ₱{affordableProjection.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</span>
                  <span>Target: ₱{goalInputs.targetAmount.toLocaleString('en-PH')}</span>
                </div>
              </div>

              {/* Gap Analysis / Empathetic Coach Advice Banner */}
              <div className={`p-4 rounded-xl border backdrop-blur-md text-xs leading-relaxed ${
                isSurplus
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200 shadow-inner'
                  : 'bg-white/10 border-white/15 text-sky-100 shadow-inner'
              }`}>
                {isSurplus ? (
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Pasok na pasok sa target! </strong> Ang kaya mong ₱{(goalInputs.currentAffordableMonthly || 0).toLocaleString()}/buwan ay lalampas pa sa target mo ng humigit-kumulang <strong>+₱{differenceAmount.toLocaleString()}</strong>.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Empathetic Coach Note: </span>
                      <span>
                        Kung medyo mabigat ang <strong>₱{results.requiredMonthlyContribution.toLocaleString()}/buwan</strong> ngayon, huwag mag-alala! Sa kaya mong <strong>₱{(goalInputs.currentAffordableMonthly || 0).toLocaleString()}/buwan</strong>, makakaipon ka pa rin ng <strong>₱{affordableProjection.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</strong>. Walang talo sa pag-iipon—ang mahalaga ay tuloy-tuloy ka.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Apply to Calculator Button */}
              <button
                type="button"
                onClick={() => {
                  onApplyToCalculator(
                    results.requiredMonthlyContribution,
                    goalInputs.initialAmount,
                    goalInputs.assumedDividendRate
                  );
                  triggerCelebration();
                }}
                className="w-full mt-2 py-4 px-6 rounded-xl bg-white hover:bg-sky-50 text-[#0B1528] font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer group"
              >
                <span>Apply Required Plan to Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#0B5CAB]" />
              </button>
            </div>
          </div>

          {/* Capital vs Dividend Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-slate-500 font-semibold">Your Out-of-Pocket</div>
              <div className="text-base font-bold text-[#0F1E36] font-mono-num mt-1">
                ₱{results.estimatedTotalContributions.toLocaleString('en-PH')}
              </div>
              <div className="text-[10px] text-slate-400">
                Principal invested
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200/60">
              <div className="text-emerald-800 font-semibold">Earned Dividends</div>
              <div className="text-base font-bold text-emerald-700 font-mono-num mt-1">
                +₱{results.estimatedDividends.toLocaleString('en-PH')}
              </div>
              <div className="text-[10px] text-emerald-800">
                Tax-free growth
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
