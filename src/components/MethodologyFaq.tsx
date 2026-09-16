import React, { useState } from 'react';
import { BookOpen, HelpCircle, FileText, ExternalLink, ChevronDown, ChevronRight, ShieldAlert } from 'lucide-react';

export const MethodologyFaq: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'methodology' | 'faq' | 'guide'>('methodology');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'What is Pag-IBIG MP2?',
      a: 'The Modified Pag-IBIG II (MP2) Savings Program is a special voluntary savings facility established by Pag-IBIG Fund under Republic Act No. 9679. It has a 5-year maturity period and is designed for active Pag-IBIG members (and retirees) who wish to save more and earn higher, tax-free annual dividends backed by a sovereign government guarantee.'
    },
    {
      q: 'Who is eligible to open an MP2 account?',
      a: 'Any active Pag-IBIG Fund member (employed, self-employed, OFW, or voluntary) who has at least one active Regular Pag-IBIG (P1) monthly contribution. Former Pag-IBIG members (such as retirees and pensioners) with other sources of monthly income and active P1 history are also eligible.'
    },
    {
      q: 'How are MP2 dividends actually calculated by Pag-IBIG?',
      a: 'Pag-IBIG allocates at least 70% of its annual net income for member dividends. MP2 dividends are computed using the Average Monthly Balance (AMB) method, which weights each remittance by the number of months it remains with the Fund during that calendar year: (Deposit × [13 - Month Number] / 12 × Declared Rate). Dividends are declared annually around March or April of the succeeding year.'
    },
    {
      q: 'Compounding (Reinvestment) vs Annual Payout: Which should I choose?',
      a: '• Compounded (Reinvested): Dividends remain inside your account and earn subsequent dividends in following years. This maximizes the compound growth effect and is ideal for long-term wealth building.\n• Annual Payout: Dividends are credited directly every year to your Pag-IBIG Loyalty Card Plus or linked bank account. This is ideal if you need passive supplementary cash flow or living income.'
    },
    {
      q: 'Is my money guaranteed? What are the risks?',
      a: 'Your principal capital is 100% guaranteed by the Philippine Government under Section 19 of RA 9679. There is zero risk of negative capital loss. The only variable is the dividend rate, which fluctuates from year to year depending on Pag-IBIG Fund’s loan collection and investment performance (ranging historically between 4.63% and 8.11%).'
    },
    {
      q: 'Can I open multiple MP2 accounts?',
      a: 'Yes! There is no limit on the number of MP2 accounts a single member can open. This allows you to build an "MP2 Savings Ladder" by opening an account each year for 5 consecutive years, creating a matured account with liquidity every single year.'
    },
    {
      q: 'What happens when my MP2 account reaches 5-year maturity?',
      a: 'Upon maturity, you can claim your total accumulated savings (principal + tax-free dividends) through your Virtual Pag-IBIG portal or at any branch. If you do not withdraw, the funds will earn the lower Regular Pag-IBIG (P1) dividend rate for the next 2 years, after which they stop earning dividends.'
    },
    {
      q: 'Can I withdraw my MP2 savings before 5 years?',
      a: 'Early pre-termination is only permitted under specific justifiable reasons specified in Pag-IBIG rules: total disability, permanent departure from the country, critical illness (member or immediate family), retirement, death, or unemployment. Pre-terminating without valid grounds forfeits 50% of the earned dividends.'
    }
  ];

  return (
    <div id="methodology-faq-section" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-[#D9E3EC] overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('methodology')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'methodology'
              ? 'border-[#0B5CAB] text-[#0B5CAB]'
              : 'border-transparent text-[#526575] hover:text-[#172B3A]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Calculation Methodology & Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'faq'
              ? 'border-[#0B5CAB] text-[#0B5CAB]'
              : 'border-transparent text-[#526575] hover:text-[#172B3A]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'guide'
              ? 'border-[#0B5CAB] text-[#0B5CAB]'
              : 'border-transparent text-[#526575] hover:text-[#172B3A]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>How to Open & Remit Guide</span>
        </button>
      </div>

      {/* Tab 1: Methodology */}
      {activeTab === 'methodology' && (
        <div className="space-y-6 text-[#172B3A] text-xs leading-relaxed">
          
          <div>
            <h3 className="text-sm font-bold text-[#123B63] mb-2">
              Official Pag-IBIG AMB Month-Weighting Calculation Model
            </h3>
            <p className="text-[#526575]">
              This planner adheres strictly to the official Pag-IBIG Fund dividend crediting formula rather than generic monthly compounding calculators. In Pag-IBIG MP2:
            </p>
            <div className="my-3 p-4 bg-[#F8FAFC] rounded-md border border-[#CBD5E1] space-y-2 text-xs">
              <div className="text-[#0B5CAB] font-bold">Annual Dividend Formula:</div>
              <div className="text-[#123B63] font-mono-num font-semibold">Dividend = (Beginning Balance × Rate) + Σ [Monthly Remittance × (13 - Month#) / 12 × Rate]</div>
              <div className="text-[#526575] text-[11px] pt-1 border-t border-[#E2E8F0]">
                Where Month# ranges from 1 (January = 12/12 weighting) to 12 (December = 1/12 weighting).
              </div>
            </div>
            <p className="text-[#526575]">
              Beginning balance from prior accumulated years earns the full annual dividend rate (12/12 months). Monthly deposits earn dividends prorated to the number of months remaining in that calendar year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F8FAFC] rounded-md border border-[#D9E3EC] space-y-2">
              <h4 className="font-bold text-[#123B63] text-xs">Tax-Exempt Status (0% Withholding)</h4>
              <p className="text-[#526575]">
                Under Republic Act No. 9679 (Home Development Mutual Fund Law of 2009), all dividends earned on MP2 savings are <strong className="text-[#21865B]">100% tax-free</strong>. Unlike commercial bank accounts, time deposits, or retail treasury bonds which incur 20% final withholding tax, every peso declared by Pag-IBIG is credited in full to your account.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-md border border-[#D9E3EC] space-y-2">
              <h4 className="font-bold text-[#123B63] text-xs">Inflation Adjustment Formula</h4>
              <p className="text-[#526575]">
                Purchasing power in today's pesos is computed using the standard Fisher discounting equation:
                <span className="block font-mono-num font-bold text-[#123B63] my-1">
                  Real Value = Future Value / (1 + Inflation Rate)^Years
                </span>
                This demonstrates how much real goods and services your future maturity pesos can purchase relative to today's purchasing power.
              </p>
            </div>
          </div>

          {/* Legal and Disclaimer Notice */}
          <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-md flex items-start space-x-3 text-[#526575]">
            <ShieldAlert className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-[#92400E]">Independent Financial Planning Tool Disclaimer:</strong>
              <p className="text-[11px] text-[#78350F]">
                This web application is an independent financial education and planning platform. It is <strong className="text-[#92400E]">NOT an official Pag-IBIG Fund tool</strong> and has no official affiliation with the Home Development Mutual Fund (HDMF). Projected returns, sensitivity matrix analyses, and simulations are based on user-selected assumptions and historical records for informational planning purposes only, and do not constitute legal, tax, or investment advice.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: FAQs */}
      {activeTab === 'faq' && (
        <div className="space-y-2.5">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.q}
                className="border border-[#D9E3EC] rounded-md overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] flex items-center justify-between transition cursor-pointer select-none"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#123B63]">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#0B5CAB] shrink-0 ml-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#526575] shrink-0 ml-2" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white text-xs text-[#172B3A] leading-relaxed border-t border-[#D9E3EC] whitespace-pre-line">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Step by Step Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6 text-xs text-[#172B3A]">
          
          <div>
            <h3 className="text-sm font-bold text-[#123B63] mb-3">
              How to Open Your Pag-IBIG MP2 Account in 3 Easy Steps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F8FAFC] rounded-md border border-[#D9E3EC] space-y-2">
                <div className="w-6 h-6 rounded-full bg-[#0B5CAB] text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-[#123B63]">Go to Virtual Pag-IBIG</h4>
                <p className="text-[#526575]">
                  Visit the official Pag-IBIG Fund website (<a href="https://www.pagibigfundservices.com/mp2enrollment/" target="_blank" rel="noreferrer" className="text-[#0B5CAB] underline font-medium inline-flex items-center">mp2enrollment <ExternalLink className="w-3 h-3 ml-0.5" /></a>). Enter your 12-digit Pag-IBIG MID Number and personal details.
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-md border border-[#D9E3EC] space-y-2">
                <div className="w-6 h-6 rounded-full bg-[#0B5CAB] text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-[#123B63]">Configure Your Account</h4>
                <p className="text-[#526575]">
                  Select your monthly contribution amount, dividend treatment (5-year Compounded or Annual Payout), and preferred mode of remittance.
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-md border border-[#D9E3EC] space-y-2">
                <div className="w-6 h-6 rounded-full bg-[#0B5CAB] text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-[#123B63]">Save Your MP2 Number & Remit</h4>
                <p className="text-[#526575]">
                  Submit the online form to instantly generate your unique <strong className="text-[#123B63]">12-digit MP2 Account Number</strong>. Make your first remittance of at least ₱500 to activate it!
                </p>
              </div>
            </div>
          </div>

          {/* Remittance channels */}
          <div className="p-4 bg-[#F8FAFC] rounded-md border border-[#D9E3EC] space-y-3">
            <h4 className="font-bold text-[#123B63] text-xs">Popular Remittance Channels</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[#172B3A]">
              <div className="p-2.5 bg-white rounded border border-[#CBD5E1]">
                <div className="font-bold text-[#123B63]">Virtual Pag-IBIG</div>
                <div className="text-[11px] text-[#526575]">Credit/Debit card, Maya, GCash</div>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#CBD5E1]">
                <div className="font-bold text-[#123B63]">GCash App</div>
                <div className="text-[11px] text-[#526575]">Pay Bills → Government → Pag-IBIG MP2</div>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#CBD5E1]">
                <div className="font-bold text-[#123B63]">Maya App</div>
                <div className="text-[11px] text-[#526575]">Bills → Government → Pag-IBIG MP2</div>
              </div>
              <div className="p-2.5 bg-white rounded border border-[#CBD5E1]">
                <div className="font-bold text-[#123B63]">Bayad Centers / Banks</div>
                <div className="text-[11px] text-[#526575]">Over-the-counter & branch partners</div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
