import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Percent,
  Clock,
  PiggyBank,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Coins,
  ArrowRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';
import { calculateMp2Projection } from '../lib/mp2Calculator';

interface Mp2In3MinutesProps {
  onStartPlanning?: () => void;
}

export const Mp2In3Minutes: React.FC<Mp2In3MinutesProps> = ({ onStartPlanning }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedExampleMonthly, setSelectedExampleMonthly] = useState<number>(1000);

  const sample5Year = calculateMp2Projection({
    startingAmount: 0,
    monthlyContribution: selectedExampleMonthly,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: 6.5,
    dividendTreatment: 'reinvest',
    projectionYears: 5,
    annualInflationRate: 3.0,
    startYear: 2026,
  });

  const STEPS = [
    {
      id: 1,
      number: '1',
      title: 'Ano ang MP2?',
      subtitle: 'Voluntary savings na protektado ng batas',
      badge: 'Batas Republika 9679',
      icon: ShieldCheck,
      color: 'blue',
      summary: 'Ang Modified Pag-IBIG II (MP2) ay isang opisyal at voluntary savings program ng Pag-IBIG Fund.',
      keyTakeaway: '100% ng iyong naipon (principal) ay garantisado ng Republika ng Pilipinas. Hindi ito malulugi o mababawasan.',
      visual: (
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2.5">
          <div className="font-bold text-blue-900 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0B5CAB]" />
            <span>Soberanong Garantiya (Sovereign Guarantee)</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Kahit anong mangyari sa merkado o ekonomiya, ang bawat pisong inihulog mo sa iyong MP2 account ay ibabalik sa'yo ng buo. Zero credit risk sa puhunan mo.
          </p>
          <div className="text-[11px] font-semibold text-[#0B5CAB]">
            Sino ang pwede sumali? Lahat ng aktibong miyembro ng Pag-IBIG (empleyado, OFW, self-employed, delivery riders, retirees).
          </div>
        </div>
      )
    },
    {
      id: 2,
      number: '2',
      title: 'Paano kumikita ang MP2?',
      subtitle: '100% Tax-Free Dividends mula sa kita ng Fund',
      badge: '0% Withholding Tax',
      icon: Percent,
      color: 'emerald',
      summary: 'Kumikita ang MP2 sa pamamagitan ng taunang dividends na nanggagaling sa net income ng Pag-IBIG (pabahay at short-term loans).',
      keyTakeaway: 'Walang 20% tax deduction! Kung ano ang na-declare na dividend rate, 100% buo itong mapupunta sa ipon mo.',
      visual: (
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900">Karaniwang Bangko vs MP2</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Malaking Pagkakaiba</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="text-slate-500 font-semibold">Bank Savings / TD</div>
              <div className="text-xs font-bold text-slate-800">~1.0% - 4.0%</div>
              <div className="text-red-600 font-medium">Bawas 20% final tax</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-emerald-300 space-y-1">
              <div className="text-emerald-800 font-bold">Pag-IBIG MP2</div>
              <div className="text-xs font-bold text-emerald-700">~6.0% - 7.5%</div>
              <div className="text-emerald-700 font-bold">0% Tax (Libre sa buwis)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      number: '3',
      title: 'Bakit nagbabago ang dividend rate?',
      subtitle: 'Taun-taon dine-declare base sa kita',
      badge: 'Hindi Fixed',
      icon: TrendingUp,
      color: 'amber',
      summary: 'Ang dividend rate ay hindi fixed o nakatali sa isang pangako. Nakadepende ito sa taunang kita ng Pag-IBIG Fund.',
      keyTakeaway: 'Kaya dito sa Project Impok, gumagamit tayo ng mga scenario (tulad ng 6.0%, 6.5%, o 7.0%) para maging makatotohanan ang plano mo.',
      visual: (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
          <div className="font-bold text-amber-900">Kasaysayan ng MP2 Dividends (Sample):</div>
          <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-mono-num font-bold">
            <div className="p-1.5 bg-white rounded border border-amber-200">
              <div className="text-[10px] text-slate-500">2021</div>
              <div className="text-[#0B5CAB]">6.00%</div>
            </div>
            <div className="p-1.5 bg-white rounded border border-amber-200">
              <div className="text-[10px] text-slate-500">2022</div>
              <div className="text-[#0B5CAB]">7.03%</div>
            </div>
            <div className="p-1.5 bg-white rounded border border-amber-200">
              <div className="text-[10px] text-slate-500">2023</div>
              <div className="text-[#0B5CAB]">7.05%</div>
            </div>
            <div className="p-1.5 bg-white rounded border border-amber-200">
              <div className="text-[10px] text-slate-500">2024</div>
              <div className="text-[#0B5CAB]">7.15%</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 pt-1">
            Ang 14-year average mula 2011 hanggang 2024 ay <strong>6.44%</strong>.
          </p>
        </div>
      )
    },
    {
      id: 4,
      number: '4',
      title: 'Kailan ko makukuha ang pera?',
      subtitle: '5-year lock-in period para lumago',
      badge: '5 Taon',
      icon: Clock,
      color: 'blue',
      summary: 'Bawat MP2 account ay may 5-year lock-in period mula sa petsa ng iyong unang hulog.',
      keyTakeaway: 'Pagkatapos ng 5 taon, pwede mo nang i-withdraw ang buong puhunan at lahat ng kinita, o magbukas ng bagong account para mag-rollover.',
      visual: (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
          <div className="font-bold text-slate-800">Dalawang Pagpipilian sa Dividends:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
              <div className="font-bold text-[#0B5CAB]">1. 5-Year Compounded (Reinvested)</div>
              <p className="text-slate-600 text-[11px]">
                Ang dividend bawat taon ay idinadagdag sa ipon mo para kumita rin ng dividend. Ito ang <strong>pinakamalaking magiging resulta</strong>.
              </p>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800">2. Annual Cash Payout</div>
              <p className="text-slate-600 text-[11px]">
                Ipinapasok kada taon sa Loyalty Card Plus o bank account mo ang kinita, habang naiiwan ang puhunan mo sa Pag-IBIG.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      number: '5',
      title: 'Magkano kaya ang pwede kong maipon?',
      subtitle: 'Kahit maliit basta tuloy-tuloy, malayo ang mararating',
      badge: 'Simulan sa ₱500',
      icon: PiggyBank,
      color: 'emerald',
      summary: 'Hindi mo kailangan maging mayaman para magsimula sa MP2. Minimum contribution ay ₱500 lang bawat hulog.',
      keyTakeaway: 'Tingnan kung ano ang nagagawa ng regular na pag-iipon sa loob ng 5 taon gamit ang 6.5% assumed rate:',
      visual: (
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950">Pumili ng buwanang ipon:</span>
            <div className="flex items-center space-x-1">
              {[500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedExampleMonthly(amt)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono-num transition cursor-pointer ${
                    selectedExampleMonthly === amt
                      ? 'bg-[#0B5CAB] text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  ₱{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-emerald-300 space-y-2">
            <div className="text-xs text-slate-600">
              Kung maghuhulog ka ng <strong>₱{selectedExampleMonthly.toLocaleString()}/buwan</strong> sa loob ng 5 taon:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-1.5 bg-slate-50 rounded">
                <div className="text-[10px] text-slate-500">Iyong Hulog</div>
                <div className="text-xs font-bold text-slate-800 font-mono-num">
                  ₱{sample5Year.totalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="p-1.5 bg-emerald-50 rounded">
                <div className="text-[10px] text-emerald-700">Tantiya sa Dividends</div>
                <div className="text-xs font-bold text-emerald-700 font-mono-num">
                  +₱{sample5Year.totalDividendsEarned.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="p-1.5 bg-blue-50 rounded border border-blue-200">
                <div className="text-[10px] text-[#0B5CAB]">Posibleng Kabuuan</div>
                <div className="text-xs font-black text-[#0B5CAB] font-mono-num">
                  ₱{sample5Year.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 italic text-center">
              "Ang mahalaga, may nasisimulan. Walang maliit na ipon kapag tuloy-tuloy."
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      number: '6',
      title: 'Ano ang dapat kong tandaan?',
      subtitle: 'Mga paalala bago magsimula',
      badge: 'Praktikal na Tips',
      icon: HeartHandshake,
      color: 'blue',
      summary: 'Maging matalino sa pagpaplano ng iyong budget para maging masaya at magaan ang iyong pag-iipon.',
      keyTakeaway: 'Huwag ilagay ang emergency fund sa MP2 dahil hindi ito madaling ma-withdraw bago mag-5 taon nang walang penalty.',
      visual: (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="space-y-1.5 text-slate-700">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Itabi muna ang Emergency Fund</strong> (3-6 buwang gastusin sa banko o digital wallet na accessible agad).</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Okay lang mag-skip kung gipit</strong> — walang multa sa Pag-IBIG kung hindi ka nakapaghulog ng ilang buwan. Hulog lang ulit kapag kaya na!</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Pwede magkaroon ng higit sa 1 account</strong> — kapag komportable ka na, pwede kang magbukas ng bago kada taon (MP2 Ladder).</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = STEPS[activeStep - 1];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F1E36]">
              MP2 in 3 Minutes
            </h1>
            <p className="text-xs text-slate-500">
              Mabilis, simple, at walang paligoy-ligoy na gabay para sa bawat Pilipino
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#0B5CAB] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
          Hakbang {activeStep} ng {STEPS.length}
        </span>
      </div>

      {/* Progress Dots / Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveStep(s.id)}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
              activeStep === s.id
                ? 'bg-white border-[#0B5CAB] ring-2 ring-blue-100 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                activeStep === s.id ? 'bg-[#0B5CAB] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {s.number}
              </span>
              <s.icon className={`w-3.5 h-3.5 ${activeStep === s.id ? 'text-[#0B5CAB]' : 'text-slate-400'}`} />
            </div>
            <div className="mt-2 text-[11px] font-bold truncate text-slate-800">
              {s.title}
            </div>
          </button>
        ))}
      </div>

      {/* Main Focus Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block text-[11px] font-bold text-[#0B5CAB] uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
              {current.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F1E36]">
              {current.title}
            </h2>
            <p className="text-xs text-slate-500">
              {current.subtitle}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 text-[#0B5CAB] shrink-0">
            <current.icon className="w-6 h-6" />
          </div>
        </div>

        {/* Human explanation */}
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <p className="text-base font-semibold text-slate-900">
            {current.summary}
          </p>
          <div className="p-3.5 bg-slate-50 rounded-xl border-l-4 border-[#0B5CAB] text-xs text-slate-700 font-medium">
            💡 <strong>Ang Tandaan: </strong>{current.keyTakeaway}
          </div>
        </div>

        {/* Visual / Interactive Example */}
        <div>
          {current.visual}
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            ← Nakaraan
          </button>

          {activeStep < STEPS.length ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.min(STEPS.length, prev + 1))}
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[#0B5CAB] hover:bg-[#155E9E] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span>Susunod ({activeStep + 1}/{STEPS.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartPlanning}
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span>Subukan Mag-calculate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Encouraging Footer Note */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 flex items-start space-x-3">
        <HeartHandshake className="w-5 h-5 text-[#0B5CAB] shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-bold text-[#0F1E36]">Friendly Coach Advice: </span>
          <span>
            Hindi mo kailangang maging eksperto sa finance para mag-ipon. Ang pinakamahalagang hakbang ay ang pagsisimula, kahit ₱500 lang muna bawat buwan.
          </span>
        </div>
      </div>

    </div>
  );
};
