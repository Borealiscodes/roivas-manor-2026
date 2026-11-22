import { Q16_ONE, q16Clamp, q16Div, q16Sqrt, q16Cos, q16Sin, Q16_TAU } from '../core/q16.js';

const SAMPLE_N = 24;

function resamplePoints(rawPts, n = SAMPLE_N) {
  if (rawPts.length < 2) return null;
  let totalLen = 0;
  for (let i = 1; i < rawPts.length; i++) {
    const dx = rawPts.at(i).x - rawPts.at(i - 1).x;
    const dy = rawPts.at(i).y - rawPts.at(i - 1).y;
    totalLen += Math.hypot(dx, dy);
  }
  if (totalLen < 12) return null;

  const interval = totalLen / (n - 1);
  let accum = 0;
  const pts = rawPts.map((p) => ({ x: p.x, y: p.y }));
  const out = Array.of({ x: pts.at(0).x, y: pts.at(0).y });

  for (let i = 1; i < pts.length; i++) {
    const p0 = pts.at(i - 1), p1 = pts.at(i);
    const d = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    if (accum + d >= interval && d > 0) {
      const t = (interval - accum) / d;
      const np = { x: p0.x + t * (p1.x - p0.x), y: p0.y + t * (p1.y - p0.y) };
      out.push(np);
      pts.splice(i, 0, np);
      accum = 0;
    } else {
      accum += d;
    }
  }
  while (out.length < n) out.push({ x: pts.at(-1).x, y: pts.at(-1).y });
  return out.slice(0, n);
}

function normalizePathQ16(pts) {
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const scale = Math.max(12, maxX - minX, maxY - minY);
  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;

  return pts.map((p) => ({
    x: (((p.x - cx) / scale) * Q16_ONE) | 0,
    y: (((p.y - cy) / scale) * Q16_ONE) | 0
  }));
}

/** Count sharp vertices along normalized path to separate smooth Enso loops from Diamonds/Polygons */
function countSharpCorners(normPts) {
  let corners = 0;
  let cooldown = 0;
  for (let i = 2; i < normPts.length; i++) {
    if (cooldown > 0) { cooldown--; continue; }
    const a = normPts.at(i - 2), b = normPts.at(i - 1), c = normPts.at(i);
    const v1x = b.x - a.x, v1y = b.y - a.y;
    const v2x = c.x - b.x, v2y = c.y - b.y;
    const m1 = Math.hypot(v1x, v1y), m2 = Math.hypot(v2x, v2y);
    if (m1 > 1000 && m2 > 1000) {
      const cosTheta = (v1x * v2x + v1y * v2y) / (m1 * m2);
      if (cosTheta < 0.45) {
        corners++;
        cooldown = 2;
      }
    }
  }
  return corners;
}

function buildCanonicalTemplates() {
  const raw = {
    CHATTURGHA: Array.of({x:0,y:0}, {x:50,y:100}, {x:100,y:0}),
    ULYAOTH:    Array.of({x:50,y:0}, {x:100,y:50}, {x:50,y:100}, {x:0,y:50}, {x:50,y:0}),
    XELLOTATH:  Array.of({x:0,y:0}, {x:100,y:33}, {x:0,y:66}, {x:100,y:100}),
    MANTOROK:   Array.of({x:0,y:0}, {x:100,y:100}, {x:100,y:0}, {x:0,y:100}),
    ANTORBOK:   Array.of({x:50,y:100}, {x:50,y:0}, {x:25,y:30}, {x:50,y:0}, {x:75,y:30}),
    BANKOROK:   Array.of({x:0,y:0}, {x:100,y:0}, {x:100,y:70}, {x:50,y:100}, {x:0,y:70}, {x:0,y:0}),
    TIER:       Array.of({x:15,y:100}, {x:15,y:0}, {x:85,y:0}, {x:85,y:100}),
    NAROKATH:   Array.of({x:0,y:0}, {x:100,y:0}, {x:0,y:100}, {x:100,y:100}),
    REDGORMOR:  Array.of({x:50,y:0}, {x:100,y:100}, {x:0,y:100}, {x:50,y:0}),
    MAGORMOR:   Array.of({x:0,y:20}, {x:100,y:20}, {x:100,y:80}, {x:0,y:80}, {x:0,y:20}),
    ARETAK:     Array.of({x:50,y:100}, {x:50,y:0}, {x:0,y:40}, {x:100,y:40}),
    PARGON:     Array.from({ length: 17 }, (_, i) => {
      const a = q16Div(i * Q16_TAU, 16 << 16);
      return { x: 50 + ((50 * q16Cos(a)) >> 16), y: 50 + ((50 * q16Sin(a)) >> 16) };
    })
  };

  const templates = {};
  for (const [key, pts] of Object.entries(raw)) {
    templates[key] = normalizePathQ16(resamplePoints(pts, SAMPLE_N));
  }
  return templates;
}

export class Dollar1Q16Recognizer {
  constructor() {
    this.templates = buildCanonicalTemplates();
    this.stroke = [];
  }

  begin(x, y) { this.stroke = Array.of({ x, y }); }

  add(x, y) {
    const last = this.stroke.at(-1);
    if (!last) return;
    const dx = x - last.x, dy = y - last.y;
    if (dx * dx + dy * dy >= 9) this.stroke.push({ x, y });
  }

  recognizePoints(rawPts) {
    const resampled = resamplePoints(rawPts, SAMPLE_N);
    if (!resampled) return null;
    const candidate = normalizePathQ16(resampled);
    const corners = countSharpCorners(candidate);

    let bestRune = null;
    let bestDist = 0x7fffffff;

    for (const [runeId, tmpl] of Object.entries(this.templates)) {
      let sumDist = 0;
      for (let i = 0; i < SAMPLE_N; i++) {
        const dx = (candidate.at(i).x - tmpl.at(i).x) >> 4;
        const dy = (candidate.at(i).y - tmpl.at(i).y) >> 4;
        sumDist += q16Sqrt((dx * dx + dy * dy) << 8);
      }
      let avgDist = (sumDist / SAMPLE_N) | 0;

      // Penalize PARGON (smooth Enso circle) when stroke has >= 2 sharp corners (Diamond/Triangle/Box)
      if (runeId === 'PARGON' && corners >= 2) avgDist += 14000;
      // Reward ULYAOTH / REDGORMOR / MAGORMOR when sharp polygon corners are detected
      if ((runeId === 'ULYAOTH' || runeId === 'REDGORMOR' || runeId === 'MAGORMOR') && corners >= 2) {
        avgDist = Math.max(0, avgDist - 4500);
      }

      if (avgDist < bestDist) {
        bestDist = avgDist;
        bestRune = runeId;
      }
    }

    const accuracyQ16 = q16Clamp(Q16_ONE - (bestDist << 1), 16384, Q16_ONE);
    const potencyMultQ16 = 39321 + ((accuracyQ16 * 52429) >> 16);
    return { runeId: bestRune, accuracyQ16, potencyMultQ16 };
  }

  finish() {
    const res = this.recognizePoints(this.stroke);
    this.stroke = [];
    return res;
  }
}
