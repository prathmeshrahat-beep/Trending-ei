import React, { useState, useRef } from 'react';
import { CandlestickData } from '../types';

interface CandlestickChartProps {
  candles: CandlestickData[];
  symbol: string;
  currency?: string;
  height?: number;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  candles,
  symbol,
  currency = 'USD',
  height = 260,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!candles || candles.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-[#0d131f] border border-slate-800 rounded-xl text-slate-500 text-sm">
        No candlestick data available
      </div>
    );
  }

  // Calculate scales
  const prices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map((c) => c.volume)) || 1;

  // Chart dimensions
  const chartHeight = height - 60; // Leave 60px for volume at bottom
  const volumeHeight = 45;
  const paddingY = 15;

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minPrice) / priceRange) * (chartHeight - paddingY * 2);
  };

  const getVolY = (vol: number) => {
    return height - (vol / maxVolume) * volumeHeight;
  };

  const activeCandle = hoverIndex !== null ? candles[hoverIndex] : candles[candles.length - 1];
  const isUp = activeCandle.close >= activeCandle.open;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const candleWidth = rect.width / candles.length;
    const index = Math.floor(x / candleWidth);
    if (index >= 0 && index < candles.length) {
      setHoverIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="bg-[#0c121d] border border-slate-800/80 rounded-xl p-3 select-none" ref={containerRef}>
      {/* OHLC Bar Top */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono mb-2 pb-2 border-b border-slate-800/60 gap-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">{symbol}</span>
          <span className="text-slate-500">{activeCandle.time}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div>
            <span className="text-slate-500">O: </span>
            <span className="text-slate-300">{activeCandle.open.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500">H: </span>
            <span className="text-emerald-400">{activeCandle.high.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500">L: </span>
            <span className="text-rose-400">{activeCandle.low.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500">C: </span>
            <span className={isUp ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {activeCandle.close.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Vol: </span>
            <span className="text-slate-400">{activeCandle.volume.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg
          className="w-full h-full cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const price = minPrice + priceRange * (1 - pct);
            const y = paddingY + pct * (chartHeight - paddingY * 2);
            return (
              <g key={idx}>
                <line x1="0" y1={y} x2="100%" y2={y} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
                <text x="99%" y={y - 3} fill="#64748b" fontSize="9" textAnchor="end" className="font-mono">
                  {price.toFixed(price > 100 ? 1 : 4)}
                </text>
              </g>
            );
          })}

          {/* Candlesticks & Volume */}
          {candles.map((c, i) => {
            const candleWidthPercent = 100 / candles.length;
            const xCenter = `${(i + 0.5) * candleWidthPercent}%`;
            const xLeft = `${i * candleWidthPercent + candleWidthPercent * 0.15}%`;
            const barWidth = `${candleWidthPercent * 0.7}%`;

            const candleIsUp = c.close >= c.open;
            const color = candleIsUp ? '#10b981' : '#f43f5e';

            const yHigh = getY(c.high);
            const yLow = getY(c.low);
            const yOpen = getY(c.open);
            const yClose = getY(c.close);

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

            const volY = getVolY(c.volume);
            const volHeight = height - volY;

            return (
              <g key={i}>
                {/* Volume bar at bottom */}
                <rect
                  x={xLeft}
                  y={volY}
                  width={barWidth}
                  height={volHeight}
                  fill={color}
                  opacity="0.25"
                />

                {/* Wick */}
                <line x1={xCenter} y1={yHigh} x2={xCenter} y2={yLow} stroke={color} strokeWidth="1.2" />

                {/* Body */}
                <rect
                  x={xLeft}
                  y={bodyTop}
                  width={barWidth}
                  height={bodyHeight}
                  fill={candleIsUp ? color : color}
                  rx="1"
                />
              </g>
            );
          })}

          {/* Active Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={`${((hoverIndex + 0.5) * 100) / candles.length}%`}
                y1="0"
                x2={`${((hoverIndex + 0.5) * 100) / candles.length}%`}
                y2={height}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1="0"
                y1={getY(activeCandle.close)}
                x2="100%"
                y2={getY(activeCandle.close)}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={`${((hoverIndex + 0.5) * 100) / candles.length}%`}
                cy={getY(activeCandle.close)}
                r="3.5"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/40 font-mono">
        <span>Timeframe: 1H Candles</span>
        <span>Drag / Hover to inspect OHLC</span>
      </div>
    </div>
  );
};
