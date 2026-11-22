# Preprint: Non-Euclidean Camp, Unistroke Friction, and Cellular Sheaf Action-Gating in *Roivas Manor: 2026* (`v0.2.0-alpha`)

**Author:** Borealis Serenity Hedling 
**Date:** November 22, 2026  
**Repository:** `://github.com`  
**Status:** Self-Aware Proof-of-Concept Preprint (`v0.2.0-alpha`)

---

## Abstract

***Roivas Manor: 2026* (`v0.2.0-alpha`)** is a zero-float, zero-dependency interactive proof of concept that deploys industrial-grade fixed-point cellular sheaf cohomology (`Q16.16`), `4×4` De Casteljau bicubic Bezier manifolds, depth-sorted 3D octahedron projection, and Piper neural wave narration in service of a deliberately campy premise: **that basic Euclidean polygons and sharp corners are cosmically terrifying.** Inspired by H. P. Lovecraft's horror of non-Euclidean angles (Lovecraft, 1928) and Silicon Knights' *Eternal Darkness: Sanity's Requiem* (2002), this paper offers a candid post-mortem of our current prototype. We acknowledge the severe mechanical limits of our 12×16 hex-bitmap sprites, single-stroke gesture collisions on complex multi-stroke runes, and static 3-room loop. Finally, we demonstrate how classic point-and-click adventure design—specifically the threshold-based exploration and causal action-gating perfected in both *Eternal Darkness* and Humongous Entertainment's *Putt-Putt* series (1992–2000)—can be formalized mathematically inside our `Q16.16` cellular sheaf paradigm to build a genuinely coherent, explorable haunted estate.

---

## 1. An Ironic Ode to Scary Geometry (The Over-Engineered Cosmology)

There is an inherent comedic absurdity in bringing **spectral cellular sheaf theory** (Hansen & Ghrist, 2019), **7th-century Bhaskara I rational trigonometry**, and **Tikhonov singularity regularization** ($\lambda_{Q16} = 98$) to bear on a 480×272 pixel canvas where a 36×48 trenchcoat sprite stands beside a rotating purple octahedron.

In Lovecraftian fiction, madness is reliably induced by "angles that are acute where they ought to be obtuse." *Roivas Manor: 2026* takes that trope literally:
* **The Cosmology Engine:** Four cosmic entities—**Chattur'gha** (Matter), **Ulyaoth** (Magick), **Xel'lotath** (Sanity), and **Mantorok** (Binding)—are modeled as orthogonal channels in a 4D `Q16.16` integer stalk vector $\mathcal{F}(v) \in \mathbb{Z}_{32}^4$.
* **The Punchline:** When a player connects a red chevron (`CHATTURGHA`) to a green zig-zag (`XELLOTATH`), the coboundary operator $\delta^0$ computes non-zero Dirichlet frustration energy $\mathcal{E}$, detuning a Karplus-Strong string waveguide (Karplus & Strong, 1983) into a microtonal tritone and warping a Scottish female neural voice (`en_GB-alba-medium`) into slow-motion dread. In short: **we built a deterministic differential-geometry physics kernel to make a triangle argue with a diamond.**

Released unabashedly as a **campy proof of concept**, `v0.2.0-alpha` succeeds at proving that zero-float math, Bayer ordered dithering (Bayer, 1973), and CI-rendered neural audio can coexist in a tiny web footprint—while making no pretense of being a finished commercial horror game.

---

## 2. Candid Limitations of `v0.2.0-alpha`

### 2.1 One-to-One Unistroke Friction on Complex Runes
While separating sharp-cornered diamonds (`ULYAOTH`) from smooth *Enso* circles (`PARGON`) resolved primary loop collisions, our `$1` unistroke recognizer (Wobbrock et al., 2007) remains fundamentally constrained by **single-stroke continuity**:
* Complex runes such as **Aretak** (trident cross), **Antorbok** (spear arrow), and **Mantorok** (hourglass chaos-cross) naturally invite lifted-pen multi-stroke drawing. Forcing players to trace them as one continuous unistroke introduces unnatural retracing artifacts and recognition friction under time pressure.
* **Required Upgrade:** Transition from `$1` to a **`$P` Point-Cloud Recognizer** (Vatavu et al., 2012) or **`$N` Multistroke Recognizer** (Anthony & Wobbrock, 2010) implemented in `Q16.16` integer coordinates, treating strokes as order-independent point sets so players can lift their finger naturally across multi-line sigils.

### 2.2 Basic Visual Assets & Static Diorama Staging
The current mansion relies on procedural line-art arches and three static `12×16` 1-bit hex-mask sprites (`Investigator`, `Grandfather Clock`, `Horror`). While charmingly reminiscent of early handheld hardware, the investigator cannot walk across rooms, inspect furniture, or carry physical inventory items.

---

## 3. World-Building Through Thresholds & Action-Gating: From *Putt-Putt* to *Eternal Darkness*

To evolve from a three-screen spell sandbox into an authentic, explorable Roivas Manor, we must look at how classic adventure games construct believable worlds out of minimal screens. Remarkably, psychological survival horror (*Eternal Darkness*) and children's point-and-click adventures (*Putt-Putt Saves the Zoo*, Humongous Entertainment, 1995) rely on the exact same structural grammar: **spatial thresholds and causal action-gating** (Fernández-Vara, 2009; Adams, 2014).

### 3.1 The *Putt-Putt* & *Eternal Darkness* Threshold Loop
In *Putt-Putt*, world-building happens not through open-world sprawl, but through **legible local state transitions across doorways (thresholds)**:
1. **The Threshold:** A locked gate, a broken bridge, or a sleeping animal blocks passage between Room $A$ and Room $B$.
2. **Diegetic Affordance:** Inspecting the threshold reveals *why* it is gated (e.g., an empty rope hook, a missing gear, or a glowing rune seal).
3. **Cross-Room Causal Gating:** Acquiring an item or tool in Room $C$ (e.g., *Putt-Putt*'s rope or Alexandra Roivas's *Enchanted Gladius* / *Chapter Page*) transforms the threshold in Room $A$, permanently altering the room's visual state, ambient audio, and navigable graph.

*Eternal Darkness* layers **Sanity-modulated perception** onto this exact *Putt-Putt* loop: crossing a doorway threshold triggers `Ledger 2` hallucinations (walking into a room upside-down, shrinking portraits, or phantom enemies) while `Ledger 1` tracks whether the player holds the physical key or counter-alignment spell required to unseal the next wing of the mansion.

---

## 4. Formalizing Thresholds & Action-Gating in `Q16.16` Cellular Sheaves

Crucially, we do not need an external quest-flag engine to implement *Putt-Putt* / *Eternal Darkness* world-building. **A cellular sheaf is already a mathematical machine for local-to-global threshold gating.**

### 4.1 Rooms as 0-Cells and Doorways as Gated 1-Cells
Let the Roivas Manor floorplan be modeled as a cell complex $X$:
* **0-Cells ($v \in X_0$):** Individual manor rooms (*Foyer*, *Dining Hall*, *Servants' Quarters*, *Forbidden Library*, *Observatory*), each carrying a `Q16.16` state stalk $\mathcal{F}(v) \in \mathbb{Z}_{32}^k$ encoding both cosmic alignment dominance and local room flags (e.g., `CLOCK_WOUND`, `BARRICADE_BURNED`, `RELIC_PLACED`).
* **1-Cells ($e = (u, v) \in X_1$):** Thresholds (doors, secret bookcases, cellar stairs) connecting Room $u$ to Room $v$.

### 4.2 Restriction Maps ($\mathcal{F}_{u \trianglelefteq e}$) as Action Gates
In cellular sheaf theory, passage across an edge $e = (u, v)$ is valid (a **global section**, $\delta^0 \mathbf{x} = \mathbf{0}$) if and only if the state at Room $u$ matches the state at Room $v$ after applying the edge's **restriction map** $\mathcal{F}_{u \trianglelefteq e}$ (Curry, 2014):

$$\mathcal{F}_{u \trianglelefteq e}(\mathbf{x}_u) = \mathcal{F}_{v \trianglelefteq e}(\mathbf{x}_v)$$

We can encode every classic adventure-game puzzle directly as an integer restriction matrix $R_e$ in `Q16.16`:
1. **Physical Item Gate (*Putt-Putt* Key/Tool):** Door edge $e_{\text{cellar}}$ projects onto the `BRASS_KEY` bitmask channel of the player's stalk. If `KEY == 0`, the coboundary tension $\mathcal{E}(e_{\text{cellar}}) > 0$ physically blocks movement and triggers a diegetic *"The cellar lock is rusted shut"* narration.
2. **Runic Counter-Alignment Gate (*Eternal Darkness* Barrier):** A crimson *Chattur'gha* flesh-barrier blocking the Library staircase defines a restriction map requiring $\text{Ulyaoth}_{Q16} \ge 65536$ (`1.0x`) on the incident vertex. Casting `ULYAOTH + ANTORBOK + REDGORMOR` satisfies the restriction equation, collapsing $\mathcal{E}(e) \to 0$, dissolving the barrier sprites, and unlocking the upper floor.
3. **Sanity-Warped Thresholds (`Ledger 2` Hallucination Edges):** When `sanityQ16 < 26214` (`40%`), `Ledger 2` temporarily re-routes doorway transitions to phantom mirror-rooms before snapping the player back to their true `Ledger 1` coordinates—preserving deterministic `< 4 KB` FNV-1a replay verification while delivering psychological horror.

---

## 5. Conclusion

*Roivas Manor: 2026* (`v0.2.0-alpha`) embraces its status as a campy, mathematically over-engineered tribute to retro horror and scary geometry. By upgrading our unistroke recognizer to `$P` multistroke point clouds and promoting doorways from static menu dropdowns to **sheaf-theoretic restriction gates**, future versions can unite *Putt-Putt*'s tactile causal world-building with *Eternal Darkness*'s creeping cosmic dread—all inside the exact same zero-float `Q16.16` kernel.

---

## References (APA 7th Edition)

* Adams, E. (2014). *Fundamentals of game design* (3rd ed.). New Riders.
* Anthony, L., & Wobbrock, J. O. (2010). A lightweight multistroke recognizer for user interface prototypes. *Proceedings of Graphics Interface 2010 (GI '10)*, 245–252. https://doi.org
* Bayer, B. E. (1973). An optimum method for two-level rendition of continuous-tone pictures. *IEEE International Conference on Communications*, *1*, 26-11–26-15.
* Curry, J. (2014). *Sheaves, cosheaves and applications* [Doctoral dissertation, University of Pennsylvania]. arXiv. https://arxiv.org
* Fernández-Vara, C. (2009). The tribulations of adventure games: Integrating story into simulation through performance [Doctoral dissertation, Georgia Institute of Technology]. SMARTech Repository. handle.net
* Hansen, J., & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. Journal of Applied and Computational Topology, 3(4), 315–358. doi.org
* Humongous Entertainment. (1995). Putt-Putt Saves the Zoo [Video game]. Humongous Entertainment.
* Karplus, K., & Strong, A. (1983). Digital synthesis of plucked-string and drum timbre. Computer Music Journal, 7(2), 43–55. doi.org
* Lovecraft, H. P. (1928, February). The call of Cthulhu. Weird Tales, 11(2), 159–178.
* Silicon Knights. (2002). Eternal Darkness: Sanity's Requiem [Video game]. Nintendo.
* Vatavu, R.-D., Anthony, L., & Wobbrock, J. O. (2012). Gestures as point clouds: A $P recognizer for user interface prototypes. Proceedings of the 14th ACM International Conference on Multimodal Interaction (ICMI '12), 273–280. doi.org
* Wobbrock, J. O., Wilson, A. D., & Li, Y. (2007). Gestures without libraries, toolkits or training: A $1 recognizer for user interface prototypes. Proceedings of the 20th Annual ACM Symposium on User Interface Software and Technology (UIST '07), 159–168. doi.org

