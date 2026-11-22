import assert from 'node:assert/strict';
import { Q16_ONE, Q16_HALF } from '../src/core/q16.js';
import { ALIGN, CosmologySheaf } from '../src/core/sheaf_cosmology.js';
import { Dollar1Q16Recognizer } from '../src/physics/dollar1_q16.js';
import { CircleOfPower } from '../src/physics/circle_of_power.js';
import { ROIVAS_CHAPTERS, checkChapterVictory } from '../src/story/roivas_chapters.js';

// 1. Verify 12-rune $1 recognizer classifies a downward V as CHATTURGHA
const rec = new Dollar1Q16Recognizer();
const vMatch = rec.recognizePoints(Array.of({ x: 10, y: 10 }, { x: 50, y: 90 }, { x: 90, y: 10 }));
assert.equal(vMatch.runeId, 'CHATTURGHA');
assert.ok(vMatch.accuracyQ16 > Q16_HALF);

// 2. Verify Chapter I victory condition
const ch1 = ROIVAS_CHAPTERS.at(0);
const circle = new CircleOfPower(ch1.circlePoints);
ch1.suggestedRunes.forEach((r, idx) => circle.inscribeRune(idx, r, vMatch.potencyMultQ16));
circle.step();
const spell = circle.evaluateSpell();
assert.equal(checkChapterVictory(ch1, spell), true);

console.log('✓ Roivas Manor 2026 Engine Suite Verified:', {
  recognized: vMatch.runeId,
  accuracyPct: ((vMatch.accuracyQ16 * 100) >> 16) + '%',
  chapter1Cleared: true
});
