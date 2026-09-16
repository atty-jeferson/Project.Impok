import React, { useState } from 'react';
import { CalculationResults } from '../types/mp2';

interface InteractiveGrowthChartProps {
  results: CalculationResults;
}

export const InteractiveGrowthChart: React.FC<InteractiveGrowthChartProps> = ({ results }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [visibleSeries, setVisibleSeries] = useState({
    totalValue: true,
    contributions: true,
    dividends: true,
    realValue: true,
  });

  const { yearlyRecords, inputs } = results;

  // Build points: Year 0 (initial starting amount) + Year 1 to N
  const dataPoints = [
    {
      yearLabel: `Start (${inputs.startYear || 2024})`,
      yearNum: 0,
      calendarYear: inputs.startYear || 2024,
      contributions: inputs.startingAmount,
      dividends: 0,
      totalValue: inputs.startingAmount,
      realValue: inputs.startingAmount,
    },
    ...yearlyRecords.map((yr) => ({
      yearLabel: `Year ${yr.year} (${yr.calendarYear})`,
      yearNum: yr.year,
      calendarYear: yr.calendarYear,
      contributions: yr.cumulativeContributions,
      dividends: yr.cumulativeDividends,
      totalValue: yr.totalAccumulatedValue,
      realValue: yr.realValueInflationAdjusted,
    })),
  ];

  // Max value calculation for Y scale
  const allValues = dataPoints.flatMap(d => [
    visibleSeries.totalValue ? d.totalValue : 0,
    visibleSeries.contributions ? d.contributions : 0,
    visibleSeries.dividends ? d.dividends : 0,
    visibleSeries.realValue ? d.realValue : 0,
  ]);
  const maxValue = Math.max(...allValues, 10000);
  const yAxisMax = Math.ceil(maxValue * 1.1 / 10000) * 10000;

  // Dimensions
  const svgWidth = 800;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 45, left: 75 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const getX = (index: number) => padding.left + (index / (dataPoints.length - 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - (val / yAxisMax) * chartHeight;

  // Generate SVG path for a given series key
  const generatePath = (key: 'totalValue' | 'contributions' | 'dividends' | 'realValue') => {
    return dataPoints
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(d[key])}`)
      .join(' ');
  };

  const generateAreaPath = (key: 'totalValue') => {
    const linePath = generatePath(key);
    const lastX = getX(dataPoints.length - 1);
    const firstX = getX(0);
    const bottomY = getY(0);
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  // Y-axis gridline ticks (5 ticks)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(pct => Math.round(yAxisMax * pct));

  const hoveredData = hoverIndex !== null ? dataPoints[hoverIndex] : dataPoints[dataPoints.length - 1];

  return (
    <div id="growth-chart-section" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-[#0F1E36] tracking-tight flex items-center">
            <span>Portfolio Growth Trajectory</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Projection across {inputs.projectionYears} years @ {inputs.assumedDividendRate.toFixed(2)}% dividend assumption
          </p>
        </div>

        {/* Series Visibility Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setVisibleSeries(s => ({ ...s, totalValue: !s.totalValue }))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              visibleSeries.totalValue
                ? 'bg-blue-50 border-[#0B5CAB] text-[#0F1E36] font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0F1E36]"></div>
            <span>Ending Balance</span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleSeries(s => ({ ...s, contributions: !s.contributions }))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              visibleSeries.contributions
                ? 'bg-blue-50 border-[#0B5CAB] text-[#0B5CAB] font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0B5CAB]"></div>
            <span>Contributions</span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleSeries(s => ({ ...s, dividends: !s.dividends }))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              visibleSeries.dividends
                ? 'bg-emerald-50 border-emerald-600 text-emerald-700 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
            <span>Dividends</span>
          </button>

          <button
            type="button"
            onClick={() => setVisibleSeries(s => ({ ...s, realValue: !s.realValue }))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              visibleSeries.realValue
                ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <span>Inflation-Adjusted</span>
          </button>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          style={{ minWidth: '550px' }}
        >
          <defs>
            <linearGradient id="totalValueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B5CAB" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0B5CAB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((tickVal, idx) => {
            const y = getY(tickVal);
            return (
              <g key={`ytick-${idx}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray={tickVal === 0 ? undefined : '3 3'}
                  strokeWidth={tickVal === 0 ? 1.5 : 1}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#526575"
                  className="font-mono-num"
                >
                  ₱{tickVal >= 1000000 ? `${(tickVal / 1000000).toFixed(1)}M` : `${Math.round(tickVal / 1000)}k`}
                </text>
              </g>
            );
          })}

          {/* Area fill for total value */}
          {visibleSeries.totalValue && (
            <path
              d={generateAreaPath('totalValue')}
              fill="url(#totalValueGradient)"
            />
          )}

          {/* Contributions Line (Primary Blue Dashed) */}
          {visibleSeries.contributions && (
            <path
              d={generatePath('contributions')}
              fill="none"
              stroke="#155E9E"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}

          {/* Cumulative Dividends Line (Green) */}
          {visibleSeries.dividends && (
            <path
              d={generatePath('dividends')}
              fill="none"
              stroke="#21865B"
              strokeWidth="2.5"
            />
          )}

          {/* Real Value Line (Slate Gray Dotted) */}
          {visibleSeries.realValue && (
            <path
              d={generatePath('realValue')}
              fill="none"
              stroke="#526575"
              strokeWidth="1.75"
              strokeDasharray="3 3"
            />
          )}

          {/* Total Value Line (Deep Navy) */}
          {visibleSeries.totalValue && (
            <path
              d={generatePath('totalValue')}
              fill="none"
              stroke="#123B63"
              strokeWidth="3"
            />
          )}

          {/* X-Axis Labels & Vertical Guidance Bars */}
          {dataPoints.map((d, i) => {
            const x = getX(i);
            const isHovered = hoverIndex === i;
            return (
              <g key={`xpoint-${i}`}>
                {/* Vertical hover line */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={svgHeight - padding.bottom}
                    stroke="#0B5CAB"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* X-axis tick label */}
                <text
                  x={x}
                  y={svgHeight - padding.bottom + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fill={isHovered ? '#0B5CAB' : '#526575'}
                >
                  {i === 0 ? 'Start' : `Yr ${d.yearNum}`}
                </text>

                {/* Circles on data points */}
                {visibleSeries.totalValue && (
                  <circle
                    cx={x}
                    cy={getY(d.totalValue)}
                    r={isHovered ? 6 : 3.5}
                    fill="#123B63"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                )}

                {/* Transparent hover capture zone */}
                <rect
                  x={x - (chartWidth / (dataPoints.length - 1)) / 2}
                  y={padding.top}
                  width={chartWidth / (dataPoints.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Hover Details Bar */}
      <div className="mt-3 p-3 bg-[#F7F9FC] border border-[#E2E8F0] rounded-md grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-[#526575] uppercase font-bold block">Selected Point</span>
          <span className="font-bold text-[#123B63]">{hoveredData.yearLabel}</span>
        </div>

        <div>
          <span className="text-[10px] text-[#526575] uppercase font-bold block">Ending Balance</span>
          <span className="font-bold text-[#123B63] font-mono-num text-sm">
            ₱{hoveredData.totalValue.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[#526575] uppercase font-bold block">Cumulative Principal</span>
          <span className="font-semibold text-[#155E9E] font-mono-num">
            ₱{hoveredData.contributions.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-[#526575] uppercase font-bold block">Cumulative Dividends</span>
          <span className="font-semibold text-[#21865B] font-mono-num">
            +₱{hoveredData.dividends.toLocaleString('en-PH', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
};
