import { registerAdapter } from './registry.js';
import { seedDatabase } from '../seed.js';

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('zrow_sqljs_dbs', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('dbs')) {
        db.createObjectStore('dbs', { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(new Error('Failed to open IndexedDB for sql.js'));
  });
}

async function loadFromIDB(dbName) {
  const idb = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('dbs', 'readonly');
    const store = tx.objectStore('dbs');
    const req = store.get(dbName);
    req.onsuccess = () => {
      idb.close();
      resolve(req.result?.data || null);
    };
    req.onerror = () => { idb.close(); reject(new Error('Failed to read DB')); };
  });
}

async function saveToIDB(dbName, buffer) {
  const idb = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('dbs', 'readwrite');
    const store = tx.objectStore('dbs');
    store.put({ id: dbName, data: buffer, updated: Date.now() });
    tx.oncomplete = () => { idb.close(); resolve(); };
    tx.onerror = () => { idb.close(); reject(new Error('Failed to save DB')); };
  });
}

async function deleteFromIDB(dbName) {
  const idb = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('dbs', 'readwrite');
    const store = tx.objectStore('dbs');
    store.delete(dbName);
    tx.oncomplete = () => { idb.close(); resolve(); };
    tx.onerror = () => { idb.close(); reject(); };
  });
}

class SQLjsAdapter {
  static info = {
    name: 'SQLite (sql.js)',
    slug: 'sqljs',
    description: 'Full SQLite via WASM, persisted to IndexedDB',
    icon: 'database',
  };

  constructor() {
    this._db = null;
    this._SQL = null;
    this._config = null;
  }

  async connect(config) {
    this._config = config;
    const wasmUrl = config.wasmPath || 'dist/vendor/';
    this._SQL = await window.initSqlJs({ locateFile: f => wasmUrl + f });

    if (!config.database || config.database === ':memory:') {
      this._db = new SQL.Database();
      if (config.seed !== false) this._seedIfEmpty();
      return;
    }

    try {
      const stored = await loadFromIDB(config.database);
      if (stored) {
        this._db = new SQL.Database(stored);
      } else {
        this._db = new SQL.Database();
        if (config.seed !== false) this._seedIfEmpty();
      }
    } catch (e) {
      console.warn('IndexedDB load failed, starting fresh:', e.message);
      this._db = new SQL.Database();
      if (config.seed !== false) this._seedIfEmpty();
    }
  }

  _seedIfEmpty() {
    try {
      const r = this._db.exec("SELECT count(*) as cnt FROM sqlite_master WHERE type='table'");
      if (r.length && r[0].values[0][0] > 0) return;
    } catch { /* table doesn't exist yet */ }
    seedDatabase(this._db, (sql) => this._db.exec(sql));
  }

  async disconnect() {
    if (this._config?.database && this._config.database !== ':memory:' && this._db) {
      try {
        const data = this._db.export();
        await saveToIDB(this._config.database, data);
      } catch (e) {
        console.warn('Failed to persist DB to IndexedDB:', e.message);
      }
    }
    if (this._db) this._db.close();
    this._db = null;
  }

  async getTables() {
    const r = this._db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    if (!r.length) return [];
    const tables = [];
    for (const row of r[0].values) {
      const name = row[0];
      const cr = this._db.exec(`PRAGMA table_info("${name}")`);
      const cols = cr.length ? cr[0].values.map(c => ({
        name: c[1], type: c[2], nullable: !c[3], defaultValue: c[4], primaryKey: !!c[5],
      })) : [];
      tables.push({ name, type: 'table', columns: cols });
    }
    return tables;
  }

  async getColumns(table) {
    const r = this._db.exec(`PRAGMA table_info("${table}")`);
    if (!r.length) return [];
    return r[0].values.map(c => ({
      name: c[1], type: c[2], nullable: !c[3], defaultValue: c[4], primaryKey: !!c[5],
    }));
  }

  async query(sql) {
    const start = performance.now();
    const statements = this._db._SQLite.parseSql(sql, this._db);
    let columns = [];
    let rows = [];
    let affectedRows = 0;

    for (const stmt of statements) {
      try {
        const raw = this._db.execWithStatement(stmt);
        if (raw.length > 0) {
          columns = raw[0].columns.map(c => ({ name: c, type: 'text' }));
          rows = raw[0].values.map(vals => {
            const obj = {};
            raw[0].columns.forEach((c, i) => { obj[c] = vals[i]; });
            return obj;
          });
        }
        affectedRows += this._db.getRowsModified();
      } catch (e) {
        throw new Error(e.message);
      }
    }

    return {
      columns,
      rows,
      affectedRows,
      duration: Math.round(performance.now() - start),
    };
  }

  async getTableData(table, { limit = 100, offset = 0 } = {}) {
    try {
      const r = this._db.exec(`SELECT * FROM "${table}" LIMIT ${limit} OFFSET ${offset}`);
      const cr = this._db.exec(`SELECT COUNT(*) as cnt FROM "${table}"`);
      const total = cr.length ? cr[0].values[0][0] : 0;
      if (!r.length) return { columns: [], rows: [], total: 0 };
      const columns = r[0].columns.map(c => ({ name: c, type: 'text' }));
      const rows = r[0].values.map(vals => {
        const obj = {};
        r[0].columns.forEach((c, i) => { obj[c] = vals[i]; });
        return obj;
      });
      return { columns, rows, total };
    } catch { return { columns: [], rows: [], total: 0 }; }
  }

  async updateRow(table, data, id) {
    const sets = Object.entries(data)
      .filter(([k]) => k !== 'id')
      .map(([k, v]) => `"${k}" = ${v === null ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v}`)
      .join(', ');
    if (!sets) return;
    await this.query(`UPDATE "${table}" SET ${sets} WHERE id = ${typeof id === 'string' && isNaN(Number(id)) ? `'${id}'` : id}`);
  }

  async deleteRow(table, id) {
    await this.query(`DELETE FROM "${table}" WHERE id = ${typeof id === 'string' && isNaN(Number(id)) ? `'${id}'` : id}`);
  }
}

registerAdapter('sqljs', SQLjsAdapter);
export default SQLjsAdapter;
