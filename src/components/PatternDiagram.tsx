import React from 'react';

interface PatternDiagramProps {
  type: string;
  className?: string;
}

export const PatternDiagram: React.FC<PatternDiagramProps> = ({ type, className = 'w-full h-28' }) => {
  switch (type) {
    // 1. HAMMER (हैमर कैंडल - बॉटम पर बनता है, मार्केट ऊपर जाता है)
    case 'hammer':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Trend line down */}
          <path d="M20 20 L50 45 L70 55" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="15" y1="65" x2="185" y2="65" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          <text x="18" y="78" fill="#64748b" fontSize="8">Support Demand Zone</text>
          
          {/* Prior red candle */}
          <line x1="65" y1="35" x2="65" y2="60" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="58" y="42" width="14" height="15" fill="#ef4444" rx="1.5" />

          {/* HAMMER CANDLE */}
          {/* Upper tiny wick */}
          <line x1="100" y1="28" x2="100" y2="32" stroke="#10b981" strokeWidth="1.5" />
          {/* Candle Body at the top */}
          <rect x="91" y="32" width="18" height="14" fill="#10b981" stroke="#34d399" strokeWidth="1.5" rx="2" />
          {/* Long lower wick (at least 2x-3x body) */}
          <line x1="100" y1="46" x2="100" y2="78" stroke="#10b981" strokeWidth="2.5" />
          
          {/* Subsequent green candle (Confirmation) */}
          <line x1="135" y1="18" x2="135" y2="52" stroke="#10b981" strokeWidth="1.5" />
          <rect x="127" y="22" width="16" height="24" fill="#10b981" rx="1.5" />

          {/* Bullish Reversal Arrow */}
          <path d="M155 45 L175 22 M175 22 L163 23 M175 22 L174 34" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="90" y="24" fill="#34d399" fontSize="9" fontWeight="bold">Hammer</text>
          <text x="145" y="16" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP (Rally)</text>
        </svg>
      );

    // 2. HANGING MAN (हैंगिंग मैन - टॉप पर बनता है, मार्केट नीचे गिरता है)
    case 'hanging_man':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Trend line up */}
          <path d="M20 65 L50 40 L70 30" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="15" y1="25" x2="185" y2="25" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
          <text x="20" y="20" fill="#f43f5e" fontSize="8">Resistance Supply Zone</text>

          {/* Prior green candle */}
          <line x1="65" y1="28" x2="65" y2="55" stroke="#10b981" strokeWidth="1.5" />
          <rect x="58" y="32" width="14" height="18" fill="#10b981" rx="1.5" />

          {/* HANGING MAN CANDLE */}
          <line x1="100" y1="24" x2="100" y2="28" stroke="#ef4444" strokeWidth="1.5" />
          {/* Small body at top */}
          <rect x="91" y="28" width="18" height="13" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" rx="2" />
          {/* Long lower wick */}
          <line x1="100" y1="41" x2="100" y2="75" stroke="#ef4444" strokeWidth="2.5" />

          {/* Subsequent red breakdown candle */}
          <line x1="135" y1="36" x2="135" y2="72" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="127" y="40" width="16" height="26" fill="#ef4444" rx="1.5" />

          {/* Bearish Reversal Arrow */}
          <path d="M155 40 L175 65 M175 65 L163 64 M175 65 L174 53" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="80" y="22" fill="#f87171" fontSize="9" fontWeight="bold">Hanging Man</text>
          <text x="142" y="78" fill="#ef4444" fontSize="9" fontWeight="bold">↓ DOWN (Fall)</text>
        </svg>
      );

    // 3. INVERTED HAMMER (इनवर्टेड हैमर - बॉटम पर अपर विक रिजेक्शन, बुलिश रिवर्सल)
    case 'inverted_hammer':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 25 L55 55" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="15" y1="70" x2="185" y2="70" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Long Upper Wick */}
          <line x1="100" y1="20" x2="100" y2="52" stroke="#10b981" strokeWidth="2.5" />
          {/* Small Body at Bottom */}
          <rect x="91" y="52" width="18" height="14" fill="#10b981" stroke="#34d399" strokeWidth="1.5" rx="2" />
          {/* Tiny lower wick */}
          <line x1="100" y1="66" x2="100" y2="69" stroke="#10b981" strokeWidth="1.5" />

          {/* Confirmation Candle */}
          <rect x="128" y="35" width="16" height="26" fill="#10b981" rx="1.5" />
          <line x1="136" y1="25" x2="136" y2="68" stroke="#10b981" strokeWidth="1.5" />

          <path d="M155 52 L175 28 M175 28 L163 29 M175 28 L174 40" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="65" y="18" fill="#34d399" fontSize="9" fontWeight="bold">Inverted Hammer</text>
          <text x="145" y="22" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP</text>
        </svg>
      );

    // 4. SHOOTING STAR (शूटिंग स्टार - टॉप पर लंबी अपर विक, बियरिश रिवर्सल)
    case 'shooting_star':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 65 L55 35" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="15" y1="20" x2="185" y2="20" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />

          {/* Long upper rejection wick */}
          <line x1="100" y1="18" x2="100" y2="50" stroke="#ef4444" strokeWidth="2.5" />
          {/* Small body at bottom */}
          <rect x="91" y="50" width="18" height="14" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" rx="2" />
          <line x1="100" y1="64" x2="100" y2="67" stroke="#ef4444" strokeWidth="1.5" />

          {/* Breakdown Candle */}
          <rect x="128" y="52" width="16" height="26" fill="#ef4444" rx="1.5" />
          <line x1="136" y1="45" x2="136" y2="82" stroke="#ef4444" strokeWidth="1.5" />

          <path d="M155 42 L175 68 M175 68 L163 67 M175 68 L174 56" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="75" y="14" fill="#f87171" fontSize="9" fontWeight="bold">Shooting Star</text>
          <text x="145" y="80" fill="#ef4444" fontSize="9" fontWeight="bold">↓ DOWN</text>
        </svg>
      );

    // 5. MARUBOZU BULLISH (बड़ी हरी कैंडल - फुल मोमेंटम बाइंग)
    case 'marubozu_bullish':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="75" x2="180" y2="75" stroke="#334155" strokeWidth="1" />
          {/* Giant solid green body with virtually no wicks */}
          <rect x="80" y="15" width="40" height="60" fill="#10b981" stroke="#34d399" strokeWidth="2" rx="2" />
          <text x="82" y="10" fill="#34d399" fontSize="8">Open = Low</text>
          <text x="78" y="84" fill="#34d399" fontSize="8">Close = High</text>

          <path d="M140 50 L170 20 M170 20 L158 21 M170 20 L169 32" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="25" y="45" fill="#38bdf8" fontSize="8">बड़ी हरी कैंडल</text>
          <text x="135" y="15" fill="#10b981" fontSize="9" fontWeight="bold">↑ तेज मोमेंटम UP</text>
        </svg>
      );

    // 6. MARUBOZU BEARISH (बड़ी लाल कैंडल - फुल मोमेंटम सेलिंग)
    case 'marubozu_bearish':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="15" x2="180" y2="15" stroke="#334155" strokeWidth="1" />
          {/* Giant solid red body with virtually no wicks */}
          <rect x="80" y="18" width="40" height="60" fill="#ef4444" stroke="#f87171" strokeWidth="2" rx="2" />
          <text x="80" y="12" fill="#f87171" fontSize="8">Open = High</text>
          <text x="80" y="86" fill="#f87171" fontSize="8">Close = Low</text>

          <path d="M140 40 L170 70 M170 70 L158 69 M170 70 L169 58" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="25" y="45" fill="#f87171" fontSize="8">बड़ी लाल कैंडल</text>
          <text x="135" y="82" fill="#ef4444" fontSize="9" fontWeight="bold">↓ तेज गिरावट DOWN</text>
        </svg>
      );

    // 7. DOJI & SPINNING TOP (छोटी कैंडल - इंडिसिजन / मार्केट रुकावट)
    case 'doji':
    case 'spinning_top':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Long upper and lower wick */}
          <line x1="70" y1="15" x2="70" y2="75" stroke="#94a3b8" strokeWidth="2" />
          {/* Flat thin body (Doji) */}
          <line x1="56" y1="45" x2="84" y2="45" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <text x="50" y="85" fill="#cbd5e1" fontSize="8" fontWeight="bold">Classic Doji</text>

          {/* Spinning Top (small real body) */}
          <line x1="140" y1="15" x2="140" y2="75" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="132" y="40" width="16" height="10" fill="#38bdf8" stroke="#7dd3fc" strokeWidth="1" rx="1" />
          <text x="120" y="85" fill="#38bdf8" fontSize="8" fontWeight="bold">Spinning Top</text>

          <text x="75" y="12" fill="#fbbf24" fontSize="8">⚖️ न्यूट्रल / संशय (Indecision)</text>
        </svg>
      );

    // 8. BULLISH ENGULFING (बुलिश एंगल्फिंग - लाल को निगलने वाली बड़ी हरी)
    case 'bullish_engulfing':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 25 L50 48" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Small 1st Red Candle */}
          <line x1="70" y1="40" x2="70" y2="68" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="62" y="46" width="16" height="16" fill="#ef4444" rx="1.5" />

          {/* Giant 2nd Green Candle Engulfing the 1st */}
          <line x1="105" y1="20" x2="105" y2="80" stroke="#10b981" strokeWidth="2" />
          <rect x="94" y="28" width="22" height="42" fill="#10b981" stroke="#34d399" strokeWidth="1.5" rx="2" />

          <path d="M135 55 L165 25 M165 25 L153 26 M165 25 L164 37" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="65" y="16" fill="#34d399" fontSize="9" fontWeight="bold">Bullish Engulfing</text>
          <text x="140" y="18" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP (Reversal)</text>
        </svg>
      );

    // 9. BEARISH ENGULFING (बियरिश एंगल्फिंग - हरी को निगलने वाली बड़ी लाल)
    case 'bearish_engulfing':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 65 L50 40" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Small 1st Green Candle */}
          <line x1="70" y1="28" x2="70" y2="56" stroke="#10b981" strokeWidth="1.5" />
          <rect x="62" y="34" width="16" height="16" fill="#10b981" rx="1.5" />

          {/* Giant 2nd Red Candle Engulfing the 1st */}
          <line x1="105" y1="18" x2="105" y2="78" stroke="#ef4444" strokeWidth="2" />
          <rect x="94" y="24" width="22" height="44" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" rx="2" />

          <path d="M135 35 L165 65 M165 65 L153 64 M165 65 L164 53" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="65" y="14" fill="#f87171" fontSize="9" fontWeight="bold">Bearish Engulfing</text>
          <text x="140" y="78" fill="#ef4444" fontSize="9" fontWeight="bold">↓ DOWN (Crash)</text>
        </svg>
      );

    // 10. THREE WHITE SOLDIERS (तीनों हरी कैंडल - Three White Soldiers)
    case 'three_white_soldiers':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Candle 1 */}
          <line x1="50" y1="52" x2="50" y2="82" stroke="#10b981" strokeWidth="1.5" />
          <rect x="42" y="58" width="16" height="20" fill="#10b981" rx="1.5" />

          {/* Candle 2 */}
          <line x1="85" y1="36" x2="85" y2="68" stroke="#10b981" strokeWidth="1.5" />
          <rect x="77" y="42" width="16" height="22" fill="#10b981" rx="1.5" />

          {/* Candle 3 */}
          <line x1="120" y1="18" x2="120" y2="52" stroke="#10b981" strokeWidth="1.5" />
          <rect x="112" y="24" width="16" height="24" fill="#10b981" rx="1.5" />

          {/* Breakout Arrow */}
          <path d="M145 40 L175 15 M175 15 L163 16 M175 15 L174 27" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="45" y="14" fill="#34d399" fontSize="9" fontWeight="bold">तीनों हरी कैंडल (Three White Soldiers)</text>
          <text x="142" y="12" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP</text>
        </svg>
      );

    // 11. THREE BLACK CROWS (तीनों लाल कैंडल - Three Black Crows)
    case 'three_black_crows':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Candle 1 */}
          <line x1="50" y1="18" x2="50" y2="48" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="42" y="24" width="16" height="20" fill="#ef4444" rx="1.5" />

          {/* Candle 2 */}
          <line x1="85" y1="34" x2="85" y2="66" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="77" y="40" width="16" height="22" fill="#ef4444" rx="1.5" />

          {/* Candle 3 */}
          <line x1="120" y1="50" x2="120" y2="84" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="112" y="56" width="16" height="24" fill="#ef4444" rx="1.5" />

          {/* Breakdown Arrow */}
          <path d="M145 55 L175 80 M175 80 L163 79 M175 80 L174 68" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="45" y="14" fill="#f87171" fontSize="9" fontWeight="bold">तीनों लाल कैंडल (Three Black Crows)</text>
          <text x="142" y="85" fill="#ef4444" fontSize="9" fontWeight="bold">↓ DOWN</text>
        </svg>
      );

    // 12. MORNING STAR (मॉर्निंग स्टार - 3 कैंडल्स का बुलिश रिवर्सल)
    case 'morning_star':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 1st Big Red */}
          <line x1="50" y1="20" x2="50" y2="65" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="42" y="28" width="16" height="30" fill="#ef4444" rx="1.5" />

          {/* 2nd Gap-Down Small Star */}
          <line x1="95" y1="62" x2="95" y2="82" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="88" y="67" width="14" height="10" fill="#fbbf24" rx="1" />

          {/* 3rd Big Green */}
          <line x1="140" y1="24" x2="140" y2="70" stroke="#10b981" strokeWidth="1.5" />
          <rect x="132" y="32" width="16" height="32" fill="#10b981" rx="1.5" />

          <path d="M160 45 L180 20 M180 20 L168 21 M180 20 L179 32" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="60" y="14" fill="#34d399" fontSize="9" fontWeight="bold">Morning Star (3 Candles)</text>
          <text x="155" y="15" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP</text>
        </svg>
      );

    // 13. EVENING STAR (इवनिंग स्टार - 3 कैंडल्स का बियरिश रिवर्सल)
    case 'evening_star':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 1st Big Green */}
          <line x1="50" y1="25" x2="50" y2="70" stroke="#10b981" strokeWidth="1.5" />
          <rect x="42" y="32" width="16" height="32" fill="#10b981" rx="1.5" />

          {/* 2nd Gap-Up Small Star */}
          <line x1="95" y1="12" x2="95" y2="34" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="88" y="17" width="14" height="10" fill="#fbbf24" rx="1" />

          {/* 3rd Big Red */}
          <line x1="140" y1="30" x2="140" y2="76" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="132" y="38" width="16" height="32" fill="#ef4444" rx="1.5" />

          <path d="M160 50 L180 75 M180 75 L168 74 M180 75 L179 63" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="60" y="12" fill="#f87171" fontSize="9" fontWeight="bold">Evening Star (3 Candles)</text>
          <text x="155" y="85" fill="#ef4444" fontSize="9" fontWeight="bold">↓ DOWN</text>
        </svg>
      );

    // 14. TWEEZER BOTTOM (ट्वीज़र बॉटम - डबल लो बॉटम रिवर्सल)
    case 'tweezer_bottom':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="75" x2="180" y2="75" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="25" y="85" fill="#34d399" fontSize="8">Same Low Price Support</text>

          {/* 1st Red Candle */}
          <line x1="85" y1="35" x2="85" y2="75" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="77" y="42" width="16" height="22" fill="#ef4444" rx="1.5" />

          {/* 2nd Green Candle with identical low wick */}
          <line x1="115" y1="35" x2="115" y2="75" stroke="#10b981" strokeWidth="1.5" />
          <rect x="107" y="42" width="16" height="22" fill="#10b981" rx="1.5" />

          <path d="M140 50 L170 20 M170 20 L158 21 M170 20 L169 32" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="75" y="24" fill="#34d399" fontSize="9" fontWeight="bold">Tweezer Bottom</text>
          <text x="145" y="16" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP</text>
        </svg>
      );

    // 15. TWEEZER TOP (ट्वीज़र टॉप - डबल हाई रेसिस्टेंस रिजेक्शन)
    case 'tweezer_top':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="20" x2="180" y2="20" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="25" y="14" fill="#f87171" fontSize="8">Same High Price Resistance</text>

          {/* 1st Green Candle */}
          <line x1="85" y1="20" x2="85" y2="60" stroke="#10b981" strokeWidth="1.5" />
          <rect x="77" y="28" width="16" height="22" fill="#10b981" rx="1.5" />

          {/* 2nd Red Candle with identical high wick */}
          <line x1="115" y1="20" x2="115" y2="60" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="107" y="28" width="16" height="22" fill="#ef4444" rx="1.5" />

          <path d="M140 40 L170 70 M170 70 L158 69 M170 70 L169 58" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="75" y="78" fill="#f87171" fontSize="9" fontWeight="bold">Tweezer Top</text>
          <text x="145" y="84" fill="#ef4444" fontSize="9" fontWeight="bold">↓ DOWN</text>
        </svg>
      );

    // 16. DRAGONFLY & GRAVESTONE DOJI
    case 'dragonfly_doji':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="100" y1="25" x2="100" y2="78" stroke="#10b981" strokeWidth="2.5" />
          <line x1="80" y1="25" x2="120" y2="25" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
          <path d="M135 50 L165 25 M165 25 L153 26 M165 25 L164 37" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="65" y="16" fill="#34d399" fontSize="9" fontWeight="bold">Dragonfly Doji</text>
          <text x="140" y="18" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP (Rejection Low)</text>
        </svg>
      );

    case 'gravestone_doji':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="100" y1="18" x2="100" y2="72" stroke="#ef4444" strokeWidth="2.5" />
          <line x1="80" y1="72" x2="120" y2="72" stroke="#f87171" strokeWidth="4" strokeLinecap="round" />
          <path d="M135 40 L165 65 M165 65 L153 64 M165 65 L164 53" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="60" y="85" fill="#f87171" fontSize="9" fontWeight="bold">Gravestone Doji</text>
          <text x="140" y="78" fill="#ef4444" fontSize="9" fontWeight="bold">↓ DOWN (Supply Top)</text>
        </svg>
      );

    // 17. PIERCING LINE & DARK CLOUD COVER
    case 'piercing_line':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Red Candle */}
          <rect x="70" y="25" width="18" height="35" fill="#ef4444" rx="1.5" />
          <line x1="79" y1="18" x2="79" y2="68" stroke="#ef4444" strokeWidth="1.5" />
          {/* 50% line */}
          <line x1="60" y1="42" x2="135" y2="42" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          {/* Green Candle opening gap-down and closing above 50% */}
          <rect x="100" y="32" width="18" height="38" fill="#10b981" rx="1.5" />
          <line x1="109" y1="25" x2="109" y2="76" stroke="#10b981" strokeWidth="1.5" />
          <path d="M135 50 L165 25 M165 25 L153 26 M165 25 L164 37" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="70" y="15" fill="#34d399" fontSize="9" fontWeight="bold">Piercing Line (&gt;50% Body)</text>
          <text x="140" y="18" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP</text>
        </svg>
      );

    case 'dark_cloud_cover':
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Green Candle */}
          <rect x="70" y="30" width="18" height="35" fill="#10b981" rx="1.5" />
          <line x1="79" y1="22" x2="79" y2="72" stroke="#10b981" strokeWidth="1.5" />
          {/* 50% line */}
          <line x1="60" y1="47" x2="135" y2="47" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          {/* Red Candle opening gap-up and closing below 50% */}
          <rect x="100" y="20" width="18" height="38" fill="#ef4444" rx="1.5" />
          <line x1="109" y1="14" x2="109" y2="65" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M135 40 L165 65 M165 65 L153 64 M165 65 L164 53" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="65" y="14" fill="#f87171" fontSize="9" fontWeight="bold">Dark Cloud Cover (&gt;50% Body)</text>
          <text x="140" y="78" fill="#ef4444" fontSize="9" fontWeight="bold">↓ DOWN</text>
        </svg>
      );

    // ==========================================
    // CHART PATTERNS
    // ==========================================
    case 'higher_high':
    case 'higher_low':
    case 'bullish_trend':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bullGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <path d="M10 65 L45 40 L75 55 L115 25 L145 42 L185 15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 65 L45 40 L75 55 L115 25 L145 42 L185 15 L185 75 L10 75 Z" fill="url(#bullGrad)" />
          <circle cx="45" cy="40" r="3.5" fill="#10b981" />
          <circle cx="75" cy="55" r="3.5" fill="#3b82f6" />
          <circle cx="115" cy="25" r="3.5" fill="#10b981" />
          <circle cx="145" cy="42" r="3.5" fill="#3b82f6" />
          <circle cx="185" cy="15" r="3.5" fill="#10b981" />
          <text x="42" y="32" fill="#10b981" fontSize="9" fontWeight="bold">H</text>
          <text x="70" y="69" fill="#60a5fa" fontSize="9" fontWeight="bold">HL</text>
          <text x="110" y="18" fill="#10b981" fontSize="9" fontWeight="bold">HH</text>
          <text x="140" y="55" fill="#60a5fa" fontSize="9" fontWeight="bold">HL</text>
          <text x="180" y="10" fill="#10b981" fontSize="9" fontWeight="bold">HH (↑ UP)</text>
        </svg>
      );

    case 'lower_high':
    case 'lower_low':
    case 'bearish_trend':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d="M15 18 L50 45 L80 30 L115 60 L145 45 L185 70" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 18 L50 45 L80 30 L115 60 L145 45 L185 70 L185 75 L15 75 Z" fill="url(#bearGrad)" />
          <circle cx="15" cy="18" r="3.5" fill="#ef4444" />
          <circle cx="50" cy="45" r="3.5" fill="#f87171" />
          <circle cx="80" cy="30" r="3.5" fill="#fb923c" />
          <circle cx="115" cy="60" r="3.5" fill="#ef4444" />
          <circle cx="145" cy="45" r="3.5" fill="#fb923c" />
          <circle cx="185" cy="70" r="3.5" fill="#ef4444" />
          <text x="12" y="12" fill="#ef4444" fontSize="9" fontWeight="bold">H</text>
          <text x="47" y="58" fill="#f87171" fontSize="9" fontWeight="bold">LL</text>
          <text x="75" y="24" fill="#fb923c" fontSize="9" fontWeight="bold">LH</text>
          <text x="110" y="73" fill="#f87171" fontSize="9" fontWeight="bold">LL</text>
          <text x="140" y="39" fill="#fb923c" fontSize="9" fontWeight="bold">LH (↓ DOWN)</text>
        </svg>
      );

    case 'double_bottom':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="35" x2="180" y2="35" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <text x="120" y="28" fill="#94a3b8" fontSize="8">Neckline Break ↑ UP</text>
          <path d="M20 20 L55 65 L95 35 L135 65 L175 18" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="55" cy="65" r="4" fill="#10b981" />
          <circle cx="135" cy="65" r="4" fill="#10b981" />
          <circle cx="95" cy="35" r="3.5" fill="#38bdf8" />
          <text x="40" y="77" fill="#10b981" fontSize="8" fontWeight="bold">Bottom 1</text>
          <text x="120" y="77" fill="#10b981" fontSize="8" fontWeight="bold">Bottom 2</text>
        </svg>
      );

    case 'double_top':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="52" x2="180" y2="52" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <text x="115" y="64" fill="#94a3b8" fontSize="8">Neckline Breakdown ↓ DOWN</text>
          <path d="M20 65 L60 20 L100 52 L140 20 L180 70" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="60" cy="20" r="4" fill="#ef4444" />
          <circle cx="140" cy="20" r="4" fill="#ef4444" />
          <text x="45" y="14" fill="#ef4444" fontSize="8" fontWeight="bold">Peak 1</text>
          <text x="125" y="14" fill="#ef4444" fontSize="8" fontWeight="bold">Peak 2</text>
        </svg>
      );

    case 'head_shoulders':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="52" x2="185" y2="52" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M25 65 L55 35 L75 52 L105 15 L135 52 L155 35 L180 70" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="45" y="28" fill="#f87171" fontSize="8">LS</text>
          <text x="100" y="10" fill="#ef4444" fontSize="9" fontWeight="bold">Head</text>
          <text x="150" y="28" fill="#f87171" fontSize="8">RS</text>
          <text x="125" y="64" fill="#ef4444" fontSize="8">Breakdown ↓ DOWN</text>
        </svg>
      );

    case 'inv_head_shoulders':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="32" x2="185" y2="32" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M25 18 L55 50 L75 32 L105 70 L135 32 L155 50 L180 15" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="45" y="62" fill="#34d399" fontSize="8">LS</text>
          <text x="98" y="78" fill="#10b981" fontSize="9" fontWeight="bold">Head</text>
          <text x="150" y="62" fill="#34d399" fontSize="8">RS</text>
          <text x="125" y="26" fill="#10b981" fontSize="8">Breakout ↑ UP</text>
        </svg>
      );

    case 'cup_handle':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="25" y1="28" x2="180" y2="28" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M30 28 Q 75 75 120 28 L140 42 L155 35 L180 15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <text x="65" y="55" fill="#34d399" fontSize="8">Cup</text>
          <text x="135" y="52" fill="#60a5fa" fontSize="8">Handle</text>
          <text x="145" y="20" fill="#10b981" fontSize="8" fontWeight="bold">Breakout ↑ UP</text>
        </svg>
      );

    case 'flag':
    case 'pennant':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 70 L65 20" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <line x1="65" y1="20" x2="130" y2="35" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="60" y1="35" x2="125" y2="50" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M65 20 L80 38 L95 26 L110 44 L125 32 L165 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          <text x="35" y="50" fill="#10b981" fontSize="8">Pole</text>
          <text x="85" y="52" fill="#38bdf8" fontSize="8">Flag</text>
          <text x="135" y="16" fill="#10b981" fontSize="8" fontWeight="bold">Breakout ↑ UP</text>
        </svg>
      );

    case 'triangle':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="25" x2="160" y2="25" stroke="#f43f5e" strokeWidth="1.5" />
          <line x1="20" y1="65" x2="160" y2="25" stroke="#10b981" strokeWidth="1.5" />
          <path d="M25 60 L45 25 L75 50 L105 25 L130 40 L165 15" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <text x="30" y="18" fill="#f87171" fontSize="8">Resistance</text>
          <text x="35" y="74" fill="#34d399" fontSize="8">Ascending Support</text>
          <text x="145" y="12" fill="#10b981" fontSize="9" fontWeight="bold">↑ UP</text>
        </svg>
      );

    case 'wedge':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="65" x2="155" y2="20" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="20" y1="75" x2="155" y2="35" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M25 72 L45 55 L70 60 L100 42 L130 44 L165 68" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <text x="40" y="35" fill="#f87171" fontSize="8">Rising Wedge (Contracting)</text>
          <text x="145" y="78" fill="#ef4444" fontSize="9" fontWeight="bold">↓ Breakdown</text>
        </svg>
      );

    case 'breakout':
    case 'resistance_rejection':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="15" y1="30" x2="185" y2="30" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="20" y="24" fill="#f43f5e" fontSize="8" fontWeight="bold">Key Resistance</text>
          <path d="M20 65 L55 30 L80 50 L115 30 L135 42 L165 12" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="165" cy="12" r="4" fill="#10b981" />
          <text x="140" y="24" fill="#10b981" fontSize="9" fontWeight="bold">Breakout ↑ UP</text>
        </svg>
      );

    case 'breakdown':
    case 'support_bounce':
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="15" y1="52" x2="185" y2="52" stroke="#10b981" strokeWidth="1.5" />
          <text x="20" y="47" fill="#10b981" fontSize="8" fontWeight="bold">Key Support</text>
          <path d="M20 20 L55 52 L80 35 L115 52 L140 38 L165 72" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="165" cy="72" r="4" fill="#ef4444" />
          <text x="125" y="68" fill="#ef4444" fontSize="9" fontWeight="bold">Breakdown ↓ DOWN</text>
        </svg>
      );

    case 'sideways':
    case 'range':
    default:
      return (
        <svg viewBox="0 0 200 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="15" y1="22" x2="185" y2="22" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="15" y1="58" x2="185" y2="58" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
          <text x="20" y="17" fill="#f87171" fontSize="7">Resistance Ceiling</text>
          <text x="20" y="68" fill="#34d399" fontSize="7">Support Floor</text>
          <path d="M20 50 L45 22 L75 58 L105 22 L135 58 L165 24 L180 45" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};
