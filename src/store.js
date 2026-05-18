import { createStore } from 'ztore';
import { SQLite } from './adapters/sqljs.js';

function loadConnections() {
  try { return JSON.parse(localStorage.getItem('zrow_connections') || '[]'); } catch { return []; }
}
function saveConnections(c) {
  localStorage.setItem('zrow_connections', JSON.stringify(c));
}

let tabId = Date.now();
function nextId() { return ++tabId; }

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
  currentTable: null,
  currentTableData: null,
  currentTableInfo: null,
  sidebarView: 'tables',
  recordCount: null,
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
    const updated = conn.id
      ? connections.map(c => c.id === conn.id ? { ...conn } : c)
      : [...connections, { ...conn, id }];
    store.setKey('connections', updated);
    saveConnections(updated);
    return id;
  },

  deleteConnection(id) {
    const { connections, activeConnectionId, tabs } = store.get();
    const updated = connections.filter(c => c.id !== id);
    store.setKey('connections', updated);
    saveConnections(updated);
    store.setKey('tabs', tabs.filter(t => t.connectionId !== id));
    if (activeConnectionId === id) {
      store.setKey('activeConnectionId', null);
      store.setKey('tables', []);
      store.setKey('currentTable', null);
      store.setKey('currentTableData', null);
    }
  },

  setActiveConnection(id) { store.setKey('activeConnectionId', id); },

  addTab(type = 'editor', opts = {}) {
    const { tabs, activeConnectionId } = store.get();
    const id = nextId();
    const tab = {
      id, type,
      name: opts.name || (type === 'editor' ? `Query ${tabs.filter(t => t.type === 'editor').length + 1}` : opts.tableName || 'Table'),
      connectionId: opts.connectionId || activeConnectionId,
      sql: opts.sql || '',
      tableName: opts.tableName || null,
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
      store.setKey('activeTabId', updated.length ? updated[Math.max(0, newIdx)].id : null);
    }
  },

  setActiveTab(id) { store.setKey('activeTabId', id); },

  updateTabSQL(id, sql) {
    store.setKey('tabs', store.get().tabs.map(t => t.id === id ? { ...t, sql } : t));
  },

  setStatus(text) { store.setKey('statusText', text); },
  setResults(r) { store.setKey('results', r); store.setKey('queryError', null); },
  setQueryError(e) { store.setKey('queryError', e); store.setKey('results', null); },
  setQueryRunning(b) { store.setKey('queryRunning', b); },
  setTables(t) { store.setKey('tables', t); },
  setCurrentTable(t) { store.setKey('currentTable', t); },
  setCurrentTableData(d) { store.setKey('currentTableData', d); },
  setCurrentTableInfo(i) { store.setKey('currentTableInfo', i); },
  setSidebarView(v) { store.setKey('sidebarView', v); },
  setRecordCount(n) { store.setKey('recordCount', n); },
};

export function getActiveTab() {
  const { tabs, activeTabId } = store.get();
  return tabs.find(t => t.id === activeTabId) || null;
}

export function getActiveConnection() {
  const { connections, activeConnectionId } = store.get();
  return connections.find(c => c.id === activeConnectionId) || null;
}

let _db = null;

export function getDB() { return _db; }

export async function connectToDatabase(conn) {
  const db = new SQLite();
  await db.open(conn.database || conn.name, conn.wasmPath);
  if (conn.seed !== false) db.seedIfEmpty();
  _db = db;
  store.setKey('activeConnectionId', conn.id);
  store.setKey('tables', db.getTables());
  store.setKey('statusText', `Connected — ${conn.name}`);
  return db;
}

export async function disconnectDatabase() {
  if (_db) await _db.save();
  _db = null;
  store.setKey('activeConnectionId', null);
  store.setKey('tables', []);
  store.setKey('currentTable', null);
  store.setKey('currentTableData', null);
  store.setKey('currentTableInfo', null);
}

export async function executeQuery(sql) {
  if (!_db) throw new Error('Not connected');
  store.setKey('queryRunning', true);
  store.setKey('queryError', null);
  try {
    const result = _db.exec(sql);
    store.setKey('results', result);
    store.setKey('queryRunning', false);
    store.setKey('statusText', `${result.rows.length} rows in ${result.duration}ms`);
    return result;
  } catch (err) {
    store.setKey('queryError', err.message);
    store.setKey('queryRunning', false);
    store.setKey('statusText', 'Query failed');
    throw err;
  }
}

export async function browseTable(name) {
  if (!_db) return;
  try {
    const data = _db.getTableData(name);
    const info = _db.getTableInfo(name);
    store.setKey('currentTable', name);
    store.setKey('currentTableData', data);
    store.setKey('currentTableInfo', info);
    store.setKey('statusText', `Table "${name}" — ${data.total} rows`);
  } catch {}
}

function refreshCurrentTable() {
  const { currentTable } = store.get();
  if (currentTable) browseTable(currentTable);
}

function refreshTables() {
  if (_db) {
    store.setKey('tables', _db.getTables());
  }
}

export async function insertRow(table, data) {
  if (!_db) return;
  _db.insertRow(table, data);
  store.setKey('statusText', `Row inserted into "${table}"`);
  refreshCurrentTable();
  refreshTables();
}

export async function updateRowByPk(table, data, pkCol, pkVal) {
  if (!_db) return;
  _db.updateRowByPk(table, data, pkCol, pkVal);
  store.setKey('statusText', `Row updated in "${table}"`);
  refreshCurrentTable();
}

export async function deleteRowByPk(table, pkCol, pkVal) {
  if (!_db) return;
  _db.deleteRowByPk(table, pkCol, pkVal);
  store.setKey('statusText', `Row deleted from "${table}"`);
  refreshCurrentTable();
  refreshTables();
}

export async function createTable(name, columns) {
  if (!_db) return;
  _db.createTable(name, columns);
  store.setKey('statusText', `Table "${name}" created`);
  refreshTables();
}

export async function dropTable(name) {
  if (!_db) return;
  _db.dropTable(name);
  if (store.get().currentTable === name) {
    store.setKey('currentTable', null);
    store.setKey('currentTableData', null);
    store.setKey('currentTableInfo', null);
  }
  store.setKey('statusText', `Table "${name}" dropped`);
  refreshTables();
}

export async function addColumn(table, columnDef) {
  if (!_db) return;
  _db.addColumn(table, columnDef);
  store.setKey('statusText', `Column "${columnDef.name}" added to "${table}"`);
  refreshCurrentTable();
  refreshTables();
}

export async function dropColumn(table, name) {
  if (!_db) return;
  _db.dropColumn(table, name);
  store.setKey('statusText', `Column "${name}" dropped from "${table}"`);
  refreshCurrentTable();
  refreshTables();
}

export async function renameTable(oldName, newName) {
  if (!_db) return;
  _db.renameTable(oldName, newName);
  if (store.get().currentTable === oldName) {
    store.setKey('currentTable', newName);
  }
  store.setKey('statusText', `Table renamed to "${newName}"`);
  refreshTables();
}
