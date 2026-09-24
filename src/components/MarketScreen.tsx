import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  ExternalLink,
  MessageSquare,
  Clock,
  Database,
  BarChart2,
} from 'lucide-react';
import { MarketCategory, MarketQuote } from '../types';
import { CandlestickChart } from './CandlestickChart';

interface MarketScreenProps {
  onSendToChat: (prompt: string) => void;
  alphaVantageApiKey?: string;
}

export const MarketScreen: React.FC<MarketScreenProps> = ({ onSendToChat, alphaVantageApiKey }) => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('indian');
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NIFTY 50');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (alphaVantageApiKey) {
        headers['x-alphavantage-key'] = alphaVantageApiKey;
      }
      const res = await fetch(`/api/market-quotes?category=${activeCategory}`, { headers });
      const data = await res.json();
      if (data.quotes) {
        setQuotes(data.quotes);
        if (!data.quotes.find((q: MarketQuote) => q.symbol === selectedSymbol)) {
          setSelectedSymbol(data.quotes[0]?.symbol || '');
        }
      }
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Error fetching market quotes', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [activeCategory]);

  const selectedQuote = quotes.find((q) => q.symbol === selectedSymbol) || quotes[0];

  const handleAskAI = (quote: MarketQuote) => {
    const prompt = `कृपया **${quote.name} (${quote.symbol})** का तात्कालिक Technical और Market Structure विश्लेषण करें।
• Current Price: ${quote.currency === 'INR' ? '₹' : '$'}${quote.price.toLocaleString()}
• 24h Change: ${quote.change > 0 ? '+' : ''}${quote.change} (${quote.changePercent}%)
• 24h High: ${quote.high24h.toLocaleString()} | 24h Low: ${quote.low24h.toLocaleString()}
• Volume: ${quote.volume24h}
• Data Source: ${quote.source} (${quote.timestamp})

वर्तमान ट्रेंड, मुख्य सपोर्ट व रेसिस्टेंस लेवल्स, बुलिश व बियरिश सिनेरियो, और इनवैलिडेशन लेवल्स स्पष्ट करें।`;
    onSendToChat(prompt);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Category Tabs Header */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Category:</span>
            <div className="flex bg-[#121a29] p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveCategory('indian')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeCategory === 'indian'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🇮🇳</span> Indian Market
              </button>
              <button
                onClick={() => setActiveCategory('us')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeCategory === 'us'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🇺🇸</span> US Market
              </button>
              <button
                onClick={() => setActiveCategory('crypto')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeCategory === 'crypto'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>₿</span> Crypto
              </button>
              <button
                onClick={() => setActiveCategory('forex')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeCategory === 'forex'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>💱</span> Forex
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              {lastRefreshed ? `Updated: ${lastRefreshed}` : ''}
            </span>
            <button
              onClick={fetchQuotes}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Quotes"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Quote & Interactive Chart Showcase */}
      {selectedQuote && (
        <div className="bg-[#0b1019] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-100">{selectedQuote.name}</h3>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs">
                  {selectedQuote.symbol}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  Source: {selectedQuote.source}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedQuote.timestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-slate-100">
                  {selectedQuote.currency === 'INR' ? '₹' : '$'}
                  {selectedQuote.price.toLocaleString()}
                </div>
                <div
                  className={`text-xs font-mono font-semibold flex items-center justify-end gap-1 ${
                    selectedQuote.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {selectedQuote.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>
                    {selectedQuote.change >= 0 ? '+' : ''}
                    {selectedQuote.change} ({selectedQuote.changePercent}%)
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAskAI(selectedQuote)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                Analyze with AI
              </button>
            </div>
          </div>

          {/* Interactive Candlestick Chart */}
          <CandlestickChart
            candles={selectedQuote.candles || []}
            symbol={selectedQuote.symbol}
            currency={selectedQuote.currency}
            height={280}
          />
        </div>
      )}

      {/* Asset Quotes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quotes.map((quote) => {
          const isSelected = quote.symbol === selectedSymbol;
          const isPositive = quote.change >= 0;

          return (
            <div
              key={quote.symbol}
              onClick={() => setSelectedSymbol(quote.symbol)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#101b2d] border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                  : 'bg-[#0b1019] border-slate-800 hover:border-slate-700 hover:bg-[#0e1624]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-200">{quote.symbol}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-[100px]">{quote.name}</span>
              </div>

              <div className="text-lg font-bold font-mono text-slate-100 mb-1">
                {quote.currency === 'INR' ? '₹' : '$'}
                {quote.price.toLocaleString()}
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span
                  className={`font-semibold flex items-center gap-0.5 ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {quote.changePercent}%
                </span>
                <span className="text-[10px] text-slate-500">{quote.volume24h}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
