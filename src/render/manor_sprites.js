import { FB_WIDTH, FB_HEIGHT } from './bayer_clut8.js';

// 12x16 bitmaps encoded as 16 rows of 12-bit hex masks
const SPRITE_INVESTIGATOR = Uint16Array.of(
  0x03C, 0x07E, 0x05A, 0x07E, 0x03C, 0x0FF, 0x1BD, 0x1BD,
  0x1FF, 0x0FF, 0x0EE, 0x0EE, 0x0EE, 0x06C, 0x06C, 0x0EE
);

const SPRITE_CLOCK = Uint16Array.of(
  0x1F8, 0x3FC, 0x7FE, 0x696, 0x6D6, 0x6F6, 0x696, 0x3FC,
  0x3FC, 0x39C, 0x39C, 0x3FC, 0x3FC, 0x3FC, 0x7FE, 0x7FE
);

const SPRITE_HORROR = Uint16Array.of(
  0x108, 0x39C, 0x7FE, 0xD6B, 0xFFF, 0x7FE, 0x39C, 0x7FE,
  0xDB6, 0x999, 0x108, 0x204, 0x402, 0x801, 0x000, 0x000
);

export function blitSprite12x16(fb, maskRows, x, y, scale, colorIdx) {
  for (let row = 0; row < 16; row++) {
    const bits = maskRows.at(row);
    for (let col = 0; col < 12; col++) {
      if ((bits >> (11 - col)) & 1) {
        for (let sy = 0; sy < scale; sy++) {
          const py = y + row * scale + sy;
          if (py < 0 || py >= FB_HEIGHT) continue;
          for (let sx = 0; sx < scale; sx++) {
            const px = x + col * scale + sx;
            if (px >= 0 && px < FB_WIDTH) fb.indices[py * FB_WIDTH + px] = colorIdx;
          }
        }
      }
    }
  }
}

export function renderManorActors(fb, roomId, dominantAlign, dirichletEnergyQ16, tick) {
  const bank = (dominantAlign & 3) << 6;
  // 1. Investigator on left dais holding flickering lantern
  blitSprite12x16(fb, SPRITE_INVESTIGATOR, 36, 178, 3, bank + 58);
  const flicker = 8 + ((tick >> 2) & 3);
  fb.drawCircleOutline(74, 198, flicker, bank + 62, 16);

  // 2. Room prop on right dais (Grandfather Clock in Foyer/Library)
  if (roomId !== 'OBSERVATORY') {
    blitSprite12x16(fb, SPRITE_CLOCK, 404, 164, 3, bank + 48);
    // Swinging pendulum
    const pendX = 422 + (((tick >> 3) & 3) - 1) * 2;
    fb.drawLine(422, 194, pendX, 206, bank + 63);
  }

  // 3. Manifested Horror appears when Dirichlet tension or low sanity triggers
  if (dirichletEnergyQ16 > 16384 || roomId === 'LIBRARY') {
    const bob = ((tick >> 3) & 3) - 1;
    blitSprite12x16(fb, SPRITE_HORROR, 386, 118 + bob, 3, 56); // Crimson horror eyes/frame
  }
}
