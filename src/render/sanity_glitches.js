import { Q16_ONE, q16Clamp, GaloisLFSR16 } from '../core/q16.js';
import { FB_WIDTH, FB_HEIGHT } from './bayer_clut8.js';

const HALLUCINATIONS = Array.of(
  'ROIVAS ARCHIVE CORRUPTED — DELETING TIMELINE...',
  'THE GRANDFATHER CLOCK STRIKES THIRTEEN',
  'SANITY CRITICAL: THE MANOR WALLS BLEED',
  'CONTROLLER PORT 1 UNPLUGGED'
);

export class SanityHallucinator {
  constructor() {
    this.lfsr = new GaloisLFSR16(0x9999);
    this.tick = 0;
  }

  apply(fb, sanityQ16, dirichletEnergyQ16) {
    this.tick++;
    const loss = Q16_ONE - q16Clamp(sanityQ16, 0, Q16_ONE);
    if (loss < 8192 && dirichletEnergyQ16 < 16384) return null;

    const bleedCols = (loss >> 11) + (dirichletEnergyQ16 >> 12);
    for (let b = 0; b < bleedCols; b++) {
      const x = Math.abs(this.lfsr.nextQ16Signed()) % FB_WIDTH;
const startY = Math.abs(this.lfsr.nextQ16Signed()) % (FB_HEIGHT - 24);
const len = 8 + (Math.abs(this.lfsr.nextQ16Signed()) & 31);
for (let dy = 0; dy < len && startY + dy < FB_HEIGHT; dy++) {
fb.indices[(startY + dy) * FB_WIDTH + x] = 48 - (dy >> 1);
}
}
if (loss > 42598 && ((this.tick >> 5) & 1) === 0) {
return ((this.tick >> 6) % HALLUCINATIONS.length);
}
return null;
}
}
