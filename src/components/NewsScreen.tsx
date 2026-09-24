import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, MessageSquare, ExternalLink, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketNewsItem, MarketCategory } from '../types';

interface NewsScreenProps {
  onSendToChat: (prompt: string) => void;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({ onSendToChat }) => {
  const [selectedCat, setSelectedCat] = useState<MarketCategory>('indian');
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${selectedCat}`);
      const data = await res.json();
      if (data.news) {
        setNews(data.news);
      }
    } catch (e) {
      console.error('Error fetching market news', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCat]);

  const handleAnalyzeImpact = (item: MarketNewsItem) => {
    const prompt = `कृपया इस मार्केट समाचार के संभावित प्रभाव (Market Impact) का विश्लेषण करें:
• Headline: "${item.headline}"
• Source: ${item.source} (${item.date} ${item.time})
• Summary: ${item.summary}
• Market Relevance: ${item.marketRelevance}

1. इसका संबंधित सेक्टर्स और स्टॉक्स पर क्या बुलिश/बियरिश असर हो सकता है?
2. ट्रेडर्स को किन मुख्य लेवल्स या रिस्क फैक्टर्स पर नजर रखनी चाहिए?`;
    onSendToChat(prompt);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Category Filter & Refresh Header */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Financial Market News</h2>
              <p className="text-xs text-slate-400">Grounded news feeds with market relevance & sentiment mapping</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchNews}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh News"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setSelectedCat('indian')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedCat === 'indian'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇮🇳 Indian Market
          </button>
          <button
            onClick={() => setSelectedCat('us')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedCat === 'us'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🇺🇸 US Market
          </button>
          <button
            onClick={() => setSelectedCat('crypto')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedCat === 'crypto'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ₿ Crypto
          </button>
          <button
            onClick={() => setSelectedCat('forex')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedCat === 'forex'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💱 Forex
          </button>
        </div>
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((item) => {
          const isBull = item.sentiment === 'bullish';
          const isBear = item.sentiment === 'bearish';

          return (
            <div
              key={item.id}
              className="bg-[#0b1019] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl space-y-3"
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">{item.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.date} {item.time}
                    </span>
                  </div>

                  {/* Sentiment Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isBull
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : isBear
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isBull ? <TrendingUp className="w-3 h-3" /> : isBear ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {item.sentiment}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-sm font-bold text-slate-100 hover:text-amber-400 transition-colors leading-snug">
                  {item.headline}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed mt-2">{item.summary}</p>

                {/* Relevance */}
                <div className="mt-3 p-2 rounded-lg bg-[#111826] border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-amber-400">Relevance: </strong>
                  {item.marketRelevance}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  onClick={() => handleAnalyzeImpact(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 rounded-xl text-xs font-semibold transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Analyze Market Impact with AI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
