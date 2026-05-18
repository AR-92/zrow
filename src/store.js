import { createStore } from 'ztore';

const DEFAULT_DDL = `CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  owner_id INTEGER,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);`;

const DEFAULT_DML = `-- Sample query: select users
SELECT u.id, u.name, u.email, u.role, COUNT(p.id) as project_count
FROM users u
LEFT JOIN projects p ON p.owner_id = u.id
WHERE u.role = 'user'
GROUP BY u.id, u.name, u.email, u.role
HAVING COUNT(p.id) > 0
ORDER BY u.name ASC
LIMIT 10;`;

function loadConnections() {
  try {
    return JSON.parse(localStorage.getItem('zrow_connections') || '[]');
  } catch { return []; }
}

function saveConnections(connections) {
  localStorage.setItem('zrow_connections', JSON.stringify(connections));
}

let tabIdCounter = Date.now();
function nextTabId() { return ++tabIdCounter; }

const initialState = {
  theme: localStorage.getItem('zrow_theme') || 'dark',
  connections: loadConnections(),
  activeConnectionId: null,
  tabs: [],
  activeTabId: null,
  statusText: 'Ready',
  results: null,
  queryRunning: false,
  queryError: null,
  tables: [],
  currentTableData: null,
  connectionModalOpen: false,
  editingConnection: null,
};

export const store = createStore(initialState);

export const actions = {
  toggleTheme() {
    const theme = store.get().theme === 'dark' ? 'light' : 'dark';
    store.setKey('theme', theme);
    localStorage.setItem('zrow_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },

  addConnection(conn) {
    const { connections } = store.get();
    const id = conn.id || 'conn_' + Date.now();
    const updated = conn.id ? connections.map(c => c.id === conn.id ? { ...conn } : c) : [...connections, { ...conn, id }];
    store.setKey('connections', updated);
    saveConnections(updated);
    return id;
  },

  deleteConnection(id) {
    const { connections, activeConnectionId, tabs } = store.get();
    const updated = connections.filter(c => c.id !== id);
    store.setKey('connections', updated);
    saveConnections(updated);
    const newTabs = tabs.filter(t => t.connectionId !== id);
    store.setKey('tabs', newTabs);
    if (activeConnectionId === id) {
      store.setKey('activeConnectionId', null);
      store.setKey('tables', []);
    }
    if (newTabs.length === 0) {
      store.setKey('activeTabId', null);
    } else if (!newTabs.find(t => t.id === store.get().activeTabId)) {
      store.setKey('activeTabId', newTabs[0].id);
    }
  },

  setActiveConnection(id) {
    store.setKey('activeConnectionId', id);
  },

  openConnectionModal(connection = null) {
    store.setKey('editingConnection', connection);
    store.setKey('connectionModalOpen', true);
  },

  closeConnectionModal() {
    store.setKey('editingConnection', null);
    store.setKey('connectionModalOpen', false);
  },

  addTab(type = 'editor', opts = {}) {
    const { tabs, activeConnectionId } = store.get();
    const id = nextTabId();
    const tab = {
      id,
      type,
      name: opts.name || (type === 'editor' ? `Query ${tabs.filter(t => t.type === 'editor').length + 1}` : 'Table'),
      connectionId: opts.connectionId || activeConnectionId,
      sql: opts.sql || '',
      tableName: opts.tableName || null,
      dirty: false,
    };
    store.setKey('tabs', [...tabs, tab]);
    store.setKey('activeTabId', id);
    return id;
  },

  closeTab(id) {
    const { tabs, activeTabId } = store.get();
    const idx = tabs.findIndex(t => t.id === id);
    const updated = tabs.filter(t => t.id !== id);
    store.setKey('tabs', updated);
    if (activeTabId === id) {
      const newIdx = Math.min(idx, updated.length - 1);
      store.setKey('activeTabId', updated.length > 0 ? updated[Math.max(0, newIdx)].id : null);
    }
  },

  setActiveTab(id) {
    store.setKey('activeTabId', id);
  },

  updateTabSQL(id, sql) {
    const { tabs } = store.get();
    store.setKey('tabs', tabs.map(t => t.id === id ? { ...t, sql, dirty: true } : t));
  },

  setStatus(text) {
    store.setKey('statusText', text);
  },

  setResults(results) {
    store.setKey('results', results);
    store.setKey('queryError', null);
  },

  setQueryError(error) {
    store.setKey('queryError', error);
    store.setKey('results', null);
  },

  setQueryRunning(running) {
    store.setKey('queryRunning', running);
  },

  setTables(tables) {
    store.setKey('tables', tables);
  },

  setCurrentTableData(data) {
    store.setKey('currentTableData', data);
  },
};

export function getActiveTab() {
  const { tabs, activeTabId } = store.get();
  return tabs.find(t => t.id === activeTabId) || null;
}

export function getActiveConnection() {
  const { connections, activeConnectionId } = store.get();
  return connections.find(c => c.id === activeConnectionId) || null;
}

let _adapterCache = {};

export async function connectToDatabase(connection) {
  const { getAdapterForType, connectAdapter } = await import('./adapters/registry.js');
  const adapter = getAdapterForType(connection.type);
  if (!adapter) throw new Error(`Unknown database type: ${connection.type}`);
  const conn = await connectAdapter(adapter, connection);
  _adapterCache[connection.id] = conn;
  store.setKey('activeConnectionId', connection.id);
  const tables = await conn.getTables();
  store.setKey('tables', tables);
  store.setKey('statusText', `Connected to ${connection.name}`);
  return conn;
}

export async function disconnectDatabase(connectionId) {
  const conn = _adapterCache[connectionId];
  if (conn && conn.disconnect) await conn.disconnect();
  delete _adapterCache[connectionId];
  if (store.get().activeConnectionId === connectionId) {
    store.setKey('activeConnectionId', null);
    store.setKey('tables', []);
  }
}

export async function executeQuery(connectionId, sql) {
  const conn = _adapterCache[connectionId];
  if (!conn) throw new Error('Not connected');
  store.setKey('queryRunning', true);
  store.setKey('queryError', null);
  try {
    const result = await conn.query(sql);
    store.setKey('results', result);
    store.setKey('queryRunning', false);
    store.setKey('statusText', `Query returned ${result.rows.length} rows in ${result.duration}ms`);
    return result;
  } catch (err) {
    store.setKey('queryError', err.message);
    store.setKey('queryRunning', false);
    store.setKey('statusText', 'Query failed');
    throw err;
  }
}

export function getConnectedAdapter(connectionId) {
  return _adapterCache[connectionId] || null;
}
