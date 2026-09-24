import React, { useState } from 'react';
import { BookOpen, Search, CheckCircle2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { KNOWLEDGE_TOPICS } from '../data/knowledgeData';
import { KnowledgeTopic } from '../types';

interface KnowledgeScreenProps {
  onSendToChat: (prompt: string) => void;
}

export const KnowledgeScreen: React.FC<KnowledgeScreenProps> = ({ onSendToChat }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'basics' | 'technical' | 'risk' | 'instruments'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(KNOWLEDGE_TOPICS[0].id);

  const filteredTopics = KNOWLEDGE_TOPICS.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.summary.toLowerCase().includes(search.toLowerCase()) ||
      topic.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || topic.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAskAI = (topic: KnowledgeTopic) => {
    const prompt = `कृपया ट्रेडिंग कॉन्सेप्ट **"${topic.title}"** के बारे में विस्तार से उदाहरणों के साथ समझाएं।
एक नए और मध्यवर्ती ट्रेडर को इसमें क्या गलतियां करने से बचना चाहिए और इसे लाइव मार्केट में कैसे टेस्ट करना चाहिए?`;
    onSendToChat(prompt);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Trading Knowledge & Education Base
              </h2>
              <p className="text-xs text-slate-400">
                Core fundamentals, auction psychology, risk controls, and instrument mechanics
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search concepts (e.g. Liquidity, Stop Loss)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121a29] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/80">
          {(['all', 'basics', 'technical', 'risk', 'instruments'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat === 'all' ? `All (${KNOWLEDGE_TOPICS.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedId === topic.id;

          return (
            <div
              key={topic.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-[#0d1422] border-purple-500/40 shadow-xl'
                  : 'bg-[#0b1019] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                onClick={() => toggleExpand(topic.id)}
                className="p-4 md:p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-purple-400">
                      {topic.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{topic.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400">{topic.summary}</p>
                </div>

                <div className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-5 md:px-5 pt-2 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-150">
                  {/* Detailed explanation */}
                  <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-[#080d16] p-4 rounded-xl border border-slate-800/60 font-sans">
                    {topic.content}
                  </div>

                  {/* Key Takeaways */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                      Key Takeaways:
                    </span>
                    <div className="space-y-1">
                      {topic.keyTakeaways.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ask AI button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleAskAI(topic)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl text-xs font-semibold transition-all shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Ask AI to Elaborate
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
