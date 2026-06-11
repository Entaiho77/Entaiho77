// ---------------------------------------------------------------------------
// Reference tab.
//
// Two kinds of panels:
//   - Built-in rules tables (D&D 5e SRD), defined in code — read-only.
//   - Custom panels the DM writes themselves — free text, editable.
// A filter box narrows panels by title/content, because hunting for a rule
// mid-combat should take seconds.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { useAppState, makeId } from '../state/AppState.jsx';
import { builtinTables } from '../data/referenceTables.js';

export default function ReferencePanels() {
  const { state, update } = useAppState();
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLowerCase();

  // A panel matches if the query appears in its title or anywhere in its
  // content. Empty query matches everything.
  const matchesBuiltin = (t) =>
    !q ||
    t.title.toLowerCase().includes(q) ||
    t.rows.some((row) => row.join(' ').toLowerCase().includes(q));
  const matchesCustom = (p) =>
    !q || p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q);

  const builtins = builtinTables.filter(matchesBuiltin);
  const customs = state.customPanels.filter(matchesCustom);

  function addPanel() {
    update((draft) => {
      draft.customPanels.unshift({ id: makeId(), title: 'New panel', body: '' });
    });
  }

  function editPanel(id, patch) {
    update((draft) => {
      const p = draft.customPanels.find((x) => x.id === id);
      if (p) Object.assign(p, patch);
    });
  }

  function deletePanel(id, title) {
    if (!window.confirm(`Delete panel "${title}"?`)) return;
    update((draft) => {
      draft.customPanels = draft.customPanels.filter((x) => x.id !== id);
    });
  }

  return (
    <div>
      <div className="reference-toolbar">
        <input
          type="search"
          aria-label="Filter reference panels"
          placeholder="Filter panels… (e.g. grappled, cover)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button type="button" className="primary" onClick={addPanel}>
          + Custom panel
        </button>
      </div>

      <div className="reference-grid">
        {/* DM's own panels first — they made them, they reach for them most. */}
        {customs.map((p) => (
          <section className="panel" key={p.id} aria-label={p.title}>
            <input
              className="panel-title-input"
              aria-label="Panel title"
              value={p.title}
              onChange={(e) => editPanel(p.id, { title: e.target.value })}
            />
            <textarea
              aria-label={`Content of ${p.title}`}
              placeholder="House rules, name lists, price tables — anything you want at hand."
              value={p.body}
              onChange={(e) => editPanel(p.id, { body: e.target.value })}
            />
            <button
              type="button"
              className="ghost danger"
              onClick={() => deletePanel(p.id, p.title)}
            >
              Delete panel
            </button>
          </section>
        ))}

        {builtins.map((t) => (
          <section className="panel" key={t.id} aria-label={t.title}>
            <details open={q !== ''}>
              <summary>
                <h3>{t.title}</h3>
                <span className="hint">{t.source}</span>
              </summary>
              <table>
                <thead>
                  <tr>
                    {t.columns.map((col) => (
                      <th key={col} scope="col">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </section>
        ))}

        {builtins.length === 0 && customs.length === 0 && (
          <p className="empty-hint">No panels match “{filter}”.</p>
        )}
      </div>
    </div>
  );
}
