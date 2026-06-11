// ---------------------------------------------------------------------------
// App shell: header, tab navigation, and the always-available dice roller.
//
// Layout idea: the DM lives in one of five tabs (Combat, Library,
// Reference, Notes, Settings), while the dice roller sits in a sidebar on
// wide screens — dice need to be one click away at all times. On narrow
// screens the sidebar drops below the main content.
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { AppStateProvider, useAppState } from './state/AppState.jsx';
import InitiativeTracker from './components/InitiativeTracker.jsx';
import DiceRoller from './components/DiceRoller.jsx';
import NotesPanel from './components/NotesPanel.jsx';
import ReferencePanels from './components/ReferencePanels.jsx';
import LibraryPanel from './components/LibraryPanel.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';

const TABS = [
  { key: 'combat', label: 'Combat' },
  { key: 'library', label: 'Library' },
  { key: 'reference', label: 'Reference' },
  { key: 'notes', label: 'Notes' },
  { key: 'settings', label: 'Settings' },
];

function Shell() {
  const [tab, setTab] = useState('combat');
  const { activeSystem } = useAppState();

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          Virtual <span>DM Screen</span>
        </h1>
        <span className="system-badge" title="Active game system — change in Settings">
          {activeSystem.name}
        </span>
        <nav className="tabs" aria-label="Main sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? 'active' : ''}
              aria-current={tab === t.key ? 'page' : undefined}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="app-body">
        <main className="app-main">
          {tab === 'combat' && <InitiativeTracker />}
          {tab === 'library' && <LibraryPanel />}
          {tab === 'reference' && <ReferencePanels />}
          {tab === 'notes' && <NotesPanel />}
          {tab === 'settings' && <SettingsPanel />}
        </main>

        <aside className="app-aside">
          <DiceRoller />
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
