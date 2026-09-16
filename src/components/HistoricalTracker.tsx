import React, { useState } from 'react';
import { 
  HISTORICAL_MP2_RATES, 
  HISTORICAL_STATS 
} from '../data/historicalRates';
import { History, Award, ArrowDown, ShieldCheck } from 'lucide-react';

interface HistoricalTrackerProps {
  onSelectRate: (rate: number) => void;
}

export const HistoricalTracker: React.FC<HistoricalTrackerProps> = ({ onSelectRate }) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // SVG Chart dimensions
  const svgWidth = 800;
  const svgHeight = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const minRate = 2.0;
  const maxRate = 9.0;

  // Filter declared records for plotting
  const chartData = HISTORICAL_MP2_RATES
    .filter((d): d is (typeof d & { dividendRate: number; inflationRate: number }) => 
      d.dividendRate !== null && d.inflationRate !== null
    )
    .slice()
    .sort((a, b) => a.year - b.year);

  const getX = (index: number) => padLeft + (index / Math.max(1, chartData.length - 1)) * chartWidth;
  const getY = (rate: number) => padTop + chartHeight - ((rate - minRate) / (maxRate - minRate)) * chartHeight;

  // Generate paths
  const dividendPoints = chartData.map((d, i) => `${getX(i)},${getY(d.dividendRate)}`).join(' ');
  const inflationPoints = chartData.map((d, i) => `${getX(i)},${getY(d.inflationRate)}`).join(' ');

  return (
    <div id="historical-tracker-section" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E3EC]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-md bg-[#EAF3FA] text-[#0B5CAB]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#123B63]">
              Official Historical MP2 Dividend Performance (2011–2025)
            </h2>
            <p className="text-xs text-[#526575]">
              15-year official record of declared MP2 tax-free dividend returns vs Philippine headline inflation
            </p>
          </div>
        </div>

        <div className="flex items-center text-xs text-[#526575] bg-[#F1F5F9] px-3 py-1.5 rounded-md border border-[#D9E3EC]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#21865B] mr-1.5" />
          <span>Source: Pag-IBIG Fund Official Annual Reports & PSA</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 5-Year Average */}
        <div className="p-4 rounded-md bg-[#F8FAFC] border border-[#D9E3EC]">
          <div className="text-xs font-bold text-[#526575] uppercase">5-Year Average</div>
          <div className="text-2xl font-bold text-[#0B5CAB] font-mono-num mt-1">
            {HISTORICAL_STATS.fiveYearAverage.toFixed(2)}%
          </div>
          <p className="text-[11px] text-[#526575] mt-1">
            2020–2024 (Pandemic & Recovery)
          </p>
        </div>

        {/* 10-Year Average */}
        <div className="p-4 rounded-md bg-[#F8FAFC] border border-[#D9E3EC]">
          <div className="text-xs font-bold text-[#526575] uppercase">10-Year Average</div>
          <div className="text-2xl font-bold text-[#123B63] font-mono-num mt-1">
            {HISTORICAL_STATS.tenYearAverage.toFixed(2)}%
          </div>
          <p className="text-[11px] text-[#526575] mt-1">
            2015–2024 consistent track record
          </p>
        </div>

        {/* Highest Year */}
        <div className="p-4 rounded-md bg-[#F0FAF4] border border-[#B7E5C7]">
          <div className="text-xs font-bold text-[#21865B] uppercase flex items-center">
            <Award className="w-3.5 h-3.5 mr-1" />
            <span>Highest Year</span>
          </div>
          <div className="text-2xl font-bold text-[#21865B] font-mono-num mt-1">
            {HISTORICAL_STATS.maxDividend.rate.toFixed(2)}%
          </div>
          <p className="text-[11px] text-[#526575] mt-1">
            Recorded in {HISTORICAL_STATS.maxDividend.year}
          </p>
        </div>

        {/* Lowest Year */}
        <div className="p-4 rounded-md bg-[#F8FAFC] border border-[#D9E3EC]">
          <div className="text-xs font-bold text-[#526575] uppercase flex items-center">
            <ArrowDown className="w-3.5 h-3.5 mr-1" />
            <span>Lowest Year</span>
          </div>
          <div className="text-2xl font-bold text-[#172B3A] font-mono-num mt-1">
            {HISTORICAL_STATS.minDividend.rate.toFixed(2)}%
          </div>
          <p className="text-[11px] text-[#526575] mt-1">
            Recorded in {HISTORICAL_STATS.minDividend.year} (Initial roll-out)
          </p>
        </div>

      </div>

      {/* Interactive SVG Chart */}
      <div className="p-4 bg-[#F8FAFC] rounded-md border border-[#D9E3EC] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#123B63]">
            MP2 Dividends vs. Philippine Inflation Rate (2011–2024)
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-[#0B5CAB] rounded"></span>
              <span className="text-[#0B5CAB] font-bold">MP2 Dividend Rate</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-[#64748B] rounded"></span>
              <span className="text-[#526575] font-medium">PH Inflation Rate</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-52 select-none"
          >
            {/* Grid horizontal lines */}
            {[2, 4, 6, 8].map(r => (
              <g key={`grid-h-${r}`}>
                <line
                  x1={padLeft}
                  y1={getY(r)}
                  x2={svgWidth - padRight}
                  y2={getY(r)}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={getY(r) + 4}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                >
                  {r}%
                </text>
              </g>
            ))}

            {/* Inflation Line */}
            <polyline
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              points={inflationPoints}
            />

            {/* MP2 Dividend Line */}
            <polyline
              fill="none"
              stroke="#0B5CAB"
              strokeWidth="3"
              points={dividendPoints}
            />

            {/* Data points */}
            {chartData.map((item, i) => {
              const cx = getX(i);
              const cyDiv = getY(item.dividendRate);
              const isHovered = hoveredYear === item.year;

              return (
                <g 
                  key={`point-${item.year}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredYear(item.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                >
                  {/* Year labels on x axis */}
                  <text
                    x={cx}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    fill={isHovered ? '#0B5CAB' : '#64748B'}
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    '{String(item.year).slice(2)}
                  </text>

                  {/* Dividend circle */}
                  <circle
                    cx={cx}
                    cy={cyDiv}
                    r={isHovered ? 6 : 4}
                    fill="#0B5CAB"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={Math.max(padLeft, Math.min(svgWidth - padRight - 120, cx - 60))}
                        y={Math.max(padTop, cyDiv - 45)}
                        width="120"
                        height="36"
                        rx="4"
                        fill="#123B63"
                        stroke="#0B5CAB"
                        strokeWidth="1"
                      />
                      <text
                        x={Math.max(padLeft, Math.min(svgWidth - padRight - 120, cx - 60)) + 60}
                        y={Math.max(padTop, cyDiv - 45) + 15}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="Inter, sans-serif"
                      >
                        {item.year}: {item.dividendRate.toFixed(2)}%
                      </text>
                      <text
                        x={Math.max(padLeft, Math.min(svgWidth - padRight - 120, cx - 60)) + 60}
                        y={Math.max(padTop, cyDiv - 45) + 28}
                        textAnchor="middle"
                        fill="#CBD5E1"
                        fontSize="9"
                        fontFamily="Inter, sans-serif"
                      >
                        Inflation: {item.inflationRate.toFixed(2)}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Historical Rates Data Table */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B63] mb-2">
          Complete Official Declared Dividend History
        </h3>

        <div className="overflow-x-auto rounded-md border border-[#D9E3EC]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EAF3FA] border-b border-[#D9E3EC] text-[#123B63] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3 text-right">MP2 Dividend Rate</th>
                <th className="py-2.5 px-3 text-right">PH Inflation</th>
                <th className="py-2.5 px-3 text-right">Real Net Spread</th>
                <th className="py-2.5 px-3 text-right">₱100k Annual Earnings</th>
                <th className="py-2.5 px-3 text-center">Status / Use Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-mono-num text-[#172B3A]">
              {HISTORICAL_MP2_RATES.slice().reverse().map((item) => {
                const isDeclared = item.dividendRate !== null;
                const spread = isDeclared && item.inflationRate !== null ? item.dividendRate! - item.inflationRate : null;
                const p100kReturn = isDeclared ? 100000 * (item.dividendRate! / 100) : null;

                return (
                  <tr key={item.year} className="hover:bg-[#F5F9FC] transition">
                    <td className="py-2.5 px-3 font-bold text-[#123B63] font-sans">
                      <div className="flex items-center gap-1.5">
                        <span>{item.year}</span>
                        {isDeclared ? (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Declared
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#0B5CAB]">
                      {isDeclared ? `${item.dividendRate!.toFixed(2)}%` : 'Pending Q1 2027'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#526575]">
                      {item.inflationRate !== null ? `${item.inflationRate.toFixed(2)}%` : 'In Progress'}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${spread !== null && spread >= 0 ? 'text-[#21865B]' : 'text-[#C53030]'}`}>
                      {spread !== null ? (spread >= 0 ? `+${spread.toFixed(2)}%` : `${spread.toFixed(2)}%`) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#172B3A] font-semibold">
                      {p100kReturn !== null ? `₱${p100kReturn.toLocaleString('en-PH', { maximumFractionDigits: 0 })}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      {isDeclared ? (
                        <button
                          type="button"
                          onClick={() => onSelectRate(item.dividendRate!)}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-white hover:bg-[#F1F5F9] text-[#0B5CAB] border border-[#CBD5E1] transition cursor-pointer"
                        >
                          Apply {item.dividendRate!.toFixed(2)}%
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Not yet declared</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
