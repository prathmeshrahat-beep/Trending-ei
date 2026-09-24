import React, { useState } from 'react';
import {
  KeyRound,
  Cpu,
  Sliders,
  Globe,
  Newspaper,
  LineChart,
  Mic,
  Camera,
  ShieldCheck,
  Check,
  Trash2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { AppSettings } from '../types';
import { maskApiKey } from '../services/storage';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  targetSection?: 'general' | 'api' | 'voice' | 'camera';
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  targetSection = 'general',
}) => {
  // Local state for raw key inputs
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [alphaKeyInput, setAlphaKeyInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const maskedGemini = maskApiKey(settings.geminiApiKey);
  const maskedAlpha = maskApiKey(settings.alphaVantageApiKey);

  const handleSaveGeminiKey = (customVal?: string) => {
    const val = (customVal !== undefined ? customVal : geminiKeyInput).trim();
    if (!val) return;
    onUpdateSettings({
      ...settings,
      geminiApiKey: val,
    });
    setGeminiKeyInput('');
    setSaveSuccessMsg('✅ आपकी API Key पूरे ऐप और AI सिस्टम में सफलतापूर्वक सेट और सेव हो गई है!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handlePasteGeminiKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setGeminiKeyInput(text.trim());
      }
    } catch (e) {
      console.warn('Clipboard read error', e);
    }
  };

  const handleClearGeminiKey = () => {
    onUpdateSettings({
      ...settings,
      geminiApiKey: '',
    });
    setGeminiKeyInput('');
    setSaveSuccessMsg('Gemini API Key cleared. Default environment key will be used.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveAlphaKey = () => {
    if (!alphaKeyInput.trim()) return;
    onUpdateSettings({
      ...settings,
      alphaVantageApiKey: alphaKeyInput.trim(),
    });
    setAlphaKeyInput('');
    setSaveSuccessMsg('Alpha Vantage Key saved.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleClearAlphaKey = () => {
    onUpdateSettings({
      ...settings,
      alphaVantageApiKey: '',
    });
    setAlphaKeyInput('');
    setSaveSuccessMsg('Alpha Vantage Key cleared.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Success banner */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 1. API KEY CONFIGURATION */}
      {(targetSection === 'api' || targetSection === 'general') && (
        <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">AI API Key Configuration</h3>
              <p className="text-xs text-slate-400">Client-side encrypted key storage with automatic server proxy</p>
            </div>
          </div>

          {/* Gemini Key Form */}
          <div className="bg-[#0f1726] border border-emerald-500/30 rounded-xl p-4 md:p-5 space-y-3.5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-100 uppercase tracking-wider block">
                  Gemini API Key (Google AI Studio)
                </label>
                <p className="text-[11px] text-slate-400">
                  अपनी API Key नीचे बॉक्स में पेस्ट करके सेव करें — यह पूरे ऐप और AI सिस्टम में सक्रिय हो जाएगी।
                </p>
              </div>
              {maskedGemini ? (
                <span className="text-xs font-mono bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/40 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  पूरे सिस्टम में सक्रिय: {maskedGemini}
                </span>
              ) : (
                <span className="text-xs text-amber-400/90 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                  पर्यावरण कुंजी (Default Environment Key)
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={maskedGemini ? 'Enter new key to update or paste...' : 'Paste your API key here (AI Studio से प्राप्त की)...'}
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                className="flex-1 bg-[#141f33] border border-slate-700/80 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono transition-colors shadow-inner"
              />
              <button
                type="button"
                onClick={handlePasteGeminiKey}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-colors shrink-0"
                title="Paste from clipboard"
              >
                📋 पेस्ट करें (Paste)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => handleSaveGeminiKey()}
                disabled={!geminiKeyInput.trim()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                SAVE API KEY (सिस्टम में सेव करें)
              </button>
              {settings.geminiApiKey && (
                <button
                  onClick={handleClearGeminiKey}
                  className="px-4 py-2.5 bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  CLEAR API KEY
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal bg-[#0a101a] p-2.5 rounded-lg border border-slate-800">
              🔒 <strong>सुरक्षा गारंटी:</strong> आपकी API Key आपके डिवाइस की एन्क्रिप्टेड लोकल स्टोरेज में सुरक्षित रूप से सेव होती है और केवल आपके विश्लेषण अनुरोधों के लिए इस्तेमाल की जाती है।
            </p>
          </div>

          {/* Alpha Vantage API Section as explicitly required */}
          <div className="bg-[#0f1726] border border-slate-800/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                  Alpha Vantage API (Live & Historical Market Data)
                </span>
                <span className="text-[11px] text-slate-400">
                  Required to fetch real-time and historical equity/forex/crypto OHLC candles.
                </span>
              </div>
              {maskedAlpha && (
                <span className="text-xs font-mono bg-cyan-950/60 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                  Saved: {maskedAlpha}
                </span>
              )}
            </div>

            {/* Spec Details Card */}
            <div className="bg-[#0a0f19] border border-slate-800/80 rounded-lg p-3 text-[11px] font-mono space-y-1 text-slate-400">
              <div><strong className="text-slate-300">API NAME:</strong> Alpha Vantage</div>
              <div><strong className="text-slate-300">PURPOSE:</strong> Historical candlestick series & live quotes for stocks, forex, and crypto</div>
              <div><strong className="text-slate-300">REQUIRED KEY:</strong> Free API key from alphavantage.co</div>
              <div><strong className="text-slate-300">ENDPOINT CONFIGURATION:</strong> https://www.alphavantage.co/query</div>
              <div><strong className="text-slate-300">WHERE TO ADD IT:</strong> In the input below or via server environment (ALPHA_VANTAGE_API_KEY)</div>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder={maskedAlpha ? 'Enter new Alpha Vantage key to update...' : 'Paste your Alpha Vantage API key here...'}
                value={alphaKeyInput}
                onChange={(e) => setAlphaKeyInput(e.target.value)}
                className="w-full bg-[#141f33] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSaveAlphaKey}
                disabled={!alphaKeyInput.trim()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                SAVE ALPHA VANTAGE KEY
              </button>
              {settings.alphaVantageApiKey && (
                <button
                  onClick={handleClearAlphaKey}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. AI MODEL & INFERENCE SETTINGS */}
      {(targetSection === 'general') && (
        <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">AI Model & Analysis Engine</h3>
              <p className="text-xs text-slate-400">Configure intelligence, reasoning depth, and research capabilities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Model Selector */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">AI Model</label>
              <select
                value={settings.model}
                onChange={(e) => onUpdateSettings({ ...settings, model: e.target.value })}
                className="w-full bg-[#141f33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="gemini-3.8-flash">Gemini 3.8 Flash (High Reasoning & Vision)</option>
                <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (High Availability & Lowest Latency)</option>
                <option value="gemini-flash-latest">Gemini Flash Latest (Stable General)</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Automatic multi-model failover is active if upstream demand spikes occur.
              </span>
            </div>

            {/* Language */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Preferred Response Language</label>
              <select
                value={settings.preferredLanguage}
                onChange={(e) => onUpdateSettings({ ...settings, preferredLanguage: e.target.value as any })}
                className="w-full bg-[#141f33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="auto">Auto (Match User Language)</option>
                <option value="hinglish">Hinglish (Hindi + English Trading Terminology)</option>
                <option value="hindi">Pure Hindi (सरल हिंदी व्याख्या)</option>
                <option value="english">Professional English</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Temperature (Creativity vs Determinism)</label>
                <span className="font-mono text-emerald-400">{settings.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => onUpdateSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500">Lower values (0.2 - 0.4) ensure strict factual risk calculations.</span>
            </div>

            {/* Max Response Length */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Maximum Response Length</label>
                <span className="font-mono text-emerald-400">{settings.maxTokens} tokens</span>
              </div>
              <input
                type="range"
                min="512"
                max="4096"
                step="256"
                value={settings.maxTokens}
                onChange={(e) => onUpdateSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Research Toggles */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Live Grounding & Data Toggles</h4>

            <div className="flex items-center justify-between p-3 bg-[#111827] rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Enable Web Research</span>
                  <span className="text-[11px] text-slate-400">Ground answers in live Google Search results with source citations</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableWebResearch}
                onChange={(e) => onUpdateSettings({ ...settings, enableWebResearch: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#111827] rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-3">
                <Newspaper className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Enable News Research</span>
                  <span className="text-[11px] text-slate-400">Fetch financial news across Indian, US, Crypto, and Forex sectors</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableNewsResearch}
                onChange={(e) => onUpdateSettings({ ...settings, enableNewsResearch: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#111827] rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-3">
                <LineChart className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Enable Market Data Feeds</span>
                  <span className="text-[11px] text-slate-400">Include real-time market indices, 24h highs/lows and OHLC candles</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableMarketData}
                onChange={(e) => onUpdateSettings({ ...settings, enableMarketData: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. VOICE & SPEAKER SETTINGS */}
      {(targetSection === 'voice' || targetSection === 'general') && (
        <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">Voice & Audio Settings</h3>
              <p className="text-xs text-slate-400">Text-to-speech reading and microphone speech recognition preferences</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#111827] rounded-xl border border-slate-800/80">
              <div>
                <span className="text-xs font-medium text-slate-200 block">Read Answer (Text-To-Speech)</span>
                <span className="text-[11px] text-slate-400">Allow AI trading analysis responses to be read aloud</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableVoiceResponse}
                onChange={(e) => onUpdateSettings({ ...settings, enableVoiceResponse: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-medium">Speech Rate / Speed</label>
                  <span className="font-mono text-cyan-400">{settings.voiceSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={settings.voiceSpeed}
                  onChange={(e) => onUpdateSettings({ ...settings, voiceSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-medium">Voice Pitch</label>
                  <span className="font-mono text-cyan-400">{settings.voicePitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={settings.voicePitch}
                  onChange={(e) => onUpdateSettings({ ...settings, voicePitch: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CAMERA SETTINGS */}
      {(targetSection === 'camera' || targetSection === 'general') && (
        <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">Camera Settings</h3>
              <p className="text-xs text-slate-400">Configure chart capture viewfinder and optical input</p>
            </div>
          </div>

          <div className="text-xs space-y-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Default Camera Lens</label>
              <select
                value={settings.cameraFacingMode}
                onChange={(e) => onUpdateSettings({ ...settings, cameraFacingMode: e.target.value as any })}
                className="w-full bg-[#141f33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="environment">Back / Environment Camera (Recommended for Charts & Screens)</option>
                <option value="user">Front / Selfie Camera</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              Camera permissions are only requested when you tap the Camera button and never run in the background.
            </p>
          </div>
        </div>
      )}

      {/* 5. BOTTOM API KEY PERSISTENCE CARD (Dedicated Quick Set as requested) */}
      <div className="bg-gradient-to-r from-[#0d1624] via-[#101b2c] to-[#0d1624] border-2 border-emerald-500/50 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl shadow-emerald-950/20">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>सेट करें अपनी Gemini API Key (पूरे सिस्टम में सेव)</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                Active System Sync
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              अपनी API Key यहाँ पेस्ट करें और सेव करें — यह तुरंत पूरे ऐप, सभी चैट और AI मॉडल में सेट हो जाएगी।
            </p>
          </div>
        </div>

        {maskedGemini && (
          <div className="flex items-center justify-between p-2.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
            <span className="font-medium">✅ पूरे सिस्टम और AI में सक्रिय कुंजी:</span>
            <span className="font-mono font-bold tracking-wider">{maskedGemini}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            API KEY पेस्ट करें (Paste API Key Here):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={maskedGemini ? 'Enter new API key to update...' : 'यहाँ अपनी API Key पेस्ट करें (AI Studio से प्राप्त)...'}
              value={geminiKeyInput}
              onChange={(e) => setGeminiKeyInput(e.target.value)}
              className="flex-1 bg-[#141f33] border border-slate-700/80 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono transition-colors shadow-inner"
            />
            <button
              type="button"
              onClick={handlePasteGeminiKey}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-colors shrink-0"
              title="Clipboard se paste karein"
            >
              📋 पेस्ट करें (Paste)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => handleSaveGeminiKey()}
            disabled={!geminiKeyInput.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            [ SAVE API KEY ]
          </button>
          {settings.geminiApiKey && (
            <button
              onClick={handleClearGeminiKey}
              className="px-4 py-2.5 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              [ CLEAR API KEY ]
            </button>
          )}
        </div>

        <div className="bg-[#080d15] p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="text-slate-300 font-semibold">ℹ️ यह कैसे काम करता है:</p>
          <p>1. Google AI Studio से अपनी फ्री या पेड API Key कॉपी करें।</p>
          <p>2. ऊपर दिए गए बॉक्स में <strong>पेस्ट करें (Paste)</strong> और <strong>[ SAVE API KEY ]</strong> दबाएं।</p>
          <p>3. यह कुंजी पूरे ऐप, सभी स्क्रीन, चैट, चार्ट एनालिसिस और बैकएंड प्रॉक्सी में स्वचालित रूप से लागू हो जाएगी।</p>
        </div>
      </div>
    </div>
  );
};
