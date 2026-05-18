import { registerAdapter } from './registry.js';

class IndexedDBAdapter {
  static info = {
    name: 'IndexedDB',
    slug: 'indexeddb',
    description: 'Browser IndexedDB with SQL-like queries',
    icon: 'database',
  };

  constructor() {
    this._db = null;
    this._dbName = '';
    this._tables = new Map();
  }

  async connect(config) {
    this._dbName = config.database || 'zrow_indexeddb';
    this._tables.clear();
    await this._openDB();
    await this._loadSchema();
  }

  async disconnect() {
    if (this._db) this._db.close();
    this._db = null;
    this._tables.clear();
  }

  _openDB(version = 1) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this._dbName, version);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('_schema')) {
          db.createObjectStore('_schema', { keyPath: 'name' });
        }
      };
      req.onsuccess = (e) => {
        this._db = e.target.result;
        resolve();
      };
      req.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  }

  _getTransaction(storeName, mode = 'readonly') {
    return this._db.transaction(storeName, mode);
  }

  _getStore(storeName, mode = 'readonly') {
    const tx = this._getTransaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  async _loadSchema() {
    try {
      const tx = this._getTransaction('_schema');
      const store = tx.objectStore('_schema');
      const tables = await new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(new Error('Failed to load schema'));
      });

      for (const table of tables) {
        this._tables.set(table.name, table.columns || []);
      }
    } catch (e) {
      console.warn('No schema found, creating default schema store');
      if (!this._db.objectStoreNames.contains('_schema')) {
        this._db.close();
        await this._openDB(this._db.version + 1);
      }
    }
  }

  async _saveSchema() {
    const tx = this._getTransaction('_schema', 'readwrite');
    const store = tx.objectStore('_schema');
    for (const [name, columns] of this._tables) {
      store.put({ name, columns });
    }
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  }

  _ensureObjectStore(tableName) {
    if (this._db.objectStoreNames.contains(tableName)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this._db.close();
      const newVersion = this._db.version + 1;
      const req = indexedDB.open(this._dbName, newVersion);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(tableName)) {
          db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = (e) => {
        this._db = e.target.result;
        resolve();
      };
      req.onerror = reject;
    });
  }

  async getTables() {
    const tableNames = [];
    for (const name of this._db.objectStoreNames) {
      if (name !== '_schema') {
        tableNames.push({ name, type: 'table', columns: this._tables.get(name) || [] });
      }
    }
    return tableNames;
  }

  async getColumns(table) {
    return this._tables.get(table) || [];
  }

  async query(sql) {
    const start = performance.now();
    const parsed = this._parseSQL(sql);
    if (!parsed) throw new Error('Unsupported query. Try: SELECT, INSERT, CREATE TABLE, DROP TABLE');

    let result;
    switch (parsed.type) {
      case 'CREATE_TABLE':
        result = await this._createTable(parsed);
        break;
      case 'DROP_TABLE':
        result = await this._dropTable(parsed);
        break;
      case 'INSERT':
        result = await this._insert(parsed);
        break;
      case 'SELECT':
        result = await this._select(parsed);
        break;
      case 'UPDATE':
        result = await this._update(parsed);
        break;
      case 'DELETE':
        result = await this._delete(parsed);
        break;
      default:
        throw new Error('Unsupported query type');
    }

    return {
      columns: result.columns || [],
      rows: result.rows || [],
      affectedRows: result.affectedRows || 0,
      duration: Math.round(performance.now() - start),
    };
  }

  _parseSQL(sql) {
    const s = sql.trim().replace(/\s+/g, ' ').replace(/--.*?\n/g, '').replace(/\/\*.*?\*\//g, '');
    const upper = s.toUpperCase();

    if (upper.startsWith('CREATE TABLE')) {
      const match = s.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([^\s(]+)\s*\(([\s\S]*)\)/i);
      if (!match) return null;
      const tableName = match[1].replace(/['"`]/g, '');
      const colStr = match[2];
      const columns = [];
      const lines = colStr.split(',').map(l => l.trim()).filter(l => l);
      for (const line of lines) {
        if (/^(PRIMARY|FOREIGN|CONSTRAINT|UNIQUE|INDEX|CHECK)\s/i.test(line)) continue;
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          columns.push({
            name: parts[0].replace(/['"`]/g, ''),
            type: parts[1].replace(/\(.*\)/, ''),
            nullable: !/NOT\s+NULL/i.test(line),
            primaryKey: /PRIMARY\s+KEY/i.test(line),
          });
        }
      }
      return { type: 'CREATE_TABLE', tableName, columns };
    }

    if (upper.startsWith('DROP TABLE')) {
      const match = s.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([^\s;]+)/i);
      if (!match) return null;
      return { type: 'DROP_TABLE', tableName: match[1].replace(/['"`]/g, '') };
    }

    if (upper.startsWith('INSERT INTO')) {
      const match = s.match(/INSERT\s+INTO\s+([^\s(]+)\s*(?:\(([^)]*)\))?\s*VALUES\s*\(([^)]+)\)/i);
      if (!match) return null;
      const tableName = match[1].replace(/['"`]/g, '');
      const columns = match[2] ? match[2].split(',').map(c => c.trim().replace(/['"`]/g, '')) : null;
      const values = match[3].split(',').map(v => this._parseValue(v.trim()));
      return { type: 'INSERT', tableName, columns, values };
    }

    if (upper.startsWith('SELECT')) {
      const match = s.match(/SELECT\s+(.*?)\s+FROM\s+([^\s]+)(?:\s+WHERE\s+(.*))?(?:\s+ORDER\s+BY\s+(.*?))?(?:\s+LIMIT\s+(\d+))?(?:\s+OFFSET\s+(\d+))?/i);
      if (!match) return null;
      const where = match[3] || null;
      return {
        type: 'SELECT',
        tableName: match[2].replace(/['"`]/g, ''),
        columns: match[1].split(',').map(c => c.trim()),
        where,
        orderBy: match[4] || null,
        limit: match[5] ? parseInt(match[5]) : null,
        offset: match[6] ? parseInt(match[6]) : null,
      };
    }

    if (upper.startsWith('UPDATE')) {
      const match = s.match(/UPDATE\s+([^\s]+)\s+SET\s+(.*?)(?:\s+WHERE\s+(.*))?/i);
      if (!match) return null;
      return {
        type: 'UPDATE',
        tableName: match[1].replace(/['"`]/g, ''),
        set: match[2].split(',').map(p => {
          const [k, ...v] = p.split('=');
          return { column: k.trim().replace(/['"`]/g, ''), value: this._parseValue(v.join('=').trim()) };
        }),
        where: match[3] || null,
      };
    }

    if (upper.startsWith('DELETE FROM')) {
      const match = s.match(/DELETE\s+FROM\s+([^\s]+)(?:\s+WHERE\s+(.*))?/i);
      if (!match) return null;
      return { type: 'DELETE', tableName: match[1].replace(/['"`]/g, ''), where: match[2] || null };
    }

    return null;
  }

  _parseValue(v) {
    if (v === 'NULL' || v === 'null') return null;
    if (v === 'TRUE' || v === 'true') return true;
    if (v === 'FALSE' || v === 'false') return false;
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) return v.slice(1, -1);
    const num = Number(v);
    if (!isNaN(num) && v.trim() !== '') return num;
    return v;
  }

  async _createTable(parsed) {
    await this._ensureObjectStore(parsed.tableName);
    this._tables.set(parsed.tableName, parsed.columns);
    await this._saveSchema();
    return { columns: [{ name: 'result', type: 'text' }], rows: [{ result: 'Table created' }], affectedRows: 0 };
  }

  async _dropTable(parsed) {
    this._tables.delete(parsed.tableName);
    await this._saveSchema();
    return new Promise((resolve, reject) => {
      this._db.close();
      const newVersion = this._db.version + 1;
      const req = indexedDB.open(this._dbName, newVersion);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (db.objectStoreNames.contains(parsed.tableName)) {
          db.deleteObjectStore(parsed.tableName);
        }
      };
      req.onsuccess = (e) => {
        this._db = e.target.result;
        resolve({ columns: [{ name: 'result', type: 'text' }], rows: [{ result: 'Table dropped' }], affectedRows: 0 });
      };
      req.onerror = reject;
    });
  }

  async _insert(parsed) {
    const { tableName, columns, values } = parsed;
    const tableColumns = this._tables.get(tableName) || [];
    try {
      const store = this._getStore(tableName, 'readwrite');
      const row = {};
      if (columns) columns.forEach((col, i) => row[col] = values[i] !== undefined ? values[i] : null);
      else tableColumns.forEach((col, i) => row[col.name] = values[i] !== undefined ? values[i] : null);

      const id = await new Promise((resolve, reject) => {
        const req = store.add(row);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(new Error('Insert failed'));
      });

      return { columns: tableColumns.length ? tableColumns : [{ name: 'id', type: 'integer' }], rows: [{ ...row, id }], affectedRows: 1 };
    } catch (e) {
      throw new Error(`Insert failed: ${e.message}`);
    }
  }

  async _select(parsed) {
    const { tableName, columns, where, orderBy, limit, offset } = parsed;
    const tableColumns = this._tables.get(tableName) || [];

    const allRows = await new Promise((resolve, reject) => {
      const store = this._getStore(tableName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(new Error('Select failed'));
    });

    let filtered = allRows.filter(r => this._evalWhere(r, where));

    if (orderBy) {
      const om = orderBy.match(/(\w+)\s*(ASC|DESC)?/i);
      if (om) {
        const [, col, dir] = om;
        filtered.sort((a, b) => {
          if (a[col] == null) return 1; if (b[col] == null) return -1;
          return dir?.toUpperCase() === 'DESC'
            ? String(b[col]).localeCompare(String(a[col]))
            : String(a[col]).localeCompare(String(b[col]));
        });
      }
    }

    if (offset) filtered = filtered.slice(offset);
    if (limit) filtered = filtered.slice(0, limit);

    const isStar = columns.length === 1 && (columns[0] === '*' || columns[0] === 'COUNT(*)');
    let resultColumns;
    let projected;

    if (isStar) {
      if (columns[0] === 'COUNT(*)') {
        return { columns: [{ name: 'COUNT(*)', type: 'int' }], rows: [{ 'COUNT(*)': filtered.length }], affectedRows: 0 };
      }
      resultColumns = tableColumns;
      projected = filtered;
    } else {
      resultColumns = columns.map(c => ({ name: c.replace(/['"`]/g, '').split(' ')[0], type: 'text' }));
      projected = filtered.map(r => {
        const obj = {};
        columns.forEach(c => {
          const clean = c.replace(/['"`]/g, '');
          const asMatch = clean.match(/(\w+)\s+AS\s+(\w+)/i);
          obj[asMatch ? asMatch[2] : clean.replace(/.*\./, '')] = r[clean.replace(/.*\./, '')];
        });
        return obj;
      });
    }

    return { columns: resultColumns, rows: projected, affectedRows: 0 };
  }

  _evalWhere(row, where) {
    if (!where) return true;
    const match = where.match(/(\w+)\s*(=|!=|<>|>|<|>=|<=|LIKE|IS|IS\s+NOT)\s*(.+)/i);
    if (!match) return true;
    const [, col, op, valStr] = match;
    const val = this._parseValue(valStr.trim().replace(/^'(.*)'$/, '$1'));
    const rowVal = row[col];
    switch (op.toUpperCase()) {
      case '=': return rowVal == val;
      case '!=':
      case '<>': return rowVal != val;
      case '>': return rowVal > val;
      case '<': return rowVal < val;
      case '>=': return rowVal >= val;
      case '<=': return rowVal <= val;
      case 'LIKE': return String(rowVal).toLowerCase().includes(String(val).toLowerCase().replace(/%/g, ''));
      case 'IS': return val === null ? rowVal == null : rowVal === val;
      case 'IS NOT': return val === null ? rowVal != null : rowVal !== val;
      default: return true;
    }
  }

  async _update(parsed) {
    const { tableName, set, where } = parsed;
    const allRows = await new Promise((resolve, reject) => {
      const store = this._getStore(tableName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = reject;
    });

    let count = 0;
    const store2 = this._getStore(tableName, 'readwrite');
    for (const row of allRows) {
      if (this._evalWhere(row, where)) {
        set.forEach(s => row[s.column] = s.value);
        store2.put(row);
        count++;
      }
    }

    await new Promise((resolve, reject) => {
      store2.transaction.oncomplete = resolve;
      store2.transaction.onerror = reject;
    });

    return { columns: [], rows: [], affectedRows: count };
  }

  async _delete(parsed) {
    const { tableName, where } = parsed;
    const allRows = await new Promise((resolve, reject) => {
      const store = this._getStore(tableName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = reject;
    });

    let count = 0;
    const store2 = this._getStore(tableName, 'readwrite');
    for (const row of allRows) {
      if (this._evalWhere(row, where)) {
        store2.delete(row.id);
        count++;
      }
    }

    await new Promise((resolve, reject) => {
      store2.transaction.oncomplete = resolve;
      store2.transaction.onerror = reject;
    });

    return { columns: [], rows: [], affectedRows: count };
  }

  async getTableData(table, { limit = 100, offset = 0 } = {}) {
    const tableColumns = this._tables.get(table) || [];
    const allRows = await new Promise((resolve, reject) => {
      const store = this._getStore(table);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = reject;
    });
    return { columns: tableColumns, rows: allRows.slice(offset, offset + limit), total: allRows.length };
  }

  async updateRow(table, data, id) {
    const store = this._getStore(table, 'readwrite');
    const existing = await new Promise((resolve, reject) => {
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    });
    if (existing) {
      store.put({ ...existing, ...data });
    }
  }

  async deleteRow(table, id) {
    const store = this._getStore(table, 'readwrite');
    store.delete(id);
  }
}

registerAdapter('indexeddb', IndexedDBAdapter);
export default IndexedDBAdapter;
