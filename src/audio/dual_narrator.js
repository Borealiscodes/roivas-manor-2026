import { Q16_ONE, q16Clamp } from '../core/q16.js';

/**
 * Dual-Voice Narrator (inspired by NonDual-Audio-Preprint-Studio)
 *   1. Narrator: en-GB Male (grounded Roivas Manor 2026 chronicle)
 *   2. Oracle:   Scottish / en-GB Female (Sanity-warped rune chanting)
 */
export class DualVoiceNarrator {
  constructor() {
    this.maleGB = null;
    this.femaleScotGB = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const bindVoices = () => this._selectVoices();
      bindVoices();
      window.speechSynthesis.onvoiceschanged = bindVoices;
    }
  }

  _selectVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // 1. en-GB Male (Daniel, Arthur, Oliver, Ryan, or any en-GB male)
    this.maleGB =
      voices.find((v) => /en[-_]GB/i.test(v.lang) && /male|daniel|arthur|oliver|george|ryan/i.test(v.name)) ||
      voices.find((v) => /en[-_]GB/i.test(v.lang)) ||
      voices.at(0);

    // 2. Scottish / Celtic / en-GB Female (Fiona, Moira, Kate, Serena, Hazel)
    this.femaleScotGB =
      voices.find((v) => /fiona|scotland|scottish|moira/i.test(v.name)) ||
      voices.find((v) => /en[-_]GB/i.test(v.lang) && /female|kate|serena|hazel|libby|sonia/i.test(v.name)) ||
      voices.find((v) => /en[-_](GB|IE|AU)/i.test(v.lang) && v !== this.maleGB) ||
      this.maleGB;
  }

  /** Grounded en-GB Male narration for Roivas Manor story chapters */
  narrateStory(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this._selectVoices();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (this.maleGB) u.voice = this.maleGB;
    u.lang = 'en-GB';
    u.pitch = 0.86;
    u.rate = 0.94;
    u.volume = 0.95;
    window.speechSynthesis.speak(u);
  }

  /** Sanity-warped Scottish/en-GB Female Oracle chanting runes */
  chantRune(runeWord, sanityQ16 = Q16_ONE, dirichletEnergyQ16 = 0) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this._selectVoices();
    window.speechSynthesis.cancel();

    const sRatio = q16Clamp(sanityQ16, 0, Q16_ONE) / Q16_ONE;
    const tension = q16Clamp(dirichletEnergyQ16, 0, Q16_ONE) / Q16_ONE;

    const u = new SpeechSynthesisUtterance(runeWord.toLowerCase());
    if (this.femaleScotGB) u.voice = this.femaleScotGB;
    u.lang = 'en-GB';
    // Warps from haunting Scottish soprano (1.18) down into eldritch sub-octave (0.28) as Sanity fractures
    u.pitch = Math.max(0.25, 1.18 * sRatio - 0.35 * tension);
    u.rate = Math.max(0.52, 0.82 * sRatio);
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
  }
}
