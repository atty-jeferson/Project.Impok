import React, { useState } from 'react';
import { generateSensitivityMatrix } from '../lib/mp2Calculator';
import { CalculationInputs } from '../types/mp2';
import { Grid } from 'lucide-react';

interface SensitivityMatrixProps {
  currentInputs: CalculationInputs;
  onSelectCell: (monthly: number, rate: number) => void;
}

export const SensitivityMatrix: React.FC<SensitivityMatrixProps> = ({ currentInputs, onSelectCell }) => {
  const [metricType, setMetricType] = useState<'maturity' | 'dividends'>('maturity');
  const monthlyLevels = [3000, 5000, 7500, 10000, 15000, 20000];
  const rateLevels = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0];

  const { matrix } = generateSensitivityMatrix(
    currentInputs.startingAmount,
    currentInputs.projectionYears,
    currentInputs.dividendTreatment,
    monthlyLevels,
    rateLevels
  );

  // Determine min and max for heatmap color scaling
  const allValues = matrix.flatMap(row => 
    rateLevels.map(r => metricType === 'maturity' ? row.rates[r].maturityValue : row.rates[r].totalDividends)
  );
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  const getHeatmapColor = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    // Government Blue clean heatmap progression
    if (ratio < 0.25) return 'bg-white text-[#526575]';
    if (ratio < 0.50) return 'bg-[#F5F9FD] text-[#172B3A] font-medium';
    if (ratio < 0.75) return 'bg-[#E3F0FA] text-[#0B5CAB] font-semibold';
    return 'bg-[#CBE4F8] text-[#123B63] font-bold';
  };

  return (
    <div id="sensitivity-matrix-section" className="bg-white border border-[#D9E3EC] rounded-lg p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D9E3EC]">
        <div>
          <h3 className="text-base font-bold text-[#123B63] tracking-tight flex items-center">
            <Grid className="w-4 h-4 mr-2 text-[#0B5CAB]" />
            <span>Sensitivity Heatmap Matrix</span>
          </h3>
          <p className="text-xs text-[#526575] mt-0.5">
            How your {currentInputs.projectionYears}-year balance responds to changes in monthly savings vs. dividend rates
          </p>
        </div>

        {/* Toggle between Maturity Value and Dividends Only */}
        <div className="flex items-center space-x-1 p-1 bg-[#F1F5F9] border border-[#D9E3EC] rounded-md text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMetricType('maturity')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              metricType === 'maturity' ? 'bg-[#0B5CAB] text-white shadow-xs font-bold' : 'text-[#526575] hover:text-[#172B3A]'
            }`}
          >
            Projected Value
          </button>
          <button
            type="button"
            onClick={() => setMetricType('dividends')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              metricType === 'dividends' ? 'bg-[#0B5CAB] text-white shadow-xs font-bold' : 'text-[#526575] hover:text-[#172B3A]'
            }`}
          >
            Dividends Only
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-[#D9E3EC]">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            <tr className="bg-[#EAF3FA] text-[#123B63] font-bold border-b border-[#D9E3EC]">
              <th className="py-2.5 px-3 text-left font-sans">
                Monthly Contrib. \ Dividend
              </th>
              {rateLevels.map(r => (
                <th key={`head-rate-${r}`} className="py-2.5 px-2 font-mono-num">
                  {r.toFixed(1)}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-mono-num">
            {matrix.map((row) => {
              const isCurrentMonthly = Math.abs(currentInputs.monthlyContribution - row.monthly) < 500;
              return (
                <tr key={`row-${row.monthly}`} className="hover:opacity-95">
                  <td className={`py-2.5 px-3 text-left font-bold border-r border-[#D9E3EC] ${
                    isCurrentMonthly ? 'bg-[#EAF3FA] text-[#0B5CAB]' : 'bg-[#FAFCFE] text-[#172B3A]'
                  }`}>
                    ₱{row.monthly.toLocaleString('en-PH')}
                    {isCurrentMonthly && <span className="ml-1 text-[10px] font-sans text-[#0B5CAB] font-semibold">(current)</span>}
                  </td>
                  {rateLevels.map(r => {
                    const data = row.rates[r];
                    const val = metricType === 'maturity' ? data.maturityValue : data.totalDividends;
                    const isCurrentCell = isCurrentMonthly && Math.abs(currentInputs.assumedDividendRate - r) < 0.25;

                    return (
                      <td
                        key={`cell-${row.monthly}-${r}`}
                        onClick={() => onSelectCell(row.monthly, r)}
                        title={`Click to set: ₱${row.monthly.toLocaleString('en-PH')}/mo @ ${r.toFixed(1)}%`}
                        className={`py-2 px-2 cursor-pointer transition relative border-r border-[#E2E8F0] last:border-r-0 ${getHeatmapColor(val)} ${
                          isCurrentCell ? 'ring-2 ring-inset ring-[#0B5CAB] font-black' : ''
                        }`}
                      >
                        ₱{Math.round(val / 1000)}k
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#526575] gap-2">
        <span className="italic">💡 Tip: Click any cell in the heatmap to load that exact monthly & dividend scenario directly into the calculator.</span>
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <span>Heatmap:</span>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-white border border-[#CBD5E1]"></span>
            <span>Lower</span>
            <span className="w-3 h-3 rounded bg-[#CBE4F8] border border-[#0B5CAB] ml-1"></span>
            <span>Higher</span>
          </div>
        </div>
      </div>
    </div>
  );
};
