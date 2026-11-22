import { Q16_ONE, Q16_TAU, q16Clamp, q16Sin, GaloisLFSR16 } from '../core/q16.js';
import { ALIGN } from '../core/sheaf_cosmology.js';
import { KarplusStrongVoice } from './karplus_strong.js';

const PITCH_HZ = {
  [ALIGN.CHATTURGHA]: 73,
  [ALIGN.ULYAOTH]: 138,
  [ALIGN.XELLOTATH]: 207,
  [ALIGN.MANTOROK]: 49
};

export class CosmologySoundscape {
  constructor(sampleRate = 22050) {
    this.sampleRate = sampleRate;
    this.voices = Array.of(
      new KarplusStrongVoice(sampleRate, 0xace1),
      new KarplusStrongVoice(sampleRate, 0xbeef),
      new KarplusStrongVoice(sampleRate, 0xdead),
      new KarplusStrongVoice(sampleRate, 0xcafe)
    );
    this.lfsr = new GaloisLFSR16(0x6661);
    this.whisperEnv = 0;
    this.w1 = 0;
    this.w2 = 0;
    this.cursor = 0;
    this.p1 = 0;
    this.p2 = 0;
    this.clockCounter = 0;
    this.reverbBuf = new Int32Array(4096);
    this.reverbIdx = 0;
  }

  triggerRuneIncantation(alignment, sanityQ16 = Q16_ONE, dirichletEnergyQ16 = 0) {
    const hz = PITCH_HZ[alignment] ?? 98;
    const v = this.voices.at(this.cursor);
    this.cursor = (this.cursor + 1) % this.voices.length;
    v.pluck(hz, sanityQ16, dirichletEnergyQ16);
    this.whisperEnv = (this.sampleRate * 0.55) | 0;
  }

  renderBlock(frameCount, sanityQ16 = Q16_ONE) {
    const out = new Int16Array(frameCount);
    const loss = Q16_ONE - q16Clamp(sanityQ16, 0, Q16_ONE);
    const step1 = ((44 * Q16_TAU) / this.sampleRate) | 0;
    const step2 = (((58 + (loss >> 12)) * Q16_TAU) / this.sampleRate) | 0;

    for (let i = 0; i < frameCount; i++) {
      this.p1 = (this.p1 + step1) % Q16_TAU;
      this.p2 = (this.p2 + step2) % Q16_TAU;
      let mix = (q16Sin(this.p1) >> 4) + (q16Sin(this.p2) >> 5);

      // Grandfather clock hollow wood tick every 1.0s
      this.clockCounter++;
      if (this.clockCounter >= this.sampleRate) this.clockCounter = 0;
      if (this.clockCounter < 180) {
        mix += ((this.lfsr.nextQ16Signed() >> 4) * (180 - this.clockCounter)) >> 8;
      }

      for (let v = 0; v < this.voices.length; v++) mix += this.voices.at(v).nextSample() >> 1;

      const noise = this.lfsr.nextQ16Signed() >> 4;
      const shift = loss > 24000 ? 2 : 3;
      this.w1 += (noise - this.w1 - (this.w2 >> 1)) >> shift;
      this.w2 += this.w1 >> shift;
      const gain = this.whisperEnv > 0 ? 4 : (1 + (loss >> 14));
      mix += (this.w2 * gain) >> 2;
      if (this.whisperEnv > 0) this.whisperEnv--;

      const echo = this.reverbBuf[this.reverbIdx];
      const wet = mix + (echo >> 1) + (echo >> 2);
      this.reverbBuf[this.reverbIdx] = q16Clamp(wet, -32768, 32767);
      this.reverbIdx = (this.reverbIdx + 1) & 4095;
      out[i] = q16Clamp(wet >> 1, -32768, 32767);
    }
    return out;
  }
}
