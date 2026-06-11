// ---------------------------------------------------------------------------
// Game system presets.
//
// A "system" tells the rest of the app three things:
//   - dice:       which dice appear in the dice roller (numbers = sides)
//   - statFields: which stat boxes appear on creatures and characters
//   - conditions: which conditions can be applied to combatants
//
// Each stat field has a stable `key` (used to store values) and a `label`
// (what the DM sees). The key never changes once created, even if the label
// is edited later — that way renaming a field doesn't orphan saved data.
//
// These presets are copied into the DM's saved data the first time the app
// runs, so the DM can edit them freely in Settings without touching code.
// ---------------------------------------------------------------------------

export function defaultSystems() {
  return [
    {
      id: 'dnd5e',
      name: 'D&D 5e',
      dice: [4, 6, 8, 10, 12, 20, 100],
      statFields: [
        { key: 'ac', label: 'AC' },
        { key: 'str', label: 'STR' },
        { key: 'dex', label: 'DEX' },
        { key: 'con', label: 'CON' },
        { key: 'int', label: 'INT' },
        { key: 'wis', label: 'WIS' },
        { key: 'cha', label: 'CHA' },
      ],
      conditions: [
        'Blinded',
        'Charmed',
        'Deafened',
        'Frightened',
        'Grappled',
        'Incapacitated',
        'Invisible',
        'Paralyzed',
        'Petrified',
        'Poisoned',
        'Prone',
        'Restrained',
        'Stunned',
        'Unconscious',
        'Exhaustion',
        'Concentrating',
      ],
    },
    {
      // ----------------------------------------------------------------
      // Solryn — the DM's homebrew system.
      // Per the DM: it uses the same d20 dice and the same conditions
      // as D&D 5e, with its own seven attributes. Stat block fields
      // beyond the attributes (defense, speed, etc.) are still pending
      // the DM's character sheet — add them here or in Settings.
      // ----------------------------------------------------------------
      id: 'solryn',
      name: 'Solryn',
      dice: [4, 6, 8, 10, 12, 20, 100],
      statFields: [
        { key: 'str', label: 'STR' },
        { key: 'nim', label: 'NIM' },
        { key: 'end', label: 'END' },
        { key: 'wis', label: 'WIS' },
        { key: 'int', label: 'INT' },
        { key: 'arc', label: 'ARC' },
        { key: 'lck', label: 'LCK' },
      ],
      conditions: [
        'Blinded',
        'Charmed',
        'Deafened',
        'Frightened',
        'Grappled',
        'Incapacitated',
        'Invisible',
        'Paralyzed',
        'Petrified',
        'Poisoned',
        'Prone',
        'Restrained',
        'Stunned',
        'Unconscious',
        'Exhaustion',
      ],
    },
  ];
}

// Turns a human label like "Hit Dice" into a storage-safe key like "hit-dice".
// A short random suffix prevents collisions if two fields share a label.
export function makeFieldKey(label) {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'field'}-${Math.random().toString(36).slice(2, 6)}`;
}
