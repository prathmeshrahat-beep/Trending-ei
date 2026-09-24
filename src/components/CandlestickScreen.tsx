import React, { useState } from 'react';
import { Search, Flame, ArrowUpRight, TrendingUp, TrendingDown, Volume2, MessageSquare } from 'lucide-react';
import { TRADING_PATTERNS } from '../data/patternsData';
import { PatternDiagram } from './PatternDiagram';
import { TradingPattern } from '../types';
import { voiceManager } from '../services/voice';

interface CandlestickScreenProps {
  onSendToChat: (promptText: string) => void;
}

export const CandlestickScreen: React.FC<CandlestickScreenProps> = ({ onSendToChat }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'single' | 'double' | 'triple' | 'bullish' | 'bearish'>('all');
  const [activeVoicePatternId, setActiveVoicePatternId] = useState<string | null>(null);

  // Filter only candlestick patterns (not chart patterns)
  const candlestickPatterns = TRADING_PATTERNS.filter((p) => {
    return p.candleGroup === 'single' || p.candleGroup === 'double' || p.candleGroup === 'triple';
  });

  const filtered = candlestickPatterns.filter((pattern) => {
    const q = search.toLowerCase();
    const matchesSearch =
      pattern.name.toLowerCase().includes(q) ||
      (pattern.hindiName && pattern.hindiName.toLowerCase().includes(q)) ||
      (pattern.whatItDoes && pattern.whatItDoes.toLowerCase().includes(q)) ||
      (pattern.marketAction && pattern.marketAction.toLowerCase().includes(q)) ||
      pattern.explanation.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'single') return pattern.candleGroup === 'single';
    if (filter === 'double') return pattern.candleGroup === 'double';
    if (filter === 'triple') return pattern.candleGroup === 'triple';
    if (filter === 'bullish') return pattern.direction === 'bullish';
    if (filter === 'bearish') return pattern.direction === 'bearish';
    return true;
  });

  const handleSpeakPattern = (pattern: TradingPattern) => {
    if (activeVoicePatternId === pattern.id) {
      voiceManager.stopSpeaking();
      setActiveVoicePatternId(null);
      return;
    }
    const textToSpeak = `${pattern.name}। ${pattern.hindiName || ''}। ${pattern.whatItDoes || ''}। ${pattern.marketAction || ''}। पुष्टि: ${pattern.confirmation || ''}। स्टॉप लॉस: ${pattern.risk || ''}`;
    setActiveVoicePatternId(pattern.id);
    voiceManager.speak(textToSpeak, {
      language: 'hi-IN',
      onEnd: () => setActiveVoicePatternId(null),
      onError: () => setActiveVoicePatternId(null),
    });
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Title & Search */}
      <div className="bg-[#0b101a] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>कैंडलस्टिक लाइब्रेरी (Candlesticks)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              सिंगल, डबल और ट्रिपल कैंडलस्टिक पैटर्न्स, डायरेक्शनल सिग्नल व स्टॉप-लॉस
            </p>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="खोजें (Hammer, Doji, Engulfing...)"
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'सभी कैंडलस्टिक' },
            { id: 'single', label: 'Single Candles' },
            { id: 'double', label: 'Double Candles' },
            { id: 'triple', label: 'Triple Candles' },
            { id: 'bullish', label: '🟢 केवल बुलिश' },
            { id: 'bearish', label: '🔴 केवल बियरिश' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === tab.id
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Candlesticks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pattern) => {
          const isBullish = pattern.direction === 'bullish';
          const isBearish = pattern.direction === 'bearish';
          const isSpeaking = activeVoicePatternId === pattern.id;

          return (
            <div
              key={pattern.id}
              className={`bg-[#0c121e] border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                isBullish
                  ? 'border-emerald-500/20 hover:border-emerald-500/50'
                  : isBearish
                  ? 'border-rose-500/20 hover:border-rose-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Pattern Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider mb-1 ${
                        isBullish
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isBearish
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isBullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {(pattern.direction || 'neutral').toUpperCase()}
                    </span>
                    <h3 className="font-bold text-sm text-slate-100">{pattern.name}</h3>
                    {pattern.hindiName && (
                      <p className="text-xs text-slate-400 font-medium">{pattern.hindiName}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSpeakPattern(pattern)}
                    className={`p-2 rounded-xl transition-all ${
                      isSpeaking
                        ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="बोलकर सुनें (Voice Audio)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* SVG Visual Diagram */}
                <div className="my-3 bg-[#060a12] border border-slate-800/80 rounded-xl p-3 flex items-center justify-center">
                  <PatternDiagram type={pattern.diagramType || 'hammer'} />
                </div>

                {/* What it does */}
                {pattern.whatItDoes && (
                  <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    {pattern.whatItDoes}
                  </p>
                )}

                {/* Market action signal */}
                {pattern.marketAction && (
                  <div
                    className={`p-2 rounded-xl text-xs font-bold mb-2 flex items-center gap-1.5 ${
                      isBullish
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    <span>{pattern.marketAction}</span>
                  </div>
                )}
              </div>

              {/* Action Button: Send to chat */}
              <button
                onClick={() =>
                  onSendToChat(`मुझे ${pattern.name} (${pattern.hindiName || ''}) के बारे में बताएं। लाइव मार्केट में इसके साथ परफेक्ट एंट्री, कन्फर्मेशन और स्टॉप-लॉस कैसे तय करें?`)
                }
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-slate-800/80 hover:bg-cyan-900/40 text-slate-300 hover:text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700/60 hover:border-cyan-500/40 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>चैट में इसके बारे में पूछें</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
