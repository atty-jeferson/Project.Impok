import React, { useState, useMemo } from 'react';
import {
  CalculationResults,
  CalculationInputs,
  ActiveTabType,
  AppMode
} from '../types/mp2';
import { HISTORICAL_MP2_RATES, HISTORICAL_STATS } from '../data/historicalRates';
import { compareTimingEffect, calculateMp2Projection } from '../lib/mp2Calculator';
import { ProjectImpokLogo } from './ProjectImpokLogo';
import { InteractiveGrowthChart } from './InteractiveGrowthChart';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertCircle,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  HeartHandshake,
  Target,
  BookOpen,
  Edit2,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Percent,
  ChevronDown,
  ChevronUp,
  Wallet,
  Coins
} from 'lucide-react';

interface DashboardViewProps {
  results: CalculationResults;
  inputs: CalculationInputs;
  onNavigate: (tab: ActiveTabType) => void;
  onUpdateRate: (rate: number) => void;
  userNickname: string;
  onEditNickname: () => void;
  appMode: AppMode;
  onToggleMode: (mode: AppMode) => void;
  onApplyPlan?: (monthlyContribution: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  results,
  inputs,
  onNavigate,
  onUpdateRate,
  userNickname,
  onEditNickname,
  appMode,
  onToggleMode,
  onApplyPlan,
}) => {
  const latestHistorical = HISTORICAL_MP2_RATES.find(r => r.dividendRate !== null && r.dividendStatus === 'declared') || HISTORICAL_MP2_RATES[1];

  // Compute educational timing difference for current annual contributions
  const annualTotal = inputs.monthlyContribution * 12;
  const timingStats = compareTimingEffect(annualTotal > 0 ? annualTotal : 60000, inputs.assumedDividendRate);

  // Emotional & realistic interpretation numbers
  const totalMonths = inputs.projectionYears * 12;
  const annualSaved = inputs.monthlyContribution * 12;

  // Coach Wisdom message based on context
  const getCoachWisdom = () => {
    if (inputs.monthlyContribution <= 1000 && inputs.startingAmount === 0) {
      return {
        title: "Kahit ₱500 o ₱1,000 lang muna, panalo ka na!",
        body: `Sa ₱${inputs.monthlyContribution.toLocaleString()}/buwan, nakakapagtabi ka ng ₱${annualSaved.toLocaleString()} kada taon. Sa 5 taon, aabot ito ng mahigit ₱${results.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })} dahil sa compound interest. Ang disiplina sa simula ang pinakamahalaga!`
      };
    }
    if (inputs.startingAmount >= 50000) {
      return {
        title: "Malaking tulong ang starting savings mo!",
        body: `Dahil may ₱${inputs.startingAmount.toLocaleString()} ka nang paunang hulog, kumikita agad ito ng buong dividend mula Day 1. Bawat taon, lumalaki ang kita nang kusa (compounding).`
      };
    }
    return {
      title: "Ito ang kaya ng konsistensi mo sa pag-iipon",
      body: `Nagtatabi ka ng ₱${inputs.monthlyContribution.toLocaleString()}/buwan (₱${annualSaved.toLocaleString()} sa isang taon). Sa loob ng ${inputs.projectionYears} taon, ang sarili mong inihulog ay ₱${results.totalContributions.toLocaleString()}. Dahil sa dibidendo, tinatayang aabot sa ₱${results.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })} ang iyong maiuuwi.`
    };
  };

  const coachWisdom = getCoachWisdom();
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState<boolean>(false);

  return (
    <div className="space-y-10 pb-12">
      
      {/* 1. GREETING & MODE SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F1E36] tracking-tight">
              Kumusta, <span className="text-[#0B5CAB]">{userNickname || 'Ka-Ipon'}</span>?
            </h1>
            <button
              type="button"
              onClick={onEditNickname}
              className="text-xs text-slate-500 hover:text-[#0B5CAB] bg-white hover:bg-blue-50 border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition cursor-pointer"
              title="Palitan ang iyong nickname"
            >
              <Edit2 className="w-3 h-3" />
              <span>Palitan</span>
            </button>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            “Let’s see what your savings could become.”
          </p>
        </div>

        {/* Mode Selector */}
        <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => onToggleMode('quick')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition cursor-pointer ${
                appMode === 'quick'
                  ? 'bg-[#0B5CAB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F1E36] hover:bg-slate-50'
              }`}
            >
              SIMPLE
            </button>
            <button
              type="button"
              onClick={() => onToggleMode('advanced')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition cursor-pointer ${
                appMode === 'advanced'
                  ? 'bg-[#0B5CAB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F1E36] hover:bg-slate-50'
              }`}
            >
              ADVANCED
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE VISUAL CENTERPIECE: SOPHISTICATED GRADIENT HERO */}
      <section 
        aria-label="Your Savings Plan Hero"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] text-white p-7 sm:p-10 lg:p-12 shadow-xl border border-blue-900/40"
      >
        {/* Soft Atmospheric Radial Highlights */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true" 
        />

        {/* Subtle, Oversized Seed Watermark */}
        <div 
          className="absolute -right-16 -bottom-20 w-[420px] h-[420px] pointer-events-none select-none opacity-10 blur-[0.5px]"
          aria-hidden="true"
        >
          <ProjectImpokLogo variant="watermark" size="100%" className="w-full h-full text-white" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Current Plan Context */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-200 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>PROJECT IMPOK • YOUR SAVINGS PLAN</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                This is your MP2 savings plan.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-md">
                Start with what feels comfortable today and let time do the heavy lifting.
              </p>
            </div>

            {/* Current Plan Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 space-y-3 max-w-md shadow-inner">
              <div className="text-[11px] font-bold tracking-wider uppercase text-sky-200">
                YOUR CURRENT PLAN
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono-num">
                  ₱{inputs.monthlyContribution.toLocaleString()}
                  <span className="text-sm font-normal text-sky-200 ml-1.5">/ buwan</span>
                </div>
                <div className="text-xs font-semibold text-sky-100 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                  {inputs.projectionYears}-Year Plan
                </div>
              </div>
              <div className="text-xs text-slate-300 pt-1 border-t border-white/10 flex items-center justify-between">
                <span>Diskarte: {inputs.dividendTreatment === 'reinvest' ? '5-Year Compounded' : 'Annual Cash Payout'}</span>
                <span>Assumed rate: {inputs.assumedDividendRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Right Side: Primary Big Result & ONE Strong Action */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start lg:items-end space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 w-full lg:max-w-md space-y-4 shadow-2xl">
              <div className="text-xs font-bold uppercase tracking-widest text-sky-300">
                ESTIMATED MATURITY VALUE
              </div>

              {/* The Big Moment Number */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight [font-variant-numeric:tabular-nums]">
                ₱{results.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>

              <div className="text-xs text-sky-100 leading-relaxed">
                Tinatayang maiuuwi mo sa pagtatapos ng {inputs.projectionYears} taon batay sa iyong kasalukuyang hulog.
              </div>

              {/* Ratio Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, (results.totalContributions / (results.projectedMaturityValue || 1)) * 100)}%` }}
                    className="bg-sky-400 h-full"
                  />
                  <div
                    style={{ width: `${Math.min(100, (results.totalDividendsEarned / (results.projectedMaturityValue || 1)) * 100)}%` }}
                    className="bg-emerald-400 h-full"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-sky-200">
                  <span>Puhunan: ₱{results.totalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</span>
                  <span className="text-emerald-300 font-semibold">Tubo: +₱{results.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* ONE Strong CTA Button */}
              <button
                type="button"
                onClick={() => onNavigate('calculator')}
                className="w-full mt-2 py-4 px-6 rounded-xl bg-white hover:bg-sky-50 text-[#0B1528] font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer group"
              >
                <span>Explore My Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#0B5CAB]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. YOUR PLAN AT A GLANCE (3 Essential Metrics) */}
      <section aria-label="Your Plan at a Glance" className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Your Plan at a Glance
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Metric 1: Contributions */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Your Contributions</span>
              <Wallet className="w-4 h-4 text-[#0B5CAB]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0F1E36] font-mono-num">
              ₱{results.totalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-slate-500">
              Sariling pera na naihulog sa loob ng {inputs.projectionYears} taon
            </p>
          </div>

          {/* Metric 2: Estimated Dividends */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <span>Estimated Dividends</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono-num">
              +₱{results.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-slate-500">
              Tinatayang dagdag mula sa tax-free compound dividends
            </p>
          </div>

          {/* Metric 3: Plan Duration */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Plan Duration</span>
              <Calendar className="w-4 h-4 text-[#0B5CAB]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0F1E36] font-mono-num">
              {inputs.projectionYears} Taon
            </div>
            <p className="text-xs text-slate-500">
              100% Tax-Exempt • Sovereign Capital Backed
            </p>
          </div>

        </div>
      </section>

      {/* 4. ESSENTIAL SUPPORTING INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Coach Contextual Wisdom */}
        <div className="p-5 bg-[#F0F7FF] border border-[#BCD7F5] rounded-2xl flex items-start space-x-3.5 shadow-2xs">
          <div className="p-2.5 bg-blue-100 rounded-xl text-[#0B5CAB] shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-[#0B5CAB] uppercase tracking-wider">
              Coach Insight • {coachWisdom.title}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {coachWisdom.body}
            </p>
          </div>
        </div>

        {/* Institutional Trust & Sovereign Guarantee */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl flex items-start space-x-3.5 shadow-2xs">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Sovereign Capital Guarantee (RA 9679)
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ang iyong inihulog na kapital sa Pag-IBIG MP2 ay protektado at garantisado ng pamahalaan ng Pilipinas. Ang lahat ng kinikitang dibidendo ay 100% tax-free.
            </p>
          </div>
        </div>

      </div>

      {/* 5. ONE MAIN CHART: HOW YOUR SAVINGS COULD GROW */}
      <section aria-label="Savings Trajectory Chart" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0F1E36] tracking-tight">
              How your savings could grow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              See how your contributions and estimated dividends build your projected balance over time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('calculator')}
            className="text-xs font-bold text-[#0B5CAB] hover:text-[#155E9E] inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Tingnan ang detalye sa kalkulador</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-6">
          <InteractiveGrowthChart results={results} />
        </div>
      </section>

      {/* 6. WHAT WOULD YOU LIKE TO EXPLORE? (Guide Section) */}
      <section aria-label="Explore Options" className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#0F1E36] tracking-tight">
            Ano'ng gusto mong subukan o tuklasin?
          </h2>
          <span className="text-xs text-slate-500">Pumili ng susunod na hakbang:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Card 1: What If I Save More? */}
          <button
            type="button"
            onClick={() => onNavigate('scenarios')}
            className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-[#0B5CAB] hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B5CAB] flex items-center justify-center font-bold group-hover:bg-[#0B5CAB] group-hover:text-white transition">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-[#0F1E36] group-hover:text-[#0B5CAB] transition">
                What if I save more?
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore contribution scenarios and see what an extra ₱500 or ₱1,000 adds.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-[#0B5CAB]">
              <span>Explore scenarios</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Card 2: How Does Inflation Affect My Savings? */}
          <button
            type="button"
            onClick={() => onNavigate('inflation')}
            className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-600 group-hover:text-white transition">
                <Percent className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-[#0F1E36] group-hover:text-amber-700 transition">
                Inflation & Purchasing Power
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                See what your projected balance will be worth in today’s pesos.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-amber-700">
              <span>See purchasing power</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Card 3: What Have Dividend Rates Looked Like? */}
          <button
            type="button"
            onClick={() => onNavigate('historical')}
            className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-[#0F1E36] group-hover:text-emerald-700 transition">
                Historical Rates (2011–2025)
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                See official past Pag-IBIG MP2 declared dividend rates and averages.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700">
              <span>Explore historical rates</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </button>

          {/* Card 4: Detailed Plan / Advanced Mode */}
          <button
            type="button"
            onClick={() => onNavigate('calculator')}
            className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-[#0B5CAB] hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B5CAB] flex items-center justify-center font-bold group-hover:bg-[#0B5CAB] group-hover:text-white transition">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-[#0F1E36] group-hover:text-[#0B5CAB] transition">
                Customize My Plan
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adjust starting amount, contribution timing, payout options, and rate assumptions.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-[#0B5CAB]">
              <span>Open calculator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </button>

        </div>
      </section>

      {/* 7. PROGRESSIVE DISCLOSURE: DEEPER TECHNICAL ANALYSIS */}
      <section className="pt-2">
        <button
          type="button"
          onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
          className="w-full py-3.5 px-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 flex items-center justify-between transition cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB] group-hover:bg-[#0B5CAB] group-hover:text-white transition">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-bold text-[#0F1E36] block">
                Technical Analysis & Strategy Notes
              </span>
              <span className="text-[11px] text-slate-500">
                Timing advantages, ladder strategy, and rate assumptions
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500">
            <span>{showAdvancedAnalysis ? 'Itago' : 'Ipakita'}</span>
            {showAdvancedAnalysis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAdvancedAnalysis && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            
            {/* Box 1: Rate Assumption Toggle */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#0B5CAB] bg-blue-50 px-2 py-0.5 rounded">
                    ASSUMED RATE
                  </span>
                  <span className="text-xs text-slate-500">Active</span>
                </div>
                <div className="mt-2 text-2xl font-black text-[#0B5CAB] font-mono-num">
                  {inputs.assumedDividendRate.toFixed(2)}%
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Ito ang ginagamit nating rate sa projection. Tandaan na pwedeng tumaas o bumaba ang rate taun-taon.
                </p>
              </div>
              <div className="flex items-center space-x-1.5 pt-2">
                {[5.5, 6.5, 7.0, 7.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onUpdateRate(rate)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      inputs.assumedDividendRate === rate
                        ? 'bg-[#0B5CAB] text-white border-[#0B5CAB]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'
                    }`}
                  >
                    {rate.toFixed(1)}%
                  </button>
                ))}
              </div>
            </div>

            {/* Box 2: Timing Advantage */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    TIMING ADVANTAGE
                  </span>
                  <span className="text-xs text-emerald-700 font-bold font-mono-num">
                    +₱{timingStats.timingAdvantageJanVsDec.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-xs font-bold text-[#0F1E36]">
                  Mas maagang hulog = Mas mataas na AMB
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Ang hulog sa Enero ay kumikita ng 12 buwan ng dibidendo, kumpara sa 1 buwan lang para sa hulog ng Disyembre.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('strategies')}
                className="text-xs font-bold text-[#0B5CAB] hover:text-[#155E9E] flex items-center space-x-1 cursor-pointer pt-1"
              >
                <span>Tingnan ang ways to save</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Box 3: MP2 Savings Ladder */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3 md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    MP2 LADDER
                  </span>
                  <span className="text-xs text-slate-500">5 Accounts</span>
                </div>
                <div className="mt-2 text-xs font-bold text-[#0F1E36]">
                  Annual Maturity Stream
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Magbukas ng panibagong MP2 account bawat taon upang simula sa Year 5, may regular na nagma-mature taun-taon.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('ladder')}
                className="text-xs font-bold text-[#0B5CAB] hover:text-[#155E9E] flex items-center space-x-1 cursor-pointer pt-1"
              >
                <span>Silipin ang ladder simulation</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        )}
      </section>

    </div>
  );
};
