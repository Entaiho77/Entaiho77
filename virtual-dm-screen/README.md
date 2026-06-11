# Virtual DM Screen

A browser-based Dungeon Master screen for remote tabletop sessions. This is
**Phase 1** of the three-phase plan in the project brief: a complete,
local-only DM toolkit. No login, no cloud, no player view yet — those are
Phases 2 and 3.

## What's in Phase 1

- **Combat tab** — initiative tracker with rounds/turns, per-combatant HP
  (damage/heal), and condition chips drawn from the active game system.
- **Dice sidebar** — always visible; dice buttons come from the active
  system, with quantity + modifier and a roll history.
- **Library tab** — create and save creatures, characters, and places.
  Creatures/characters get stat fields from their game system and can be
  sent straight into combat.
- **Reference tab** — pre-loaded D&D 5e SRD tables (conditions, actions,
  cover, exhaustion, DCs, skills, light) plus your own free-text panels.
  A filter box finds rules fast mid-combat.
- **Notes tab** — a quick scratchpad plus named session notes that persist.
- **Settings tab** — switch/edit/add game systems (dice list, stat fields,
  conditions), export all data to a JSON file, import it back, reset.

Ships with two system presets: **D&D 5e** and **Solryn** (currently a
placeholder — see below).

## Running it

You need [Node.js](https://nodejs.org) installed (version 18 or newer).

```bash
cd virtual-dm-screen
npm install        # first time only
npm run dev        # starts a local server, prints a URL to open
```

To build the deployable version: `npm run build` (output lands in `dist/`).

## Where things live

```
index.html                  Page shell + font loading
src/main.jsx                Entry point — mounts React
src/App.jsx                 Header, tabs, layout
src/styles.css              All styling (design tokens at the top)
src/state/AppState.jsx      THE data model: one state object, autosaved to
                            localStorage; export/import lives here too
src/data/systems.js         D&D 5e and Solryn system presets
src/data/referenceTables.js Built-in 5e SRD reference tables
src/components/             One file per feature (combat, dice, notes,
                            reference, library, settings)
```

The single most important file is `src/state/AppState.jsx` — every feature
reads and writes state through it. When Phase 2 swaps localStorage for
Supabase, that file changes and the components mostly don't.

## Important notes for the maintainer

- **Data lives in the browser.** Clearing site data wipes it. Use
  *Settings → Export data* regularly; the file is your backup and will
  remain the import format in later phases.
- **Solryn preset.** Built from the Solryn Master Reference Document
  v1.2. Same dice and conditions as 5e; creature stat fields mirror the
  master doc's stat block (DR, Speed, Damage, AP, Soul Core) plus the
  seven attributes (STR, NIM, END, WIS, INT, ARC, LCK). Solryn rules
  tables (core rules, derived stats, combat, crits, armor, races,
  leveling, magic…) are pre-loaded in the Reference tab, and the
  Library tab has an "Add Solryn bestiary" button that loads the 10
  statted creatures from the master doc. When the master doc changes,
  update `src/data/referenceTables.js` and `src/data/solrynBestiary.js`.
- **Editing the built-in 5e tables** means editing
  `src/data/referenceTables.js` — they're code, not saved data, so they
  can't be lost or corrupted by a bad import.

## Roadmap (from the brief)

1. ✅ **Phase 1 — local DM screen** (this code)
2. **Phase 2 — accounts & cloud**: Supabase auth + Postgres persistence.
   Heads-up for then: Supabase free-tier projects pause after ~1 week of
   inactivity (one-click resume in their dashboard); paid tier is ~$25/mo
   if the tool outgrows free.
3. **Phase 3 — player view & sharing**: room-code links, real-time sync,
   per-item reveal checkboxes. Hidden data must be filtered server-side so
   it never reaches player devices.

## Deploying (optional for Phase 1)

Any free static host works (Vercel, Netlify, Cloudflare Pages). Point the
host at this `virtual-dm-screen/` subfolder as the project root; build
command `npm run build`, output directory `dist`.
