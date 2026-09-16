import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Layers,
  HelpCircle,
  Percent,
  Compass,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calculator,
  Coins,
  Wallet
} from 'lucide-react';
import { ActiveTabType } from '../types/mp2';
import { calculateMp2Projection } from '../lib/mp2Calculator';
import { ProjectImpokLogo } from './ProjectImpokLogo';

interface LandingPageProps {
  onEnterApp: (targetTab?: ActiveTabType) => void;
  onSetContribution?: (monthly: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onSetContribution
}) => {
  const [previewMonthly, setPreviewMonthly] = useState<number>(2000);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  const previewResults = calculateMp2Projection({
    startingAmount: 0,
    monthlyContribution: previewMonthly,
    contributionPattern: 'fixed_monthly',
    assumedDividendRate: 6.5,
    dividendTreatment: 'reinvest',
    projectionYears: 5,
    annualInflationRate: 4,
    startYear: new Date().getFullYear()
  });

  const capabilities = [
    {
      number: '01',
      title: 'Smart Calculator',
      description: 'Isang calculator na dinisenyo hindi lang para magbigay ng numero, kundi para ipaliwanag kung saan nanggaling ito.',
      icon: Calculator,
      tab: 'calculator' as ActiveTabType,
      action: 'Try the Calculator'
    },
    {
      number: '02',
      title: 'What If Scenarios',
      description: 'Ano ang mangyayari kung taasan mo ang hulog? O kung bumaba ang dividend rate? Alamin agad.',
      icon: Compass,
      tab: 'whatif' as ActiveTabType,
      action: 'Explore Scenarios'
    },
    {
      number: '03',
      title: 'Historical Rates',
      description: 'Silipin ang tunay na performance ng MP2 mula 2011 hanggang kasalukuyan at gawin itong basehan.',
      icon: TrendingUp,
      tab: 'historical' as ActiveTabType,
      action: 'View History'
    },
    {
      number: '04',
      title: 'MP2 Ladder',
      description: 'Pag-aralan ang 5-year rolling maturity strategy na ginagamit ng mga long-term MP2 savers.',
      icon: Layers,
      tab: 'ladder' as ActiveTabType,
      action: 'Learn the Ladder'
    },
    {
      number: '05',
      title: 'Inflation Analysis',
      description: 'Tingnan kung paano nilalabanan ng MP2 dividends ang pagtaas ng presyo ng mga bilihin.',
      icon: Percent,
      tab: 'inflation' as ActiveTabType,
      action: 'Check Inflation'
    },
    {
      number: '06',
      title: 'Goal Planner',
      description: 'May target amount ka ba na gustong maabot? Ipapakita ng system kung magkano ang kailangan mong ihulog.',
      icon: Sparkles,
      tab: 'goal' as ActiveTabType,
      action: 'Plan Your Goal'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-blue-500/30 selection:text-white">
      
      {/* 1. ELEGANT TOP BRAND NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <ProjectImpokLogo size={36} variant="color" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black tracking-tight text-[#0F1E36]">
                  PROJECT IMPOK
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Your MP2 Financial Coach
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
              <button onClick={() => onEnterApp('how-it-works')} className="hover:text-[#0B5CAB] transition cursor-pointer">How It Works</button>
              <button onClick={() => onEnterApp('literacy')} className="hover:text-[#0B5CAB] transition cursor-pointer">MP2 in 3 Minutes</button>
              <button onClick={() => onEnterApp('methodology')} className="hover:text-[#0B5CAB] transition cursor-pointer">Methodology</button>
              <button onClick={() => onEnterApp('dashboard')} className="text-slate-900 font-bold hover:text-[#0B5CAB] transition cursor-pointer">Log In</button>
            </nav>

            <button
              type="button"
              onClick={() => onEnterApp('calculator')}
              className="inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B5CAB] text-white hover:bg-[#155E9E] transition shadow-xs cursor-pointer"
            >
              <span>Start My Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION — PREMIUM DEEP NAVY / INDIGO GRADIENT */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB]">
        
        {/* Soft Atmospheric Radial Highlights */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12]">
            Your savings deserve <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-emerald-300 drop-shadow-sm">a plan.</span>
          </h1>

          <p className="text-base sm:text-xl text-sky-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Understand what your MP2 savings could become — starting with what you can realistically set aside.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onEnterApp('calculator')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-9 py-4 rounded-xl text-sm font-bold bg-white text-[#0B1528] hover:bg-sky-50 transition shadow-xl cursor-pointer"
            >
              <span>Start My Plan</span>
              <ArrowRight className="w-4 h-4 text-[#0B5CAB]" />
            </button>

             <a
              href="#why-impok"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition cursor-pointer backdrop-blur-md"
            >
              <span>See How It Works</span>
            </a>
          </div>

        </div>
      </section>

      {/* 3. WHY PROJECT IMPOK? */}
      <section id="why-impok" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F1E36] tracking-tight">
              Planning your savings shouldn't require a finance degree.
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              PROJECT IMPOK helps you understand your contributions, potential dividends, time, and inflation — giving you a clearer picture of your plan in seconds.
            </p>
          </div>

        </div>
      </section>

      {/* 4. PRODUCT PREVIEW SECTION (THE CALCULATOR) */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F1E36] tracking-tight">
              See what your plan could become.
            </h2>
            <p className="text-slate-600">
              Interactive, beautiful, and mathematically precise.
            </p>
          </div>

          {/* Calculator Preview Container */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden max-w-4xl mx-auto">
            {/* Window header */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
            </div>
            
            <div className="p-8 sm:p-12 space-y-10">
              
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Magkano ang kaya mong ihulog buwan-buwan?
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-black text-slate-400">₱</span>
                  <input
                    type="number"
                    value={previewMonthly}
                    onChange={(e) => setPreviewMonthly(Number(e.target.value) || 0)}
                    className="w-full max-w-[200px] text-4xl sm:text-5xl font-black text-[#0F1E36] bg-transparent border-b-2 border-slate-200 focus:border-[#0B5CAB] focus:outline-none transition pb-2 font-mono-num"
                  />
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] border border-blue-900/40 shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-sky-300">
                    ESTIMATED MATURITY VALUE
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-white tracking-tight [font-variant-numeric:tabular-nums]">
                    ₱{previewResults.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => onEnterApp('calculator')}
                  className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-[#0B5CAB] text-white hover:bg-[#155E9E] transition shadow-md cursor-pointer"
                >
                  <span>Try the Full Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS (SIMPLE STEPS) */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F1E36] tracking-tight">
              Paano gumagana ang system?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B5CAB] font-black flex items-center justify-center mx-auto text-xl">1</div>
              <h3 className="font-bold text-[#0F1E36]">Set your contribution</h3>
              <p className="text-sm text-slate-600">Start with any amount from ₱500 upwards.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B5CAB] font-black flex items-center justify-center mx-auto text-xl">2</div>
              <h3 className="font-bold text-[#0F1E36]">Choose your timeline</h3>
              <p className="text-sm text-slate-600">Map out your 5-year lock-in period.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B5CAB] font-black flex items-center justify-center mx-auto text-xl">3</div>
              <h3 className="font-bold text-[#0F1E36]">Understand your estimate</h3>
              <p className="text-sm text-slate-600">See exactly how your principal and dividends combine.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0B5CAB] font-black flex items-center justify-center mx-auto text-xl">4</div>
              <h3 className="font-bold text-[#0F1E36]">Explore what could change</h3>
              <p className="text-sm text-slate-600">Test different rates, scenarios, and inflation.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BUILT FOR REAL PEOPLE */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-black text-[#0F1E36] tracking-tight">
            Hindi kailangang malaki agad.
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Start with what you can realistically set aside. PROJECT IMPOK helps you understand the numbers behind your savings plan — without making you feel like you need to be a financial expert.
          </p>
        </div>
      </section>

      {/* 7. ADVANCED CAPABILITIES */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F1E36] tracking-tight">
              Simple when you start.<br/>Powerful when you're ready.
            </h2>
            <p className="text-slate-600">Go deeper into your analysis when you want to learn more.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.number}
                  onClick={() => onEnterApp(cap.tab)}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-[#0B5CAB]/50 hover:shadow-lg transition text-left cursor-pointer group flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black tracking-widest text-slate-300 font-mono-num">
                        {cap.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-[#0B5CAB] transition">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F1E36] group-hover:text-[#0B5CAB] transition">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-sm font-bold text-[#0B5CAB]">
                    <span>{cap.action}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. FINAL WARM CTA SECTION — PREMIUM GRADIENT */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0B1528] via-[#0B5CAB] to-[#155E9E] text-center">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          
          <div className="inline-block p-2 rounded-full bg-white/10 backdrop-blur-md shadow-2xl mb-2">
            <ProjectImpokLogo size={48} variant="white" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Start with what you have.
          </h2>
          <p className="text-lg sm:text-xl text-sky-100 max-w-xl mx-auto leading-relaxed font-medium">
            See what your savings could become today.
          </p>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => onEnterApp('calculator')}
              className="inline-flex items-center space-x-2 px-10 py-5 rounded-2xl text-base font-bold bg-white text-[#0B1528] hover:bg-sky-50 transition shadow-2xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start My Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. PREMIUM FOOTER WITH COLLAPSIBLE DISCLOSURE */}
      <footer className="bg-[#040A14] pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-[#0B1528] text-slate-400">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-8">
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center space-x-2">
                <ProjectImpokLogo size={28} variant="white" />
                <span className="font-black text-white tracking-wide">PROJECT IMPOK</span>
              </div>
              <p className="text-xs font-semibold text-sky-400/80">Your MP2 Financial Coach</p>
              <p className="text-xs italic text-slate-500">“Pag may itinanim, may aanihin.”</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => onEnterApp('literacy')} className="hover:text-white transition">MP2 in 3 Minutes</button></li>
                <li><button onClick={() => onEnterApp('calculator')} className="hover:text-white transition">Calculator</button></li>
                <li><button onClick={() => onEnterApp('how-it-works')} className="hover:text-white transition">How It Works</button></li>
                <li><button onClick={() => onEnterApp('dashboard')} className="hover:text-white transition">Log In</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => onEnterApp('whatif')} className="hover:text-white transition">What If Scenarios</button></li>
                <li><button onClick={() => onEnterApp('inflation')} className="hover:text-white transition">Inflation Analysis</button></li>
                <li><button onClick={() => onEnterApp('historical')} className="hover:text-white transition">Historical Rates</button></li>
                <li><button onClick={() => onEnterApp('ladder')} className="hover:text-white transition">MP2 Ladder</button></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Learn</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => onEnterApp('methodology')} className="hover:text-white transition">Methodology</button></li>
                <li><button onClick={() => onEnterApp('sources')} className="hover:text-white transition">Sources & Assumptions</button></li>
                <li><button onClick={() => onEnterApp('how-it-works')} className="hover:text-white transition">FAQ</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-6">
            
            {/* COLLAPSIBLE LEGAL DISCLOSURE */}
            <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
              <button 
                type="button"
                onClick={() => setIsDisclosureOpen(!isDisclosureOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              >
                <span>Independent Public Education Notice</span>
                {isDisclosureOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {isDisclosureOpen && (
                <div className="px-6 pb-6 pt-2 text-[11px] text-slate-500 leading-relaxed space-y-3">
                  <p>
                    <strong>Independent Public Education Notice:</strong> PROJECT IMPOK is an independent planning and financial-education tool created to help savers model Pag-IBIG Modified Pag-IBIG II outcomes under Republic Act No. 9679. This application is not an official portal of, operated by, or affiliated with the Home Development Mutual Fund (Pag-IBIG Fund).
                  </p>
                  <p>
                    Pag-IBIG guarantees the savings capital (principal) under Republic Act No. 9679, but dividend rates vary according to the Fund's annual financial performance and are not guaranteed. Projections are mathematical estimates based on user-provided assumptions.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
              <p>© {new Date().getFullYear()} PROJECT IMPOK. Your MP2 Financial Coach.</p>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sky-400/70">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Client-Side Only</span>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};
