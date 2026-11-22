export const ROIVAS_CHAPTERS = Array.of(
  {
    id: 'CH1_FOYER',
    room: 'FOYER',
    title: 'Chapter I: The Thirteenth Chime (2026)',
    circlePoints: 3,
    narrative: 'October 2026. Twenty-four years after Alexandra Roivas sealed the estate, the Foyer grandfather clock strikes thirteen. Astral energy leaks from a hovering octahedron crystal.',
    objective: 'Cast a 3-Point Magick Ward: ULYAOTH (Diamond) + BANKOROK (Shield) + REDGORMOR (Triangle).',
    required: { alignment: 'ULYAOTH', verb: 'BANKOROK', noun: 'REDGORMOR' },
    suggestedRunes: Array.of('ULYAOTH', 'BANKOROK', 'REDGORMOR')
  },
  {
    id: 'CH2_LIBRARY',
    room: 'LIBRARY',
    title: 'Chapter II: Whispers in the Stacks',
    circlePoints: 5,
    narrative: 'In the Forbidden Library, a Xel\'lotath horror materializes from the Tome of Eternal Darkness, fracturing your perception. Counter Green Mind with Red Matter!',
    objective: 'Cast an Amplified Flesh Strike (5-Pt): CHATTURGHA (V) + PARGON (Circle) + ANTORBOK (Arrow) + PARGON + ARETAK (Cross).',
    required: { alignment: 'CHATTURGHA', verb: 'ANTORBOK', noun: 'ARETAK' },
    suggestedRunes: Array.of('CHATTURGHA', 'PARGON', 'ANTORBOK', 'PARGON', 'ARETAK')
  },
  {
    id: 'CH3_OBSERVATORY',
    room: 'OBSERVATORY',
    title: 'Chapter III: The Fractured Octahedron',
    circlePoints: 5,
    narrative: 'Beneath the manor, the 3D crystal splits along coboundary fault lines. Only Mantorok, the Corpse-God, can bind the manifold without collapsing reality.',
    objective: 'Cast a Mantorok Binding Field (5-Pt): MANTOROK (Hourglass) + PARGON (Circle) + BANKOROK (Shield) + PARGON + REDGORMOR (Triangle).',
    required: { alignment: 'MANTOROK', verb: 'BANKOROK', noun: 'REDGORMOR' },
    suggestedRunes: Array.of('MANTOROK', 'PARGON', 'BANKOROK', 'PARGON', 'REDGORMOR')
  }
);

export function checkChapterVictory(chapter, spellResult) {
  if (!spellResult || !spellResult.valid) return false;
  return (
    spellResult.alignment === chapter.required.alignment &&
    spellResult.verb === chapter.required.verb &&
    spellResult.noun === chapter.required.noun
  );
}
