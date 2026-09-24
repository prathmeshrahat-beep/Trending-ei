/**
 * TradePulse - Trading & Market Analysis Assistant
 * Featuring Central Sci-Fi Arc Reactor Core, Clean 5-Tab Navigation, and Offline-ready APK Build
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Home,
  MessageSquare,
  BarChart2,
  Flame,
  Settings as SettingsIcon,
  TrendingUp,
} from 'lucide-react';

import { JarvisCoreReactor } from './components/JarvisCoreReactor';
import { CandlestickScreen } from './components/CandlestickScreen';
import { ChartPatternsScreen } from './components/ChartPatternsScreen';
import { ChatArea } from './components/ChatArea';
import { SettingsScreen } from './components/SettingsScreen';
import { CameraModal } from './components/CameraModal';
import { PhotoViewerModal } from './components/PhotoViewerModal';
import { HistoryModal } from './components/HistoryModal';

import {
  Conversation,
  ChatMessage,
  AppSettings,
  ChatMode,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadConversations,
  saveConversations,
  getActiveChatId,
  setActiveChatId,
} from './services/storage';

export type MainTab = 'home' | 'candlestick' | 'patterns' | 'chat' | 'settings';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeChatId, setActiveChatIdState] = useState<string | null>(() => {
    const saved = getActiveChatId();
    if (saved && conversations.some((c) => c.id === saved)) return saved;
    return conversations[0]?.id || null;
  });

  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [photoViewer, setPhotoViewer] = useState<{
    isOpen: boolean;
    imageUrl: string | null;
    title?: string;
  }>({
    isOpen: false,
    imageUrl: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Sync conversations
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    if (activeChatId) {
      setActiveChatId(activeChatId);
    }
  }, [activeChatId]);

  const activeConversation =
    conversations.find((c) => c.id === activeChatId) ||
    conversations[0] || {
      id: 'default',
      title: 'ट्रेडिंग सत्र',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'chart' as ChatMode,
      messages: [],
    };

  // Create new chat
  const handleNewChat = () => {
    const newId = 'chat_' + Date.now();
    const newChat: Conversation = {
      id: newId,
      title: 'नया ट्रेडिंग सत्र',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'chart',
      messages: [
        {
          id: 'welcome_' + Date.now(),
          sender: 'ai',
          text: `नमस्ते! नया ट्रेडिंग सत्र प्रारंभ हो गया है।

आप किसी भी स्टॉक, इंडेक्स (NIFTY/BANK NIFTY), क्रिप्टो या फॉरेक्स चार्ट की इमेज अपलोड कर सकते हैं अथवा अपना प्रश्न पूछ सकते हैं।`,
          timestamp: Date.now(),
          mode: 'chart',
        },
      ],
    };
    const updated = [newChat, ...conversations];
    setConversations(updated);
    setActiveChatIdState(newId);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatIdState(id);
    setActiveTab('chat');
  };

  const handleDeleteChat = (id: string) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    if (activeChatId === id) {
      setActiveChatIdState(filtered[0]?.id || null);
    }
  };

  // Send message to AI
  const handleSendMessage = async (
    text: string,
    imageBase64?: string,
    mode: ChatMode = 'chart'
  ) => {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text: text || (imageBase64 ? 'कृपया इस अपलोड किए गए चार्ट का संपूर्ण टेक्निकल एवं स्ट्रक्चरल विश्लेषण करें।' : ''),
      imageBase64,
      timestamp: Date.now(),
      mode,
    };

    const updatedMessages = [...activeConversation.messages, userMessage];

    let newTitle = activeConversation.title;
    if (activeConversation.title === 'नया ट्रेडिंग सत्र' || activeConversation.title === 'New Trading Chat') {
      if (text) {
        newTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      } else if (imageBase64) {
        newTitle = 'चार्ट विश्लेषण';
      }
    }

    const updatedConversations = conversations.map((c) =>
      c.id === activeConversation.id
        ? { ...c, title: newTitle, messages: updatedMessages, updatedAt: Date.now() }
        : c
    );
    setConversations(updatedConversations);

    // AI streaming message placeholder
    const aiMessageId = 'msg_ai_' + Date.now();
    const initialAiMessage: ChatMessage = {
      id: aiMessageId,
      sender: 'ai',
      text: '',
      timestamp: Date.now(),
      mode,
    };

    const withAiPlaceholder = updatedConversations.map((c) =>
      c.id === activeConversation.id
        ? { ...c, messages: [...updatedMessages, initialAiMessage] }
        : c
    );
    setConversations(withAiPlaceholder);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Stream call to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
            imageBase64: m.imageBase64,
          })),
          mode,
          settings,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) throw new Error('Readable stream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeConversation.id) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === aiMessageId ? { ...m, text: accumulatedText } : m
              ),
            };
          })
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      // Fallback local structured trading response if server is offline or proxy is pending
      const fallbackText = `### 📊 TradePulse विश्लेषण
- **स्ट्रक्चर:** मार्केट चार्ट का विश्लेषण लोड हो रहा है।
- **कन्फर्मेशन:** मुख्य सपोर्ट और रेसिस्टेंस लेवल्स को मार्क करें।
- **स्टॉप-लॉस:** अपने पूर्व स्विंग लो/हाई के 1% रिस्क के अनुसार सुरक्षित स्टॉप-लॉस रखें।

*अधिक जानकारी हेतु विशिष्ट स्टॉक या टाइमफ्रेम साझा करें।*`;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversation.id) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === aiMessageId
                ? {
                    ...m,
                    text: fallbackText,
                  }
                : m
            ),
          };
        })
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSendPromptFromOtherScreens = (promptText: string) => {
    setActiveTab('chat');
    handleSendMessage(promptText, undefined, 'chart');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060a12] text-slate-100 font-sans antialiased">
      {/* Top History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        conversations={conversations}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        isOpen={photoViewer.isOpen}
        onClose={() => setPhotoViewer({ isOpen: false, imageUrl: null })}
        imageUrl={photoViewer.imageUrl}
        imageTitle={photoViewer.title}
        onSendToChat={(base64) => {
          setActiveTab('chat');
          handleSendMessage(
            'कृपया इस फोटो/चार्ट का संपूर्ण विश्लेषण करें।',
            base64,
            'chart'
          );
        }}
      />

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        preferredFacingMode={settings.cameraFacingMode}
        onPhotoCaptured={(base64) => {
          setActiveTab('chat');
          handleSendMessage(
            'कृपया इस कैमरे से कैप्चर किए गए चार्ट का संपूर्ण टेक्निकल एवं स्ट्रक्चरल विश्लेषण करें। Candlesticks, Support, Resistance, Market Structure और Bullish/Bearish Scenarios की पहचान करें।',
            base64,
            'chart'
          );
        }}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Minimal App Bar */}
        <header className="h-14 px-4 bg-[#0a0f18] border-b border-slate-800/90 flex items-center justify-between shrink-0 z-20">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-950">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-100 tracking-tight">TradePulse</span>
            </div>
          </div>

          {/* Top History Button */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-95 shadow"
            title="चैट हिस्ट्री देखें"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>हिस्ट्री</span>
          </button>
        </header>

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <JarvisCoreReactor
              onOpenChat={() => setActiveTab('chat')}
              onOpenCamera={() => setIsCameraOpen(true)}
              onOpenPhotoViewer={(src, title) =>
                setPhotoViewer({ isOpen: true, imageUrl: src, title })
              }
            />
          )}

          {activeTab === 'candlestick' && (
            <div className="p-4 md:p-6 max-w-6xl mx-auto">
              <CandlestickScreen onSendToChat={handleSendPromptFromOtherScreens} />
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="p-4 md:p-6 max-w-6xl mx-auto">
              <ChartPatternsScreen onSendToChat={handleSendPromptFromOtherScreens} />
            </div>
          )}

          {activeTab === 'chat' && (
            <ChatArea
              messages={activeConversation.messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onStopGeneration={handleStopGeneration}
              onNewChat={handleNewChat}
              onOpenCamera={() => setIsCameraOpen(true)}
              settings={settings}
              activeChatTitle={activeConversation.title}
            />
          )}

          {activeTab === 'settings' && (
            <div className="p-4 md:p-6 max-w-4xl mx-auto">
              <SettingsScreen
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                targetSection="general"
              />
            </div>
          )}
        </main>

        {/* Bottom 5 Clean Navigation Options Only */}
        <nav className="h-16 bg-[#0a0f18] border-t border-slate-800/90 flex items-center justify-around px-2 shrink-0 z-10 select-none">
          {/* 1. सेटिंग */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'settings'
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SettingsIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">सेटिंग</span>
          </button>

          {/* 2. कैंडलस्टिक */}
          <button
            onClick={() => setActiveTab('candlestick')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'candlestick'
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">कैंडलस्टिक</span>
          </button>

          {/* 3. होम / कोर (Central Emblem Screen) */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'home'
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">होम</span>
          </button>

          {/* 4. चैट पैटर्न */}
          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'patterns'
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">चार्ट पैटर्न</span>
          </button>

          {/* 5. मैसेज चैटिंग */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'chat'
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">मैसेज चैटिंग</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
