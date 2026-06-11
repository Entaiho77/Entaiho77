// ---------------------------------------------------------------------------
// Library tab: the DM's saved creatures, characters, and places.
//
// Creatures and characters get stat fields from the game system they were
// created under (so a Solryn creature keeps Solryn stats even if the DM
// later switches the active system to 5e). Places are simpler: a name and
// free-text notes.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { useAppState, makeId } from '../state/AppState.jsx';
import { solrynBestiary } from '../data/solrynBestiary.js';

// The three collections, with labels for the sub-tab buttons.
const KINDS = [
  { key: 'creatures', label: 'Creatures', hasStats: true },
  { key: 'characters', label: 'Characters', hasStats: true },
  { key: 'places', label: 'Places', hasStats: false },
];

export default function LibraryPanel() {
  const { state, update, activeSystem } = useAppState();
  const [kindKey, setKindKey] = useState('creatures');
  const [editingId, setEditingId] = useState(null);

  const kind = KINDS.find((k) => k.key === kindKey);
  const entries = state.library[kindKey];
  const editing = entries.find((e) => e.id === editingId) ?? null;

  function newEntry() {
    const id = makeId();
    update((draft) => {
      draft.library[kindKey].unshift({
        id,
        name: '',
        // Stat-bearing entries remember which system they belong to.
        ...(kind.hasStats
          ? { systemId: activeSystem.id, maxHp: null, stats: {} }
          : {}),
        notes: '',
      });
    });
    setEditingId(id);
  }

  function editEntry(patch) {
    update((draft) => {
      const e = draft.library[kindKey].find((x) => x.id === editingId);
      if (e) Object.assign(e, patch);
    });
  }

  function setStat(fieldKey, value) {
    update((draft) => {
      const e = draft.library[kindKey].find((x) => x.id === editingId);
      if (e) e.stats[fieldKey] = value;
    });
  }

  function deleteEntry(id, name) {
    if (!window.confirm(`Delete "${name || 'this entry'}" from the library?`)) return;
    update((draft) => {
      draft.library[kindKey] = draft.library[kindKey].filter((x) => x.id !== id);
    });
    if (editingId === id) setEditingId(null);
  }

  // Copy the Solryn starter bestiary (10 creatures from the master doc)
  // into the saved creature library. Skips names that already exist, so
  // pressing it twice doesn't create duplicates.
  function loadSolrynBestiary() {
    update((draft) => {
      const existing = new Set(draft.library.creatures.map((c) => c.name));
      solrynBestiary.forEach((b) => {
        if (existing.has(b.name)) return;
        draft.library.creatures.push({
          id: makeId(),
          name: b.name,
          systemId: 'solryn',
          maxHp: b.maxHp,
          stats: { ...b.stats },
          notes: b.notes,
        });
      });
    });
  }

  // Drop a creature/character straight into the initiative tracker.
  function sendToCombat(entry) {
    update((draft) => {
      draft.encounter.combatants.push({
        id: makeId(),
        name: entry.name || 'Unnamed',
        initiative: 0,
        hp: entry.maxHp ?? null,
        maxHp: entry.maxHp ?? null,
        conditions: [],
        libraryId: entry.id,
      });
      draft.encounter.combatants.sort((a, b) => b.initiative - a.initiative);
    });
  }

  // Stat fields come from the system the ENTRY was created under, which may
  // not be the active system. Fall back to the active system's fields if
  // the entry's system was deleted.
  const entrySystem = editing?.systemId
    ? state.systems.find((s) => s.id === editing.systemId) || activeSystem
    : activeSystem;

  return (
    <div className="library-layout">
      <nav className="subtabs" aria-label="Library sections">
        {KINDS.map((k) => (
          <button
            key={k.key}
            type="button"
            className={k.key === kindKey ? 'active' : ''}
            onClick={() => {
              setKindKey(k.key);
              setEditingId(null);
            }}
          >
            {k.label} ({state.library[k.key].length})
          </button>
        ))}
      </nav>

      <div className="library-split">
        <section className="panel" aria-label={`${kind.label} list`}>
          <div className="panel-header">
            <h2>{kind.label}</h2>
            <div className="button-row">
              {kindKey === 'creatures' && (
                <button type="button" onClick={loadSolrynBestiary}>
                  Add Solryn bestiary
                </button>
              )}
              <button type="button" className="primary" onClick={newEntry}>
                + New
              </button>
            </div>
          </div>

          {entries.length === 0 ? (
            <p className="empty-hint">
              Nothing saved yet. Everything you create here is included in
              file exports (Settings tab).
            </p>
          ) : (
            <ul className="library-list">
              {entries.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className={`note-item ${e.id === editingId ? 'selected' : ''}`}
                    onClick={() => setEditingId(e.id)}
                  >
                    <strong>{e.name || 'Unnamed'}</strong>
                    {kind.hasStats && e.maxHp != null && (
                      <span className="hint">HP {e.maxHp}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {editing && (
          <section className="panel" aria-label="Editor">
            <div className="panel-header">
              <h2>Edit</h2>
              {kind.hasStats && (
                <button type="button" onClick={() => sendToCombat(editing)}>
                  Send to combat ⚔
                </button>
              )}
            </div>

            <label className="field">
              Name
              <input
                value={editing.name}
                onChange={(e) => editEntry({ name: e.target.value })}
                placeholder={kind.hasStats ? 'e.g. Gravewight' : 'e.g. The Sunken Library'}
              />
            </label>

            {kind.hasStats && (
              <>
                <label className="field">
                  Max HP
                  <input
                    type="number"
                    min="0"
                    value={editing.maxHp ?? ''}
                    onChange={(e) =>
                      editEntry({
                        maxHp: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                  />
                </label>

                <fieldset className="stat-grid">
                  <legend>
                    Stats <span className="hint">({entrySystem.name})</span>
                  </legend>
                  {entrySystem.statFields.map((f) => (
                    <label key={f.key} className="stat-box">
                      {f.label}
                      <input
                        value={editing.stats[f.key] ?? ''}
                        onChange={(e) => setStat(f.key, e.target.value)}
                      />
                    </label>
                  ))}
                </fieldset>
              </>
            )}

            <label className="field">
              Notes
              <textarea
                value={editing.notes}
                onChange={(e) => editEntry({ notes: e.target.value })}
                placeholder="Attacks, tactics, secrets, description…"
              />
            </label>

            <button
              type="button"
              className="ghost danger"
              onClick={() => deleteEntry(editing.id, editing.name)}
            >
              Delete
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
