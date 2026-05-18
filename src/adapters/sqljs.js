import { seedDatabase } from '../seed.js';

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('zrow_dbs', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('dbs'))
        db.createObjectStore('dbs', { keyPath: 'id' });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(new Error('Failed to open IndexedDB'));
  });
}

async function loadFromIDB(name) {
  const idb = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('dbs', 'readonly');
    const req = tx.objectStore('dbs').get(name);
    req.onsuccess = () => { idb.close(); resolve(req.result?.data || null); };
    req.onerror = () => { idb.close(); reject(new Error('Failed to read DB')); };
  });
}

async function saveToIDB(name, buffer) {
  const idb = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('dbs', 'readwrite');
    tx.objectStore('dbs').put({ id: name, data: buffer, updated: Date.now() });
    tx.oncomplete = () => { idb.close(); resolve(); };
    tx.onerror = () => { idb.close(); reject(); };
  });
}

export class SQLite {
  constructor() {
    this._db = null;
    this._SQL = null;
    this._name = null;
  }

  async open(name, wasmPath) {
    this._name = name;
    this._SQL = await window.initSqlJs({ locateFile: f => (wasmPath || 'dist/vendor/') + f });
    this._db = new this._SQL.Database();
    if (name && name !== ':memory:') {
      try {
        const stored = await loadFromIDB(name);
        if (stored) this._db = new this._SQL.Database(stored);
      } catch {}
    }
    return this;
  }

  seedIfEmpty() {
    try {
      const r = this._db.exec("SELECT count(*) as cnt FROM sqlite_master WHERE type='table'");
      if (r.length && r[0].values[0][0] > 0) return;
    } catch {}
    seedDatabase(this._db, (sql) => this._db.exec(sql));
  }

  async save() {
    if (this._name && this._name !== ':memory:' && this._db) {
      try { await saveToIDB(this._name, this._db.export()); } catch {}
    }
  }

  exec(sql) {
    const start = performance.now();
    const results = this._db.exec(sql);
    let columns = [], rows = [], affectedRows = this._db.getRowsModified();
    for (const r of results) {
      if (r.columns?.length) {
        columns = r.columns.map(c => ({ name: c, type: 'text' }));
        rows = r.values.map(vals => {
          const obj = {};
          r.columns.forEach((c, i) => { obj[c] = vals[i]; });
          return obj;
        });
      }
    }
    const write = /^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(sql);
    if (write) this.save();
    return { columns, rows, affectedRows, duration: Math.round(performance.now() - start) };
  }

  getTables() {
    const r = this._db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    if (!r.length) return [];
    return r[0].values.map(row => {
      const name = row[0];
      const cr = this._db.exec(`PRAGMA table_info("${name}")`);
      const cols = cr.length ? cr[0].values.map(c => ({
        name: c[1], type: c[2], nullable: !c[3], defaultValue: c[4], primaryKey: !!c[5],
      })) : [];
      return { name, type: 'table', columns: cols };
    });
  }

  getTableData(name, { limit = 200, offset = 0 } = {}) {
    try {
      const r = this._db.exec(`SELECT * FROM "${name}" LIMIT ${limit} OFFSET ${offset}`);
      const cr = this._db.exec(`SELECT COUNT(*) as cnt FROM "${name}"`);
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

  updateRow(table, data, id) {
    const sets = Object.entries(data)
      .filter(([k]) => k !== 'id')
      .map(([k, v]) => `"${k}" = ${v === null ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v}`)
      .join(', ');
    if (!sets) return;
    this.exec(`UPDATE "${table}" SET ${sets} WHERE id = ${typeof id === 'string' && isNaN(Number(id)) ? `'${id}'` : id}`);
  }

  deleteRow(table, id) {
    this.exec(`DELETE FROM "${table}" WHERE id = ${typeof id === 'string' && isNaN(Number(id)) ? `'${id}'` : id}`);
  }

  updateRowByPk(table, data, pkCol, pkVal) {
    const sets = Object.entries(data)
      .filter(([k]) => k !== pkCol)
      .map(([k, v]) => `"${k}" = ${v === null ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v}`)
      .join(', ');
    if (!sets) return;
    this.exec(`UPDATE "${table}" SET ${sets} WHERE "${pkCol}" = ${typeof pkVal === 'string' && isNaN(Number(pkVal)) ? `'${pkVal.replace(/'/g, "''")}'` : pkVal}`);
  }

  deleteRowByPk(table, pkCol, pkVal) {
    this.exec(`DELETE FROM "${table}" WHERE "${pkCol}" = ${typeof pkVal === 'string' && isNaN(Number(pkVal)) ? `'${pkVal.replace(/'/g, "''")}'` : pkVal}`);
  }

  insertRow(table, data) {
    const cols = Object.keys(data).map(k => `"${k}"`);
    const vals = Object.values(data).map(v =>
      v === null || v === undefined ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
    );
    this.exec(`INSERT INTO "${table}" (${cols.join(', ')}) VALUES (${vals.join(', ')})`);
  }

  createTable(name, columns) {
    const colDefs = columns.map(c => {
      let def = `"${c.name}" ${c.type}`;
      if (c.primaryKey) def += ' PRIMARY KEY';
      if (c.autoIncrement) def += ' AUTOINCREMENT';
      if (c.notNull) def += ' NOT NULL';
      if (c.defaultValue != null && c.defaultValue !== '')
        def += ` DEFAULT ${typeof c.defaultValue === 'string' ? `'${c.defaultValue}'` : c.defaultValue}`;
      if (c.unique) def += ' UNIQUE';
      return def;
    });
    this.exec(`CREATE TABLE "${name}" (${colDefs.join(', ')})`);
  }

  dropTable(name) {
    this.exec(`DROP TABLE IF EXISTS "${name}"`);
  }

  addColumn(table, columnDef) {
    let def = `"${columnDef.name}" ${columnDef.type}`;
    if (columnDef.notNull) def += ' NOT NULL';
    if (columnDef.defaultValue != null && columnDef.defaultValue !== '')
      def += ` DEFAULT ${typeof columnDef.defaultValue === 'string' ? `'${columnDef.defaultValue}'` : columnDef.defaultValue}`;
    this.exec(`ALTER TABLE "${table}" ADD COLUMN ${def}`);
  }

  dropColumn(table, name) {
    this.exec(`ALTER TABLE "${table}" DROP COLUMN "${name}"`);
  }

  renameTable(oldName, newName) {
    this.exec(`ALTER TABLE "${oldName}" RENAME TO "${newName}"`);
  }

  getTableInfo(name) {
    const cols = this._db.exec(`PRAGMA table_info("${name}")`);
    const indexes = this._db.exec(`PRAGMA index_list("${name}")`);
    const fks = this._db.exec(`PRAGMA foreign_key_list("${name}")`);
    return {
      columns: cols.length ? cols[0].values.map(c => ({
        cid: c[0], name: c[1], type: c[2], notNull: !!c[3], defaultValue: c[4], primaryKey: !!c[5],
      })) : [],
      indexes: indexes.length ? indexes[0].values.map(i => ({
        name: i[1], unique: !i[2], origin: i[3],
      })) : [],
      foreignKeys: fks.length ? fks[0].values.map(f => ({
        column: f[3], refTable: f[2], refColumn: f[4],
      })) : [],
    };
  }
}
