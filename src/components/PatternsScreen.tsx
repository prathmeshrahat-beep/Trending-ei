import React, { useState } from 'react';
import {
  Search,
  BarChart2,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Volume2,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { TRADING_PATTERNS } from '../data/patternsData';
import { PatternDiagram } from './PatternDiagram';
import { TradingPattern } from '../types';
import { voiceManager } from '../services/voice';

interface PatternsScreenProps {
  onSendToChat: (promptText: string) => void;
}

export const PatternsScreen: React.FC<PatternsScreenProps> = ({ onSendToChat }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [activeVoicePatternId, setActiveVoicePatternId] = useState<string | null>(null);

  const filteredPatterns = TRADING_PATTERNS.filter((pattern) => {
    const q = search.toLowerCase();
    const matchesSearch =
      pattern.name.toLowerCase().includes(q) ||
      (pattern.hindiName && pattern.hindiName.toLowerCase().includes(q)) ||
      (pattern.whatItDoes && pattern.whatItDoes.toLowerCase().includes(q)) ||
      (pattern.marketAction && pattern.marketAction.toLowerCase().includes(q)) ||
      pattern.explanation.toLowerCase().includes(q) ||
      pattern.example.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'bullish') return pattern.direction === 'bullish';
    if (filter === 'bearish') return pattern.direction === 'bearish';
    if (filter === 'neutral') return pattern.direction === 'neutral';
    if (filter === 'hammer_hanging')
      return (
        pattern.id === 'hammer_candle' ||
        pattern.id === 'hanging_man_candle' ||
        pattern.id === 'inverted_hammer' ||
        pattern.id === 'shooting_star'
      );
    if (filter === 'big_candles')
      return (
        pattern.id === 'marubozu_bullish' ||
        pattern.id === 'marubozu_bearish' ||
        pattern.id === 'bullish_engulfing' ||
        pattern.id === 'bearish_engulfing'
      );
    if (filter === 'small_candles')
      return (
        pattern.id === 'doji_spinning_top' ||
        pattern.id === 'dragonfly_doji' ||
        pattern.id === 'gravestone_doji'
      );
    if (filter === 'triple_candles')
      return (
        pattern.candleGroup === 'triple' ||
        pattern.id === 'three_white_soldiers' ||
        pattern.id === 'three_black_crows' ||
        pattern.id === 'morning_star' ||
        pattern.id === 'evening_star'
      );
    if (filter === 'chart_patterns') return pattern.candleGroup === 'pattern' || pattern.category === 'reversal' || pattern.category === 'continuation' || pattern.category === 'structure';

    return true;
  });

  const handleAskAI = (pattern: TradingPattern) => {
    voiceManager.primeAudio();
    const prompt = `कृपया **${pattern.hindiName || pattern.name}** के बारे में सरल हिंदी में विस्तार से बताएं।
1. यह कैंडल या चार्ट पैटर्न क्या काम करता है?
2. इसके आने के बाद मार्केट ऊपर जाएगा या नीचे जाएगा?
3. इसमें ट्रेड एंट्री, स्टॉप लॉस और टार्गेट कैसे तय किया जाता है?
4. लाइव मार्केट में इसका सही उदाहरण क्या है?`;
    onSendToChat(prompt);
  };

  const handleSpeakPattern = (pattern: TradingPattern) => {
    if (activeVoicePatternId === pattern.id) {
      voiceManager.stopSpeaking();
      setActiveVoicePatternId(null);
      return;
    }

    voiceManager.primeAudio();
    const speechText = `${pattern.hindiName || pattern.name}। ${pattern.marketAction || ''}। यह कैंडल क्या काम करती है: ${pattern.whatItDoes || pattern.explanation}। कन्फर्मेशन: ${pattern.confirmation}। रिस्क मैनेजमेंट: ${pattern.risk}`;

    setActiveVoicePatternId(pattern.id);
    voiceManager.speak(speechText, {
      rate: 1.25,
      pitch: 1.05,
      onEnd: () => setActiveVoicePatternId(null),
      onError: () => setActiveVoicePatternId(null),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c121d] via-[#101928] to-[#0c121d] border border-emerald-500/30 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-md">
              <BarChart2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black text-slate-100 uppercase tracking-wider">
                  सब चार्ट व कैंडलस्टिक ज्ञान (All Charts & Candles)
                </h2>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  {TRADING_PATTERNS.length} पैटर्न्स
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                कौन सी कैंडल क्या काम करती है, किसके बाद ऊपर जाएगा और किसके बाद नीचे जाएगा — सचित्र संपूर्ण जानकारी
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="खोजें (जैसे हैमर, हैंगिंग मैन, बड़ी कैंडल, W)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121a29] border border-slate-700 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            🌟 सब चार्ट व कैंडल ({TRADING_PATTERNS.length})
          </button>
          <button
            onClick={() => setFilter('bullish')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'bullish'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40 border border-emerald-500/30'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            मार्केट ऊपर जाएगा (Bullish)
          </button>
          <button
            onClick={() => setFilter('bearish')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'bearish'
                ? 'bg-rose-500 text-white shadow-md font-bold'
                : 'bg-rose-950/40 text-rose-400 hover:bg-rose-900/40 border border-rose-500/30'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            मार्केट नीचे जाएगा (Bearish)
          </button>
          <button
            onClick={() => setFilter('hammer_hanging')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'hammer_hanging'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900/80 text-cyan-300 hover:bg-slate-800 border border-cyan-800/40'
            }`}
          >
            🔨 हैमर व हैंगिंग मैन
          </button>
          <button
            onClick={() => setFilter('big_candles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'big_candles'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900/80 text-amber-300 hover:bg-slate-800 border border-amber-800/40'
            }`}
          >
            🕯️ बड़ी कैंडल (मारूबोज़ू / एंगल्फिंग)
          </button>
          <button
            onClick={() => setFilter('small_candles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'small_candles'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900/80 text-indigo-300 hover:bg-slate-800 border border-indigo-800/40'
            }`}
          >
            🔘 छोटी कैंडल (डोजी / स्पिनिंग टॉप)
          </button>
          <button
            onClick={() => setFilter('triple_candles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'triple_candles'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-900/80 text-teal-300 hover:bg-slate-800 border border-teal-800/40'
            }`}
          >
            👥 तीनों कैंडल (सैनिक / कौवे / स्टार्स)
          </button>
          <button
            onClick={() => setFilter('chart_patterns')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'chart_patterns'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/80 text-purple-300 hover:bg-slate-800 border border-purple-800/40'
            }`}
          >
            📐 चार्ट पैटर्न (W, M, फ्लैग, H&S)
          </button>
        </div>
      </div>

      {/* Grid of All Candles and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatterns.map((pattern) => {
          const isSpeakingThis = activeVoicePatternId === pattern.id;
          const isBullish = pattern.direction === 'bullish';
          const isBearish = pattern.direction === 'bearish';

          return (
            <div
              key={pattern.id}
              className={`bg-[#0b1019] border rounded-2xl p-4 md:p-5 flex flex-col justify-between transition-all hover:shadow-2xl group ${
                isBullish
                  ? 'border-emerald-500/30 hover:border-emerald-500/70'
                  : isBearish
                  ? 'border-rose-500/30 hover:border-rose-500/70'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header & Direction Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-100 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                      {pattern.hindiName || pattern.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      {pattern.name}
                    </span>
                  </div>

                  {/* Market Direction Badge */}
                  {isBullish && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ऊपर जाएगा (UP)
                    </span>
                  )}
                  {isBearish && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                      <TrendingDown className="w-3 h-3 text-rose-400" />
                      नीचे जाएगा (DOWN)
                    </span>
                  )}
                  {!isBullish && !isBearish && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold shrink-0">
                      ⚖️ रुकेगा / संशय
                    </span>
                  )}
                </div>

                {/* Visual SVG Diagram */}
                <div className="bg-[#05080e] border border-slate-800/80 rounded-xl p-2.5 mb-3 flex items-center justify-center overflow-hidden shadow-inner">
                  <PatternDiagram type={pattern.diagramType} className="w-full h-28" />
                </div>

                {/* Key Insight: Market Action */}
                {pattern.marketAction && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-bold mb-3 flex items-center gap-2 border ${
                      isBullish
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : isBearish
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                        : 'bg-amber-950/50 text-amber-200 border-amber-500/30'
                    }`}
                  >
                    <span>{pattern.marketAction}</span>
                  </div>
                )}

                {/* What it does */}
                <div className="bg-[#0f1726]/80 p-3 rounded-xl border border-slate-800/80 mb-3 space-y-1.5 text-xs">
                  <p className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    यह क्या काम करती है:
                  </p>
                  <p className="text-slate-200 leading-relaxed">
                    {pattern.whatItDoes || pattern.explanation}
                  </p>
                </div>

                {/* Trade Setup: Confirmation & Stop Loss */}
                <div className="space-y-1.5 text-[11px] mb-4">
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                    <strong className="text-emerald-400 block mb-0.5">
                      ✓ कन्फर्मेशन व ट्रेड एंट्री:
                    </strong>
                    {pattern.confirmation}
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
                    <strong className="text-rose-400 block mb-0.5">
                      🛡️ स्टॉप लॉस (Risk Management):
                    </strong>
                    {pattern.risk}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSpeakPattern(pattern)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSpeakingThis
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold animate-pulse'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                  title="इस कैंडल के बारे में बोलकर सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isSpeakingThis ? 'रोकें (Stop)' : '🔊 सुनें'}
                </button>

                <button
                  onClick={() => handleAskAI(pattern)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  AI से पूछें
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-12 bg-[#0c121d] border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">कोई चार्ट या कैंडलस्टिक नहीं मिली।</p>
          <button
            onClick={() => {
              setSearch('');
              setFilter('all');
            }}
            className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            सभी पैटर्न्स देखें
          </button>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 bg-[#0a0f19] border border-amber-500/20 rounded-xl text-xs text-amber-300/90 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>अनुशासित ट्रेडिंग नोट:</strong> कोई भी कैंडलस्टिक या चार्ट पैटर्न 100% गारंटी नहीं देता। हमेशा सपोर्ट/रेसिस्टेंस, वॉल्यूम कन्फर्मेशन और कड़े स्टॉप-लॉस के साथ ही ट्रेड लें।
        </p>
      </div>
    </div>
  );
};
