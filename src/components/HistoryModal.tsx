import React from 'react';
import { X, Clock, MessageSquare, Trash2, Plus, ArrowRight } from 'lucide-react';
import { Conversation } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  conversations,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0c121e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#0e1626] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-100">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-base">चैट हिस्ट्री (Session History)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button: New chat */}
        <div className="p-3 bg-[#0a0f18] border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">कुल सत्र: {conversations.length}</span>
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नया सेशन शुरू करें</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              कोई पूर्व हिस्ट्री नहीं मिली।
            </div>
          ) : (
            conversations.map((chat) => {
              const isActive = chat.id === activeChatId;
              const dateStr = new Date(chat.updatedAt || chat.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{chat.title || 'सत्र'}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{chat.messages.length} संदेश</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('इस चैट हिस्ट्री को हटाना चाहते हैं?')) {
                          onDeleteChat(chat.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="डिलीट करें"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-500 ml-1" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
