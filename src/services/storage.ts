import { AppSettings, Conversation, ChatMessage, ChatMode } from '../types';

const SETTINGS_KEY = 'tradepulse_settings_v1';
const CHATS_KEY = 'tradepulse_chats_v1';
const ACTIVE_CHAT_KEY = 'tradepulse_active_chat_id';

const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  alphaVantageApiKey: '',
  model: 'gemini-3.1-flash-lite',
  temperature: 0.3,
  maxTokens: 1024,
  enableWebResearch: false,
  enableNewsResearch: true,
  enableMarketData: true,
  enableVoiceResponse: true,
  voiceSpeed: 1.25,
  voicePitch: 1.05,
  preferredLanguage: 'auto',
  cameraFacingMode: 'environment',
};

// Safe key masking function as requested: "Never display the complete API key after saving. Show only: ************ABCD"
export function maskApiKey(key?: string): string {
  if (!key || key.trim().length === 0) return '';
  const trimmed = key.trim();
  if (trimmed.length <= 4) return '************' + trimmed;
  const suffix = trimmed.slice(-4);
  return '************' + suffix;
}

// Obfuscate in localStorage
function encodeSecret(val: string): string {
  if (!val) return '';
  try {
    return btoa(encodeURIComponent(val));
  } catch {
    return val;
  }
}

function decodeSecret(val: string): string {
  if (!val) return '';
  try {
    return decodeURIComponent(atob(val));
  } catch {
    return val;
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      enableVoiceResponse: parsed.enableVoiceResponse !== false,
      voiceSpeed: parsed.voiceSpeed || 1.25,
      voicePitch: parsed.voicePitch || 1.05,
      geminiApiKey: parsed.geminiApiKey ? decodeSecret(parsed.geminiApiKey) : '',
      alphaVantageApiKey: parsed.alphaVantageApiKey ? decodeSecret(parsed.alphaVantageApiKey) : '',
    };
  } catch (e) {
    console.error('Failed to load settings from storage', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    const toStore = {
      ...settings,
      geminiApiKey: encodeSecret(settings.geminiApiKey),
      alphaVantageApiKey: encodeSecret(settings.alphaVantageApiKey),
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(toStore));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) {
      // Create initial conversation
      const initialChat: Conversation = {
        id: 'chat_' + Date.now(),
        title: 'Trading Analysis & Insights',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        mode: 'chart',
        messages: [
          {
            id: 'msg_welcome',
            sender: 'ai',
            text: `नमस्ते और Welcome to **TradePulse AI** — आपका समर्पित Financial Market & Chart Analysis Assistant.

मैं आपकी किस प्रकार सहायता कर सकता हूँ?
1. 📸 **चार्ट की फोटो या स्क्रीनशॉट अपलोड करें** — Candlestick, Support, Resistance, Market Structure और Bullish/Bearish Scenarios का विस्तृत विश्लेषण प्राप्त करें।
2. 🇮🇳 **Indian Markets** (NIFTY, BANK NIFTY, Stocks) या 🇺🇸 **US, ₿ Crypto, 💱 Forex** के बारे में प्रश्न पूछें।
3. 🎙️ **Microphone** बटन दबाकर बोलकर सवाल पूछें।
4. 📚 नीचे दिए गए Quick Modes या Side Drawer से Patterns, Indicators एवं Risk Calculator एक्सप्लोर करें।`,
            timestamp: Date.now(),
            mode: 'chart',
          },
        ],
      };
      saveConversations([initialChat]);
      return [initialChat];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load chats', e);
    return [];
  }
}

export function saveConversations(chats: Conversation[]): void {
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error('Failed to save chats', e);
  }
}

export function getActiveChatId(): string | null {
  return localStorage.getItem(ACTIVE_CHAT_KEY);
}

export function setActiveChatId(id: string): void {
  localStorage.setItem(ACTIVE_CHAT_KEY, id);
}
