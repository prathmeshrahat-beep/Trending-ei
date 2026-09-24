export type MarketCategory = 'indian' | 'us' | 'crypto' | 'forex';

export type ChatMode =
  | 'chart'
  | 'technical'
  | 'news'
  | 'crypto'
  | 'indian'
  | 'us'
  | 'forex'
  | 'learn'
  | 'risk';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  image?: string; // base64 or object URL
  imageBase64?: string;
  timestamp: number;
  mode?: ChatMode;
  analysisData?: {
    asset?: string;
    timeframe?: string;
    structure?: string;
    trend?: string;
    support?: string;
    resistance?: string;
    volume?: string;
    pattern?: string;
    bullishScenario?: string;
    bearishScenario?: string;
    risk?: string;
    whatToWatch?: string;
    isUnclear?: boolean;
  };
  sources?: Array<{
    title: string;
    uri: string;
  }>;
  groundingSources?: Array<{
    title?: string;
    url: string;
  }>;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  mode: ChatMode;
}

export interface AppSettings {
  geminiApiKey: string; // Stored securely
  alphaVantageApiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enableWebResearch: boolean;
  enableNewsResearch: boolean;
  enableMarketData: boolean;
  enableVoiceResponse: boolean;
  voiceSpeed: number;
  voicePitch: number;
  preferredLanguage: 'auto' | 'english' | 'hinglish' | 'hindi';
  cameraFacingMode: 'environment' | 'user';
}

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  currency: string;
  timestamp: string;
  source: string;
  sparkline: number[];
  candles: CandlestickData[];
}

export interface TradingPattern {
  id: string;
  name: string;
  hindiName?: string;
  category:
    | 'candlestick_bullish'
    | 'candlestick_bearish'
    | 'candlestick_neutral'
    | 'reversal'
    | 'continuation'
    | 'structure';
  direction?: 'bullish' | 'bearish' | 'neutral';
  candleGroup?: 'single' | 'double' | 'triple' | 'pattern';
  whatItDoes?: string;
  marketAction?: string;
  explanation: string;
  example: string;
  bullishMeaning: string;
  bearishMeaning: string;
  confirmation: string;
  risk: string;
  diagramType:
    | 'hammer'
    | 'hanging_man'
    | 'inverted_hammer'
    | 'shooting_star'
    | 'marubozu_bullish'
    | 'marubozu_bearish'
    | 'doji'
    | 'spinning_top'
    | 'bullish_engulfing'
    | 'bearish_engulfing'
    | 'three_white_soldiers'
    | 'three_black_crows'
    | 'morning_star'
    | 'evening_star'
    | 'piercing_line'
    | 'dark_cloud_cover'
    | 'tweezer_bottom'
    | 'tweezer_top'
    | 'dragonfly_doji'
    | 'gravestone_doji'
    | 'bullish_trend'
    | 'bearish_trend'
    | 'sideways'
    | 'breakout'
    | 'breakdown'
    | 'support_bounce'
    | 'resistance_rejection'
    | 'double_top'
    | 'double_bottom'
    | 'head_shoulders'
    | 'inv_head_shoulders'
    | 'triangle'
    | 'wedge'
    | 'flag'
    | 'pennant'
    | 'cup_handle'
    | 'channel'
    | 'range'
    | 'higher_high'
    | 'higher_low'
    | 'lower_high'
    | 'lower_low';
}

export interface IndicatorInfo {
  id: string;
  name: string;
  abbreviation: string;
  category: 'momentum' | 'trend' | 'volatility' | 'volume';
  whatItMeans: string;
  howItWorks: string;
  bullishCondition: string;
  bearishCondition: string;
  limitations: string;
  priceActionPairing: string;
}

export interface MarketNewsItem {
  id: string;
  headline: string;
  source: string;
  date: string;
  time: string;
  category: MarketCategory | 'global';
  summary: string;
  marketRelevance: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

export interface KnowledgeTopic {
  id: string;
  title: string;
  category: 'basics' | 'technical' | 'risk' | 'instruments';
  summary: string;
  content: string;
  keyTakeaways: string[];
}
