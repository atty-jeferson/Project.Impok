import React, { useState, useMemo } from 'react';
import { calculateMp2Projection, compareTimingEffect } from '../lib/mp2Calculator';
import { CalendarClock, TrendingUp, Clock, Info, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

interface ContributionPlannerProps {
  assumedRate: number;
}

export const ContributionPlanner: React.FC<ContributionPlannerProps> = ({ assumedRate }) => {
  const [baseMonthly, setBaseMonthly] = useState<number>(5000);
  const [bonusMonth, setBonusMonth] = useState<number>(11); // November (13th-month)
  const [bonusAmount, setBonusAmount] = useState<number>(15000);
  const [stepUpPercent, setStepUpPercent] = useState<number>(5);

  const annualBaseAmount = baseMonthly * 12;

  // 1. Timing Comparison: January vs December vs Fixed Monthly for the EXACT same annual deposit
  const timingStats = useMemo(() => {
    return compareTimingEffect(annualBaseAmount, assumedRate);
  }, [annualBaseAmount, assumedRate]);

  // 2. Multi-Year Strategy Projections (5 Years)
  // Strategy 1: Fixed Monthly
  const stratFixedMonthly = useMemo(() => {
    return calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: baseMonthly,
      contributionPattern: 'fixed_monthly',
      assumedDividendRate: assumedRate,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
  }, [baseMonthly, assumedRate]);

  // Strategy 2: Annual Lump Sum in January (Same total annual deposit)
  const stratJanuaryLump = useMemo(() => {
    return calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: 0,
      contributionPattern: 'lump_sum_annual',
      lumpSumMonth: 1, // January
      lumpSumAmount: annualBaseAmount,
      assumedDividendRate: assumedRate,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
  }, [annualBaseAmount, assumedRate]);

  // Strategy 3: Annual Lump Sum in December (Same total annual deposit)
  const stratDecemberLump = useMemo(() => {
    return calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: 0,
      contributionPattern: 'lump_sum_annual',
      lumpSumMonth: 12, // December
      lumpSumAmount: annualBaseAmount,
      assumedDividendRate: assumedRate,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
  }, [annualBaseAmount, assumedRate]);

  // Strategy 4: Increasing Annual Contributions (Step-Up e.g. 5% per year)
  const stratStepUp = useMemo(() => {
    return calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: baseMonthly,
      contributionPattern: 'increasing_annually',
      annualIncreaseRatePercent: stepUpPercent,
      assumedDividendRate: assumedRate,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
  }, [baseMonthly, stepUpPercent, assumedRate]);

  // Strategy 5: Monthly + Annual Bonus (e.g. 13th month)
  const stratMonthlyPlusBonus = useMemo(() => {
    return calculateMp2Projection({
      startingAmount: 0,
      monthlyContribution: baseMonthly,
      contributionPattern: 'monthly_plus_lump',
      lumpSumMonth: bonusMonth,
      lumpSumAmount: bonusAmount,
      assumedDividendRate: assumedRate,
      dividendTreatment: 'reinvest',
      projectionYears: 5,
      annualInflationRate: 3.0,
      startYear: 2026,
    });
  }, [baseMonthly, bonusMonth, bonusAmount, assumedRate]);

  // 3. Interactive Custom 12-Month Remittance Simulator
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [customSchedule, setCustomSchedule] = useState<number[]>([
    5000, 5000, 5000, 5000, 5000, 5000,
    5000, 5000, 5000, 5000, 15000, 10000 // default with year-end boost
  ]);

  const handleUpdateMonth = (idx: number, val: number) => {
    const updated = [...customSchedule];
    updated[idx] = Math.max(0, val);
    setCustomSchedule(updated);
  };

  const handleQuickFill = (amt: number) => {
    setCustomSchedule(new Array(12).fill(amt));
  };

  const customYear1Total = customSchedule.reduce((a, b) => a + b, 0);
  const customYear1Dividend = useMemo(() => {
    const rateDecimal = assumedRate / 100;
    return customSchedule.reduce((sum, amt, mIdx) => {
      const monthNum = mIdx + 1;
      const monthsRemaining = 13 - monthNum;
      return sum + amt * (monthsRemaining / 12) * rateDecimal;
    }, 0);
  }, [customSchedule, assumedRate]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F1E36]">
              Ways to Save & Flexible Savings Plan
            </h1>
            <p className="text-xs text-slate-500">
              Save what you can, when you can. Hindi sapilitan ang pare-parehong hulog buwan-buwan.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-600 font-semibold">Karaniwang buwanang hulog:</span>
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1">
            <span className="text-xs text-slate-500 mr-1">₱</span>
            <input
              type="number"
              step={500}
              min={500}
              value={baseMonthly}
              onChange={(e) => setBaseMonthly(Math.max(500, Number(e.target.value) || 500))}
              className="w-20 text-xs font-bold font-mono-num text-[#0F1E36] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Real-life presets */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
        <div className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Real-Life Pinoy Savings Presets:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => {
              setBaseMonthly(1000);
              handleQuickFill(1000);
            }}
            className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800">🛵 Delivery Rider / Daily Earner</div>
            <div className="text-[11px] text-slate-500 mt-0.5">₱1,000/buwan, pantay-pantay buong taon</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setBaseMonthly(2000);
              const sched = [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 10000, 5000];
              setCustomSchedule(sched);
            }}
            className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800">🎁 Empleyado na may 13th Month</div>
            <div className="text-[11px] text-slate-500 mt-0.5">₱2,000/mo + bonus booster pag Disyembre</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setBaseMonthly(1500);
              const sched = [500, 3000, 500, 4000, 500, 1000, 5000, 500, 500, 2000, 3000, 1000];
              setCustomSchedule(sched);
            }}
            className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800">💻 Freelancer / Seasonal Worker</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Maliit kapag lean season, malaki kapag may project</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setBaseMonthly(5000);
              const sched = [15000, 0, 0, 15000, 0, 0, 15000, 0, 0, 15000, 0, 0];
              setCustomSchedule(sched);
            }}
            className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800">✈️ OFW Quarterly Padala</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Isahang hulog kada tatlong buwan (₱15k x 4)</div>
          </button>
        </div>
      </div>

      {/* CORE TIMING PRINCIPLE BANNER */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] text-white shadow-xl space-y-4 border border-blue-900/40">
        {/* Soft Atmospheric Radial Highlights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-sky-300 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>The MP2 Timing Principle</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug drop-shadow-sm">
            Earlier contributions receive more months of dividend eligibility within the calendar year.
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-3xl">
            The dividend rate is declared once annually and is uniform for all members. <strong>There is no higher interest rate in January.</strong> Rather, under Pag-IBIG's Average Monthly Balance (AMB) rule, money deposited in January is active in your account for 12 out of 12 months, whereas a December deposit is active for only 1 month.
          </p>

          {/* Dynamic Timing Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-inner">
              <div className="text-[10px] uppercase font-bold text-emerald-300">
                January Lump Sum (₱{annualBaseAmount.toLocaleString()})
              </div>
              <div className="text-xl font-black text-white font-mono-num mt-1">
                ₱{timingStats.januaryLumpSumDividend.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-sky-100 mt-1">
                12 of 12 months eligible (100% full weight)
              </div>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-inner">
              <div className="text-[10px] uppercase font-bold text-sky-300">
                Fixed Monthly (₱{baseMonthly.toLocaleString()} × 12)
              </div>
              <div className="text-xl font-black text-white font-mono-num mt-1">
                ₱{timingStats.monthlyEvenDividend.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-sky-100 mt-1">
                Staggered 6.5 of 12 months avg (54.2% weight)
              </div>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-inner">
              <div className="text-[10px] uppercase font-bold text-amber-300">
                December Lump Sum (₱{annualBaseAmount.toLocaleString()})
              </div>
              <div className="text-xl font-black text-white font-mono-num mt-1">
                ₱{timingStats.decemberLumpSumDividend.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-sky-100 mt-1">
                1 of 12 months eligible (8.3% weight)
              </div>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-sky-100 font-medium pt-2 border-t border-white/10">
            Timing Advantage: Depositing in January yields <span className="text-emerald-400 font-bold">+₱{timingStats.timingAdvantageJanVsDec.toLocaleString()}</span> more in Year 1 dividends than waiting until December for the exact same principal!
          </div>
        </div>
      </div>

      {/* 5-Year Strategy Comparison Cards */}
      <div>
        <h2 className="text-sm font-bold text-[#0F1E36] mb-3">
          5-Year Strategic Pathways (Assuming {assumedRate.toFixed(2)}% Dividend Rate)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Fixed Monthly */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">1. Fixed Monthly</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Standard</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                ₱{baseMonthly.toLocaleString()} remitted reliably every calendar month.
              </p>
              <div className="mt-3">
                <div className="text-xl font-black text-[#0F1E36] font-mono-num">
                  ₱{stratFixedMonthly.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                  +₱{stratFixedMonthly.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })} dividends
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Total Saved: ₱{stratFixedMonthly.totalContributions.toLocaleString()}
            </div>
          </div>

          {/* Card 2: January Annual Lump Sum */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">2. January Lump Sum</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Max Compounding</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Single ₱{annualBaseAmount.toLocaleString()} deposit every January (same total principal).
              </p>
              <div className="mt-3">
                <div className="text-xl font-black text-[#0B5CAB] font-mono-num">
                  ₱{stratJanuaryLump.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                  +₱{stratJanuaryLump.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })} dividends
                </div>
              </div>
            </div>
            <div className="text-[11px] text-[#0B5CAB] font-semibold pt-2 border-t border-blue-100">
              +₱{(stratJanuaryLump.projectedMaturityValue - stratFixedMonthly.projectedMaturityValue).toLocaleString()} timing gain over monthly!
            </div>
          </div>

          {/* Card 3: 5% Step-Up */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">3. Annual Step-Up</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">+5%/yr</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Increases monthly deposit by 5% each year as income grows.
              </p>
              <div className="mt-3">
                <div className="text-xl font-black text-[#0F1E36] font-mono-num">
                  ₱{stratStepUp.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                  +₱{stratStepUp.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })} dividends
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Total Saved: ₱{stratStepUp.totalContributions.toLocaleString()}
            </div>
          </div>

          {/* Card 4: Monthly + 13th Month Bonus */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">4. Monthly + Bonus</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">13th Month</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Monthly ₱{baseMonthly.toLocaleString()} plus ₱{bonusAmount.toLocaleString()} bonus in Nov.
              </p>
              <div className="mt-3">
                <div className="text-xl font-black text-[#0F1E36] font-mono-num">
                  ₱{stratMonthlyPlusBonus.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                  +₱{stratMonthlyPlusBonus.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })} dividends
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Total Saved: ₱{stratMonthlyPlusBonus.totalContributions.toLocaleString()}
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Custom 12-Month Schedule Simulator */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-[#0F1E36]">
              Interactive Custom 12-Month Remittance Simulator
            </h2>
            <p className="text-xs text-slate-500">
              Simulate cashflows for Year 1 with variable monthly remittances (bonuses, mid-year incentives)
            </p>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill(5000)}
              className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Fill ₱5k
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(10000)}
              className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Fill ₱10k
            </button>
          </div>
        </div>

        {/* 12 Months Input Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {MONTH_NAMES.map((name, idx) => {
            const monthsRemaining = 13 - (idx + 1);
            const val = customSchedule[idx];
            const divEarned = val * (monthsRemaining / 12) * (assumedRate / 100);

            return (
              <div key={name} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800">{name.slice(0, 3)}</span>
                  <span className="text-[10px] text-slate-500">{monthsRemaining}/12 mo</span>
                </div>
                <input
                  type="number"
                  step={500}
                  min={0}
                  value={val}
                  onChange={(e) => handleUpdateMonth(idx, Number(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono-num font-semibold text-[#0F1E36] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
                <div className="text-[10px] text-emerald-700 font-mono-num text-right">
                  +₱{Math.round(divEarned).toLocaleString()} div
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Schedule Results Summary */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-[#0F1E36]">Custom Schedule Year 1 Total Saved: </span>
            <span className="font-mono-num font-black text-[#0B5CAB]">₱{customYear1Total.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-bold text-[#0F1E36]">Estimated Year 1 Dividend: </span>
            <span className="font-mono-num font-black text-emerald-700">+₱{Math.round(customYear1Dividend).toLocaleString()}</span>
          </div>
          <div>
            <span className="font-bold text-[#0F1E36]">Effective Yield: </span>
            <span className="font-mono-num font-bold text-slate-700">
              {customYear1Total > 0 ? ((customYear1Dividend / customYear1Total) * 100).toFixed(2) : '0.00'}%
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
