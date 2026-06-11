// ---------------------------------------------------------------------------
// App state: one object that holds everything the DM creates.
//
// How it works, in plain terms:
//   - There is ONE state object (see buildDefaultState below) shared by the
//     whole app through React "context".
//   - Components read it with `useAppState()` and change it by calling
//     `update(draft => { ...mutate draft... })`. The `immer` library lets us
//     write changes as simple mutations while React still gets a fresh
//     object — this avoids a whole class of subtle bugs.
//   - Every change is saved to the browser's localStorage automatically.
//
// Phase 1 note: localStorage is fine as a scratch store for a single
// browser, but it is NOT durable (clearing site data wipes it). That's why
// Export/Import exists, and why Phase 2 moves persistence to Supabase.
// When Phase 2 arrives, this file is the main thing that changes — the
// components won't need to know the storage moved.
// ---------------------------------------------------------------------------

import { createContext, useContext, useEffect, useState } from 'react';
import { produce } from 'immer';
import { defaultSystems } from '../data/systems.js';

const STORAGE_KEY = 'virtual-dm-screen-v1';

// A unique id for combatants, creatures, notes, etc.
export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for very old browsers.
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function buildDefaultState() {
  return {
    version: 1,
    activeSystemId: 'dnd5e',
    systems: defaultSystems(),

    // The current combat encounter.
    encounter: {
      round: 1,
      turnIndex: 0,
      combatants: [], // { id, name, initiative, hp, maxHp, conditions: [], note }
    },

    // The DM's saved content library.
    library: {
      creatures: [], // { id, name, systemId, maxHp, stats: {fieldKey: value}, notes }
      characters: [], // same shape as creatures
      places: [], // { id, name, notes }
    },

    notes: {
      scratchpad: '', // fast mid-session jotting
      sessionNotes: [], // { id, title, body, updatedAt } — persists between sessions
    },

    // DM-defined reference panels (free text). Built-in 5e tables live in
    // src/data/referenceTables.js and are not part of saved data.
    customPanels: [], // { id, title, body }

    rollHistory: [], // newest first; capped in DiceRoller
  };
}

// Load saved state, falling back to defaults. If the saved data is from an
// older version of the app and is missing a top-level section, we fill that
// section in from defaults instead of crashing.
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaultState();
    const saved = JSON.parse(raw);
    if (typeof saved !== 'object' || saved === null) return buildDefaultState();
    return { ...buildDefaultState(), ...saved };
  } catch (err) {
    // Corrupted save data — start fresh rather than rendering a broken app.
    console.error('Could not load saved data, starting fresh:', err);
    return buildDefaultState();
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  // Lazy initializer: loadState runs once, not on every render.
  const [state, setState] = useState(loadState);

  // `update` is how every component changes state. Example:
  //   update(draft => { draft.encounter.round += 1; })
  const update = (recipe) => setState((prev) => produce(prev, recipe));

  // Replace everything at once (used by Import and Reset).
  const replaceState = (next) => setState(next);

  // Auto-save to localStorage whenever state changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Could not save data:', err);
    }
  }, [state]);

  // The system currently in use (controls dice, stat fields, conditions).
  const activeSystem =
    state.systems.find((s) => s.id === state.activeSystemId) || state.systems[0];

  return (
    <AppStateContext.Provider value={{ state, update, replaceState, activeSystem }}>
      {children}
    </AppStateContext.Provider>
  );
}

// The hook components call to get { state, update, replaceState, activeSystem }.
export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}

// ---------------------------------------------------------------------------
// Export / Import — the backup escape hatch.
// ---------------------------------------------------------------------------

// Downloads the entire state as a JSON file the DM can keep anywhere.
export function exportToFile(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10); // e.g. 2026-06-11
  link.href = url;
  link.download = `dm-screen-backup-${date}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Reads a backup file and returns the state object inside it.
// Throws a friendly error if the file isn't a valid backup.
export async function importFromFile(file) {
  const text = await file.text();
  const data = JSON.parse(text); // throws on invalid JSON
  const looksValid =
    data &&
    typeof data === 'object' &&
    Array.isArray(data.systems) &&
    data.encounter &&
    data.library;
  if (!looksValid) {
    throw new Error('That file does not look like a DM Screen backup.');
  }
  // Fill in any sections a backup from an older app version might lack.
  return { ...buildDefaultState(), ...data };
}
