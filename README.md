# 🕯️ Roivas Manor: 2026 (`Q16.16` Narrative Runic Engine)

> 🚧 **UNDER CONSTRUCTION (`v0.2.0-dev`)** 🚧  
> *Narrative sequel & architectural expansion of [`tome-of-eternal-holonomy`](https://github.com) powered by [`ndh-retro-hw-pipeline`](https://github.com).*

Twenty-four years after Alexandra Roivas sealed the Essence of Mantorok beneath the Rhode Island estate, the manor's grandfather clock strikes thirteen. A fractured, hovering **3D Astral Crystal** has manifested inside the estate—leaking *Dirichlet Tension* back through the halls.

Built on a **zero-float, zero-dependency `Q16.16` fixed-point Dual-Ledger engine**, *Roivas Manor: 2026* combines freehand **12-rune `$1` unistroke spellcasting**, **3D floating crystal physics**, **procedural `480×272` `CLUT8` manor rooms & bitmap sprites**, and **sanity-detuned Karplus-Strong waveguide audio**.

---

## 🏛️ What's New Over `tome-of-eternal-holonomy` (`v0.1.0`)

1. **Full 12-Rune Fixed-Point `$1` Unistroke Recognizer (`src/physics/dollar1_q16.js`):**
   * Resamples freehand brush strokes to 32 equidistant `Q16.16` points and scores golden-section template similarity across **all 12 runes** (*Chattur'gha*, *Ulyaoth*, *Xel'lotath*, *Mantorok*, *Antorbok*, *Bankorok*, *Tier*, *Narokath*, *Redgormor*, *Magormor*, *Aretak*, and *Pargon*).
   * **Stroke Accuracy Scaling:** Higher freehand precision multiplies spell potency (`0.6x` sloppy scribble → `1.4x` master calligraphy).
2. **Floating 3D Octahedron Crystal & Retro Sprite Blitter (`src/render/`):**
   * Depth-sorted 8-face 3D rotating crystal relic hovering above the Circle of Power, refracting alignment `CLUT8` palettes and fracturing into shards under Dirichlet stress.
   * Zero-asset procedural pixel-art sprites (Investigator with flickering lantern cone, Grandfather Clock, Candelabra, and manifested *Bonethief* / *Trapper* horrors) blitted directly into the `480×272` `CLUT8` Bayer-dithered framebuffer.
3. **Three Explorable Story Chapters (`src/story/roivas_chapters.js`):**
   * **Chapter I — *The Thirteenth Chime* (Grandfather Foyer):** Seal the temporal rift bleeding from the grandfather clock.
   * **Chapter II — *Whispers in the Stacks* (Forbidden Library):** Counter a *Xel'lotath* psychic parasite using the cosmic dominance triangle.
   * **Chapter III — *The Fractured Octahedron* (Sub-Basement Observatory):** Bind the destabilizing 3D crystal with a 5-point Mantorok equilibrium ritual.

---

## 🗂️ Repository Structure

```text
roivas-manor-2026/
├── README.md
├── package.json
├── index.html                                # 480x272 interactive manor & ritual sandbox
├── docs/
│   └── STORY_AND_MECHANICS.md                # Chapter walkthroughs, 12-rune templates & sprite pipeline
├── src/
│   ├── core/                                 # LEDGER 1: Deterministic Q16.16 math & cellular sheaf
│   │   ├── q16.js                            # Fixed-point arithmetic, Bhaskara trig & Galois LFSR
│   │   ├── sheaf_cosmology.js                # 4-Alignment stalks, Dirichlet tension & Mantorok clamping
│   │   └── replay_ledger.js                  # < 4 KB deterministic input recorder & FNV-1a verifier
│   ├── physics/                              # 12-rune \$1 recognizer & 4x4 De Casteljau tidal manifold
│   │   ├── bezier_patch.js                   # Bicubic integer spring grid
│   │   ├── circle_of_power.js                # N-gon vertex topology & accuracy-weighted spell solver
│   │   └── dollar1_q16.js                    # 32-point fixed-point \$1 unistroke template recognizer
│   ├── render/                               # LEDGER 2: ndh-retro-hw-pipeline 3D crystal & CLUT8 sprites
│   │   ├── bayer_clut8.js                    # 480x272 indexed framebuffer, 4x4 Bayer dithering & rooms
│   │   ├── crystal_3d.js                     # Depth-sorted rotating 3D octahedron relic & shard VFX
│   │   ├── manor_sprites.js                  # Zero-asset hex-bitmap sprite blitter & lantern lighting
│   │   └── sanity_glitches.js                # Read-only fourth-wall Sanity hallucinations
│   ├── audio/                                # LEDGER 2: Sanity-detuned waveguide & manor ambience
│   │   ├── karplus_strong.js                 # Integer delay-line string voice
│   │   └── formant_whisper.js                # Grandfather clock ticks, ritual drone & LFSR whispers
│   └── story/                                # Narrative chapters, room backdrops & encounter triggers
│       └── roivas_chapters.js                # 3-Chapter Roivas Manor (2026) progression & win states
└── tests/
    └── engine_suite_test.js                  # Verifies \$1 rune recognition, 3D crystal & sheaf determinism
```
