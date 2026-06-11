// ---------------------------------------------------------------------------
// Solryn starter bestiary — the 10 statted creatures from the Solryn
// Master Reference Document v1.2, Chapter 7.
//
// The Library tab has an "Add Solryn bestiary" button that copies these
// into the DM's saved creatures (skipping any name that already exists,
// so it's safe to press twice). Stat keys here must match the Solryn
// preset's statFields in systems.js.
// ---------------------------------------------------------------------------

export const solrynBestiary = [
  {
    name: 'Mossback Hare',
    maxHp: 8,
    stats: { dr: '0', speed: '35 ft', damage: '—' },
    notes:
      'Non-combatant, Beast.\nSpecial: Burrow Dodge, Lichen Blend (natural camouflage).\nHarvestable: Sleeproot moss (healing ingredient).\nNative: Highland meadows.',
  },
  {
    name: 'Duskwatcher Owlcat',
    maxHp: 22,
    stats: { dr: '1', speed: '30 ft, glide 40 ft', damage: '1d6+3 Slashing (pounce +1d4)' },
    notes:
      'Easy, Predator.\nSpecial: Silent Descent, Twilight Tracker, Hiss-Screech.\nSoul Core: none.\nNative: Highland woods, canopy trails.',
  },
  {
    name: 'Bramble Boar',
    maxHp: 28,
    stats: { dr: '2', speed: '30 ft', damage: '1d6+4 Piercing (charge +1d4)' },
    notes:
      'Easy, Beast.\nSpecial: Thornshake (AoE), Brushbreaker, Pain-Fueled Rage.\nSoul Core: none.\nNative: Highland thickets, brambles.',
  },
  {
    name: 'Crag Hound',
    maxHp: 24,
    stats: { dr: '2', speed: '35 ft', damage: '1d6+3 Piercing', soulcore: 'Shadowbound (DC 14)' },
    notes:
      'Easy, Shadow Beast.\nSpecial: Mountain Ghost, Death-Stalker, Shadowmeld.\nNative: Mountain passes, cliff trails.',
  },
  {
    name: 'Knockerkin',
    maxHp: 18,
    stats: { dr: '1', speed: '25 ft (climb 20 ft)', damage: '1d4+2 Piercing' },
    notes:
      'Easy, Fey.\nSpecial: False Echo, Tunnel Slinker, Greed Sense.\nSoul Core: none (can be captured alive).\nNative: Abandoned mines, caves.',
  },
  {
    name: 'Lantern Wraith',
    maxHp: 18,
    stats: { dr: '1', speed: '20 ft float', damage: '1d6 Arcane', soulcore: 'Arcane/Spirit (DC 14)' },
    notes:
      'Easy, Spirit.\nSpecial: Lurelight Pulse, Misty Allure, Ethereal Drift.\nNative: Misty forests, old roads.',
  },
  {
    name: 'Hollow Man',
    maxHp: 22,
    stats: { dr: '2', speed: '25 ft', damage: '1d6+1 Slashing' },
    notes:
      'Easy, Construct.\nSpecial: Effigy Stillness, Silent Lurch, Restraining thorns.\nSoul Core: none.\nNative: Deep woods, abandoned farmland.',
  },
  {
    name: 'Whippoorwail',
    maxHp: 16,
    stats: { dr: '1', speed: '30 ft fly', damage: '1d4+2 Piercing + 1 Arcane', soulcore: 'Fading Core (DC 13, destroyed by Radiant)' },
    notes:
      'Easy, Spirit Beast.\nSpecial: Death-Linked, Cry of the Dying, blocks Luck recovery.\nNative: Forest edges, burial grounds.',
  },
  {
    name: 'Hollowkin',
    maxHp: 28,
    stats: { dr: '2', speed: '30 ft, hover 20 ft', damage: '1d8 Psychic + 1d4 Arcane', soulcore: 'Ethereal Core (DC 14)' },
    notes:
      'Easy, Spirit.\nSpecial: Misty Veil, Fade Step, Test of the Soul, Mirror Echo.\nNative: Highland ridges, misty ruins.',
  },
  {
    name: "T'rellin Shaman",
    maxHp: 22,
    stats: { dr: '1', speed: '30 ft (climb 30 ft)', damage: '1d6 Bludgeoning (staff)', soulcore: 'Naturebound Core (DC 14)' },
    notes:
      'Easy, Insectoid Caster.\nSpells (1/rest each): Entangle, Sporeblind, Chitin Shield.\nSpecial: Spellcaster, nature magic.\nNative: Canopy sanctuaries, oak groves.',
  },
];
