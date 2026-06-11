// ---------------------------------------------------------------------------
// Initiative / turn tracker — the heart of the Combat tab.
//
// Tracks combatants in initiative order, the current turn, the round
// number, each combatant's HP, and any conditions on them.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { useAppState, makeId } from '../state/AppState.jsx';

export default function InitiativeTracker() {
  const { state, update, activeSystem } = useAppState();
  const { round, turnIndex, combatants } = state.encounter;

  // ---- Add-combatant form (controlled inputs) ----
  const [name, setName] = useState('');
  const [init, setInit] = useState('');
  const [hp, setHp] = useState('');

  // Creatures and characters from the library, offered in a dropdown so
  // the DM can pull a saved stat block straight into combat.
  const libraryEntries = [
    ...state.library.creatures.map((c) => ({ ...c, kind: 'Creature' })),
    ...state.library.characters.map((c) => ({ ...c, kind: 'Character' })),
  ];

  function addCombatant(entry) {
    update((draft) => {
      draft.encounter.combatants.push(entry);
      // Keep the list sorted: highest initiative acts first.
      draft.encounter.combatants.sort((a, b) => b.initiative - a.initiative);
    });
  }

  function handleAddManual(e) {
    e.preventDefault(); // stop the browser from reloading the page
    if (!name.trim()) return;
    const maxHp = hp === '' ? null : Number(hp);
    addCombatant({
      id: makeId(),
      name: name.trim(),
      initiative: init === '' ? 0 : Number(init),
      hp: maxHp,
      maxHp,
      conditions: [],
    });
    setName('');
    setInit('');
    setHp('');
  }

  function handleAddFromLibrary(e) {
    const entry = libraryEntries.find((le) => le.id === e.target.value);
    if (!entry) return;
    addCombatant({
      id: makeId(), // a fresh id, so the same creature can join twice
      name: entry.name,
      initiative: 0,
      hp: entry.maxHp ?? null,
      maxHp: entry.maxHp ?? null,
      conditions: [],
      libraryId: entry.id, // remember where it came from
    });
    e.target.value = ''; // reset the dropdown to its placeholder
  }

  // ---- Turn / round controls ----
  function nextTurn() {
    if (combatants.length === 0) return;
    update((draft) => {
      const enc = draft.encounter;
      enc.turnIndex += 1;
      if (enc.turnIndex >= enc.combatants.length) {
        enc.turnIndex = 0;
        enc.round += 1; // wrapped around the table: new round
      }
    });
  }

  function prevTurn() {
    if (combatants.length === 0) return;
    update((draft) => {
      const enc = draft.encounter;
      enc.turnIndex -= 1;
      if (enc.turnIndex < 0) {
        enc.turnIndex = enc.combatants.length - 1;
        enc.round = Math.max(1, enc.round - 1);
      }
    });
  }

  function removeCombatant(id) {
    update((draft) => {
      const enc = draft.encounter;
      const idx = enc.combatants.findIndex((c) => c.id === id);
      enc.combatants.splice(idx, 1);
      // Keep the turn pointer on the same creature where possible.
      if (idx < enc.turnIndex) enc.turnIndex -= 1;
      if (enc.turnIndex >= enc.combatants.length) enc.turnIndex = 0;
    });
  }

  // Manual reorder for initiative ties (swap with the neighbor).
  function move(id, direction) {
    update((draft) => {
      const list = draft.encounter.combatants;
      const i = list.findIndex((c) => c.id === id);
      const j = i + direction;
      if (j < 0 || j >= list.length) return;
      [list[i], list[j]] = [list[j], list[i]];
    });
  }

  function clearEncounter() {
    if (!window.confirm('Clear all combatants and reset to round 1?')) return;
    update((draft) => {
      draft.encounter = { round: 1, turnIndex: 0, combatants: [] };
    });
  }

  return (
    <section className="panel" aria-label="Initiative tracker">
      <div className="panel-header">
        <h2>Initiative</h2>
        <div className="turn-controls">
          <span className="round-badge" aria-live="polite">
            Round {round}
          </span>
          <button type="button" onClick={prevTurn} title="Back one turn">
            ◂ Back
          </button>
          <button type="button" className="primary" onClick={nextTurn}>
            Next turn ▸
          </button>
        </div>
      </div>

      {/* Add combatants: by hand, or from the saved library. */}
      <form className="add-combatant" onSubmit={handleAddManual}>
        <input
          aria-label="Combatant name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Initiative"
          placeholder="Init"
          type="number"
          value={init}
          onChange={(e) => setInit(e.target.value)}
        />
        <input
          aria-label="Max HP"
          placeholder="HP"
          type="number"
          min="0"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
        <button type="submit">Add</button>
        {libraryEntries.length > 0 && (
          <select
            aria-label="Add from library"
            defaultValue=""
            onChange={handleAddFromLibrary}
          >
            <option value="" disabled>
              From library…
            </option>
            {libraryEntries.map((le) => (
              <option key={le.id} value={le.id}>
                {le.name} ({le.kind})
              </option>
            ))}
          </select>
        )}
      </form>

      {combatants.length === 0 ? (
        <p className="empty-hint">
          No combatants yet. Add them above, or save creatures in the Library
          tab and pull them in here.
        </p>
      ) : (
        <ol className="combatant-list">
          {combatants.map((c, i) => (
            <CombatantRow
              key={c.id}
              combatant={c}
              isActive={i === turnIndex}
              conditions={activeSystem.conditions}
              onRemove={() => removeCombatant(c.id)}
              onMoveUp={() => move(c.id, -1)}
              onMoveDown={() => move(c.id, +1)}
            />
          ))}
        </ol>
      )}

      {combatants.length > 0 && (
        <div className="panel-footer">
          <button type="button" className="danger ghost" onClick={clearEncounter}>
            Clear encounter
          </button>
        </div>
      )}
    </section>
  );
}

// One row in the initiative list: name, initiative, HP controls, conditions.
function CombatantRow({ combatant, isActive, conditions, onRemove, onMoveUp, onMoveDown }) {
  const { update } = useAppState();
  // How much damage/healing to apply when − / + is clicked.
  const [amount, setAmount] = useState('1');
  const [conditionPick, setConditionPick] = useState('');

  function changeHp(sign) {
    const n = Number(amount);
    if (!Number.isFinite(n)) return;
    update((draft) => {
      const c = draft.encounter.combatants.find((x) => x.id === combatant.id);
      if (!c || c.hp === null) return;
      c.hp = c.hp + sign * n;
      // HP can't exceed max, but CAN go below 0 (useful for instant-death
      // rules); the display clamps at 0.
      if (c.maxHp !== null) c.hp = Math.min(c.hp, c.maxHp);
    });
  }

  function setInitiative(value) {
    update((draft) => {
      const c = draft.encounter.combatants.find((x) => x.id === combatant.id);
      if (c) c.initiative = Number(value) || 0;
      draft.encounter.combatants.sort((a, b) => b.initiative - a.initiative);
    });
  }

  function addCondition(label) {
    const clean = label.trim();
    if (!clean) return;
    update((draft) => {
      const c = draft.encounter.combatants.find((x) => x.id === combatant.id);
      if (c && !c.conditions.includes(clean)) c.conditions.push(clean);
    });
    setConditionPick('');
  }

  function removeCondition(label) {
    update((draft) => {
      const c = draft.encounter.combatants.find((x) => x.id === combatant.id);
      if (c) c.conditions = c.conditions.filter((x) => x !== label);
    });
  }

  const hpDisplay =
    combatant.hp === null ? '—' : `${Math.max(0, combatant.hp)} / ${combatant.maxHp}`;
  const isDown = combatant.hp !== null && combatant.hp <= 0;

  return (
    <li className={`combatant ${isActive ? 'active' : ''} ${isDown ? 'down' : ''}`}>
      <div className="combatant-main">
        <input
          className="init-input"
          aria-label={`Initiative for ${combatant.name}`}
          type="number"
          value={combatant.initiative}
          onChange={(e) => setInitiative(e.target.value)}
        />
        <strong className="combatant-name">{combatant.name}</strong>

        {combatant.hp !== null && (
          <div className="hp-controls" aria-label={`Hit points for ${combatant.name}`}>
            <button type="button" className="danger" onClick={() => changeHp(-1)} title="Damage">
              −
            </button>
            <input
              className="hp-amount"
              aria-label="Amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button type="button" onClick={() => changeHp(+1)} title="Heal">
              +
            </button>
            <span className="hp-readout">{hpDisplay}</span>
          </div>
        )}

        <div className="row-actions">
          <button type="button" className="ghost" onClick={onMoveUp} aria-label="Move up">
            ↑
          </button>
          <button type="button" className="ghost" onClick={onMoveDown} aria-label="Move down">
            ↓
          </button>
          <button
            type="button"
            className="ghost danger"
            onClick={onRemove}
            aria-label={`Remove ${combatant.name}`}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Conditions: pick from the system's list (or type a custom one). */}
      <div className="condition-row">
        {combatant.conditions.map((cond) => (
          <button
            key={cond}
            type="button"
            className="chip"
            onClick={() => removeCondition(cond)}
            title="Click to clear"
          >
            {cond} ✕
          </button>
        ))}
        <input
          className="condition-input"
          aria-label={`Add condition to ${combatant.name}`}
          placeholder="+ condition"
          list="condition-options"
          value={conditionPick}
          onChange={(e) => setConditionPick(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCondition(conditionPick);
            }
          }}
          onBlur={() => addCondition(conditionPick)}
        />
        {/* One shared datalist would do, but a local one keeps this
            component self-contained. */}
        <datalist id="condition-options">
          {conditions.map((cond) => (
            <option key={cond} value={cond} />
          ))}
        </datalist>
      </div>
    </li>
  );
}
