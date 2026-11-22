import assert from 'node:assert/strict';
import { Q16_ONE, Q16_HALF } from '../src/core/q16.js';
import { Dollar1Q16Recognizer } from '../src/physics/dollar1_q16.js';
import { CircleOfPower } from '../src/physics/circle_of_power.js';
import { ROIVAS_CHAPTERS, checkChapterVictory } from '../src/story/roivas_chapters.js';

const rec = new Dollar1Q16Recognizer();

// 1. Verify Downward V -> CHATTURGHA
const vMatch = rec.recognizePoints(Array.of({ x: 10, y: 10 }, { x: 50, y: 90 }, { x: 90, y: 10 }));
assert.equal(vMatch.runeId, 'CHATTURGHA');

// 2. Verify Diamond -> ULYAOTH (separated from smooth Enso PARGON)
const diamondMatch = rec.recognizePoints(
  Array.of({ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }, { x: 50, y: 0 })
);
assert.equal(diamondMatch.runeId, 'ULYAOTH');

// 3. Verify Smooth Enso Circle -> PARGON
const circlePts = Array.from({ length: 25 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2;
  return { x: 50 + Math.cos(a) * 45, y: 50 + Math.sin(a) * 45 };
});
const ensoMatch = rec.recognizePoints(circlePts);
assert.equal(ensoMatch.runeId, 'PARGON');

// 4. Verify Chapter I victory
const ch1 = ROIVAS_CHAPTERS.at(0);
const circle = new CircleOfPower(ch1.circlePoints);
ch1.suggestedRunes.forEach((r, idx) => circle.inscribeRune(idx, r, diamondMatch.potencyMultQ16));
circle.step();
assert.equal(checkChapterVictory(ch1, circle.evaluateSpell()), true);

console.log('✓ Diamond vs Enso $1 Separation & Chapter Suite Verified:', {
  diamond: diamondMatch.runeId,
  enso: ensoMatch.runeId,
  vShape: vMatch.runeId
});
