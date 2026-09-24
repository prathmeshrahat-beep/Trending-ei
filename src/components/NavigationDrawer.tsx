import React, { useState } from 'react';
import {
  Home,
  MessageSquare,
  BarChart2,
  TrendingUp,
  Newspaper,
  Search,
  BookOpen,
  Calculator,
  Settings,
  KeyRound,
  Mic,
  Camera,
  Info,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Conversation } from '../types';

export type ActiveScreen =
  | 'chat'
  | 'patterns'
  | 'indicators'
  | 'markets'
  | 'news'
  | 'knowledge'
  | 'risk'
  | 'settings'
  | 'api_config'
  | 'voice_settings'
  | 'camera_settings'
  | 'about';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  conversations: Conversation[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onSelectScreen,
  conversations,
  activeChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  const menuItems = [
    { id: 'chat', label: 'Trading Chat (ट्रेडिंग चैट)', icon: MessageSquare, category: 'core' },
    { id: 'patterns', label: 'सब चार्ट व कैंडलस्टिक (All Charts & Candles)', icon: BarChart2, category: 'core' },
    { id: 'indicators', label: 'Indicators', icon: TrendingUp, category: 'core' },
    { id: 'markets', label: 'Market Sections', icon: Search, category: 'research' },
    { id: 'news', label: 'Market News', icon: Newspaper, category: 'research' },
    { id: 'knowledge', label: 'Trading Knowledge', icon: BookOpen, category: 'education' },
    { id: 'risk', label: 'Risk Engine', icon: Calculator, category: 'tools' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'system' },
    { id: 'api_config', label: 'API Configuration', icon: KeyRound, category: 'system' },
    { id: 'voice_settings', label: 'Voice Settings', icon: Mic, category: 'system' },
    { id: 'camera_settings', label: 'Camera Settings', icon: Camera, category: 'system' },
    { id: 'about', label: 'About TradePulse', icon: Info, category: 'system' },
  ];

  const handleStartRename = (e: React.MouseEvent, chat: Conversation) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim().length > 0) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      onDeleteChat(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-80 max-w-[85vw] bg-[#0c121d] border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-250 select-none">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 bg-[#080d16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-950">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-100 tracking-wide">TradePulse AI</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                  v3.8
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">Market & Chart Analysis</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Main Navigation Links */}
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 block mb-1.5">
              Navigation
            </span>
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectScreen(item.id as ActiveScreen);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Chats Section */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Recent Chats
              </span>
              <button
                onClick={() => {
                  onNewChat();
                  onSelectScreen('chat');
                  onClose();
                }}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-0.5 rounded-md hover:bg-emerald-950/30 transition-colors"
              >
                <Plus className="w-3 h-3" />
                New
              </button>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {conversations.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">No chats yet</div>
              ) : (
                conversations.map((chat) => {
                  const isCurrent = chat.id === activeChatId;
                  const isEditing = editingChatId === chat.id;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => {
                        onSelectChat(chat.id);
                        onSelectScreen('chat');
                        onClose();
                      }}
                      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#152238] text-slate-100 border border-slate-700/60 font-medium'
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-slate-900 border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-slate-100 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={(e) => handleSaveRename(e, chat.id)}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingChatId(null);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 truncate pr-2">
                            <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-emerald-400" />
                            <span className="truncate">{chat.title}</span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleStartRename(e, chat)}
                              className="p-1 text-slate-400 hover:text-slate-200"
                              title="Rename"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, chat.id)}
                              className="p-1 text-slate-400 hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="p-3 bg-[#080d16] border-t border-slate-800/80 text-[10px] text-slate-500 leading-tight flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>Educational analysis only. Market scenarios carry risk and are not guaranteed predictions.</span>
        </div>
      </div>
    </div>
  );
};
