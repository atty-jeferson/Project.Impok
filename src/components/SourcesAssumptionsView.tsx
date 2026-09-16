import React from 'react';
import { Database, ShieldCheck, ExternalLink, FileText, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { HISTORICAL_MP2_RATES } from '../data/historicalRates';

export const SourcesAssumptionsView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F1E36]">
              Sources, Assumptions & Regulatory Citations
            </h1>
            <p className="text-xs text-slate-500">
              Full transparency on data provenance, mathematical assumptions, and statutory basis
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-md font-mono-num">
          Verified for 2026 Planning
        </span>
      </div>

      {/* Statutory Citations */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#0F1E36] flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#0B5CAB]" />
          <span>Statutory & Legal Framework</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Republic Act No. 9679 (HDMF Law of 2009)</div>
            <p className="text-slate-600 leading-relaxed">
              Section 19 establishes the Modified Pag-IBIG II (MP2) Savings Program as a voluntary savings facility. Provides the sovereign state guarantee protecting all member contributions against capital impairment.
            </p>
            <div className="text-[11px] text-blue-700 font-semibold pt-1">
              Legal Basis: Section 19 (Voluntary Savings) & Section 20 (Government Guarantee)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Tax Exemption on Member Dividends</div>
            <p className="text-slate-600 leading-relaxed">
              Under RA 9679 Section 10(c) and National Internal Revenue Code (NIRC) regulations, Pag-IBIG earnings and dividend distributions to members are 100% exempt from the 20% Philippine final withholding tax on interest income.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              Zero Tax Withholding: Effective rate equals declared nominal rate
            </div>
          </div>
        </div>
      </div>

      {/* Historical Dividend Rates Provenance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F1E36]">
            Historical Dividend Rate Provenance (14-Year Record)
          </h2>
          <span className="text-xs text-slate-500">14-Year Average: 6.44%</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Year</th>
                <th className="p-3 font-mono-num">Declared Dividend Rate</th>
                <th className="p-3">Official Publication Source</th>
                <th className="p-3 font-mono-num">Inflation Rate</th>
                <th className="p-3 font-mono-num">Real Net Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono-num">
              {HISTORICAL_MP2_RATES.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/70">
                  <td className="p-3 font-bold text-slate-900">{row.year}</td>
                  <td className="p-3 font-bold text-[#0B5CAB]">{row.dividendRate.toFixed(2)}%</td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">
                    {row.publicationOrReport ? `${row.publicationOrReport} (${row.sourceTitle})` : row.sourceTitle}
                  </td>
                  <td className="p-3 text-slate-600">{row.inflationRate.toFixed(1)}%</td>
                  <td className="p-3 font-bold text-emerald-700">
                    +{(row.dividendRate - row.inflationRate).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions and Model Parameters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#0F1E36]">
          Planning Engine Assumptions
        </h2>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <strong className="text-slate-900">Average Monthly Balance (AMB) Formula: </strong>
            Crediting uses <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[#0F1E36]">Deposit × (13 - Month Number) / 12 × Declared Rate</code>. Remittances made later in the year earn proportionally fewer months of dividend credit in Year 1.
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <strong className="text-slate-900">Compounding Cycle: </strong>
            Dividends are declared once per calendar year and credited in the subsequent year. For multi-year compounding calculations, previous accumulated balances earn 12 full months (12/12) in subsequent years.
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <strong className="text-slate-900">Inflation Adjustments: </strong>
            Purchasing-power equivalents are discounted using the standard continuous annual inflation formula: <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[#0F1E36]">Nominal Value / (1 + i)^n</code>.
          </div>
        </div>
      </div>

      {/* Disclaimers & Institutional Notice */}
      <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 space-y-2 leading-relaxed">
        <div className="font-bold text-amber-900 flex items-center space-x-1.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Non-Affiliation Disclaimer & Educational Purpose</span>
        </div>
        <p>
          This web application is an independent planning and educational tool developed to assist savers in simulating Pag-IBIG MP2 growth. It is <strong>not</strong> an official website of or affiliated with the Home Development Mutual Fund (Pag-IBIG Fund).
        </p>
        <p className="text-slate-500 text-[11px]">
          Projections are mathematical estimates based on user-selected assumptions. Past dividend performance does not guarantee future declared rates. For official account opening, payments, and record verification, visit <a href="https://www.pagibigfund.gov.ph" target="_blank" rel="noopener noreferrer" className="text-[#0B5CAB] underline font-semibold">Virtual Pag-IBIG</a> or an authorized Pag-IBIG Fund branch.
        </p>
      </div>

    </div>
  );
};
