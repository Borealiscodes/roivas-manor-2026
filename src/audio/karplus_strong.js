import { Q16_ONE, q16Mul, q16Clamp, GaloisLFSR16 } from '../core/q16.js';

export class KarplusStrongVoice {
  constructor(sampleRate = 22050, seed = 0x1337) {
    this.sampleRate = sampleRate;
    this.lfsr = new GaloisLFSR16(seed);
    this.buffer = new Int32Array(1024);
    this.length = 128;
    this.index = 0;
    this.dampingShift = 10;
    this.active = false;
  }

  pluck(baseHz, sanityQ16 = Q16_ONE, dirichletEnergyQ16 = 0) {
    const loss = Q16_ONE - q16Clamp(sanityQ16, 0, Q16_ONE);
    const shiftQ16 = q16Mul(loss, 27146) + (dirichletEnergyQ16 >> 4);
    const detunedHz = Math.max(24, baseHz + ((baseHz * shiftQ16) >> 16));
    this.length = q16Clamp((this.sampleRate / detunedHz) | 0, 16, this.buffer.length - 1);
    this.index = 0;
    for (let i = 0; i < this.length; i++) this.buffer[i] = this.lfsr.nextQ16Signed() >> 1;
    this.active = true;
  }

  nextSample() {
    if (!this.active) return 0;
    const nextIdx = (this.index + 1) % this.length;
    const avg = (this.buffer[this.index] + this.buffer[nextIdx]) >> 1;
    const damped = avg - (avg >> this.dampingShift);
    this.buffer[this.index] = damped;
    this.index = nextIdx;
    return q16Clamp(damped, -32768, 32767);
  }
}
