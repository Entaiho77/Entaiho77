// ---------------------------------------------------------------------------
// Dice roller.
//
// The dice shown come from the active system (Settings tab → dice list),
// so a homebrew system can offer whatever dice it uses. Rolls are kept in
// a short history so the DM can scroll back mid-argument.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { useAppState, makeId } from '../state/AppState.jsx';

const HISTORY_LIMIT = 20;

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export default function DiceRoller() {
  const { state, update, activeSystem } = useAppState();
  const [qty, setQty] = useState(1);
  const [modifier, setModifier] = useState(0);

  function roll(sides) {
    const count = Math.min(Math.max(1, Number(qty) || 1), 100);
    const mod = Number(modifier) || 0;
    const results = Array.from({ length: count }, () => rollDie(sides));
    const total = results.reduce((sum, r) => sum + r, 0) + mod;

    update((draft) => {
      draft.rollHistory.unshift({
        id: makeId(),
        label: `${count}d${sides}${mod ? (mod > 0 ? ` + ${mod}` : ` − ${-mod}`) : ''}`,
        results,
        total,
      });
      // Cap the history so saved data doesn't grow forever.
      draft.rollHistory.length = Math.min(draft.rollHistory.length, HISTORY_LIMIT);
    });
  }

  const latest = state.rollHistory[0];

  return (
    <section className="panel dice-roller" aria-label="Dice roller">
      <div className="panel-header">
        <h2>Dice</h2>
      </div>

      <div className="dice-options">
        <label>
          Qty
          <input
            type="number"
            min="1"
            max="100"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </label>
        <label>
          Mod
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(e.target.value)}
          />
        </label>
      </div>

      <div className="dice-buttons">
        {activeSystem.dice.map((sides) => (
          <button
            key={sides}
            type="button"
            className="die-button"
            onClick={() => roll(sides)}
          >
            d{sides}
          </button>
        ))}
      </div>

      {latest && (
        // `key` makes React rebuild this element on each roll, which
        // restarts the pop-in animation (CSS class .roll-result).
        <div className="roll-result" key={latest.id} aria-live="polite">
          <span className="roll-total">{latest.total}</span>
          <span className="roll-breakdown">
            {latest.label}: {latest.results.join(' + ')}
          </span>
        </div>
      )}

      {state.rollHistory.length > 1 && (
        <details className="roll-history">
          <summary>History</summary>
          <ol>
            {state.rollHistory.slice(1).map((r) => (
              <li key={r.id}>
                <strong>{r.total}</strong> <span>({r.label})</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="ghost"
            onClick={() => update((d) => { d.rollHistory = []; })}
          >
            Clear history
          </button>
        </details>
      )}
    </section>
  );
}
