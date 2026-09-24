import React, { useState } from 'react';
import { Search, BarChart2, TrendingUp, TrendingDown, Volume2, MessageSquare, ArrowUpRight } from 'lucide-react';
import { TRADING_PATTERNS } from '../data/patternsData';
import { PatternDiagram } from './PatternDiagram';
import { TradingPattern } from '../types';
import { voiceManager } from '../services/voice';

interface ChartPatternsScreenProps {
  onSendToChat: (promptText: string) => void;
}

export const ChartPatternsScreen: React.FC<ChartPatternsScreenProps> = ({ onSendToChat }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'reversal' | 'continuation' | 'bullish' | 'bearish'>('all');
  const [activeVoicePatternId, setActiveVoicePatternId] = useState<string | null>(null);

  // Filter only chart patterns
  const chartPatterns = TRADING_PATTERNS.filter((p) => {
    return (
      p.candleGroup === 'pattern' ||
      p.category === 'reversal' ||
      p.category === 'continuation' ||
      p.category === 'structure' ||
      p.id.includes('head_shoulders') ||
      p.id.includes('double_') ||
      p.id.includes('triple_') ||
      p.id.includes('triangle') ||
      p.id.includes('flag') ||
      p.id.includes('cup_handle') ||
      p.id.includes('wedge')
    );
  });

  const filtered = chartPatterns.filter((pattern) => {
    const q = search.toLowerCase();
    const matchesSearch =
      pattern.name.toLowerCase().includes(q) ||
      (pattern.hindiName && pattern.hindiName.toLowerCase().includes(q)) ||
      (pattern.whatItDoes && pattern.whatItDoes.toLowerCase().includes(q)) ||
      (pattern.marketAction && pattern.marketAction.toLowerCase().includes(q)) ||
      pattern.explanation.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'bullish') return pattern.direction === 'bullish';
    if (filter === 'bearish') return pattern.direction === 'bearish';
    if (filter === 'reversal') return pattern.category === 'reversal';
    if (filter === 'continuation') return pattern.category === 'continuation';
    return true;
  });

  const handleSpeakPattern = (pattern: TradingPattern) => {
    if (activeVoicePatternId === pattern.id) {
      voiceManager.stopSpeaking();
      setActiveVoicePatternId(null);
      return;
    }
    const textToSpeak = `${pattern.name}। ${pattern.hindiName || ''}। ${pattern.whatItDoes || ''}। ${pattern.marketAction || ''}। ब्रेकआउट पुष्टि: ${pattern.confirmation || ''}।`;
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
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <span>चार्ट पैटर्न्स (Chart Patterns)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Head & Shoulders, Double Top/Bottom, Triangles, Flags व Cup & Handle
            </p>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="पैटर्न खोजें (Head & Shoulders, Double Bottom...)"
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'सभी चार्ट पैटर्न' },
            { id: 'reversal', label: 'रिवर्सल (Reversal)' },
            { id: 'continuation', label: 'कंटीन्यूएशन (Continuation)' },
            { id: 'bullish', label: '🟢 बुलिश ब्रेकआउट' },
            { id: 'bearish', label: '🔴 बियरिश ब्रेकडाउन' },
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

      {/* Grid */}
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
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider mb-1 ${
                        isBullish
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isBearish
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
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
                    title="बोलकर सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* SVG Visual Diagram */}
                <div className="my-3 bg-[#060a12] border border-slate-800/80 rounded-xl p-3 flex items-center justify-center">
                  <PatternDiagram type={pattern.diagramType || 'head_and_shoulders'} />
                </div>

                {pattern.whatItDoes && (
                  <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    {pattern.whatItDoes}
                  </p>
                )}

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

              <button
                onClick={() =>
                  onSendToChat(`कृपया ${pattern.name} (${pattern.hindiName || ''}) चार्ट पैटर्न के बारे में विस्तार से बताएं। इसके ब्रेकआउट, नेकलाइन और टार्गेट लेवल की गणना कैसे करें?`)
                }
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-slate-800/80 hover:bg-cyan-900/40 text-slate-300 hover:text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700/60 hover:border-cyan-500/40 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>चैट में विश्लेषण प्राप्त करें</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
