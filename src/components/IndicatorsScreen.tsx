import React, { useState } from 'react';
import { Search, TrendingUp, ShieldAlert, Sparkles, MessageSquare, Layers } from 'lucide-react';
import { INDICATORS_DATA } from '../data/indicatorsData';
import { IndicatorInfo } from '../types';

interface IndicatorsScreenProps {
  onSendToChat: (prompt: string) => void;
}

export const IndicatorsScreen: React.FC<IndicatorsScreenProps> = ({ onSendToChat }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'momentum' | 'trend' | 'volatility' | 'volume'>('all');

  const filteredIndicators = INDICATORS_DATA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.abbreviation.toLowerCase().includes(search.toLowerCase()) ||
      item.whatItMeans.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAskAI = (item: IndicatorInfo) => {
    const prompt = `कृपया **${item.name} (${item.abbreviation})** इंडिकेटर का गहन विश्लेषण समझाएं।
1. यह किस प्रकार काम करता है और इसकी गणना कैसे होती है?
2. Bullish और Bearish कंडीशंस के वास्तविक उदाहरण बताएं।
3. इसकी क्या सीमाएं (Limitations) हैं और Price Action के साथ इसे सबसे प्रभावी ढंग से कैसे कंबाइन करें?`;
    onSendToChat(prompt);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Technical Indicators Guide ({INDICATORS_DATA.length} Indicators)
              </h2>
              <p className="text-xs text-slate-400">
                Mathematical mechanics, bullish/bearish conditions, edge limitations & confluence
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search indicators (e.g. RSI, VWAP, EMA)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121a29] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/80">
          {(['all', 'momentum', 'trend', 'volatility', 'volume'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat === 'all' ? `All (${INDICATORS_DATA.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Indicator Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIndicators.map((item) => (
          <div
            key={item.id}
            className="bg-[#0b1019] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl space-y-4"
          >
            <div>
              {/* Title & Abbreviation */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                    {item.abbreviation}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{item.name}</h3>
                </div>
                <span className="text-[10px] uppercase font-semibold text-slate-500">
                  {item.category}
                </span>
              </div>

              {/* What it means */}
              <div className="mt-3 space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">What It Means: </strong>
                  {item.whatItMeans}
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <strong className="text-slate-300">How It Works: </strong>
                  {item.howItWorks}
                </p>
              </div>

              {/* Bullish & Bearish Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-300">
                  <strong className="text-emerald-400 block mb-1">Bullish Condition:</strong>
                  {item.bullishCondition}
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-300">
                  <strong className="text-rose-400 block mb-1">Bearish Condition:</strong>
                  {item.bearishCondition}
                </div>
              </div>

              {/* Limitations & Price Action Pairing */}
              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-300/90">
                  <strong className="text-amber-400 block mb-0.5">Known Limitations:</strong>
                  {item.limitations}
                </div>
                <div className="p-2.5 rounded-xl bg-[#101726] border border-slate-800 text-slate-300">
                  <strong className="text-cyan-400 block mb-0.5">Price Action Pairing:</strong>
                  {item.priceActionPairing}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Not a standalone trade signal</span>
              <button
                onClick={() => handleAskAI(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 rounded-xl text-xs font-semibold transition-all shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Analyze with AI
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-[#0a0f19] border border-amber-500/20 rounded-xl text-xs text-amber-300/90 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Indicator Disclaimer:</strong> Indicators are derivatives of price and volume—they mathematically lag the actual live auction. No indicator produces guaranteed signals. Use indicators solely for confluence to validate your primary thesis based on market structure and risk management.
        </p>
      </div>
    </div>
  );
};
