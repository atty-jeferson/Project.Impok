import React from 'react';
import { ArrowRight, History, ShieldCheck, Percent, Clock, Sparkles } from 'lucide-react';
import { calculateMp2Projection } from '../lib/mp2Calculator';

interface HeroProps {
  onStartPlanning?: () => void;
  onExploreCalculator?: () => void;
  onExploreHistory?: () => void;
  onOpenLadder?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onStartPlanning, 
  onExploreCalculator, 
  onExploreHistory, 
  onOpenLadder 
}) => {
  const handleStart = onStartPlanning || onExploreCalculator || (() => {
    const el = document.getElementById('core-calculator-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  });

  const handleHistory = onExploreHistory || onOpenLadder || (() => {});
  // Compute the illustrative example accurately using the official formula
  const illustrativeCalc = calculateMp2Projection({
    startingAmount: 0,
    monthlyContribution: 5000,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: 6.50,
    dividendTreatment: 'reinvest',
    projectionYears: 5,
    annualInflationRate: 3.0,
    startYear: 2026,
  });

  return (
    <div className="relative overflow-hidden bg-[#F5F9FC] text-[#172B3A] py-8 md:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#D9E3EC]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EAF3FA] border border-blue-200 text-xs font-semibold text-[#0B5CAB]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B5CAB]" />
              <span className="text-[11px] uppercase tracking-wider">Official Pag-IBIG AMB Computation Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#123B63] leading-tight">
              Modified Pag-IBIG II (MP2) Savings Calculator
            </h1>

            <p className="text-sm sm:text-base text-[#526575] leading-relaxed max-w-2xl">
              Plan your contributions, understand compounding growth, and forecast your tax-free dividends with sovereign government backing under Republic Act No. 9679.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleStart}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-md text-xs font-semibold bg-[#0B5CAB] text-white hover:bg-[#094d90] transition shadow-sm uppercase tracking-wider cursor-pointer"
              >
                <span>Calculate MP2 Savings</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleHistory}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-md text-xs font-medium bg-white text-[#123B63] hover:bg-slate-50 border border-[#D9E3EC] transition cursor-pointer shadow-xs"
              >
                <History className="w-4 h-4 text-[#155E9E]" />
                <span>View Historical Rates & Ladder</span>
              </button>
            </div>

            {/* Credibility & Feature Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#D9E3EC]">
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#21865B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#172B3A]">100% Tax-Free</div>
                  <div className="text-[11px] text-[#526575]">Govt. Guaranteed Principal</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Percent className="w-4 h-4 text-[#155E9E] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#172B3A]">Official AMB Formula</div>
                  <div className="text-[11px] text-[#526575]">Month-weighted interest</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#123B63] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#172B3A]">5-Year Term</div>
                  <div className="text-[11px] text-[#526575]">Compounded or Annual Payout</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Compact Illustrative Benchmark Box */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#D9E3EC] rounded-lg p-5 sm:p-6 shadow-sm relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E3EC]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#155E9E]"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
                    Standard 5-Year Benchmark
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#526575] bg-[#F1F5F9] px-2 py-0.5 rounded tracking-wider">
                  ₱5,000 / month @ 6.50%
                </span>
              </div>

              {/* Input parameters display */}
              <div className="grid grid-cols-3 gap-2.5 py-3 text-center border-b border-[#D9E3EC]">
                <div className="bg-[#F7F9FC] p-2 rounded border border-[#E2E8F0]">
                  <div className="text-[10px] uppercase text-[#526575] font-semibold">Monthly</div>
                  <div className="text-sm font-bold text-[#172B3A] mt-0.5 font-mono-num">
                    ₱5,000
                  </div>
                </div>

                <div className="bg-[#F7F9FC] p-2 rounded border border-[#E2E8F0]">
                  <div className="text-[10px] uppercase text-[#526575] font-semibold">Horizon</div>
                  <div className="text-sm font-bold text-[#172B3A] mt-0.5">
                    5 Years
                  </div>
                </div>

                <div className="bg-[#F7F9FC] p-2 rounded border border-[#E2E8F0]">
                  <div className="text-[10px] uppercase text-[#526575] font-semibold">Assumed Rate</div>
                  <div className="text-sm font-bold text-[#147D80] mt-0.5 font-mono-num">
                    6.50%
                  </div>
                </div>
              </div>

              {/* Main Output Highlight */}
              <div className="py-4 text-center">
                <div className="text-[11px] font-semibold text-[#526575] uppercase tracking-wider mb-1">
                  Projected 5-Year Maturity Value
                </div>
                <div className="text-3xl font-bold text-[#123B63] tracking-tight font-mono-num">
                  ₱{illustrativeCalc.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-[#526575] mt-1">
                  Includes <strong className="text-[#21865B] font-mono-num">₱{illustrativeCalc.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</strong> in compounded tax-free dividends
                </div>
              </div>

              {/* Progress bar breakdown */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-[#526575] font-mono-num">
                  <span>Contributions: ₱300,000 (84.5%)</span>
                  <span className="text-[#21865B] font-semibold">Dividends: ₱54,844 (15.5%)</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden flex">
                  <div className="bg-[#526575] h-full" style={{ width: '84.5%' }} title="Contributions"></div>
                  <div className="bg-[#21865B] h-full" style={{ width: '15.5%' }} title="Compounded Dividends"></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D9E3EC] text-center">
                <button
                  onClick={handleStart}
                  className="w-full py-2 rounded-md bg-[#EAF3FA] hover:bg-blue-100 text-xs font-semibold text-[#0B5CAB] border border-blue-200 transition cursor-pointer"
                >
                  Configure Your Own MP2 Scenario Below ↓
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
