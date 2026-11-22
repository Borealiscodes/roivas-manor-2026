import { Q16_TAU, q16Sin, q16Cos, q16Mul, q16Clamp } from '../core/q16.js';

// Unit octahedron vertices in Q16.16 (scaled by 32768 = 0.5)
const VERTS = Array.of(
  Array.of(0, -42000, 0),    // 0: Top apex
  Array.of(26000, 0, 0),     // 1: +X
  Array.of(0, 0, 26000),     // 2: +Z
  Array.of(-26000, 0, 0),    // 3: -X
  Array.of(0, 0, -26000),    // 4: -Z
  Array.of(0, 42000, 0)      // 5: Bottom apex
);

const FACES = Array.of(
  Array.of(0, 1, 2), Array.of(0, 2, 3), Array.of(0, 3, 4), Array.of(0, 4, 1),
  Array.of(5, 2, 1), Array.of(5, 3, 2), Array.of(5, 4, 3), Array.of(5, 1, 4)
);

export class FloatingCrystal3D {
  constructor() {
    this.rotY = 0;
    this.rotX = 16000;
    this.bobPhase = 0;
  }

  render(fb, cx, baseCy, dominantAlign, dirichletEnergyQ16) {
    const spinBoost = 1400 + (dirichletEnergyQ16 >> 7);
    this.rotY = (this.rotY + spinBoost) % Q16_TAU;
    this.bobPhase = (this.bobPhase + 3200) % Q16_TAU;

    const bobY = (q16Sin(this.bobPhase) * 6) >> 16;
    const cy = baseCy + bobY;
    // Fracture gap expands when opposing alignments clash
    const fracture = q16Clamp(dirichletEnergyQ16 >> 13, 0, 10);

    const cosY = q16Cos(this.rotY), sinY = q16Sin(this.rotY);
    const cosX = q16Cos(this.rotX), sinX = q16Sin(this.rotX);

    const proj = VERTS.map((v) => {
      const vx = v.at(0), vy = v.at(1), vz = v.at(2);
      const rx = q16Mul(vx, cosY) - q16Mul(vz, sinY);
      const rz1 = q16Mul(vx, sinY) + q16Mul(vz, cosY);
      const ry = q16Mul(vy, cosX) - q16Mul(rz1, sinX);
      const rz = q16Mul(vy, sinX) + q16Mul(rz1, cosX);

      return {
        sx: cx + ((rx * 34) >> 16),
        sy: cy + ((ry * 34) >> 16),
        z: rz
      };
    });

    const bank = (dominantAlign & 3) << 6;
    const sorted = FACES.map((f, idx) => {
      const a = proj.at(f.at(0)), b = proj.at(f.at(1)), c = proj.at(f.at(2));
      return { f, idx, avgZ: (a.z + b.z + c.z) / 3 };
    }).sort((m, n) => m.avgZ - n.avgZ);

    for (const item of sorted) {
      const f = item.f;
      const a = proj.at(f.at(0)), b = proj.at(f.at(1)), c = proj.at(f.at(2));
      // Backface culling via 2D cross product
      const cross = (b.sx - a.sx) * (c.sy - a.sy) - (b.sy - a.sy) * (c.sx - a.sx);
      if (cross <= 0) continue;

      const ox = (((a.sx + b.sx + c.sx) / 3 - cx) * fracture) >> 4;
      const oy = (((a.sy + b.sy + c.sy) / 3 - cy) * fracture) >> 4;

      const p0 = { sx: a.sx + ox, sy: a.sy + oy };
      const p1 = { sx: b.sx + ox, sy: b.sy + oy };
      const p2 = { sx: c.sx + ox, sy: c.sy + oy };

      const shade = q16Clamp(34 + (item.idx * 3) + ((item.avgZ >> 12) & 15), 24, 58);
      fb.fillDitheredTri(p0, p1, p2, bank, shade);
      fb.drawLine(p0.sx, p0.sy, p1.sx, p1.sy, bank + 63);
      fb.drawLine(p1.sx, p1.sy, p2.sx, p2.sy, bank + 63);
      fb.drawLine(p2.sx, p2.sy, p0.sx, p0.sy, bank + 63);
    }
  }
}
