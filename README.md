# 🕯️ Roivas Manor: 2026 (`Q16.16` Narrative Runic Engine)

> 👁️ **CAMPY PROOF-OF-CONCEPT ALPHA (`v0.2.0-alpha`)** 👁️  
> *Narrative sequel & architectural expansion of [`tome-of-eternal-holonomy`](https://github.com) powered by [`ndh-retro-hw-pipeline`](https://github.com).*

Twenty-four years after Alexandra Roivas sealed the Essence of Mantorok beneath the Rhode Island estate, the manor's grandfather clock strikes thirteen. A fractured, hovering **3D Octahedron Crystal** has manifested inside the estate—leaking *Dirichlet Tension* back through the halls.

Built on a **zero-float, zero-dependency `Q16.16` fixed-point Dual-Ledger engine**, *Roivas Manor: 2026* deploys spectral cellular sheaf cohomology, `4×4` De Casteljau bicubic Bezier manifolds, depth-sorted 3D crystal projection, and CI-rendered Piper neural voice narration in service of a deliberately campy premise: **that basic Euclidean polygons and sharp corners are cosmically terrifying.**

---

## 🏛️ What's New Over `tome-of-eternal-holonomy` (`v0.1.0`)

1. **12-Rune Fixed-Point `$1` Unistroke Recognizer (`src/physics/dollar1_q16.js`):**
   * Resamples freehand brush strokes to 24 equidistant `Q16.16` points with sharp-corner disambiguation (separating 4-corner *Ulyaoth* diamonds from smooth *Pargon* Enso circles) across **all 12 runes** (*Chattur'gha*, *Ulyaoth*, *Xel'lotath*, *Mantorok*, *Antorbok*, *Bankorok*, *Tier*, *Narokath*, *Redgormor*, *Magormor*, *Aretak*, and *Pargon*).
   * **Stroke Accuracy Scaling:** Freehand precision scales spell potency (`0.65x` sloppy scribble → `1.40x` master calligraphy).
2. **Floating 3D Octahedron Crystal & Hex-Mask Sprite Blitter (`src/render/`):**
   * Depth-sorted 8-face 3D rotating crystal relic hovering above the altar, refracting alignment `CLUT8` palettes and fracturing outward along face normals under Dirichlet tension.
   * Zero-asset `12×16` hex-bitmap sprites (trenchcoat Investigator with flickering lantern cone, ticking Grandfather Clock, and manifested Horror) blitted directly into the `480×272` `CLUT8` Bayer-dithered framebuffer.
3. **Dual-Voice Piper Neural Narration & CI Pipeline (`.github/workflows/`, `assets/audio/`):**
   * Automated GitHub Actions workflow pre-renders 15 `.wav` voice files via **Piper TTS**: a British Male investigator (`en_GB-alan-medium`) narrating the 2026 chapters and a Scottish Female Oracle (`en_GB-alba-medium`) chanting runes whose WebAudio `playbackRate` warps down into slow-motion dread as Sanity drops (with browser `speechSynthesis` fallback).
4. **Three Story Chapters (`src/story/roivas_chapters.js`):**
   * **Chapter I — *The Thirteenth Chime* (Foyer):** Seal the temporal rift leaking from the grandfather clock (`ULYAOTH + BANKOROK + REDGORMOR`).
   * **Chapter II — *Whispers in the Stacks* (Library):** Counter a *Xel'lotath* psychic horror using the cosmic dominance triangle (`CHATTURGHA + PARGON + ANTORBOK + PARGON + ARETAK`).
   * **Chapter III — *The Fractured Octahedron* (Observatory):** Bind the destabilizing 3D crystal with a 5-point Mantorok equilibrium ritual (`MANTOROK + PARGON + BANKOROK + PARGON + REDGORMOR`).

---

## 🎭 Candid Scope & Roadmap (`v0.2.0-alpha` → `v0.3.0`)

As documented in [`docs/PREPRINT_V0_2_CAMPY_ODE_TO_GEOMETRY.md`](docs/PREPRINT_V0_2_CAMPY_ODE_TO_GEOMETRY.md), this release is an **ironic, self-aware proof of concept**:
* **Unistroke Friction:** Complex multi-line runes (*Aretak*, *Antorbok*, *Mantorok*) currently require a single continuous stroke (`$1`); `v0.3.0` will upgrade to an order-independent **`$P` Point-Cloud Recognizer** in `Q16.16`.
* **Static Diorama Staging:** Manor rooms currently act as atmospheric backdrops rather than navigable floorplans; `v0.3.0` will promote doorways into **sheaf-theoretic restriction gates** (\(\mathcal{F}_{u \trianglelefteq e}\)) inspired by *Eternal Darkness* and *Putt-Putt* causal action-gating.

---

## 🗂️ Repository Structure

```text
roivas-manor-2026/
├── README.md
├── package.json
├── index.html                                         # 480x272 interactive manor & ritual sandbox
├── .github/
│   └── workflows/
│       └── generate-piper-narration.yml               # CI workflow rendering en-GB & Scottish Piper WAVs
├── assets/
│   └── audio/                                         # 15 CI-rendered Piper neural WAV voice clips
├── docs/
│   ├── PREPRINT_V0_2_CAMPY_ODE_TO_GEOMETRY.md         # Self-aware preprint, Putt-Putt/ED gating & APA refs
│   └── BILL_NYE_ROIVAS_MANOR_TILE_EXPLAINER.md        # Accessible 6-tile visual science breakdown
├── src/
│   ├── core/                                          # LEDGER 1: Deterministic Q16.16 math & cellular sheaf
│   │   ├── q16.js                                     # Fixed-point arithmetic, Bhaskara trig & Galois LFSR
│   │   └── sheaf_cosmology.js                         # 4-Alignment stalks, Dirichlet tension & Mantorok clamping
│   ├── physics/                                       # 12-rune \$1 recognizer & 4x4 De Casteljau tidal manifold
│   │   ├── bezier_patch.js                            # Bicubic integer spring grid
│   │   ├── circle_of_power.js                         # N-gon vertex topology & accuracy-weighted spell solver
│   │   └── dollar1_q16.js                             # 24-point fixed-point \$1 unistroke + corner classifier
│   ├── render/                                        # LEDGER 2: ndh-retro-hw-pipeline 3D crystal & CLUT8 sprites
│   │   ├── bayer_clut8.js                             # 480x272 indexed framebuffer, Bayer dithering & rooms
│   │   ├── crystal_3d.js                              # Depth-sorted rotating 3D octahedron relic & shard VFX
│   │   ├── manor_sprites.js                           # Zero-asset hex-bitmap sprite blitter & lantern aura
│   │   └── sanity_glitches.js                         # Read-only fourth-wall Sanity hallucinations
│   ├── audio/                                         # LEDGER 2: Sanity-detuned waveguide & dual narration
│   │   ├── karplus_strong.js                          # Integer delay-line string voice
│   │   ├── formant_whisper.js                         # Grandfather clock ticks, ritual drone & LFSR whispers
│   │   └── dual_narrator.js                           # British Male (Alan) + Sanity-warped Scottish Female (Alba)
│   └── story/                                         # Narrative chapters, room backdrops & victory checks
│       └── roivas_chapters.js                         # 3-Chapter Roivas Manor (2026) progression
└── tests/
    └── engine_suite_test.js                           # Verifies \$1 Diamond/Enso separation & Chapter I victory
```

---

## 🚀 Quick Start

```bash
# Run deterministic test suite (Node.js >= 20)
npm test

# Serve interactive manor sandbox locally
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080`, tap **🔊 Audio**, hit **🎙️ Narrate** to hear the British male chronicle, and draw runes freehand (or tap **📜 Auto-Inscribe**) to watch the Scottish Oracle chant and the 3D crystal fracture.

---

## 🛠️ Roadmap & Status

- [x] **v0.1.0 (`tome-of-eternal-holonomy`):** Core `Q16.16` sheaf kernel, Bayer `CLUT8` renderer & Karplus-Strong synth
- [x] **v0.2.0-alpha (`roivas-manor-2026`):** 12-rune `$1` sharp-corner recognizer, 3D floating octahedron crystal, hex-bitmap sprites, 3 story chapters & GitHub Actions Piper TTS WAV packs
- [ ] **v0.3.0:** Fixed-point `$P` multistroke point-cloud recognizer & cellular sheaf restriction-map doorways (*Putt-Putt* / *Eternal Darkness* spatial exploration)
