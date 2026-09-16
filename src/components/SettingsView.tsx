import React from 'react';
import { Settings, RotateCcw, Download, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { CalculationInputs } from '../types/mp2';

interface SettingsViewProps {
  currentInputs: CalculationInputs;
  onChangeInputs: (inputs: Partial<CalculationInputs>) => void;
  onResetDefaults: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentInputs,
  onChangeInputs,
  onResetDefaults,
}) => {
  const handleClearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all locally saved MP2 scenarios and preferences? This cannot be undone.')) {
      localStorage.clear();
      alert('Local storage cleared successfully.');
      window.location.reload();
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentInputs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mp2_plan_settings_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-[#0B5CAB]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F1E36]">
              Planner Settings & Defaults
            </h1>
            <p className="text-xs text-slate-500">
              Configure global default assumptions, storage preferences, and data exports
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetDefaults}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-300 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Defaults</span>
        </button>
      </div>

      {/* Global Calculation Defaults */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#0F1E36]">
          Calculation & Economic Baseline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Default Assumed Dividend Rate (%)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.05"
                min="1"
                max="15"
                value={currentInputs.assumedDividendRate}
                onChange={(e) => onChangeInputs({ assumedDividendRate: parseFloat(e.target.value) || 6.5 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono-num font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-slate-500 font-bold">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Applied across dashboard and projection modules.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Default Annual Inflation Rate (%)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={currentInputs.annualInflationRate}
                onChange={(e) => onChangeInputs({ annualInflationRate: parseFloat(e.target.value) || 3.0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono-num font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-slate-500 font-bold">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Used for today's-peso purchasing power discounting.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Default Projection Horizon
            </label>
            <select
              value={currentInputs.projectionYears}
              onChange={(e) => onChangeInputs({ projectionYears: parseInt(e.target.value) || 5 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={5}>5 Years (Standard MP2 Cycle)</option>
              <option value={10}>10 Years (2 MP2 Cycles)</option>
              <option value={15}>15 Years (3 MP2 Cycles)</option>
              <option value={20}>20 Years (4 MP2 Cycles)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Default Dividend Payout Treatment
            </label>
            <select
              value={currentInputs.dividendTreatment}
              onChange={(e) => onChangeInputs({ dividendTreatment: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="reinvest">5-Year Compounded (Reinvested)</option>
              <option value="annual_payout">Annual Cash Payout</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & Storage */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#0F1E36] flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Local Storage & Data Privacy</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          This application runs 100% client-side in your browser. No financial data, scenario amounts, or personal parameters are ever sent to a remote server or third party.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0B5CAB] text-xs font-bold transition border border-blue-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Configuration (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleClearLocalStorage}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition border border-red-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local Storage Cache</span>
          </button>
        </div>
      </div>

    </div>
  );
};
