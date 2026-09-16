import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Percent,
  Clock,
  Layers,
  FileText
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'What is Pag-IBIG MP2 and why was it created?',
      a: 'The Modified Pag-IBIG II (MP2) Savings Program is an official voluntary savings facility established under Section 19 of Republic Act No. 9679 (Home Development Mutual Fund Law of 2009). It was created to provide Filipino workers and retirees a high-yield, government-guaranteed vehicle to save beyond the mandatory Pag-IBIG Regular Savings (P1).'
    },
    {
      q: 'Who is eligible to open an MP2 account?',
      a: 'Any active Pag-IBIG Fund member who has at least one active monthly contribution in their Regular Savings (P1). This includes private and government employees, self-employed professionals, overseas Filipino workers (OFWs), informal sector workers, and former members (such as retirees and pensioners) with active P1 history.'
    },
    {
      q: 'How does the 5-year lock-in work?',
      a: 'Each MP2 account has a mandatory 5-year maturity period beginning from the date of your very first contribution. At the end of 5 years, you can withdraw the entire accumulated capital and dividends tax-free, or reinvest them into a fresh MP2 account.'
    },
    {
      q: 'Can I open multiple MP2 accounts at the same time?',
      a: 'Yes. Pag-IBIG does not impose any limit on the number of MP2 accounts a member can own. This flexibility enables strategies like the MP2 Savings Ladder, where you open a new account each consecutive year to achieve rolling annual liquidity.'
    },
    {
      q: 'What are the rules and penalties for pre-termination before 5 years?',
      a: 'Early withdrawal is only allowed under specific valid reasons defined in Pag-IBIG rules: total disability or insanity, permanent departure from the country, critical illness (member or immediate family), retirement, death, or unemployment. Pre-terminating without an approved justifiable cause forfeits 50% of earned dividends under the Compounded option, or only returns the principal minus previous payouts under the Annual Payout option.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F1E36]">
              How Pag-IBIG MP2 Works
            </h1>
            <p className="text-xs text-slate-500">
              Complete guide to rules, dividend crediting, sovereign backing, and account management
            </p>
          </div>
        </div>

        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Republic Act No. 9679
        </span>
      </div>

      {/* CRITICAL SECTION: WHAT PAG-IBIG DOES AND DOES NOT GUARANTEE */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-[#0F1E36] flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#0B5CAB]" />
          <span>Understanding the Sovereign Guarantee: What Is & Is Not Guaranteed</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* What IS Guaranteed */}
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What Pag-IBIG Guarantees</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              <strong>100% of Your Savings Capital (Principal).</strong> Under Section 19 of Republic Act No. 9679, the Republic of the Philippines explicitly guarantees the full return of your contributions. Even in extreme economic downturns, your deposited principal cannot decrease.
            </p>
            <div className="text-[11px] text-emerald-800 font-medium pt-1">
              Zero credit risk of capital loss for member contributions.
            </div>
          </div>

          {/* What IS NOT Guaranteed */}
          <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>What Pag-IBIG Does NOT Guarantee</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Dividend Rates Are Not Guaranteed.</strong> Pag-IBIG does <em>not</em> guarantee a fixed or minimum dividend rate. Dividend rates vary according to the Fund's annual financial performance and net distributable earnings declared each year by the Board of Trustees.
            </p>
            <div className="text-[11px] text-amber-800 font-medium pt-1">
              Historical rates (4.63% to 8.11%) are not promises of future yields.
            </div>
          </div>

        </div>
      </div>

      {/* Core Operational Mechanisms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <Percent className="w-4 h-4 text-[#0B5CAB]" />
            <span>Dividend Declaration Process</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            By statutory law, Pag-IBIG allocates at least <strong>70% of its annual net income</strong> for distribution as dividends. Rates are approved by the Board of Trustees and declared annually between March and April for the prior calendar year.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tax Treatment (100% Tax-Free)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Under RA 9679, all MP2 dividends are <strong>100% exempt from Philippine withholding tax</strong>. Unlike commercial bank deposits (subject to 20% final tax) or bonds, you receive the declared rate in full with zero tax deductions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Compounded vs Annual Payout</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Choose <strong>5-Year Compounded</strong> to maximize total wealth by letting dividends earn further dividends, or <strong>Annual Payout</strong> to receive yearly cash payouts directly to your Pag-IBIG Loyalty Card Plus or linked bank account.
          </p>
        </div>

      </div>

      {/* Pre-termination Conditions & Rules Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#0F1E36]">
          Pre-termination Conditions & Approved Grounds
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          While MP2 is designed for a strict 5-year lock-in, Pag-IBIG allows members to pre-terminate under any of the following legally approved circumstances:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-700">
          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <strong>1. Total Disability or Insanity:</strong> Incapacity verified by medical certification.
          </div>
          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <strong>2. Permanent Departure:</strong> Emigration or permanent residency in another country.
          </div>
          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <strong>3. Critical Illness:</strong> Serious medical conditions affecting the member or immediate family.
          </div>
          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <strong>4. Legal Retirement:</strong> Reaching retirement age under Philippine labor laws or SSS/GSIS.
          </div>
          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <strong>5. Death of Member:</strong> Savings and dividends pass directly to legal beneficiaries.
          </div>
          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
            <strong>6. Loss of Employment:</strong> Documented involuntary cessation from service.
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 mt-2">
          <strong>Non-approved Early Withdrawal Penalty:</strong> Withdrawing before 5 years without one of the verified reasons above results in forfeiting <strong>50% of the total accumulated dividends</strong> under the compounded option.
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#0F1E36]">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-100">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.q} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:text-[#0B5CAB] transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 ml-2">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed pl-2 border-l-2 border-blue-400">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
