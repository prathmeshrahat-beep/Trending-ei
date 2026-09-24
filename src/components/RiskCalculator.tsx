import React, { useState } from 'react';
import { ShieldAlert, Calculator, ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';

interface RiskCalculatorProps {
  onSendToChat?: (text: string) => void;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({ onSendToChat }) => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [entryPrice, setEntryPrice] = useState<number>(2500);
  const [stopLoss, setStopLoss] = useState<number>(2450);
  const [takeProfit, setTakeProfit] = useState<number>(2625);
  const [leverage, setLeverage] = useState<number>(1);
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');

  const currSymbol = currency === 'INR' ? '₹' : '$';

  // Math calculations
  const riskAmount = (accountSize * riskPercent) / 100;
  const isLong = tradeType === 'long';
  const stopDistance = isLong ? entryPrice - stopLoss : stopLoss - entryPrice;
  const profitDistance = isLong ? takeProfit - entryPrice : entryPrice - takeProfit;

  const validPrices = stopDistance > 0 && profitDistance > 0 && entryPrice > 0;

  const positionSize = validPrices ? Math.floor(riskAmount / stopDistance) : 0;
  const totalPositionValue = positionSize * entryPrice;
  const marginRequired = leverage > 0 ? totalPositionValue / leverage : totalPositionValue;
  const expectedProfit = positionSize * profitDistance;
  const riskRewardRatio = stopDistance > 0 ? profitDistance / stopDistance : 0;
  const stopLossPercent = (stopDistance / entryPrice) * 100;
  const takeProfitPercent = (profitDistance / entryPrice) * 100;

  // Estimated liquidation price under leverage
  const liquidationBuffer = leverage > 1 ? entryPrice / leverage : 0;
  const estLiquidation = isLong
    ? Math.max(0, entryPrice - liquidationBuffer * 0.9)
    : entryPrice + liquidationBuffer * 0.9;

  const handleSendToAI = () => {
    if (!onSendToChat) return;
    const summary = `कृपया मेरे इस ट्रेड सेटअप और रिस्क प्रोफाइल का विश्लेषण करें:
• Trade: ${tradeType.toUpperCase()}
• Capital: ${currSymbol}${accountSize.toLocaleString()}
• Risk Per Trade: ${riskPercent}% (${currSymbol}${riskAmount.toFixed(2)})
• Entry Price: ${currSymbol}${entryPrice}
• Stop Loss: ${currSymbol}${stopLoss} (-${stopLossPercent.toFixed(2)}%)
• Take Profit: ${currSymbol}${takeProfit} (+${takeProfitPercent.toFixed(2)}%)
• Position Size: ${positionSize} Units (${currSymbol}${totalPositionValue.toLocaleString()})
• Leverage: ${leverage}x
• Risk/Reward Ratio: 1:${riskRewardRatio.toFixed(2)}

क्या यह रिस्क-रिवार्ड और स्टॉप-लॉस प्लेसमेंट वर्तमान मार्केट कंडीशन में तर्कसंगत है?`;
    onSendToChat(summary);
  };

  return (
    <div className="bg-[#0b1019] border border-slate-800 rounded-2xl p-4 md:p-6 text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Trade Risk & Position Engine</h2>
            <p className="text-xs text-slate-400">Capital preservation, stop-loss distance & leverage assessment</p>
          </div>
        </div>

        {/* Currency & Type Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#121a29] p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currency === 'INR' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currency === 'USD' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ USD
            </button>
          </div>

          <div className="flex bg-[#121a29] p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setTradeType('long')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                isLong ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
              }`}
            >
              LONG
            </button>
            <button
              onClick={() => setTradeType('short')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                !isLong ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400'
              }`}
            >
              SHORT
            </button>
          </div>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-medium">Account Capital ({currSymbol})</label>
          <input
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(Math.max(1, Number(e.target.value)))}
            className="w-full bg-[#121a29] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-400 font-medium">Risk Per Trade (%)</label>
            <span className="text-amber-400 font-mono">{riskPercent}% = {currSymbol}{riskAmount.toFixed(0)}</span>
          </div>
          <input
            type="range"
            min="0.25"
            max="5"
            step="0.25"
            value={riskPercent}
            onChange={(e) => setRiskPercent(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">Entry Price ({currSymbol})</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(Math.max(0.01, Number(e.target.value)))}
            className="w-full bg-[#121a29] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">Stop Loss Price ({currSymbol})</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Math.max(0.01, Number(e.target.value)))}
            className="w-full bg-[#121a29] border border-slate-800 rounded-xl px-3 py-2 text-rose-300 font-mono focus:outline-none focus:border-rose-500 transition-colors"
          />
          <span className="text-[10px] text-slate-500">
            {stopDistance > 0 ? `Distance: ${currSymbol}${stopDistance.toFixed(2)} (${stopLossPercent.toFixed(2)}%)` : 'Invalid Stop Price'}
          </span>
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">Take Profit Target ({currSymbol})</label>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(Math.max(0.01, Number(e.target.value)))}
            className="w-full bg-[#121a29] border border-slate-800 rounded-xl px-3 py-2 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span className="text-[10px] text-slate-500">
            {profitDistance > 0 ? `Target: +${currSymbol}${profitDistance.toFixed(2)} (+${takeProfitPercent.toFixed(2)}%)` : 'Invalid Target'}
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-400 font-medium">Leverage Multiplier</label>
            <span className="text-cyan-400 font-mono">{leverage}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>

      {/* Calculation Results Card */}
      <div className="mt-6 bg-[#0f1827] border border-slate-800/90 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Position Sizing & Risk Metric Output</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#131f33] p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Position Size</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{positionSize} Units</span>
            <span className="text-[10px] text-slate-500 block">Value: {currSymbol}{totalPositionValue.toLocaleString()}</span>
          </div>

          <div className="bg-[#131f33] p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Max Capital at Risk</span>
            <span className="text-lg font-bold font-mono text-rose-400">{currSymbol}{riskAmount.toFixed(0)}</span>
            <span className="text-[10px] text-slate-500 block">Exact {riskPercent}% of account</span>
          </div>

          <div className="bg-[#131f33] p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Expected Reward</span>
            <span className="text-lg font-bold font-mono text-emerald-300">{currSymbol}{expectedProfit.toFixed(0)}</span>
            <span className="text-[10px] text-slate-500 block">+{((expectedProfit / accountSize) * 100).toFixed(2)}% on account</span>
          </div>

          <div className="bg-[#131f33] p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Risk / Reward Ratio</span>
            <span className={`text-lg font-bold font-mono ${riskRewardRatio >= 2 ? 'text-emerald-400' : riskRewardRatio >= 1.5 ? 'text-amber-400' : 'text-rose-400'}`}>
              1 : {riskRewardRatio.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block">{riskRewardRatio >= 2 ? 'Favorable Setup' : 'Sub-optimal RR'}</span>
          </div>
        </div>

        {/* Leverage / Liquidation Warning */}
        {leverage > 1 && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-semibold">Leverage Alert ({leverage}x): </span>
              Margin needed is {currSymbol}{marginRequired.toFixed(0)}. Estimated liquidation occurs around{' '}
              <span className="font-mono font-bold">{currSymbol}{estLiquidation.toFixed(2)}</span>. Ensure your stop loss triggers well before liquidation!
            </div>
          </div>
        )}

        {/* Evaluation Summary */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs">
            {riskRewardRatio >= 1.8 && riskPercent <= 2 ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Healthy Risk-to-Reward Profile
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-4 h-4" /> Consider adjusting Take Profit to achieve at least 1:2 Risk/Reward
              </span>
            )}
          </div>

          {onSendToChat && (
            <button
              onClick={handleSendToAI}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask AI to Review Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
