import { Q16_ONE, Q16_HALF, Q16_TAU, q16Mul, q16Cos, q16Sin, q16Div } from '../core/q16.js';
import { ALIGN, CosmologySheaf } from '../core/sheaf_cosmology.js';
import { BezierTidalPatch } from './bezier_patch.js';

export const RUNE_CODEX = {
  CHATTURGHA: { id: 'CHATTURGHA', type: 'ALIGNMENT', align: ALIGN.CHATTURGHA, label: "Chattur'gha" },
  ULYAOTH:    { id: 'ULYAOTH',    type: 'ALIGNMENT', align: ALIGN.ULYAOTH,    label: 'Ulyaoth' },
  XELLOTATH:  { id: 'XELLOTATH',  type: 'ALIGNMENT', align: ALIGN.XELLOTATH,  label: "Xel'lotath" },
  MANTOROK:   { id: 'MANTOROK',   type: 'ALIGNMENT', align: ALIGN.MANTOROK,   label: 'Mantorok' },
  ANTORBOK:   { id: 'ANTORBOK',   type: 'VERB', powerQ16: 65536, label: 'Antorbok' },
  BANKOROK:   { id: 'BANKOROK',   type: 'VERB', powerQ16: 78643, label: 'Bankorok' },
  TIER:       { id: 'TIER',       type: 'VERB', powerQ16: 98304, label: 'Tier' },
  NAROKATH:   { id: 'NAROKATH',   type: 'VERB', powerQ16: 85197, label: 'Narokath' },
  REDGORMOR:  { id: 'REDGORMOR',  type: 'NOUN', powerQ16: 65536, label: 'Redgormor' },
  MAGORMOR:   { id: 'MAGORMOR',   type: 'NOUN', powerQ16: 72090, label: 'Magormor' },
  ARETAK:     { id: 'ARETAK',     type: 'NOUN', powerQ16: 91750, label: 'Aretak' },
  PARGON:     { id: 'PARGON',     type: 'AMPLIFIER', multiplierQ16: 98304, label: 'Pargon' }
};

const VALID_COUNTS = new Set(Array.of(3, 5, 7, 9));

export class CircleOfPower {
  constructor(pointCount = 5) {
    if (!VALID_COUNTS.has(pointCount)) throw new Error('Invalid Circle point count');
    this.pointCount = pointCount;
    this.sheaf = new CosmologySheaf(pointCount);
    this.patch = new BezierTidalPatch();
    this.slots = new Array(pointCount).fill(null);
    this.slotAccuracyQ16 = new Int32Array(pointCount).fill(Q16_ONE);
    this.nodeCoords = this._computePolygonCoords(pointCount);
    for (let i = 0; i < pointCount; i++) this.sheaf.addEdge(i, (i + 1) % pointCount, Q16_ONE);
  }

  _computePolygonCoords(n) {
    const coords = [];
    const radius = 21626; // ~0.33
    for (let i = 0; i < n; i++) {
      const angle = q16Div(i * Q16_TAU, n << 16) - (Q16_TAU >> 2);
      coords.push({
        u: Q16_HALF + q16Mul(radius, q16Cos(angle)),
        v: Q16_HALF + q16Mul(radius, q16Sin(angle))
      });
    }
    return coords;
  }

  inscribeRune(slotIdx, runeKey, accuracyMultQ16 = Q16_ONE) {
    const rune = RUNE_CODEX[runeKey];
    if (!rune || slotIdx < 0 || slotIdx >= this.pointCount) return false;
    this.slots[slotIdx] = rune;
    this.slotAccuracyQ16[slotIdx] = accuracyMultQ16;

    if (rune.type === 'ALIGNMENT') {
      this.sheaf.setNodeAlignment(slotIdx, rune.align, accuracyMultQ16);
    } else if (rune.type === 'AMPLIFIER') {
      const effMult = q16Mul(rune.multiplierQ16, accuracyMultQ16);
      for (const edge of this.sheaf.edges) {
        if (edge.u === slotIdx || edge.v === slotIdx) {
          edge.weightQ16 = q16Mul(edge.weightQ16, effMult);
        }
      }
    }
    return true;
  }

  step() {
    this.patch.step();
    return this.sheaf.step();
  }

  evaluateSpell() {
    let alignRune = null, verbRune = null, nounRune = null, pargonCount = 0;
    let accSum = 0, filled = 0;

    for (let i = 0; i < this.pointCount; i++) {
      const s = this.slots.at(i);
      if (!s) continue;
      accSum += this.slotAccuracyQ16.at(i);
      filled++;
      if (s.type === 'ALIGNMENT') alignRune = s;
      if (s.type === 'VERB') verbRune = s;
      if (s.type === 'NOUN') nounRune = s;
      if (s.type === 'AMPLIFIER') pargonCount++;
    }

    const valid = Boolean(alignRune && verbRune && nounRune);
    let potencyQ16 = valid ? (verbRune.powerQ16 + nounRune.powerQ16) >> 1 : 0;
    for (let p = 0; p < pargonCount; p++) potencyQ16 = q16Mul(potencyQ16, RUNE_CODEX.PARGON.multiplierQ16);
    if (filled > 0) potencyQ16 = q16Mul(potencyQ16, (accSum / filled) | 0);

    return {
      valid,
      alignment: alignRune ? alignRune.id : 'NONE',
      verb: verbRune ? verbRune.id : 'NONE',
      noun: nounRune ? nounRune.id : 'NONE',
      incantation: this.slots.filter(Boolean).map((r) => r.id).join(' -> '),
      pargonCount,
      potencyQ16,
      dirichletEnergyQ16: this.sheaf.dirichletEnergyQ16,
      sanityQ16: this.sheaf.sanityQ16
    };
  }
}
