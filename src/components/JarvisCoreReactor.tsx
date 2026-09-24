import React, { useState, useRef } from 'react';
import { Heart, MessageSquare, Camera, Image as ImageIcon, Sparkles, Zap, Eye, CheckCircle2 } from 'lucide-react';

interface JarvisCoreReactorProps {
  onOpenChat: () => void;
  onOpenCamera: () => void;
  onOpenPhotoViewer: (imageSrc: string, title?: string) => void;
}

export const JarvisCoreReactor: React.FC<JarvisCoreReactorProps> = ({
  onOpenChat,
  onOpenCamera,
  onOpenPhotoViewer,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(1420);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sound effect generator using browser AudioContext (no external files needed)
  const playCyberneticChime = (turnOn: boolean) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (turnOn) {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
      } else {
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.18);
      }

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const handleCoreClick = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    playCyberneticChime(nextState);
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
      playCyberneticChime(true);
    }
  };

  const handleGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onOpenPhotoViewer(result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 min-h-[calc(100vh-7rem)] select-none">
      {/* Hidden File Input for Gallery Photo Selection */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleGalleryFile}
        className="hidden"
      />

      {/* Top Status Header */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2 px-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isActive
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400 animate-pulse'
                : 'bg-slate-600'
            }`}
          />
          <span className="text-[11px] font-mono tracking-wider font-semibold uppercase text-slate-300">
            {isActive ? 'CORE ACTIVE • सक्रिय' : 'STANDBY • क्लिक करें'}
          </span>
        </div>

        <button
          onClick={() => onOpenPhotoViewer('/ic_jarvis_logo.svg', 'TradePulse Core Logo')}
          className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 transition-colors"
          title="फोटो व्यूअर खोलें"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>फोटो देखें</span>
        </button>
      </div>

      {/* Center Interactive Sci-Fi Arc Reactor Photo / Emblem */}
      <div className="relative my-auto flex flex-col items-center justify-center">
        {/* Glow Aura Background */}
        <div
          className={`absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full transition-all duration-700 pointer-events-none ${
            isActive
              ? 'bg-cyan-500/20 blur-3xl scale-110'
              : 'bg-cyan-900/10 blur-2xl scale-90'
          }`}
        />

        {/* Clickable Core Circle */}
        <div
          onClick={handleCoreClick}
          className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-full cursor-pointer transition-all duration-500 transform active:scale-95 group ${
            isActive
              ? 'ring-4 ring-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.6)]'
              : 'ring-2 ring-slate-700/50 hover:ring-cyan-500/40 shadow-[0_0_20px_rgba(15,23,42,0.8)]'
          }`}
          title="ऑन/ऑफ करने के लिए क्लिक करें (Click to Activate Core)"
        >
          {/* Detailed Futuristic Arc Reactor SVG Component faithfully matching the photo */}
          <svg
            viewBox="0 0 500 500"
            className={`w-full h-full rounded-full transition-transform duration-700 ${
              isActive ? 'scale-100 rotate-0' : 'scale-98 opacity-90'
            }`}
          >
            <defs>
              {/* Outer Metallic Bezel Gradient */}
              <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="35%" stopColor="#1e293b" />
                <stop offset="70%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              {/* Cyan Neon Glow Gradient */}
              <radialGradient id="cyanCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="25%" stopColor="#67e8f9" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
              </radialGradient>

              {/* Central Flare Filter */}
              <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background disc */}
            <circle cx="250" cy="250" r="248" fill="#040814" stroke="#1e293b" strokeWidth="2" />

            {/* Outer Heavy Bezel Ring */}
            <circle
              cx="250"
              cy="250"
              r="234"
              fill="none"
              stroke="url(#bezelGrad)"
              strokeWidth="24"
            />
            <circle cx="250" cy="250" r="246" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="250" cy="250" r="222" fill="none" stroke="#082f49" strokeWidth="3" />

            {/* 8 Mechanical Rivets/Bolts on Outer Bezel */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x = 250 + 234 * Math.cos(rad);
              const y = 250 + 234 * Math.sin(rad);
              return (
                <g key={deg}>
                  <circle cx={x} cy={y} r="6" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                  <circle cx={x} cy={y} r="2.5" fill="#38bdf8" />
                </g>
              );
            })}

            {/* Neon Cyan Secondary Track */}
            <circle
              cx="250"
              cy="250"
              r="200"
              fill="none"
              stroke={isActive ? '#38bdf8' : '#0284c7'}
              strokeWidth="6"
              filter={isActive ? 'url(#glowFilter)' : undefined}
              className={isActive ? 'animate-pulse' : ''}
            />
            <circle
              cx="250"
              cy="250"
              r="192"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeOpacity="0.9"
            />

            {/* Radial segmented HUD arcs */}
            <g className={isActive ? 'origin-center animate-[spin_20s_linear_infinite]' : ''}>
              <circle
                cx="250"
                cy="250"
                r="168"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeDasharray="42 16 18 16 70 20"
                filter={isActive ? 'url(#glowFilter)' : undefined}
              />
              <circle
                cx="250"
                cy="250"
                r="152"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="4"
                strokeDasharray="14 10 24 14"
              />
            </g>

            {/* Reverse rotating tech tick ring */}
            <g className={isActive ? 'origin-center animate-[spin_15s_linear_infinite_reverse]' : ''}>
              <circle
                cx="250"
                cy="250"
                r="132"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="6"
                strokeDasharray="8 8 16 8 4 6"
              />
              <circle
                cx="250"
                cy="250"
                r="120"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeDasharray="60 30"
              />
            </g>

            {/* Central Glow Disc */}
            <circle
              cx="250"
              cy="250"
              r="96"
              fill="url(#cyanCoreGlow)"
              opacity={isActive ? 0.95 : 0.65}
            />
            <circle
              cx="250"
              cy="250"
              r="90"
              fill="#061224"
              stroke="#22d3ee"
              strokeWidth="3.5"
              filter={isActive ? 'url(#glowFilter)' : undefined}
            />

            {/* Crosshair guidelines */}
            <line x1="250" y1="120" x2="250" y2="155" stroke="#38bdf8" strokeWidth="2" />
            <line x1="250" y1="345" x2="250" y2="380" stroke="#38bdf8" strokeWidth="2" />
            <line x1="120" y1="250" x2="155" y2="250" stroke="#38bdf8" strokeWidth="2" />
            <line x1="345" y1="250" x2="380" y2="250" stroke="#38bdf8" strokeWidth="2" />

            {/* Central Stylized "A" / Delta Constellation Node Emblem */}
            <g
              transform="translate(250, 250)"
              filter={isActive ? 'url(#glowFilter)' : undefined}
            >
              {/* Connected constellation network lines */}
              <line x1="-38" y1="-10" x2="0" y2="-55" stroke="#67e8f9" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="-38" y1="-10" x2="-22" y2="28" stroke="#67e8f9" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="-15" y1="-25" x2="-38" y2="-10" stroke="#67e8f9" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="0" y1="-55" x2="38" y2="-10" stroke="#67e8f9" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="38" y1="-10" x2="22" y2="28" stroke="#67e8f9" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="0" y1="38" x2="0" y2="58" stroke="#38bdf8" strokeWidth="2" />

              {/* Constellation Nodes */}
              <circle cx="-38" cy="-10" r="3.5" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.5" />
              <circle cx="-15" cy="-25" r="3" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.5" />
              <circle cx="-22" cy="28" r="3.5" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.5" />
              <circle cx="38" cy="-10" r="3.5" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.5" />
              <circle cx="0" cy="38" r="4" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.5" />

              {/* Stylized Futuristic Letter "A" Outline */}
              <path
                d="M 0 -48 L -28 32 L -12 32 L -4 10 L 16 10 L 38 -12 L 20 -12 L 8 4 L -6 4 L 0 -22 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M -4 10 L 40 -8 L 22 28"
                fill="none"
                stroke="#67e8f9"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Center Bright Spark / Star */}
              <circle
                cx="0"
                cy="0"
                r={isActive ? 8 : 5}
                fill="#ffffff"
                className={isActive ? 'animate-ping' : ''}
              />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
            </g>
          </svg>

          {/* Center Click Hint Pulse */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className={`text-[10px] font-mono tracking-widest font-extrabold uppercase px-2.5 py-1 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 opacity-0 group-hover:opacity-100'
                  : 'bg-black/60 text-slate-300 border border-slate-700/60 opacity-80 group-hover:opacity-100'
              }`}
            >
              {isActive ? 'ACTIVE' : 'TOUCH TO ACTIVATE'}
            </span>
          </div>
        </div>

        {/* Sub-label under reactor */}
        <p className="mt-4 text-xs font-medium text-slate-400 text-center tracking-wide">
          {isActive ? (
            <span className="text-cyan-400 font-bold flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              सिस्टम सक्रिय है • विश्लेषण हेतु तैयार
            </span>
          ) : (
            <span>सेंट्रल कोर पर टैप करके ऑन करें</span>
          )}
        </p>
      </div>

      {/* Front Action Bar: 4 Essential Actions Only (Like, Chat, Camera, Gallery) */}
      <div className="w-full max-w-md pb-2 pt-4 px-3">
        <div className="bg-[#0b1220]/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-2.5 shadow-2xl flex items-center justify-around gap-2">
          {/* 1. Like Option */}
          <button
            onClick={handleLikeToggle}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all active:scale-95 ${
              isLiked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="लाइक करें"
          >
            <Heart className={`w-5 h-5 mb-1 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
            <span className="text-[11px] font-semibold">
              {isLiked ? 'पसंद आया' : 'लाइक'} ({likes})
            </span>
          </button>

          {/* 2. Message Chatting Option */}
          <button
            onClick={onOpenChat}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50 transition-all active:scale-95"
            title="चैटिंग शुरू करें"
          >
            <MessageSquare className="w-5 h-5 mb-1 text-cyan-400" />
            <span className="text-[11px] font-semibold text-slate-200">चैटिंग</span>
          </button>

          {/* 3. Camera Option */}
          <button
            onClick={onOpenCamera}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50 transition-all active:scale-95"
            title="कैमरा खोलें"
          >
            <Camera className="w-5 h-5 mb-1 text-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-200">कैमरा</span>
          </button>

          {/* 4. Gallery Photo Picker Option */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800/50 transition-all active:scale-95"
            title="गैलरी से फोटो चुनें व देखें"
          >
            <ImageIcon className="w-5 h-5 mb-1 text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-200">गैलरी</span>
          </button>
        </div>
      </div>
    </div>
  );
};
