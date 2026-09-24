// Voice service for Text-To-Speech (TTS) and Speech-To-Text (STT)
// Optimized for auto-reading trading analyses quickly and reliably across all browsers

export interface VoiceServiceState {
  isSpeaking: boolean;
  isListening: boolean;
}

class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private isSpeakingInternal = false;
  private chunks: string[] = [];
  private chunkIndex = 0;
  private currentOptions: {
    rate?: number;
    pitch?: number;
    language?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {};
  private keepAliveTimer: any = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      try {
        if ('onvoiceschanged' in this.synth) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      } catch (e) {
        console.debug('voiceschanged listener err', e);
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices();
    } catch {
      this.voices = [];
    }
  }

  // Pre-unlock speech synthesis on user interaction (Send click or tap)
  // Ensures browser autoplay policies do not block speech when AI responds asynchronously
  public primeAudio(): void {
    if (!this.synth) return;
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      // Issue an inaudible micro-utterance during user interaction to unlock audio pipeline
      const micro = new SpeechSynthesisUtterance(' ');
      micro.volume = 0.01;
      micro.rate = 2.0;
      this.synth.speak(micro);
    } catch (e) {
      console.debug('primeAudio error:', e);
    }
  }

  // Text-To-Speech with sentence-chunking and Chrome pause-bug workaround
  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      language?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): void {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    this.stopSpeaking();

    // Clean text: strip markdown, headers, bullets, and emojis for natural fast speaking
    const cleanText = text
      .replace(/⚡.*?Engine\]/gi, '')
      .replace(/\(.*?पीक.*?\)/gi, '')
      .replace(/[#*_~`$]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/•|\-|\*/g, ' ')
      .replace(/📊|📈|📉|🎯|⚠️|🔎|🇮🇳|🇺🇸|₿|💱|💡|⚡|⚙️|🔐|🎙️|📷|🖼️|📎|❌/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // Split text into natural sentence chunks (~100-150 chars) so browser synthesis never freezes
    const rawChunks = cleanText.match(/[^.!?\n।]+[.!?\n।]+|[^.!?\n।]+/g) || [cleanText];
    this.chunks = rawChunks
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (this.chunks.length === 0) return;

    this.chunkIndex = 0;
    this.currentOptions = options;
    this.isSpeakingInternal = true;

    // Start keepalive timer to prevent Chrome from pausing after 14 seconds
    this.startKeepAlive();

    options.onStart?.();
    this.speakNextChunk();
  }

  private speakNextChunk(): void {
    if (!this.synth || !this.isSpeakingInternal) return;

    if (this.chunkIndex >= this.chunks.length) {
      this.cleanup();
      this.currentOptions.onEnd?.();
      return;
    }

    const chunkText = this.chunks[this.chunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);

    // Fast speech rate (1.25x - 1.3x) for instant quick delivery
    utterance.rate = this.currentOptions.rate ?? 1.25;
    utterance.pitch = this.currentOptions.pitch ?? 1.05;

    // Detect language: Hindi or English
    const hasHindiChars = /[\u0900-\u097F]/.test(chunkText);
    if (hasHindiChars) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    // Pick best available voice
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    if (this.voices.length > 0) {
      const match = this.voices.find((v) =>
        hasHindiChars
          ? v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
          : v.lang.startsWith('en')
      );
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onend = () => {
      this.chunkIndex++;
      this.speakNextChunk();
    };

    utterance.onerror = (e) => {
      // If stopped or canceled, exit cleanly
      if (e.error === 'canceled' || e.error === 'interrupted') {
        this.cleanup();
        return;
      }
      console.warn('Speech chunk error:', e);
      // Try next chunk rather than giving up completely
      this.chunkIndex++;
      this.speakNextChunk();
    };

    // Ensure synth is not stuck in paused state
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch {}

    this.synth.speak(utterance);
  }

  private startKeepAlive(): void {
    this.stopKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.isSpeakingInternal) {
        try {
          this.synth.pause();
          this.synth.resume();
        } catch {}
      }
    }, 9000);
  }

  private stopKeepAlive(): void {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  private cleanup(): void {
    this.isSpeakingInternal = false;
    this.chunks = [];
    this.chunkIndex = 0;
    this.stopKeepAlive();
  }

  public stopSpeaking(): void {
    this.cleanup();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingInternal || Boolean(this.synth?.speaking);
  }
}

export const voiceManager = new VoiceManager();
