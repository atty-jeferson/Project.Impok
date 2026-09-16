import React, { useState } from 'react';
import { 
  CalculationInputs, 
  DividendTreatment, 
  ContributionPattern, 
  RateAssumptionMode
} from '../types/mp2';
import { 
  HISTORICAL_MP2_RATES, 
  HISTORICAL_STATS, 
  DEFAULT_PRESET_SCENARIOS 
} from '../data/historicalRates';
import { 
  generateMp2Timeline, 
  TimelineYearItem, 
  LATEST_DECLARED_RATE, 
  LATEST_DECLARED_YEAR 
} from '../lib/rateResolver';
import { 
  RotateCcw, 
  AlertCircle, 
  HelpCircle, 
  Calendar, 
  Layers,
  ArrowDown,
  CheckCircle2,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Clock,
  Info
} from 'lucide-react';

interface CoreCalculatorProps {
  inputs: CalculationInputs;
  onChange: (updated: Partial<CalculationInputs>) => void;
  onReset: () => void;
}

export const CoreCalculator: React.FC<CoreCalculatorProps> = ({ inputs, onChange, onReset }) => {
  const [calculatorMode, setCalculatorMode] = useState<'basic' | 'advanced'>('basic');
  const [activeYearIndex, setActiveYearIndex] = useState<number>(0);
  const [useCustomAnnualRates, setUseCustomAnnualRates] = useState<boolean>(() => {
    return !!(inputs.customAnnualRates && inputs.customAnnualRates.length > 0);
  });

  const STARTING_PRESETS = [0, 500, 1000, 5000, 10000, 50000];
  const MONTHLY_PRESETS = [0, 500, 1000, 2500, 5000, 10000];
  const START_YEAR_PRESETS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

  const currentStartYear = inputs.startYear || 2024;
  const currentProjectionYears = inputs.projectionYears || 5;

  // Generate deterministic year-by-year timeline based on master startYear
  const timeline: TimelineYearItem[] = generateMp2Timeline(
    currentStartYear,
    currentProjectionYears,
    inputs.rateAssumptionMode || 'latest_declared',
    inputs.assumedDividendRate,
    inputs.annualInflationRate || 3.0,
    inputs.customAnnualRates
  );

  const safeActiveIndex = Math.min(activeYearIndex, Math.max(0, timeline.length - 1));
  const activeItem = timeline[safeActiveIndex] || timeline[0];

  // Count declared vs assumption years in current timeline
  const declaredYearsCount = timeline.filter(t => t.dividend.status === 'declared').length;
  const assumptionYearsCount = timeline.length - declaredYearsCount;

  // Handle Assumption Mode change
  const handleAssumptionModeChange = (mode: RateAssumptionMode, explicitRate?: number) => {
    let newRate = inputs.assumedDividendRate;
    if (mode === 'latest_declared') {
      newRate = LATEST_DECLARED_RATE;
    } else if (mode === 'historical_average') {
      newRate = HISTORICAL_STATS.averageDividend;
    } else if (mode === 'conservative') {
      newRate = 5.50;
    } else if (mode === 'custom' && typeof explicitRate === 'number') {
      newRate = explicitRate;
    }

    onChange({
      rateAssumptionMode: mode,
      assumedDividendRate: newRate,
      customAnnualRates: undefined
    });
    setUseCustomAnnualRates(false);
  };

  // Custom rates array handler
  const currentAnnualRates = inputs.customAnnualRates || Array.from(
    { length: currentProjectionYears }, 
    (_, i) => timeline[i]?.dividend.rate ?? inputs.assumedDividendRate
  );

  const handleCustomRateChange = (yearIndex: number, newRate: number) => {
    const updatedRates = [...currentAnnualRates];
    updatedRates[yearIndex] = Math.max(0, Math.min(25, newRate));
    onChange({ customAnnualRates: updatedRates });
  };

  const handleToggleCustomAnnualRates = (enabled: boolean) => {
    setUseCustomAnnualRates(enabled);
    if (enabled) {
      onChange({
        customAnnualRates: Array.from({ length: currentProjectionYears }, (_, i) => timeline[i]?.dividend.rate ?? inputs.assumedDividendRate)
      });
    } else {
      onChange({ customAnnualRates: undefined });
    }
  };

  const handleCalculateClick = () => {
    const el = document.getElementById('results-summary-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Validation messages
  const isBelowMinContribution = inputs.monthlyContribution > 0 && inputs.monthlyContribution < 500;
  const isStartingBelowMin = inputs.startingAmount > 0 && inputs.startingAmount < 500;

  return (
    <div id="core-calculator-section" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
      
      {/* 1. Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F1E36] tracking-tight">
            My MP2 Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tell us what you can save and we'll show you what your plan could look like.
          </p>
        </div>

        {/* Mode & Reset Controls */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex bg-[#F1F5F9] p-1 rounded-md border border-[#D9E3EC] text-xs">
            <button
              type="button"
              onClick={() => setCalculatorMode('basic')}
              className={`px-3 py-1.5 rounded font-medium transition cursor-pointer ${
                calculatorMode === 'basic'
                  ? 'bg-[#0B5CAB] text-white shadow-xs font-semibold'
                  : 'text-[#526575] hover:text-[#172B3A]'
              }`}
            >
              Simple Mode
            </button>
            <button
              type="button"
              onClick={() => setCalculatorMode('advanced')}
              className={`px-3 py-1.5 rounded font-medium transition cursor-pointer flex items-center space-x-1 ${
                calculatorMode === 'advanced'
                  ? 'bg-[#0B5CAB] text-white shadow-xs font-semibold'
                  : 'text-[#526575] hover:text-[#172B3A]'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Advanced Controls</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            title="I-reset sa default settings"
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#526575] hover:text-[#172B3A] hover:bg-[#F1F5F9] border border-[#D9E3EC] transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#526575]" />
            <span className="hidden sm:inline">I-reset</span>
          </button>
        </div>
      </div>

      {/* 2. MASTER TIMELINE KEY: "WHEN DID YOU START YOUR MP2?" */}
      <div className="p-4 sm:p-5 bg-gradient-to-br from-[#F0F7FF] to-[#EAF3FA] rounded-xl border border-[#BCD7F5] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#0B5CAB] text-white rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="master-start-year-select" className="text-xs sm:text-sm font-black text-[#0F1E36] tracking-tight">
                When Did You Start Your MP2? (Taon ng Pagbubukas)
              </label>
              <p className="text-[11px] text-slate-600">
                Ito ang sentro ng buong projection. Bawat taon ay awtomatikong kukunin ang opisyal na dividend at inflation rate.
              </p>
            </div>
          </div>

          {/* Quick Info Badge */}
          <div className="flex items-center space-x-1.5 text-xs text-[#0B5CAB] bg-white px-2.5 py-1 rounded-md border border-blue-200 self-start sm:self-auto font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {declaredYearsCount} Official Declared {declaredYearsCount === 1 ? 'Year' : 'Years'} • {assumptionYearsCount} Projected
            </span>
          </div>
        </div>

        {/* Year Dropdown & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-full sm:w-64">
            <select
              id="master-start-year-select"
              value={currentStartYear}
              onChange={(e) => {
                const yr = parseInt(e.target.value, 10);
                onChange({ startYear: yr });
              }}
              className="w-full py-2 px-3 bg-white border border-[#0B5CAB] rounded-lg text-xs font-bold text-[#0F1E36] shadow-2xs focus:ring-2 focus:ring-[#0B5CAB]/30 focus:outline-none"
            >
              {Array.from({ length: 20 }, (_, i) => 2011 + i).map((yr) => {
                const rec = HISTORICAL_MP2_RATES.find(r => r.year === yr);
                const hasDeclared = rec && rec.dividendRate !== null;
                return (
                  <option key={`start-opt-${yr}`} value={yr}>
                    {yr} {hasDeclared ? `(Official Declared: ${rec.dividendRate?.toFixed(2)}%)` : '(Pending Declaration — Projection)'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-semibold mr-1">Quick Select:</span>
            {START_YEAR_PRESETS.map((yr) => (
              <button
                key={`chip-yr-${yr}`}
                type="button"
                onClick={() => onChange({ startYear: yr })}
                className={`px-2.5 py-1 text-xs rounded-md font-bold font-mono-num transition cursor-pointer border ${
                  currentStartYear === yr
                    ? 'bg-[#0B5CAB] text-white border-[#0B5CAB] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Educational Note */}
        <div className="text-[11px] text-slate-600 flex items-start space-x-1.5 pt-1 border-t border-blue-200/60">
          <Info className="w-3.5 h-3.5 text-[#0B5CAB] shrink-0 mt-0.5" />
          <span>
            Ang Pag-IBIG Fund ay may opisyal na declared rates mula <strong>2011 hanggang {LATEST_DECLARED_YEAR} ({LATEST_DECLARED_RATE.toFixed(2)}%)</strong>. Para sa 2026 pataas, gagamitin ang iyong napiling projection assumption hanggang maideklara ng Board of Trustees.
          </span>
        </div>
      </div>

      {/* 3. YOUR MP2 TIMELINE & DYNAMIC YEAR TABS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#0B5CAB]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
              YOUR MP2 TIMELINE: 5-YEAR TERM ({currentStartYear} – {currentStartYear + currentProjectionYears})
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            I-click ang anumang taon upang masuri o ayusin:
          </span>
        </div>

        {/* Dynamic Horizontal Year Cards / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {timeline.map((item, idx) => {
            const isSelected = safeActiveIndex === idx;
            const isDeclared = item.dividend.status === 'declared';

            return (
              <button
                key={`timeline-tab-${item.yearNumber}`}
                type="button"
                onClick={() => setActiveYearIndex(idx)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#0B5CAB] ring-2 ring-[#0B5CAB]/30 shadow-sm'
                    : 'bg-white border-[#CBD5E1] hover:border-[#0B5CAB]/50 hover:bg-slate-50/80'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B5CAB]" />
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Year {item.yearNumber}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        isDeclared
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {isDeclared ? 'Declared' : 'Assumption'}
                    </span>
                  </div>

                  <div className="text-xl font-black text-[#0F1E36] font-mono-num mt-1">
                    {item.calendarYear}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 space-y-0.5">
                  <div className="text-xs font-bold font-mono-num text-[#147D80] flex items-center justify-between">
                    <span>Rate:</span>
                    <span>{item.dividend.rate.toFixed(2)}%</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Inflation:</span>
                    <span>{item.inflation.rate.toFixed(1)}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ACTIVE YEAR DETAIL VIEW & RATE INTELLIGENCE */}
      <div className="p-5 bg-[#F8FAFC] border border-slate-200/90 rounded-3xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#0B5CAB]" />
            <h3 className="text-sm font-black text-[#0F1E36]">
              Year {activeItem.yearNumber} Intelligence — Calendar Year {activeItem.calendarYear}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {activeItem.dividend.status === 'declared' 
              ? '✅ 100% Opisyal na Deklarasyon ng Pag-IBIG' 
              : '📊 Pagtatantiya (Pending Official Board Resolution)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card A: Dividend Rate Intelligence */}
          <div className="p-4 bg-white rounded-lg border border-[#CBD5E1] shadow-2xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dividend Rate — {activeItem.calendarYear}
                </span>
                {activeItem.dividend.status === 'declared' ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Official Declared
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Not Yet Declared
                  </span>
                )}
              </div>

              <div className="text-3xl font-black text-[#0F1E36] font-mono-num mt-2">
                {activeItem.dividend.rate.toFixed(2)}%
              </div>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeItem.dividend.explanation}
              </p>
            </div>

            {/* Source / Resolution Details */}
            {activeItem.dividend.status === 'declared' ? (
              <div className="p-2.5 bg-emerald-50/80 rounded border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Opisyal na Talaan ng Pag-IBIG Fund</span>
                </div>
                <div className="text-[11px] text-emerald-900/90 leading-tight">
                  {activeItem.dividend.sourceTitle || 'Pag-IBIG Fund Official Board Resolution'}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-700">
                  Pumili ng Projection Assumption para sa taong ito:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAssumptionModeChange('latest_declared')}
                    className={`px-2 py-1.5 rounded text-xs text-left border transition cursor-pointer ${
                      inputs.rateAssumptionMode === 'latest_declared'
                        ? 'bg-blue-50 border-[#0B5CAB] font-bold text-[#0B5CAB]'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[10px] uppercase text-slate-500">Latest ({LATEST_DECLARED_YEAR})</div>
                    <div className="font-mono-num font-bold">{LATEST_DECLARED_RATE.toFixed(2)}%</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAssumptionModeChange('historical_average')}
                    className={`px-2 py-1.5 rounded text-xs text-left border transition cursor-pointer ${
                      inputs.rateAssumptionMode === 'historical_average'
                        ? 'bg-blue-50 border-[#0B5CAB] font-bold text-[#0B5CAB]'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[10px] uppercase text-slate-500">15-Yr Average</div>
                    <div className="font-mono-num font-bold">{HISTORICAL_STATS.averageDividend.toFixed(2)}%</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAssumptionModeChange('conservative')}
                    className={`px-2 py-1.5 rounded text-xs text-left border transition cursor-pointer ${
                      inputs.rateAssumptionMode === 'conservative'
                        ? 'bg-blue-50 border-[#0B5CAB] font-bold text-[#0B5CAB]'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[10px] uppercase text-slate-500">Mababa (Buffer)</div>
                    <div className="font-mono-num font-bold">5.50%</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAssumptionModeChange('custom', inputs.assumedDividendRate)}
                    className={`px-2 py-1.5 rounded text-xs text-left border transition cursor-pointer ${
                      inputs.rateAssumptionMode === 'custom'
                        ? 'bg-blue-50 border-[#0B5CAB] font-bold text-[#0B5CAB]'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[10px] uppercase text-slate-500">Custom Rate</div>
                    <div className="font-mono-num font-bold">{inputs.assumedDividendRate.toFixed(2)}%</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card B: Inflation & Real Purchasing Power */}
          <div className="p-4 bg-white rounded-lg border border-[#CBD5E1] shadow-2xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Philippine Inflation — {activeItem.calendarYear}
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {activeItem.inflation.status === 'historical' ? 'Official PSA / BSP' : 'BSP Mid-Term Target'}
                </span>
              </div>

              <div className="text-3xl font-black text-slate-800 font-mono-num mt-2">
                {activeItem.inflation.rate.toFixed(1)}%
              </div>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeItem.inflation.explanation}
              </p>
            </div>

            {/* Real Net Purchasing Power Return */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Real Net Spread (Dividend minus Inflation):</span>
                <span className={`font-bold font-mono-num ${
                  activeItem.dividend.rate - activeItem.inflation.rate >= 0 ? 'text-emerald-700' : 'text-red-600'
                }`}>
                  {activeItem.dividend.rate - activeItem.inflation.rate >= 0 ? '+' : ''}
                  {(activeItem.dividend.rate - activeItem.inflation.rate).toFixed(2)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ito ang tunay na lumalaking purchasing power ng pera mo pagkatapos mabawasan ng pagtaas ng presyo ng bilihin.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 5. CORE SAVINGS PARAMETERS (Starting Amount, Monthly, Treatment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

        {/* Column 1: Contribution Parameters */}
        <div className="space-y-5">
          
          {/* Starting / Initial Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="starting-amount-input" className="text-xs font-bold uppercase tracking-wider text-[#0F1E36] flex items-center">
                <span>1. May paunang ipon ka na ba? (Initial Savings)</span>
              </label>
              <span className="text-[11px] text-slate-500">Pwedeng ₱0</span>
            </div>

            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-base">
                ₱
              </div>
              <input
                id="starting-amount-input"
                type="number"
                min="0"
                step="500"
                value={inputs.startingAmount || ''}
                onChange={(e) => onChange({ startingAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
                placeholder="0"
                className="block w-full pl-9 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold font-mono-num text-base focus:ring-2 focus:ring-[#0B5CAB]/20 focus:border-[#0B5CAB] focus:outline-none placeholder-slate-400"
              />
            </div>

            <p className="text-xs text-slate-500 mt-1.5">
              Paunang hulog sa iyong MP2 account sa taong {currentStartYear}. Pwedeng ₱0 kung buwan-buwan lang muna ang plano.
            </p>

            {isStartingBelowMin && (
              <div className="mt-1.5 flex items-center text-xs text-amber-700 space-x-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Ang minimum remittance sa Pag-IBIG ay ₱500 bawat transaction.</span>
              </div>
            )}

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {STARTING_PRESETS.map((amt) => (
                <button
                  type="button"
                  key={`start-${amt}`}
                  onClick={() => onChange({ startingAmount: amt })}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold font-mono-num transition cursor-pointer border ${
                    inputs.startingAmount === amt
                      ? 'bg-[#0B5CAB] text-white border-[#0B5CAB] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-blue-50/70 border-slate-200'
                  }`}
                >
                  {amt === 0 ? '₱0' : `₱${amt.toLocaleString('en-PH')}`}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Contribution */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="monthly-contribution-input" className="text-xs font-bold uppercase tracking-wider text-[#0F1E36] flex items-center">
                <span>2. Magkano ang kaya mong itabi bawat buwan?</span>
              </label>
              <span className="text-[11px] text-[#0B5CAB] font-semibold">Min. ₱500 / buwan</span>
            </div>

            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-base">
                ₱
              </div>
              <input
                id="monthly-contribution-input"
                type="number"
                min="0"
                step="500"
                value={inputs.monthlyContribution || ''}
                onChange={(e) => onChange({ monthlyContribution: Math.max(0, parseFloat(e.target.value) || 0) })}
                placeholder="5000"
                className="block w-full pl-9 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold font-mono-num text-base focus:ring-2 focus:ring-[#0B5CAB]/20 focus:border-[#0B5CAB] focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
              <span className="font-semibold text-[#0B5CAB]">
                {inputs.monthlyContribution === 500 ? 'Paano kung ₱500 muna? Pwede kang magsimula dito!' : 'Start with what you can.'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Every month adds another step.</span>
            </div>

            {isBelowMinContribution && (
              <div className="mt-1.5 flex items-center text-xs text-amber-700 space-x-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Ang monthly contribution ay dapat kahit ₱500 ayon sa patakaran ng Pag-IBIG.</span>
              </div>
            )}

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {MONTHLY_PRESETS.map((amt) => (
                <button
                  type="button"
                  key={`month-${amt}`}
                  onClick={() => onChange({ monthlyContribution: amt })}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold font-mono-num transition cursor-pointer border ${
                    inputs.monthlyContribution === amt
                      ? 'bg-[#0B5CAB] text-white border-[#0B5CAB] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-blue-50/70 border-slate-200'
                  }`}
                >
                  {amt === 0 ? '₱0' : `₱${amt.toLocaleString('en-PH')}`}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Only: Contribution Pattern */}
          {calculatorMode === 'advanced' && (
            <div className="p-4 bg-[#F7F9FC] border border-[#D9E3EC] rounded-md space-y-3">
              <label htmlFor="contrib-pattern-select" className="block text-xs font-bold uppercase tracking-wider text-[#123B63]">
                Contribution Pattern & Timing
              </label>
              <select
                id="contrib-pattern-select"
                value={inputs.contributionPattern}
                onChange={(e) => onChange({ contributionPattern: e.target.value as ContributionPattern })}
                className="w-full py-2 px-3 bg-white border border-[#CBD5E1] rounded-md text-xs font-medium text-[#172B3A] focus:ring-1 focus:ring-[#0B5CAB] focus:border-[#0B5CAB] focus:outline-none"
              >
                <option value="fixed_monthly">Fixed Monthly (Standard recurring remittance)</option>
                <option value="increasing_annually">Increasing Annually (Step-up with salary increase)</option>
                <option value="monthly_plus_lump">Monthly + Annual Lump Sum (e.g. 13th month bonus)</option>
                <option value="lump_sum_annual">Annual Lump Sum Only (One deposit per year)</option>
              </select>

              {/* Step up percent input */}
              {inputs.contributionPattern === 'increasing_annually' && (
                <div className="p-2.5 bg-white border border-[#D9E3EC] rounded flex items-center justify-between">
                  <span className="text-xs text-[#172B3A] font-medium">Annual Step-Up Rate:</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="1"
                      value={inputs.annualIncreaseRatePercent || 5}
                      onChange={(e) => onChange({ annualIncreaseRatePercent: parseFloat(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 bg-white border border-[#CBD5E1] rounded text-center text-xs font-bold font-mono-num text-[#0B5CAB]"
                    />
                    <span className="text-xs text-[#0B5CAB] font-bold">% / yr</span>
                  </div>
                </div>
              )}

              {/* Monthly plus lump sum input */}
              {inputs.contributionPattern === 'monthly_plus_lump' && (
                <div className="p-2.5 bg-white border border-[#D9E3EC] rounded space-y-2">
                  <div className="text-xs font-bold text-[#123B63]">Annual Bonus Remittance:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-[#526575]">Bonus Month:</span>
                      <select
                        value={inputs.lumpSumMonth || 11}
                        onChange={(e) => onChange({ lumpSumMonth: parseInt(e.target.value, 10) })}
                        className="w-full mt-0.5 px-2 py-1 bg-white border border-[#CBD5E1] rounded text-xs text-[#172B3A]"
                      >
                        <option value={11}>November (13th Month)</option>
                        <option value={12}>December (Year-End)</option>
                        <option value={1}>January (New Year)</option>
                        <option value={6}>June (Mid-Year)</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#526575]">Bonus Amount:</span>
                      <input
                        type="number"
                        step="1000"
                        value={inputs.lumpSumAmount || 20000}
                        onChange={(e) => onChange({ lumpSumAmount: parseFloat(e.target.value) || 0 })}
                        className="w-full mt-0.5 px-2 py-1 bg-white border border-[#CBD5E1] rounded text-xs font-bold font-mono-num text-[#172B3A]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Column 2: Dividend Treatment & Rate Settings */}
        <div className="space-y-5">
          
          {/* Dividend Treatment (Compounded vs Annual Payout) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#123B63] mb-1.5">
              3. Ano ang gagawin sa kikitain mong dividends?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onChange({ dividendTreatment: 'reinvest' })}
                className={`p-3 rounded-md border text-left transition cursor-pointer ${
                  inputs.dividendTreatment === 'reinvest'
                    ? 'bg-[#EAF3FA] border-[#0B5CAB] ring-1 ring-[#0B5CAB]'
                    : 'bg-white border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#526575]'
                }`}
              >
                <div className="text-xs font-bold text-[#123B63] flex items-center justify-between">
                  <span>I-reinvest (Compounded)</span>
                  {inputs.dividendTreatment === 'reinvest' && (
                    <span className="w-2 h-2 rounded-full bg-[#0B5CAB]"></span>
                  )}
                </div>
                <div className="text-[11px] text-[#526575] mt-1 leading-tight">
                  Kikita rin ng dividend ang kinita mo. Ito ang pinakamalaking resulta pagkatapos ng 5 taon.
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ dividendTreatment: 'annual_payout' })}
                className={`p-3 rounded-md border text-left transition cursor-pointer ${
                  inputs.dividendTreatment === 'annual_payout'
                    ? 'bg-[#FBF5E8] border-[#A66B00] ring-1 ring-[#A66B00]'
                    : 'bg-white border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#526575]'
                }`}
              >
                <div className="text-xs font-bold text-[#123B63] flex items-center justify-between">
                  <span>Annual Cash Payout</span>
                  {inputs.dividendTreatment === 'annual_payout' && (
                    <span className="w-2 h-2 rounded-full bg-[#A66B00]"></span>
                  )}
                </div>
                <div className="text-[11px] text-[#526575] mt-1 leading-tight">
                  Ipinapadala kada taon sa Loyalty Card Plus o banko mo ang kinita, habang naiiwan ang puhunan.
                </div>
              </button>
            </div>
            <p className="text-[11px] text-[#526575] mt-1">
              Pumili kung gusto mong lumago nang todo o kung kailangan mo ng pandagdag-gastos kada taon.
            </p>
          </div>

          {/* General Assumption Slider (for projection years) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="general-rate-slider" className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
                4. Projection Assumption Rate
              </label>
              <span className="text-sm font-bold text-[#147D80] font-mono-num">
                {inputs.assumedDividendRate.toFixed(2)}% bawat taon
              </span>
            </div>

            <input
              id="general-rate-slider"
              type="range"
              min="4.0"
              max="9.5"
              step="0.05"
              value={inputs.assumedDividendRate}
              onChange={(e) => {
                const r = parseFloat(e.target.value);
                onChange({ 
                  assumedDividendRate: r,
                  rateAssumptionMode: 'custom',
                  customAnnualRates: useCustomAnnualRates ? Array.from({ length: currentProjectionYears }, () => r) : undefined
                });
              }}
              className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0B5CAB]"
            />

            <p className="text-[11px] text-[#526575] mt-1">
              Paalala: Para sa mga declared years (e.g. 2024: 7.15%, 2025: 7.12%), ang opisyal na declared rate ang gagamitin; ang rate na ito ay gagamitin lamang para sa mga taong hindi pa declared.
            </p>
          </div>

          {/* Advanced Horizon & Inflation Controls */}
          {calculatorMode === 'advanced' && (
            <div className="p-4 bg-[#F7F9FC] border border-[#D9E3EC] rounded-md space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="projection-years-select" className="block text-xs font-bold uppercase tracking-wider text-[#123B63] mb-1">
                    Projection Horizon
                  </label>
                  <select
                    id="projection-years-select"
                    value={currentProjectionYears}
                    onChange={(e) => {
                      const yrs = parseInt(e.target.value, 10);
                      onChange({ 
                        projectionYears: yrs,
                        customAnnualRates: useCustomAnnualRates ? Array.from({ length: yrs }, () => inputs.assumedDividendRate) : undefined
                      });
                    }}
                    className="w-full py-2 px-2.5 bg-white border border-[#CBD5E1] rounded-md text-xs font-medium text-[#172B3A]"
                  >
                    <option value={5}>5 Years (Standard MP2 Term)</option>
                    <option value={10}>10 Years (2x 5-Yr Cycles)</option>
                    <option value={15}>15 Years (3x 5-Yr Cycles)</option>
                    <option value={20}>20 Years (Retirement Horizon)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="assumed-inflation-input" className="block text-xs font-bold uppercase tracking-wider text-[#123B63] mb-1">
                    Assumed Inflation
                  </label>
                  <div className="relative rounded-md shadow-2xs">
                    <input
                      id="assumed-inflation-input"
                      type="number"
                      min="0"
                      max="15"
                      step="0.1"
                      value={inputs.annualInflationRate}
                      onChange={(e) => onChange({ annualInflationRate: parseFloat(e.target.value) || 0 })}
                      className="block w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-md text-xs font-semibold font-mono-num text-[#172B3A]"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#526575] text-xs font-bold">
                      %
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Annual Dividend Rates */}
              <div className="pt-2 border-t border-[#D9E3EC]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#123B63]">Custom Annual Dividend Rates:</span>
                  <button
                    type="button"
                    onClick={() => handleToggleCustomAnnualRates(!useCustomAnnualRates)}
                    className="text-xs text-[#0B5CAB] hover:underline font-medium cursor-pointer"
                  >
                    {useCustomAnnualRates ? 'Reset to Smart Timeline Resolver' : 'Specify Custom Override per Year'}
                  </button>
                </div>

                {useCustomAnnualRates ? (
                  <div className="bg-white border border-[#CBD5E1] rounded overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#F1F5F9] border-b border-[#CBD5E1] text-[#526575] font-semibold text-[11px]">
                          <th className="py-2 px-3 text-left">CALENDAR YEAR</th>
                          <th className="py-2 px-3 text-right">DIVIDEND RATE (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] font-mono-num">
                        {Array.from({ length: currentProjectionYears }).map((_, idx) => {
                          const yr = currentStartYear + idx;
                          return (
                            <tr key={`rate-yr-${yr}`} className="hover:bg-[#F8FAFC]">
                              <td className="py-1.5 px-3 font-semibold text-[#172B3A]">
                                Year {idx + 1} ({yr})
                              </td>
                              <td className="py-1.5 px-3 text-right">
                                <div className="inline-flex items-center space-x-1">
                                  <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    step="0.05"
                                    value={currentAnnualRates[idx] ?? inputs.assumedDividendRate}
                                    onChange={(e) => handleCustomRateChange(idx, parseFloat(e.target.value) || 0)}
                                    className="w-20 px-2 py-1 bg-white border border-[#CBD5E1] rounded text-right text-xs font-bold font-mono-num text-[#147D80] focus:ring-1 focus:ring-[#0B5CAB] focus:outline-none"
                                  />
                                  <span className="text-[#526575] font-bold">%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#526575]">
                    Ang bawat taon ay awtomatikong nire-resolve gamit ang opisyal na Pag-IBIG rates ({declaredYearsCount} declared) at ang projection assumption ({inputs.assumedDividendRate.toFixed(2)}%).
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 6. ONE Primary Visually Dominant Button */}
      <div className="pt-5 border-t border-[#D9E3EC] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[#526575]">
          Awtomatikong nagre-recalculate ang buong projection sa bawat pagbabago nang hindi nagre-refresh ng page.
        </div>

        <button
          type="button"
          onClick={handleCalculateClick}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-[#0B5CAB] text-white hover:bg-[#155E9E] transition shadow-xs cursor-pointer"
        >
          <span>Calculate My Plan →</span>
        </button>
      </div>

    </div>
  );
};
