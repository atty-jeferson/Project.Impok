import React, { useState } from 'react';
import { CalculationResults } from '../types/mp2';
import { ChevronDown, ChevronRight, Download, Info, Calendar } from 'lucide-react';
import { exportResultsToCsv } from '../lib/exportUtils';

interface YearByYearTableProps {
  results: CalculationResults;
}

export const YearByYearTable: React.FC<YearByYearTableProps> = ({ results }) => {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const { yearlyRecords, inputs } = results;
  const isCompounded = inputs.dividendTreatment === 'reinvest';

  const toggleYear = (yearNum: number) => {
    setExpandedYear(expandedYear === yearNum ? null : yearNum);
  };

  return (
    <div id="year-by-year-table-section" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-[#123B63] tracking-tight flex items-center gap-2">
            <span>Year-by-Year Schedule</span>
            <span className="text-[11px] font-normal px-2 py-0.5 bg-[#EAF3FA] text-[#0B5CAB] rounded border border-blue-200">
              {isCompounded ? 'Compounded (Reinvested)' : 'Annual Payout Mode'}
            </span>
          </h3>
          <p className="text-xs text-[#526575] mt-0.5">
            {isCompounded 
              ? 'Dividends are reinvested annually into the account balance.' 
              : 'Dividends are disbursed annually as payout; savings balance remains principal contributions.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportResultsToCsv(results)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#123B63] border border-[#D9E3EC] transition shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#0B5CAB]" />
          <span>Export Table (CSV)</span>
        </button>
      </div>

      {/* Official Government Data Table */}
      <div className="overflow-x-auto rounded-md border border-[#D9E3EC]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#EAF3FA] border-b border-[#D9E3EC] text-[#123B63] font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3 w-10 text-center"></th>
              <th className="py-2.5 px-3 whitespace-nowrap">Timeline</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Beginning Balance</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Contributions</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Dividend Rate</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Inflation</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">
                {isCompounded ? 'Dividend Reinvested' : 'Dividend Received'}
              </th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#123B63]">
                {isCompounded ? 'Ending Balance' : 'Savings Balance'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-mono-num text-[#172B3A]">
            {yearlyRecords.map((yr, idx) => {
              const isExpanded = expandedYear === yr.year;
              return (
                <React.Fragment key={`year-row-${yr.year}`}>
                  <tr 
                    onClick={() => toggleYear(yr.year)}
                    className={`hover:bg-[#F5F9FC] cursor-pointer transition select-none ${
                      idx % 2 === 1 ? 'bg-[#FAFCFE]' : 'bg-white'
                    } ${isExpanded ? 'bg-[#EAF3FA]/50 font-semibold' : ''}`}
                  >
                    <td className="py-2.5 px-3 text-center text-[#526575]">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 inline text-[#0B5CAB]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 inline text-slate-400" />
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#123B63] whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="font-bold text-[#0F1E36] font-mono-num">{yr.calendarYear}</span>
                        <span className="text-[11px] text-slate-500">(Yr {yr.year})</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#526575] whitespace-nowrap">
                      ₱{yr.beginningBalance.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#172B3A] whitespace-nowrap">
                      ₱{yr.annualContributions.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5 font-sans">
                        <span className="text-[#147D80] font-bold font-mono-num">{yr.dividendRate.toFixed(2)}%</span>
                        {yr.dividendStatus === 'declared' ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Declared
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            Assumption
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap text-[11px]">
                      <div className="inline-flex items-center justify-end gap-1 font-sans text-slate-600">
                        <span className="font-mono-num">{yr.inflationRate.toFixed(1)}%</span>
                        <span className="text-[9px] text-slate-400">
                          {yr.inflationStatus === 'historical' ? '(BSP)' : '(Proj)'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#21865B] whitespace-nowrap">
                      +₱{yr.dividendEarned.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#123B63] whitespace-nowrap">
                      ₱{yr.totalAccumulatedValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>

                  {/* Expandable Monthly Breakdown Sub-Table */}
                  {isExpanded && (
                    <tr className="bg-[#F8FAFC]">
                      <td colSpan={8} className="py-3 px-4 border-y border-[#D9E3EC]">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-[#526575]">
                            <div className="flex items-center space-x-1.5 font-sans font-semibold text-[#123B63]">
                              <Calendar className="w-3.5 h-3.5 text-[#0B5CAB]" />
                              <span>Monthly Remittance Breakdown — Year {yr.year} ({yr.calendarYear})</span>
                            </div>
                            <span className="text-[11px] italic font-sans">
                              *Dividend is weighted by month of deposit (AMB formula)
                            </span>
                          </div>

                          <div className="overflow-x-auto border border-[#D9E3EC] rounded bg-white">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="bg-[#F1F5F9] border-b border-[#CBD5E1] text-[#526575] text-[10px] uppercase font-semibold">
                                  <th className="py-1.5 px-3">Month</th>
                                  <th className="py-1.5 px-3 text-right">Contribution</th>
                                  <th className="py-1.5 px-3 text-right">Balance Before Deposit</th>
                                  <th className="py-1.5 px-3 text-right">Weight (Months)</th>
                                  <th className="py-1.5 px-3 text-right">Month Dividend Credit</th>
                                  <th className="py-1.5 px-3 text-right">End Month Balance</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E2E8F0] font-mono-num text-[11px]">
                                {yr.months.map((m) => (
                                  <tr key={`month-${yr.year}-${m.monthOfYear}`} className="hover:bg-slate-50">
                                    <td className="py-1 px-3 font-medium text-[#172B3A] font-sans">
                                      {m.monthName}
                                    </td>
                                    <td className="py-1 px-3 text-right text-[#172B3A]">
                                      ₱{m.contribution.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-1 px-3 text-right text-[#526575]">
                                      ₱{m.beginningBalance.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-1 px-3 text-right text-[#526575]">
                                      {13 - m.monthOfYear}/12
                                    </td>
                                    <td className="py-1 px-3 text-right text-[#21865B] font-medium">
                                      ₱{m.estimatedMonthlyDividend.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-1 px-3 text-right font-medium text-[#123B63]">
                                      ₱{m.endingBalance.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Summary Note */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#526575] gap-2 pt-2">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-[#0B5CAB] shrink-0" />
          <span>Click on any year to inspect month-by-month remittance dividend weighting.</span>
        </div>
        <div className="font-mono-num font-medium text-[#123B63]">
          Total 5-Yr Accumulated Dividends: <strong>₱{results.totalDividendsEarned.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      </div>

    </div>
  );
};
