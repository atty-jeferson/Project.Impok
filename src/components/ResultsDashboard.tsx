import React, { useState } from 'react';
import { CalculationResults, ActiveTabType } from '../types/mp2';
import { 
  TrendingUp, 
  Wallet, 
  Coins, 
  Percent, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface ResultsDashboardProps {
  results: CalculationResults;
  onNavigateTab?: (tab: ActiveTabType) => void;
  onScrollToInputs?: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  results, 
  onNavigateTab,
  onScrollToInputs
}) => {
  const [showDetailedMetrics, setShowDetailedMetrics] = useState<boolean>(false);

  const {
    projectedMaturityValue,
    totalContributions,
    totalDividendsEarned,
    annualizedReturnPercentage,
    realValuePurchasingPower,
    purchasingPowerLossAmount,
    inputs
  } = results;

  const contributionPct = projectedMaturityValue > 0
    ? Math.round((totalContributions / projectedMaturityValue) * 1000) / 10
    : 100;
  const dividendPct = projectedMaturityValue > 0
    ? Math.round((totalDividendsEarned / projectedMaturityValue) * 1000) / 10
    : 0;

  const effectiveGain = totalContributions > 0
    ? (totalDividendsEarned / totalContributions) * 100
    : 0;

  const handleScrollUp = () => {
    if (onScrollToInputs) {
      onScrollToInputs();
    } else {
      const el = document.getElementById('core-calculator-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="results-summary-section" className="space-y-8">
      
      {/* MAIN RESULT HERO CONTAINER — SPACIOUS, CENTERED, HIGH-CONTRAST */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] text-white p-6 sm:p-10 shadow-xl border border-blue-900/40 space-y-8">
        
        {/* Soft Atmospheric Radial Highlights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Context Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/15 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold tracking-widest text-sky-300">
                  Tinatayang Resulta ng Iyong Plano
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Tax-Free
                </span>
              </div>
              <div className="text-xs text-sky-100 mt-1">
                Plano: {inputs.projectionYears} taon • {inputs.assumedDividendRate.toFixed(2)}% assumed rate • {inputs.dividendTreatment === 'reinvest' ? 'Compounded' : 'Annual Payout'}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-sky-100 hidden sm:inline">
                Gusto mo bang baguhin ang halaga?
              </span>
              <button
                type="button"
                onClick={handleScrollUp}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer backdrop-blur-xs border border-white/10"
              >
                Baguhin ang Hulog ↑
              </button>
            </div>
          </div>

          {/* Central Focal Point: Big Beautiful Number */}
          <div className="text-center py-4 sm:py-8 space-y-3">
            <div className="text-xs sm:text-sm uppercase font-bold tracking-wider text-sky-200">
              Estimated Maturity Value (Tinatayang Maiuuwi)
            </div>
            
            <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight [font-variant-numeric:tabular-nums] drop-shadow-md">
              ₱{projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </div>

            <p className="text-xs sm:text-sm text-sky-100 max-w-lg mx-auto leading-relaxed">
              Ito ang tinatayang kabuuang halaga ng iyong MP2 account pagkatapos ng {inputs.projectionYears} taon batay sa iyong kasalukuyang plano.
            </p>
          </div>

          {/* Supporting Values: Contributions vs Dividends */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            
            {/* Box 1: Contributions */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-sky-200 uppercase tracking-wider">
                <span>Puhunan Mo (Contributions)</span>
                <Wallet className="w-4 h-4 text-sky-300" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight [font-variant-numeric:tabular-nums]">
                  ₱{totalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-sky-100 mt-1">
                  {contributionPct}% ng kabuuang halaga
                </div>
              </div>
            </div>

            {/* Box 2: Dividends */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 flex flex-col justify-between space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <span>Tinatayang Tubo (Dividends)</span>
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight [font-variant-numeric:tabular-nums]">
                  +₱{totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-emerald-300 mt-1 font-medium flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  {dividendPct}% mula sa compounding
                </div>
              </div>
            </div>

            {/* Box 3: Total Gain */}
            <div className="p-5 rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-400/20 flex flex-col justify-between space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-blue-300 uppercase tracking-wider">
                <span>Kabuuang Paglago (Gain)</span>
                <Percent className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight [font-variant-numeric:tabular-nums]">
                  +{effectiveGain.toFixed(1)}%
                </div>
                <div className="text-xs text-sky-100 mt-1">
                  Tubo laban sa iyong inihulog
                </div>
              </div>
            </div>

          </div>

          {/* Visual Progress / Proportion Bar */}
          <div className="space-y-2 pt-6">
            <div className="flex justify-between text-xs text-sky-100 font-medium">
              <span>Puhunan: <strong>{contributionPct}%</strong></span>
              <span className="text-emerald-300 font-bold">Dibidendo: <strong>{dividendPct}%</strong></span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex border border-white/5">
              <div 
                className="h-full bg-sky-400 transition-all duration-500" 
                style={{ width: `${contributionPct}%` }}
                title={`Contributions: ₱${totalContributions.toLocaleString()}`}
              />
              <div 
                className="h-full bg-emerald-400 transition-all duration-500" 
                style={{ width: `${dividendPct}%` }}
                title={`Dividends: ₱${totalDividendsEarned.toLocaleString()}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: “GANITO NABUO ANG ESTIMATE MO.” (Clear Breakdown Equation) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#0B5CAB]" />
          <h3 className="text-sm sm:text-base font-black text-[#0F1E36]">
            Ganito nabuo ang estimate mo.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          
          {/* Step 1: Starting amount */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">
              1. Starting Amount
            </span>
            <span className="text-lg font-bold text-slate-800 [font-variant-numeric:tabular-nums] mt-1 block">
              ₱{inputs.startingAmount.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Paunang ipon
            </span>
          </div>

          {/* Step 2: Monthly contributions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">
              2. Buwanang Hulog
            </span>
            <span className="text-lg font-bold text-slate-800 [font-variant-numeric:tabular-nums] mt-1 block">
              ₱{(inputs.monthlyContribution * inputs.projectionYears * 12).toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              ₱{inputs.monthlyContribution.toLocaleString()} × {inputs.projectionYears * 12} buwan
            </span>
          </div>

          {/* Step 3: Dividends */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
            <span className="text-[11px] uppercase font-bold text-emerald-700 block">
              3. Tinatayang Dibidendo
            </span>
            <span className="text-lg font-bold text-emerald-700 [font-variant-numeric:tabular-nums] mt-1 block">
              +₱{totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[11px] text-emerald-600 mt-0.5 block">
              Compound growth
            </span>
          </div>

          {/* Result: Maturity */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-center">
            <span className="text-[11px] uppercase font-bold text-[#0B5CAB] block">
              = Projected Maturity
            </span>
            <span className="text-lg font-black text-[#0B5CAB] [font-variant-numeric:tabular-nums] mt-1 block">
              ₱{projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[11px] text-[#0B5CAB] mt-0.5 block">
              Buong maiuuwi
            </span>
          </div>

        </div>

        {/* Plain-Language Explanation: What this means */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
          <span className="font-bold text-[#0F1E36] block text-xs">
            Ano ang ibig sabihin nito para sa iyo?
          </span>
          <p>
            Kung maghuhulog ka ng <strong>₱{inputs.monthlyContribution.toLocaleString()}/buwan</strong> sa loob ng {inputs.projectionYears} taon, ang sarili mong naipon at inihulog mula sa bulsa ay <strong>₱{totalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</strong>. Ang karagdagang tinatayang <strong>₱{totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</strong> ay kikitain mula sa compound dividends gamit ang {inputs.assumedDividendRate.toFixed(2)}% rate assumption. Lahat ng kinita ay 100% tax-free.
          </p>
        </div>

      </div>

      {/* SECTION: “WHAT IF?” — OBVIOUS NEXT STEPS */}
      <div className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-[#0B5CAB]" />
            <h3 className="text-sm sm:text-base font-black text-[#0F1E36]">
              Paano kung baguhin mo ang iyong plano?
            </h3>
          </div>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Subukan kung ano ang magiging epekto kung dagdagan mo ng ₱500 o ₱1,000 ang iyong hulog, o tingnan ang epekto ng inflation sa halaga ng pera.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab?.('scenarios')}
            className="px-4 py-2.5 rounded-xl bg-[#0B5CAB] hover:bg-[#155E9E] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5"
          >
            <span>Try Another Amount →</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigateTab?.('inflation')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition cursor-pointer"
          >
            <span>Inflation Impact</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab?.('ladder')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition cursor-pointer"
          >
            <span>MP2 Ladder</span>
          </button>
        </div>

      </div>

      {/* DETAILED SECONDARY METRICS (PURCHASING POWER & XIRR TOGGLE) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
            className="inline-flex items-center space-x-1.5 text-xs text-[#0B5CAB] hover:underline font-bold cursor-pointer"
          >
            <span>{showDetailedMetrics ? 'Itago ang Advanced Return & Purchasing Power' : 'Tingnan ang Inflation Purchasing Power & XIRR'}</span>
            {showDetailedMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <span className="text-[11px] text-slate-400">
            PSA / BSP inflation reference
          </span>
        </div>

        {showDetailedMetrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-white border border-slate-200 rounded-2xl">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] uppercase font-bold text-slate-500">
                Annualized Return (CAGR / XIRR)
              </div>
              <div className="text-xl font-bold text-slate-900 [font-variant-numeric:tabular-nums] mt-1">
                {annualizedReturnPercentage.toFixed(2)}% / yr
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Money-weighted internal rate of return
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] uppercase font-bold text-slate-500">
                Purchasing Power sa Kasalukuyan
              </div>
              <div className="text-xl font-bold text-[#0B5CAB] [font-variant-numeric:tabular-nums] mt-1">
                ₱{realValuePurchasingPower.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tunay na halaga sa presyo ngayon (@ {inputs.annualInflationRate.toFixed(1)}% inflation)
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] uppercase font-bold text-slate-500">
                Kabuuang Bawas ng Inflation
              </div>
              <div className="text-xl font-bold text-amber-700 [font-variant-numeric:tabular-nums] mt-1">
                -₱{purchasingPowerLossAmount.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pangmatagalang epekto sa {inputs.projectionYears} taon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Official Disclaimer Note */}
      <div className="flex items-start space-x-2 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <Info className="w-4 h-4 text-[#0B5CAB] shrink-0 mt-0.5" />
        <span>
          Ang mga halagang ito ay projections batay sa napiling rate assumption at Pag-IBIG AMB formula. Ang opisyal na dibidendo ng MP2 ay itinatakda taun-taon ng Pag-IBIG Fund Board of Trustees alinsunod sa Republic Act No. 9679.
        </span>
      </div>

    </div>
  );
};
