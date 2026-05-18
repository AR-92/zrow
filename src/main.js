import { store, actions } from './store.js';
import { qs, refreshIcons } from './utils/dom.js';
import { initSidebar } from './components/sidebar.js';
import { initEditor } from './components/editor.js';
import { initResults } from './components/results.js';
import { initTabs } from './components/tabs.js';
import { initConnectionModal } from './components/connection-modal.js';
import './adapters/localstorage.js';
import './adapters/indexdb.js';
import './adapters/sqljs.js';
import './adapters/sqlocal.js';

document.addEventListener('DOMContentLoaded', () => {
  const { theme } = store.get();
  document.documentElement.classList.toggle('dark', theme === 'dark');

  initTabs();
  initSidebar();
  initConnectionModal();
  initEditor();
  initResults();

  refreshIcons();

  qs('#btn-toggle-theme')?.addEventListener('click', actions.toggleTheme);
  qs('#btn-new-tab')?.addEventListener('click', () => actions.addTab('editor'));

  store.setKey('statusText', store.get().connections.length
    ? `${store.get().connections.length} connection(s) saved`
    : 'No connections — click + to add one');

  const tab = store.get().activeTabId
    ? store.get().tabs.find(t => t.id === store.get().activeTabId)
    : null;
  if (!tab) actions.addTab('editor');
});
