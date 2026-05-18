import { registerAdapter } from './registry.js';

class LocalStorageAdapter {
  static info = {
    name: 'LocalStorage',
    slug: 'localstorage',
    description: 'Browser localStorage (key-value) with SQL-like queries',
    icon: 'database',
  };

  constructor() {
    this._db = null;
    this._prefix = '';
    this._tables = new Map();
  }

  async connect(config) {
    this._prefix = config.database || 'zrow_';
    this._db = window.localStorage;
    this._loadSchema();
  }

  async disconnect() {
    this._db = null;
    this._tables.clear();
  }

  _loadSchema() {
    const schemaKey = this._prefix + '_schema';
    try {
      const raw = this._db.getItem(schemaKey);
      if (raw) {
        const tables = JSON.parse(raw);
        for (const [name, columns] of Object.entries(tables)) {
          this._tables.set(name, columns);
        }
      }
    } catch { }
  }

  _saveSchema() {
    const schemaKey = this._prefix + '_schema';
    const obj = {};
    for (const [name, columns] of this._tables) {
      obj[name] = columns;
    }
    this._db.setItem(schemaKey, JSON.stringify(obj));
  }

  _tableKey(name) {
    return this._prefix + 'table_' + name;
  }

  async getTables() {
    return Array.from(this._tables.keys()).map(name => ({
      name,
      type: 'table',
      columns: this._tables.get(name) || [],
    }));
  }

  async getColumns(table) {
    return this._tables.get(table) || [];
  }

  async query(sql) {
    const start = performance.now();
    const parsed = this._parseSQL(sql);
    if (!parsed) {
      throw new Error('Unsupported query. Try: SELECT, INSERT, CREATE TABLE, DROP TABLE');
    }

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
        if (/^PRIMARY\s+KEY/i.test(line) || /^FOREIGN\s+KEY/i.test(line) || /^CONSTRAINT/i.test(line) || /^UNIQUE/i.test(line) || /^INDEX/i.test(line) || /^CHECK/i.test(line)) continue;
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          columns.push({
            name: parts[0].replace(/['"`]/g, ''),
            type: parts[1].replace(/\(.*\)/, ''),
            nullable: !/NOT\s+NULL/i.test(line),
            primaryKey: /PRIMARY\s+KEY/i.test(line),
            defaultValue: (line.match(/DEFAULT\s+(\S+)/i) || [])[1] || null,
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
      const tableName = match[2].replace(/['"`]/g, '');
      const where = match[3] || null;
      const orderBy = match[4] || null;
      const limit = match[5] ? parseInt(match[5]) : null;
      const offset = match[6] ? parseInt(match[6]) : null;
      const selectCols = match[1].split(',').map(c => c.trim());
      return { type: 'SELECT', tableName, columns: selectCols, where, orderBy, limit, offset };
    }

    if (upper.startsWith('UPDATE')) {
      const match = s.match(/UPDATE\s+([^\s]+)\s+SET\s+(.*?)(?:\s+WHERE\s+(.*))?/i);
      if (!match) return null;
      const tableName = match[1].replace(/['"`]/g, '');
      const setParts = match[2].split(',').map(p => {
        const [k, ...v] = p.split('=');
        return { column: k.trim().replace(/['"`]/g, ''), value: this._parseValue(v.join('=').trim()) };
      });
      const where = match[3] || null;
      return { type: 'UPDATE', tableName, set: setParts, where };
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
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
      return v.slice(1, -1);
    }
    const num = Number(v);
    if (!isNaN(num) && v.trim() !== '') return num;
    return v;
  }

  _evalWhere(row, where) {
    if (!where) return true;
    const match = where.match(/(\w+)\s*(=|!=|<>|>|<|>=|<=|LIKE|IN|IS|NOT)\s*(.+)/i);
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

  async _createTable(parsed) {
    if (this._tables.has(parsed.tableName)) {
      return { columns: [], rows: [], affectedRows: 0 };
    }
    this._tables.set(parsed.tableName, parsed.columns);
    this._saveSchema();
    this._db.setItem(this._tableKey(parsed.tableName), '[]');
    return { columns: [{ name: 'result', type: 'text' }], rows: [{ result: 'Table created' }], affectedRows: 0 };
  }

  async _dropTable(parsed) {
    this._tables.delete(parsed.tableName);
    this._saveSchema();
    this._db.removeItem(this._tableKey(parsed.tableName));
    return { columns: [{ name: 'result', type: 'text' }], rows: [{ result: 'Table dropped' }], affectedRows: 0 };
  }

  async _insert(parsed) {
    const { tableName, columns, values } = parsed;
    const tableColumns = this._tables.get(tableName);
    if (!tableColumns) throw new Error(`Table ${tableName} not found`);

    let rows = [];
    try { rows = JSON.parse(this._db.getItem(this._tableKey(tableName)) || '[]'); } catch { rows = []; }

    const row = {};
    if (columns) {
      columns.forEach((col, i) => { row[col] = values[i] !== undefined ? values[i] : null; });
    } else {
      tableColumns.forEach((col, i) => { row[col.name] = values[i] !== undefined ? values[i] : null; });
    }

    if (!row.id) row.id = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    rows.push(row);
    this._db.setItem(this._tableKey(tableName), JSON.stringify(rows));
    return { columns: tableColumns, rows: [row], affectedRows: 1 };
  }

  async _select(parsed) {
    const { tableName, columns, where, orderBy, limit, offset } = parsed;
    const tableColumns = this._tables.get(tableName);
    if (!tableColumns) throw new Error(`Table ${tableName} not found`);

    let rows = [];
    try { rows = JSON.parse(this._db.getItem(this._tableKey(tableName)) || '[]'); } catch { rows = []; }

    let filtered = rows.filter(r => this._evalWhere(r, where));

    if (orderBy) {
      const orderMatch = orderBy.match(/(\w+)\s*(ASC|DESC)?/i);
      if (orderMatch) {
        const [, col, dir] = orderMatch;
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
    const projected = isStar ? filtered : filtered.map(r => {
      const obj = {};
      columns.forEach(c => {
        const clean = c.replace(/['"`]/g, '');
        const asMatch = clean.match(/(\w+)\s+AS\s+(\w+)/i);
        if (asMatch) obj[asMatch[2]] = r[asMatch[1]];
        else if (clean.includes('.')) obj[clean.split('.')[1]] = r[clean.split('.')[1]];
        else obj[clean] = r[clean];
      });
      return obj;
    });

    let resultColumns;
    if (isStar) {
      if (columns[0] === 'COUNT(*)') {
        resultColumns = [{ name: 'COUNT(*)', type: 'int' }];
        return { columns: resultColumns, rows: [{ 'COUNT(*)': filtered.length }], affectedRows: 0 };
      }
      resultColumns = tableColumns;
    } else {
      resultColumns = columns.map(c => ({ name: c.replace(/['"`]/g, '').split(' ')[0], type: 'text' }));
    }

    return { columns: resultColumns, rows: projected, affectedRows: 0 };
  }

  async _update(parsed) {
    const { tableName, set, where } = parsed;
    let rows = [];
    try { rows = JSON.parse(this._db.getItem(this._tableKey(tableName)) || '[]'); } catch { rows = []; }

    let count = 0;
    rows = rows.map(r => {
      if (this._evalWhere(r, where)) {
        set.forEach(s => { r[s.column] = s.value; });
        count++;
      }
      return r;
    });

    this._db.setItem(this._tableKey(tableName), JSON.stringify(rows));
    return { columns: [], rows: [], affectedRows: count };
  }

  async _delete(parsed) {
    const { tableName, where } = parsed;
    let rows = [];
    try { rows = JSON.parse(this._db.getItem(this._tableKey(tableName)) || '[]'); } catch { rows = []; }

    const before = rows.length;
    rows = where ? rows.filter(r => !this._evalWhere(r, where)) : [];
    const count = before - rows.length;

    this._db.setItem(this._tableKey(tableName), JSON.stringify(rows));
    return { columns: [], rows: [], affectedRows: count };
  }

  async getTableData(table, { limit = 100, offset = 0 } = {}) {
    const tableColumns = this._tables.get(table);
    if (!tableColumns) return { columns: [], rows: [] };
    let rows = [];
    try { rows = JSON.parse(this._db.getItem(this._tableKey(table)) || '[]'); } catch { rows = []; }
    const page = rows.slice(offset, offset + limit);
    return { columns: tableColumns, rows: page, total: rows.length };
  }

  async updateRow(table, data, id) {
    let rows = [];
    try { rows = JSON.parse(this._db.getItem(this._tableKey(table)) || '[]'); } catch { rows = []; }
    rows = rows.map(r => r.id === id ? { ...r, ...data } : r);
    this._db.setItem(this._tableKey(table), JSON.stringify(rows));
  }

  async deleteRow(table, id) {
    let rows = [];
    try { rows = JSON.parse(this._db.getItem(this._tableKey(table)) || '[]'); } catch { rows = []; }
    rows = rows.filter(r => r.id !== id);
    this._db.setItem(this._tableKey(table), JSON.stringify(rows));
  }
}

registerAdapter('localstorage', LocalStorageAdapter);
export default LocalStorageAdapter;
