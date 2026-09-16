import React, { useState, useMemo } from 'react';
import { Mp2AccountLadderItem, DividendTreatment } from '../types/mp2';
import { calculateLadderAccountProjection } from '../lib/mp2Calculator';
import { Layers, Plus, Trash2, Info, ArrowRight, Calendar, Sparkles } from 'lucide-react';

const MONTH_OPTIONS = [
  { value: 1, label: 'January (Month 1)' },
  { value: 2, label: 'February (Month 2)' },
  { value: 3, label: 'March (Month 3)' },
  { value: 4, label: 'April (Month 4)' },
  { value: 5, label: 'May (Month 5)' },
  { value: 6, label: 'June (Month 6)' },
  { value: 7, label: 'July (Month 7)' },
  { value: 8, label: 'August (Month 8)' },
  { value: 9, label: 'September (Month 9)' },
  { value: 10, label: 'October (Month 10)' },
  { value: 11, label: 'November (Month 11)' },
  { value: 12, label: 'December (Month 12)' },
];

export const Mp2Ladder: React.FC = () => {
  // Default 5-year ladder sequence with dynamically computed values
  const [accounts, setAccounts] = useState<Mp2AccountLadderItem[]>(() => {
    const baseYear = new Date().getFullYear();
    const initialLadder = [
      { id: 'ladder_1', name: 'Account 1 (Year 1 Foundation)', startYear: baseYear, startMonth: 1, initialDeposit: 10000, monthlyContribution: 5000, assumedRate: 6.50, dividendTreatment: 'reinvest' as DividendTreatment, maturityYear: baseYear + 5 },
      { id: 'ladder_2', name: 'Account 2 (Year 2 Ladder)', startYear: baseYear + 1, startMonth: 1, initialDeposit: 0, monthlyContribution: 5000, assumedRate: 6.50, dividendTreatment: 'reinvest' as DividendTreatment, maturityYear: baseYear + 6 },
      { id: 'ladder_3', name: 'Account 3 (Year 3 Ladder)', startYear: baseYear + 2, startMonth: 1, initialDeposit: 0, monthlyContribution: 5000, assumedRate: 6.50, dividendTreatment: 'reinvest' as DividendTreatment, maturityYear: baseYear + 7 },
      { id: 'ladder_4', name: 'Account 4 (Year 4 Ladder)', startYear: baseYear + 3, startMonth: 1, initialDeposit: 0, monthlyContribution: 5000, assumedRate: 6.50, dividendTreatment: 'reinvest' as DividendTreatment, maturityYear: baseYear + 8 },
      { id: 'ladder_5', name: 'Account 5 (Year 5 Ladder)', startYear: baseYear + 4, startMonth: 1, initialDeposit: 0, monthlyContribution: 5000, assumedRate: 6.50, dividendTreatment: 'reinvest' as DividendTreatment, maturityYear: baseYear + 9 },
    ];
    return initialLadder.map(acc => calculateLadderAccountProjection(acc));
  });

  const handleUpdateAccount = (id: string, updates: Partial<Mp2AccountLadderItem>) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id !== id) return acc;
      const merged = { ...acc, ...updates };
      // Ensure maturityYear stays synchronized 5 years ahead of startYear
      if (updates.startYear !== undefined) {
        merged.maturityYear = updates.startYear + 5;
      }
      return calculateLadderAccountProjection(merged);
    }));
  };

  const handleAddAccount = () => {
    const nextStartYear = accounts.length > 0 ? Math.max(...accounts.map(a => a.startYear)) + 1 : new Date().getFullYear();
    const newAcc = calculateLadderAccountProjection({
      id: 'ladder_' + Date.now(),
      name: `Account ${accounts.length + 1}`,
      startYear: nextStartYear,
      startMonth: 1,
      initialDeposit: 0,
      monthlyContribution: 5000,
      assumedRate: 6.50,
      dividendTreatment: 'reinvest',
      maturityYear: nextStartYear + 5,
    });
    setAccounts(prev => [...prev, newAcc]);
  };

  const handleDeleteAccount = (id: string) => {
    if (accounts.length <= 1) return;
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  // Aggregate ladder totals
  const totalMaturityValue = useMemo(() => {
    return accounts.reduce((sum, a) => sum + a.projectedMaturityValue, 0);
  }, [accounts]);

  const totalContributions = useMemo(() => {
    return accounts.reduce((sum, a) => sum + a.totalContributions, 0);
  }, [accounts]);

  const totalDividends = useMemo(() => {
    return accounts.reduce((sum, a) => sum + a.totalDividends, 0);
  }, [accounts]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F1E36]">
              MP2 Savings Ladder
            </h1>
            <p className="text-xs text-slate-500">
              Staggered 5-year accounts for recurring liquidity and continuous dividend compounding
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddAccount}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B5CAB] hover:bg-[#155E9E] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Ladder Account</span>
        </button>
      </div>

      {/* Educational Explanation Box */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 space-y-2">
        <div className="flex items-center space-x-2 text-blue-900 font-bold">
          <Info className="w-4 h-4 text-[#0B5CAB] shrink-0" />
          <span>How the MP2 Savings Ladder Strategy Works</span>
        </div>
        <p className="leading-relaxed">
          <strong>By opening accounts in different years, you can potentially create a sequence of annual maturity dates.</strong> Because Pag-IBIG allows members to open multiple MP2 accounts simultaneously with no limit, you can start one account each year. After Year 5, one account matures every single year, providing annual liquidity while keeping your principal actively compounding.
        </p>
      </div>

      {/* Staggered Timeline Diagram */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0A223D] to-[#0B5CAB] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5 border border-blue-900/40">
        {/* Soft Atmospheric Radial Highlights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-white/15 pb-3 text-xs">
            <span className="font-bold text-sky-300 uppercase tracking-wider">
              Staggered Maturity Timeline Diagram
            </span>
            <span className="text-sky-100 font-semibold bg-white/10 px-2 py-1 rounded-md border border-white/10">
              {accounts.length} Accounts Sequence
            </span>
          </div>

          {/* Visual Timeline Rows */}
          <div className="space-y-3 pt-3 font-mono-num text-xs">
            {accounts.map((acc, index) => {
              const startMonthName = MONTH_OPTIONS.find(m => m.value === acc.startMonth)?.label.split(' ')[0] || 'Jan';
              return (
                <div key={acc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition shadow-inner">
                  <div className="flex items-center space-x-2 sm:w-1/4">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                    <span className="font-bold text-white truncate">{acc.name}</span>
                  </div>

                  {/* Stagger Bar Representation */}
                  <div className="my-2 sm:my-0 flex-1 flex items-center justify-center px-4">
                    <div className="flex items-center space-x-2 text-sky-100 text-[11px] w-full max-w-md justify-between">
                      <span className="px-2 py-1 rounded-lg bg-white/10 text-sky-200 font-bold border border-white/5 shadow-inner">
                        {acc.startYear} ({startMonthName})
                      </span>
                      <div className="flex-1 mx-2 flex items-center">
                        <div className="h-1 flex-1 bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 relative rounded-full opacity-80">
                          <span className="absolute left-1/2 -top-4 -translate-x-1/2 text-[9px] text-sky-100 uppercase tracking-widest font-sans font-semibold">
                            5-Year Tenor
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-inner">
                        {acc.maturityYear} Maturity
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:w-1/4">
                    <span className="text-emerald-400 font-black text-sm">
                      ₱{acc.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    </span>
                    <div className="text-[10px] text-sky-200 mt-0.5">
                      Monthly: ₱{acc.monthlyContribution.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Aggregate Ladder Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Combined Ladder Maturity
          </div>
          <div className="text-2xl font-black text-[#0F1E36] font-mono-num mt-1">
            ₱{totalMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total payouts over {accounts.length} rolling maturity cycles
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Out-of-Pocket Saved
          </div>
          <div className="text-2xl font-black text-[#0B5CAB] font-mono-num mt-1">
            ₱{totalContributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Principal across all {accounts.length} staggered accounts
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Compounded Dividends
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono-num mt-1">
            +₱{totalDividends.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            100% Tax-free earnings accumulated
          </p>
        </div>
      </div>

      {/* Account Configuration Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F1E36]">
            Configure Ladder Accounts
          </h2>
          <span className="text-xs text-slate-500">
            All calculations dynamic and month-weighted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3">Account Name</th>
                <th className="p-3">Start Year</th>
                <th className="p-3">Start Month</th>
                <th className="p-3">Initial Deposit</th>
                <th className="p-3">Monthly Remittance</th>
                <th className="p-3">Assumed Rate</th>
                <th className="p-3">Option</th>
                <th className="p-3 font-mono-num">Projected Maturity</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-semibold text-slate-900">
                    <input
                      type="text"
                      value={acc.name}
                      onChange={(e) => handleUpdateAccount(acc.id, { name: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={acc.startYear}
                      onChange={(e) => handleUpdateAccount(acc.id, { startYear: Number(e.target.value) || 2026 })}
                      className="w-20 px-2 py-1 border border-slate-200 rounded text-xs font-mono-num focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={acc.startMonth}
                      onChange={(e) => handleUpdateAccount(acc.id, { startMonth: Number(e.target.value) || 1 })}
                      className="px-2 py-1 border border-slate-200 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      {MONTH_OPTIONS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 font-mono-num">
                    <input
                      type="number"
                      step={500}
                      min={0}
                      value={acc.initialDeposit}
                      onChange={(e) => handleUpdateAccount(acc.id, { initialDeposit: Number(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-slate-200 rounded text-xs font-mono-num focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="p-3 font-mono-num">
                    <input
                      type="number"
                      step={500}
                      min={0}
                      value={acc.monthlyContribution}
                      onChange={(e) => handleUpdateAccount(acc.id, { monthlyContribution: Number(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-slate-200 rounded text-xs font-mono-num focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="p-3 font-mono-num">
                    <input
                      type="number"
                      step={0.1}
                      min={1}
                      max={15}
                      value={acc.assumedRate}
                      onChange={(e) => handleUpdateAccount(acc.id, { assumedRate: Number(e.target.value) || 6.5 })}
                      className="w-16 px-2 py-1 border border-slate-200 rounded text-xs font-mono-num focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="ml-1 text-slate-500">%</span>
                  </td>
                  <td className="p-3">
                    <select
                      value={acc.dividendTreatment}
                      onChange={(e) => handleUpdateAccount(acc.id, { dividendTreatment: e.target.value as DividendTreatment })}
                      className="px-2 py-1 border border-slate-200 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="reinvest">Compounded</option>
                      <option value="annual_payout">Annual Payout</option>
                    </select>
                  </td>
                  <td className="p-3 font-mono-num font-bold text-[#0F1E36]">
                    ₱{acc.projectedMaturityValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
                    <div className="text-[10px] text-slate-400 font-normal">
                      Matures {acc.maturityYear}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      disabled={accounts.length <= 1}
                      onClick={() => handleDeleteAccount(acc.id)}
                      className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Delete account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
