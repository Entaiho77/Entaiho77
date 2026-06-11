// ---------------------------------------------------------------------------
// Notes tab.
//
// Two kinds of notes, per the brief:
//   - Scratchpad: one always-there text box for fast mid-session jotting.
//   - Session notes: named, dated notes that persist between sessions
//     (campaign log, prep, recaps...).
// Everything autosaves as you type — there is no Save button on purpose.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { useAppState, makeId } from '../state/AppState.jsx';

export default function NotesPanel() {
  const { state, update } = useAppState();
  const notes = state.notes.sessionNotes;
  // Which session note is open in the editor (null = none selected).
  const [selectedId, setSelectedId] = useState(notes[0]?.id ?? null);
  const selected = notes.find((n) => n.id === selectedId) ?? null;

  function newNote() {
    const id = makeId();
    update((draft) => {
      draft.notes.sessionNotes.unshift({
        id,
        title: 'Untitled note',
        body: '',
        updatedAt: Date.now(),
      });
    });
    setSelectedId(id);
  }

  function editSelected(patch) {
    update((draft) => {
      const n = draft.notes.sessionNotes.find((x) => x.id === selectedId);
      if (!n) return;
      Object.assign(n, patch, { updatedAt: Date.now() });
    });
  }

  function deleteSelected() {
    if (!selected) return;
    if (!window.confirm(`Delete "${selected.title}"? This can't be undone.`)) return;
    update((draft) => {
      draft.notes.sessionNotes = draft.notes.sessionNotes.filter(
        (n) => n.id !== selectedId
      );
    });
    setSelectedId(null);
  }

  return (
    <div className="notes-layout">
      <section className="panel" aria-label="Scratchpad">
        <div className="panel-header">
          <h2>Scratchpad</h2>
          <span className="hint">autosaves · fast jotting</span>
        </div>
        <textarea
          className="scratchpad"
          placeholder="Initiative 17 goblin has the key… players owe tavern 3gp…"
          value={state.notes.scratchpad}
          onChange={(e) =>
            update((draft) => {
              draft.notes.scratchpad = e.target.value;
            })
          }
        />
      </section>

      <section className="panel" aria-label="Session notes">
        <div className="panel-header">
          <h2>Session notes</h2>
          <button type="button" className="primary" onClick={newNote}>
            + New note
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="empty-hint">
            Notes you create here persist between sessions — campaign logs,
            prep, recaps.
          </p>
        ) : (
          <div className="notes-split">
            <ul className="note-list">
              {notes.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={`note-item ${n.id === selectedId ? 'selected' : ''}`}
                    onClick={() => setSelectedId(n.id)}
                  >
                    <strong>{n.title || 'Untitled'}</strong>
                    <span className="note-date">
                      {new Date(n.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {selected ? (
              <div className="note-editor">
                <input
                  aria-label="Note title"
                  value={selected.title}
                  onChange={(e) => editSelected({ title: e.target.value })}
                />
                <textarea
                  aria-label="Note body"
                  placeholder="Write here…"
                  value={selected.body}
                  onChange={(e) => editSelected({ body: e.target.value })}
                />
                <button type="button" className="danger ghost" onClick={deleteSelected}>
                  Delete note
                </button>
              </div>
            ) : (
              <p className="empty-hint">Select a note to edit it.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
