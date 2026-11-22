import { Q16_ONE, q16Clamp } from '../core/q16.js';

const CHAPTER_FILES = Array.of('ch1_foyer.wav', 'ch2_library.wav', 'ch3_observatory.wav');

export class DualVoiceNarrator {
  constructor() {
    this.ctx = null;
    this.buffers = new Map();
    this.maleGB = null;
    this.femaleScotGB = null;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const bind = () => this._selectVoices();
      bind();
      window.speechSynthesis.onvoiceschanged = bind;
    }
  }

  attachAudioContext(audioCtx) {
    this.ctx = audioCtx;
  }

  _selectVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;
    this.maleGB =
      voices.find((v) => /en[-_]GB/i.test(v.lang) && /male|daniel|arthur|oliver|george|ryan/i.test(v.name)) ||
      voices.find((v) => /en[-_]GB/i.test(v.lang)) ||
      voices.at(0);
    this.femaleScotGB =
      voices.find((v) => /fiona|scotland|scottish|moira/i.test(v.name)) ||
      voices.find((v) => /en[-_]GB/i.test(v.lang) && /female|kate|serena|hazel|libby|sonia/i.test(v.name)) ||
      this.maleGB;
  }

  async _playWav(filename, playbackRate = 1.0) {
    if (!this.ctx) return false;
    try {
      let buf = this.buffers.get(filename);
      if (!buf) {
        const res = await fetch('./assets/audio/' + filename);
        if (!res.ok) return false;
        const arr = await res.arrayBuffer();
        buf = await this.ctx.decodeAudioData(arr);
        this.buffers.set(filename, buf);
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = playbackRate;
      src.connect(this.ctx.destination);
      src.start();
      return true;
    } catch {
      return false;
    }
  }

  async narrateStory(text, chapterIdx = 0) {
    const file = CHAPTER_FILES.at(chapterIdx);
    if (file && (await this._playWav(file, 0.96))) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this._selectVoices();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (this.maleGB) u.voice = this.maleGB;
    u.lang = 'en-GB';
    u.pitch = 0.86;
    u.rate = 0.94;
    window.speechSynthesis.speak(u);
  }

  async chantRune(runeWord, sanityQ16 = Q16_ONE, dirichletEnergyQ16 = 0) {
    const sRatio = q16Clamp(sanityQ16, 0, Q16_ONE) / Q16_ONE;
    const tension = q16Clamp(dirichletEnergyQ16, 0, Q16_ONE) / Q16_ONE;
    // Warp Scottish female Piper WAV playback rate down into haunted slow-mo as Sanity drops
    const warpRate = Math.max(0.55, 1.02 * sRatio - 0.18 * tension);

    if (await this._playWav('rune_' + runeWord.toUpperCase() + '.wav', warpRate)) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this._selectVoices();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(runeWord.toLowerCase());
    if (this.femaleScotGB) u.voice = this.femaleScotGB;
    u.lang = 'en-GB';
    u.pitch = Math.max(0.25, 1.18 * sRatio - 0.35 * tension);
    u.rate = Math.max(0.52, 0.82 * sRatio);
    window.speechSynthesis.speak(u);
  }
}
