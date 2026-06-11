// ---------------------------------------------------------------------------
// Built-in reference tables, pre-loaded for D&D 5e.
//
// Content is summarized from the D&D 5e System Reference Document (SRD),
// which Wizards of the Coast publishes under a free license for exactly
// this kind of use.
//
// These are intentionally kept in code (not in the DM's saved data):
// they're read-only "rulebook pages". The DM adds their own editable
// panels in the Reference tab; those live in saved data instead.
// To change these tables, edit this file and redeploy.
// ---------------------------------------------------------------------------

export const builtinTables = [
  {
    id: 'conditions',
    title: 'Conditions',
    columns: ['Condition', 'Effect (summary)'],
    rows: [
      ['Blinded', "Can't see; auto-fails sight checks. Attacks against it have advantage; its attacks have disadvantage."],
      ['Charmed', "Can't attack the charmer. Charmer has advantage on social checks against it."],
      ['Deafened', "Can't hear; auto-fails hearing checks."],
      ['Frightened', 'Disadvantage on checks/attacks while source is in sight. Can’t willingly move closer to the source.'],
      ['Grappled', 'Speed 0. Ends if grappler is incapacitated or target is moved away.'],
      ['Incapacitated', "Can't take actions or reactions."],
      ['Invisible', 'Heavily obscured for hiding. Attacks against it have disadvantage; its attacks have advantage.'],
      ['Paralyzed', 'Incapacitated, can’t move/speak. Auto-fails STR & DEX saves. Attacks vs. it have advantage; hits within 5 ft are crits.'],
      ['Petrified', 'Turned to stone; incapacitated, unaware. Resistance to all damage; immune to poison/disease.'],
      ['Poisoned', 'Disadvantage on attack rolls and ability checks.'],
      ['Prone', 'Can only crawl. Disadvantage on its attacks. Melee attacks vs. it have advantage; ranged have disadvantage.'],
      ['Restrained', 'Speed 0. Attacks vs. it have advantage; its attacks have disadvantage. Disadvantage on DEX saves.'],
      ['Stunned', 'Incapacitated, can’t move, can barely speak. Auto-fails STR & DEX saves. Attacks vs. it have advantage.'],
      ['Unconscious', 'Incapacitated, prone, unaware. Drops what it holds. Attacks vs. it have advantage; hits within 5 ft are crits.'],
    ],
  },
  {
    id: 'actions-in-combat',
    title: 'Actions in Combat',
    columns: ['Action', 'What it does'],
    rows: [
      ['Attack', 'Make one melee or ranged attack (more with Extra Attack).'],
      ['Cast a Spell', 'Cast a spell with a casting time of 1 action.'],
      ['Dash', 'Gain extra movement equal to your speed this turn.'],
      ['Disengage', "Your movement doesn't provoke opportunity attacks this turn."],
      ['Dodge', 'Attacks against you have disadvantage; you make DEX saves with advantage (until your next turn).'],
      ['Help', 'Give an ally advantage on their next ability check, or on their next attack vs. a creature within 5 ft of you.'],
      ['Hide', 'Make a Dexterity (Stealth) check to become hidden.'],
      ['Ready', 'Choose a trigger and an action; use your reaction when the trigger occurs.'],
      ['Search', 'Make a Wisdom (Perception) or Intelligence (Investigation) check to find something.'],
      ['Use an Object', 'Interact with a second object, or use an object that takes an action.'],
    ],
  },
  {
    id: 'cover',
    title: 'Cover',
    columns: ['Cover', 'Benefit'],
    rows: [
      ['Half cover', '+2 bonus to AC and DEX saving throws.'],
      ['Three-quarters cover', '+5 bonus to AC and DEX saving throws.'],
      ['Total cover', "Can't be targeted directly by attacks or spells."],
    ],
  },
  {
    id: 'exhaustion',
    title: 'Exhaustion',
    columns: ['Level', 'Effect (cumulative)'],
    rows: [
      ['1', 'Disadvantage on ability checks.'],
      ['2', 'Speed halved.'],
      ['3', 'Disadvantage on attack rolls and saving throws.'],
      ['4', 'Hit point maximum halved.'],
      ['5', 'Speed reduced to 0.'],
      ['6', 'Death.'],
    ],
  },
  {
    id: 'typical-dcs',
    title: 'Typical Difficulty Classes',
    columns: ['Task difficulty', 'DC'],
    rows: [
      ['Very easy', '5'],
      ['Easy', '10'],
      ['Medium', '15'],
      ['Hard', '20'],
      ['Very hard', '25'],
      ['Nearly impossible', '30'],
    ],
  },
  {
    id: 'skills',
    title: 'Skills by Ability',
    columns: ['Ability', 'Skills'],
    rows: [
      ['Strength', 'Athletics'],
      ['Dexterity', 'Acrobatics, Sleight of Hand, Stealth'],
      ['Intelligence', 'Arcana, History, Investigation, Nature, Religion'],
      ['Wisdom', 'Animal Handling, Insight, Medicine, Perception, Survival'],
      ['Charisma', 'Deception, Intimidation, Performance, Persuasion'],
    ],
  },
  {
    id: 'light-vision',
    title: 'Light & Obscurement',
    columns: ['Situation', 'Effect'],
    rows: [
      ['Lightly obscured (dim light, patchy fog)', 'Disadvantage on Wisdom (Perception) checks relying on sight.'],
      ['Heavily obscured (darkness, opaque fog)', 'Effectively blinded when looking into the area.'],
      ['Dim light', 'Lightly obscures the area.'],
      ['Darkness', 'Heavily obscures the area.'],
    ],
  },
];
