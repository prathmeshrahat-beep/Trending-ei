import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Camera,
  Image as ImageIcon,
  Paperclip,
  X,
  Square,
  Plus,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  BarChart2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { ChatMessage, ChatMode, AppSettings } from '../types';
import { voiceManager } from '../services/voice';

// Fast client-side image compression for instant uploads
function compressImageForFastUpload(file: File, maxDim = 1200): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, imageBase64?: string, mode?: ChatMode) => void;
  onStopGeneration: () => void;
  onNewChat: () => void;
  onOpenCamera: () => void;
  settings: AppSettings;
  activeChatTitle: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onStopGeneration,
  onNewChat,
  onOpenCamera,
  settings,
  activeChatTitle,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<ChatMode>('chart');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const analysisSteps = [
    'Scanning candlestick OHLC and wick rejections...',
    'Identifying key horizontal Support & Resistance zones...',
    'Evaluating multi-timeframe market structure (HH/HL/LH/LL)...',
    'Detecting chart patterns, volume conviction & liquidity pools...',
    'Synthesizing Bullish & Bearish probability scenarios...',
  ];

  // Dynamic analysis step ticker when loading
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setAnalysisStepIndex(0);
      interval = setInterval(() => {
        setAnalysisStepIndex((prev) => (prev + 1) % analysisSteps.length);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  // Auto-speak incoming AI responses fast as requested:
  // "और मुझे फास्ट बोल के सुनाए। जैसे जवाब आए, वैसे ही मुझे वो पढ़ के जल्दी सुना दे।"
  useEffect(() => {
    if (isLoading || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (
      lastMsg &&
      lastMsg.sender === 'ai' &&
      lastMsg.id !== lastSpokenIdRef.current &&
      lastMsg.id !== 'msg_welcome' &&
      settings.enableVoiceResponse !== false
    ) {
      lastSpokenIdRef.current = lastMsg.id;
      setSpeakingMsgId(lastMsg.id);
      voiceManager.speak(lastMsg.text, {
        rate: settings.voiceSpeed || 1.25,
        pitch: settings.voicePitch || 1.05,
        onEnd: () => setSpeakingMsgId(null),
        onError: () => setSpeakingMsgId(null),
      });
    }
  }, [messages, isLoading, settings.enableVoiceResponse, settings.voiceSpeed, settings.voicePitch]);

  // Image Upload Handling with Fast Compression
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid chart image (PNG, JPG, WEBP).');
      return;
    }

    try {
      const compressedBase64 = await compressImageForFastUpload(file);
      if (compressedBase64) {
        setSelectedImage(compressedBase64);
        setActiveMode('chart');
      }
    } catch (err) {
      console.error('Image compression failed, using direct reader', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        setActiveMode('chart');
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Text-To-Speech manual toggle
  const handleSpeakMessage = (msg: ChatMessage) => {
    if (speakingMsgId === msg.id) {
      voiceManager.stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msg.id);
      voiceManager.speak(msg.text, {
        rate: settings.voiceSpeed || 1.25,
        pitch: settings.voicePitch || 1.05,
        onEnd: () => setSpeakingMsgId(null),
        onError: () => setSpeakingMsgId(null),
      });
    }
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedMsgId(msg.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSend = () => {
    const textToSend = inputText.trim();
    if (!textToSend && !selectedImage) return;

    // Pre-unlock speech synthesis audio pipeline on user gesture
    voiceManager.primeAudio();

    onSendMessage(textToSend, selectedImage || undefined, activeMode);
    setInputText('');
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick prompt chips
  const quickChips = [
    { label: '📊 चार्ट व S/R लेवल्स', prompt: 'कृपया इस चार्ट के कैंडलस्टिक्स, सपोर्ट, रेसिस्टेंस और मार्केट स्ट्रक्चर का विस्तृत विश्लेषण करें।' },
    { label: '🎯 बुलिश व बियरिश दृश्य', prompt: 'वर्तमान मार्केट में संभावित बुलिश और बियरिश परिदृश्यों की स्पष्ट व्याख्या करें।' },
    { label: '⚖️ रिस्क व स्टॉप लॉस', prompt: 'इस ट्रेड के लिए सही स्टॉप लॉस, एंट्री और रिस्क-रिवॉर्ड अनुपात क्या होना चाहिए?' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#080d16] relative overflow-hidden select-text">
      {/* Top Chat Bar */}
      <div className="px-4 py-2 bg-[#0b1019] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-bold text-slate-200 truncate max-w-[170px] sm:max-w-md">
            {activeChatTitle || 'Trading Analysis Session'}
          </h2>
          {speakingMsgId && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium animate-pulse">
              <Volume2 className="w-3 h-3 text-amber-400" />
              वाचन चालू
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {speakingMsgId && (
            <button
              onClick={() => {
                voiceManager.stopSpeaking();
                setSpeakingMsgId(null);
              }}
              className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-semibold"
              title="ऑडियो रोकें"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>रोकें</span>
            </button>
          )}

          <button
            onClick={onNewChat}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
            title="Start new chat"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMsgId === msg.id;
          const isCopied = copiedMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-slate-700 text-slate-200'
                    : 'bg-emerald-600 text-slate-950 font-bold'
                }`}
              >
                {isUser ? (
                  <span className="text-[10px] font-mono font-bold">YOU</span>
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed max-w-[85vw] sm:max-w-2xl shadow-lg ${
                  isUser
                    ? 'bg-[#152438] text-slate-100 border border-cyan-500/30 rounded-tr-none'
                    : 'bg-[#0e1624] text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                {/* Attached Image if any */}
                {msg.imageBase64 && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-slate-700/80 bg-black/40">
                    <img
                      src={msg.imageBase64}
                      alt="Uploaded Chart"
                      className="max-h-80 w-auto object-contain mx-auto"
                    />
                  </div>
                )}

                {/* Text Content with Markdown Formatting */}
                <div className="whitespace-pre-wrap break-words font-sans space-y-2">
                  {msg.text}
                </div>

                {/* Grounding Citations if Web Research returned */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                      Grounding Sources & Web Citations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingSources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-cyan-400" />
                          <span className="truncate max-w-[150px]">{source.title || source.url}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Footer: Actions & Timestamp */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakMessage(msg)}
                        className={`flex items-center gap-1 p-1 rounded hover:text-slate-200 transition-colors ${
                          isSpeaking ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                        title={isSpeaking ? 'Stop Audio' : 'Read Answer Aloud'}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{isSpeaking ? 'Stop' : 'Listen'}</span>
                      </button>

                      <button
                        onClick={() => handleCopyMessage(msg)}
                        className="flex items-center gap-1 p-1 rounded hover:text-slate-200 text-slate-400 transition-colors"
                        title="Copy analysis"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Dynamic Analysis Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>

            <div className="bg-[#0e1624] border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs space-y-2.5 w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ANALYZING MARKET DATA...
                </span>
                <button
                  onClick={onStopGeneration}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/80 transition-colors"
                >
                  <Square className="w-3 h-3 fill-rose-300" />
                  Stop
                </button>
              </div>

              {/* Progress step message */}
              <div className="bg-[#121c2e] p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="animate-pulse">{analysisSteps[analysisStepIndex]}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar (when not loading) */}
      {!isLoading && messages.length <= 2 && (
        <div className="px-4 py-1.5 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                voiceManager.primeAudio();
                onSendMessage(chip.prompt, undefined, 'chart');
              }}
              className="text-[11px] bg-[#0e1624] hover:bg-[#142033] text-slate-300 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full whitespace-nowrap transition-all shadow-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Stage Container */}
      <div className="p-3 bg-[#0b1019] border-t border-slate-800 shrink-0">
        {/* Image Preview Bar with "IMAGE RECEIVED" badge as required */}
        {selectedImage && (
          <div className="mb-2.5 p-2 bg-[#121c2e] border border-emerald-500/40 rounded-xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-black shrink-0">
                <img src={selectedImage} alt="Chart to analyze" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="inline-block bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase mb-1">
                  IMAGE RECEIVED
                </span>
                <p className="text-xs text-slate-300 font-medium">Chart ready for technical analysis</p>
                <span className="text-[10px] text-slate-500">Candlesticks, S/R, volume & structure will be parsed</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedImage(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Input Row */}
        <div className="flex items-end gap-2 bg-[#121a29] border border-slate-800 rounded-2xl p-1.5 focus-within:border-emerald-500/80 transition-colors shadow-lg">
          {/* Action Attachment Buttons */}
          <div className="flex items-center gap-1 pb-1 pl-1">
            {/* Camera Button */}
            <button
              onClick={onOpenCamera}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors"
              title="Take Photo with Camera (📷)"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Gallery Upload Image Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
              title="Upload Chart Screenshot (🖼️ / 📎)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedImage
                ? 'Add specific instructions or question for this chart (e.g. Identify Support & Resistance)...'
                : 'Type your trading question or upload a chart screenshot...'
            }
            className="flex-1 bg-transparent border-none text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none max-h-36 py-2 px-1 leading-relaxed"
          />

          {/* Send / Stop Button */}
          <div className="pb-1 pr-1">
            {isLoading ? (
              <button
                onClick={onStopGeneration}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-white" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!inputText.trim() && !selectedImage}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-all shadow-md shadow-emerald-950"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer footer */}
        <div className="mt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3 h-3 text-emerald-500/80 shrink-0" />
          <span>Educational analysis only. Scenarios carry financial risk and are not financial advice.</span>
        </div>
      </div>
    </div>
  );
};
