// ---------------------------------------------------------------------------
// Settings tab.
//
//   1. Game systems — pick the active one, edit presets, add new systems.
//      A system = dice list + stat fields + condition list.
//   2. Backup — export everything to a JSON file / import it back.
//   3. Danger zone — reset all data.
//
// Editing convention kept deliberately simple: dice and conditions are
// comma-separated text boxes. Less fancy than chip editors, but obvious,
// hard to break, and easy to maintain.
// ---------------------------------------------------------------------------

import { useRef, useState } from 'react';
import {
  useAppState,
  makeId,
  exportToFile,
  importFromFile,
  buildDefaultState,
} from '../state/AppState.jsx';
import { makeFieldKey } from '../data/systems.js';

export default function SettingsPanel() {
  const { state, update, replaceState } = useAppState();
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState('');

  function addSystem() {
    update((draft) => {
      draft.systems.push({
        id: makeId(),
        name: 'New system',
        dice: [6, 20],
        statFields: [],
        conditions: [],
      });
    });
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file later
    if (!file) return;
    if (!window.confirm('Importing replaces ALL current data. Continue?')) return;
    try {
      replaceState(await importFromFile(file));
      setImportError('');
    } catch (err) {
      setImportError(err.message || 'Could not read that file.');
    }
  }

  function resetAll() {
    const phrase = 'Reset ALL data? Creatures, notes, systems — everything. Export a backup first if unsure.';
    if (!window.confirm(phrase)) return;
    replaceState(buildDefaultState());
  }

  return (
    <div className="settings-layout">
      <section className="panel" aria-label="Game systems">
        <div className="panel-header">
          <h2>Game systems</h2>
          <button type="button" className="primary" onClick={addSystem}>
            + New system
          </button>
        </div>

        <label className="field">
          Active system
          <select
            value={state.activeSystemId}
            onChange={(e) =>
              update((draft) => {
                draft.activeSystemId = e.target.value;
              })
            }
          >
            {state.systems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        {state.systems.map((s) => (
          <SystemEditor key={s.id} system={s} />
        ))}
      </section>

      <section className="panel" aria-label="Backup">
        <div className="panel-header">
          <h2>Backup</h2>
        </div>
        <p className="hint">
          Your data lives in this browser. Export regularly — the file is
          your safety net, and it will still work after the cloud version
          arrives in Phase 2.
        </p>
        <div className="button-row">
          <button type="button" className="primary" onClick={() => exportToFile(state)}>
            Export data ↓
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Import data ↑
          </button>
          {/* Hidden file input, triggered by the button above. */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handleImport}
          />
        </div>
        {importError && <p className="error-text" role="alert">{importError}</p>}

        <div className="panel-header" style={{ marginTop: '1.5rem' }}>
          <h2>Danger zone</h2>
        </div>
        <button type="button" className="danger" onClick={resetAll}>
          Reset all data
        </button>
      </section>
    </div>
  );
}

// Collapsible editor for one game system.
function SystemEditor({ system }) {
  const { state, update } = useAppState();
  const isActive = system.id === state.activeSystemId;

  function edit(patch) {
    update((draft) => {
      const s = draft.systems.find((x) => x.id === system.id);
      if (s) Object.assign(s, patch);
    });
  }

  // "4, 6, 20" -> [4, 6, 20]; junk entries are dropped.
  function parseDice(text) {
    const dice = text
      .split(',')
      .map((part) => parseInt(part.trim(), 10))
      .filter((n) => Number.isFinite(n) && n >= 2);
    edit({ dice });
  }

  function parseConditions(text) {
    edit({
      conditions: text
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    });
  }

  function addField() {
    const label = window.prompt('Stat field label (e.g. AC, STR, Sanity):');
    if (!label?.trim()) return;
    update((draft) => {
      const s = draft.systems.find((x) => x.id === system.id);
      s.statFields.push({ key: makeFieldKey(label), label: label.trim() });
    });
  }

  function removeField(key) {
    update((draft) => {
      const s = draft.systems.find((x) => x.id === system.id);
      s.statFields = s.statFields.filter((f) => f.key !== key);
    });
  }

  function deleteSystem() {
    if (!window.confirm(`Delete the system "${system.name}"?`)) return;
    update((draft) => {
      draft.systems = draft.systems.filter((x) => x.id !== system.id);
    });
  }

  // Comma-joined views of the arrays for the text inputs. The inputs use
  // defaultValue + onBlur (not value + onChange) so we only parse the text
  // once the DM finishes typing — parsing on every keystroke would mangle
  // half-typed entries like "4, 6, 1".
  const diceText = system.dice.join(', ');
  const conditionsText = system.conditions.join(', ');

  return (
    <details className="system-editor">
      <summary>
        <h3>{system.name}</h3>
        {isActive && <span className="chip">active</span>}
      </summary>

      <label className="field">
        Name
        <input value={system.name} onChange={(e) => edit({ name: e.target.value })} />
      </label>

      <label className="field">
        Dice (comma-separated sides)
        <input
          defaultValue={diceText}
          onBlur={(e) => parseDice(e.target.value)}
          placeholder="4, 6, 8, 10, 12, 20, 100"
        />
      </label>

      <div className="field">
        <span>Stat fields (shown on creatures & characters)</span>
        <ul className="field-list">
          {system.statFields.map((f) => (
            <li key={f.key}>
              <span className="chip">{f.label}</span>
              <button
                type="button"
                className="ghost danger"
                onClick={() => removeField(f.key)}
                aria-label={`Remove ${f.label}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={addField}>
          + Add stat field
        </button>
      </div>

      <label className="field">
        Conditions (comma-separated)
        <textarea
          defaultValue={conditionsText}
          onBlur={(e) => parseConditions(e.target.value)}
          placeholder="Stunned, Bleeding, Cursed…"
        />
      </label>

      {/* Can't delete the active system — switch first. Prevents the app
          from ever having zero usable systems. */}
      {!isActive && (
        <button type="button" className="ghost danger" onClick={deleteSystem}>
          Delete system
        </button>
      )}
    </details>
  );
}
