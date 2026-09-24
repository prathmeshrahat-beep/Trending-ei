import React from 'react';
import { ShieldCheck, TrendingUp, Cpu, Lock, Smartphone, Globe, AlertTriangle } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Brand Hero */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/40">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">TradePulse AI</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Modern Android Trading AI Assistant designed primarily for financial chart vision analysis, multi-asset market intelligence, and risk discipline.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          Version 3.8 • Architecture: React + Express + Gemini 3.1 Flash Lite
        </div>

        {/* Creator Attribution Card */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#0e1726] to-cyan-950/40 border border-emerald-500/30 text-center">
          <p className="text-xs text-emerald-300 font-semibold">
            ✨ Created by <strong>प्रथमेश हार्डिया (Prathmesh Hardia)</strong>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            "उनके पर्सनल एआई और पर्सनल ट्रेडिंग के लिए समर्पित ट्रेडिंग असिस्टेंट।"
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#0b1019] border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Mobile-First Android UX</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Engineered with native camera viewfinder, image gallery picker, voice input microphone, and smooth drawer navigation.
          </p>
        </div>

        <div className="bg-[#0b1019] border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Vision Chart Engine</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Inspects candlesticks, OHLC, wicks, support, resistance, breakouts, volume, and market structure without fabricating unseen values.
          </p>
        </div>

        <div className="bg-[#0b1019] border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>Encrypted Key Security</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            API keys are masked as <code>************ABCD</code> in local storage and proxied securely server-side.
          </p>
        </div>

        <div className="bg-[#0b1019] border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Globe className="w-4 h-4" />
            <span>Multi-Asset Intelligence</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Covers Indian Markets (NIFTY, BANK NIFTY), US Equities, Crypto assets, and global Forex pairs.
          </p>
        </div>
      </div>

      {/* Mandatory Regulatory & Risk Disclaimer */}
      <div className="bg-[#121926] border border-amber-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Statutory Disclaimer & Risk Notice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This AI provides educational information and market analysis. Market scenarios are uncertain and are not guaranteed predictions or financial advice. Always verify data and consider your own risk before making financial decisions.
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Trading in equities, futures, options, forex, and cryptocurrencies involves significant risk of capital loss. Past performance, chart patterns, and technical indicators are historical probabilities and do not guarantee future price movement.
        </p>
      </div>
    </div>
  );
};
