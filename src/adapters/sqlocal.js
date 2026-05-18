import { registerAdapter } from './registry.js';
import { seedDatabase } from '../seed.js';

class SQLocalAdapter {
  static info = {
    name: 'SQLocal (SQLite + OPFS)',
    slug: 'sqlocal',
    description: 'SQLite via WASM, persisted to Origin Private File System (requires COOP/COEP headers)',
    icon: 'database',
  };

  constructor() {
    this._client = null;
    this._sql = null;
    this._batch = null;
    this._dbName = null;
  }

  async connect(config) {
    this._dbName = config.database || 'zrow.db';

    if (typeof SQLocal === 'undefined') {
      try {
        const mod = await import('https://cdn.jsdelivr.net/npm/sqlocal@0.17.0/dist/client.js');
        const { SQLocal } = mod;
        this._client = new SQLocal(this._dbName);
      } catch (e) {
        throw new Error(
          'SQLocal failed to load. Make sure the page is served with COOP/COEP headers:\n' +
          'Cross-Origin-Opener-Policy: same-origin\n' +
          'Cross-Origin-Embedder-Policy: require-corp\n' +
          'Original error: ' + e.message
        );
      }
    } else {
      this._client = new SQLocal(this._dbName);
    }

    const api = this._client;
    this._sql = api.sql.bind(api);
    this._batch = api.batch.bind(api);
    if (config.seed !== false) await this._seedIfEmpty();
  }

  async _seedIfEmpty() {
    try {
      const r = await this._sql`SELECT count(*) as cnt FROM sqlite_master WHERE type='table'`;
      if (r?.[0]?.cnt > 0) return;
    } catch { /* table doesn't exist yet */ }
    const statements = (await import('../seed.js')).DEMO_SQL.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      try { await this._sql([stmt + ';'], []); } catch {}
    }
  }

  async _runRaw(query) {
    try {
      const result = await this._sql([query], []);
      if (Array.isArray(result)) {
        const cols = result.length ? Object.keys(result[0]) : [];
        return { columns: cols.map(c => ({ name: c, type: 'text' })), rows: result };
      }
      return { columns: [], rows: [], affectedRows: 0 };
    } catch (e) {
      throw new Error('SQLocal query error: ' + e.message);
    }
  }

  async disconnect() {
    if (this._client?.destroy) await this._client.destroy();
    this._client = null;
    this._sql = null;
  }

  async getTables() {
    try {
      const result = await this._sql`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`;
      if (!result?.length) return [];
      const tables = [];
      for (const row of result) {
        const name = row.name;
        const cols = await this._sql`PRAGMA table_info(${name})`;
        const columns = (cols || []).map(c => ({
          name: c.name, type: c.type, nullable: !c.notnull, defaultValue: c.dflt_value, primaryKey: !!c.pk,
        }));
        tables.push({ name, type: 'table', columns });
      }
      return tables;
    } catch (e) {
      return [];
    }
  }

  async getColumns(table) {
    try {
      const cols = await this._sql`PRAGMA table_info(${table})`;
      return (cols || []).map(c => ({
        name: c.name, type: c.type, nullable: !c.notnull, defaultValue: c.dflt_value, primaryKey: !!c.pk,
      }));
    } catch { return []; }
  }

  async query(sqlStr) {
    const start = performance.now();
    const upper = sqlStr.trim().toUpperCase();
    const isSelect = upper.startsWith('SELECT') || upper.startsWith('PRAGMA') || upper.startsWith('EXPLAIN');
    const isWrite = upper.startsWith('INSERT') || upper.startsWith('UPDATE') || upper.startsWith('DELETE') || upper.startsWith('CREATE') || upper.startsWith('DROP') || upper.startsWith('ALTER');

    try {
      if (isSelect) {
        const result = await this._sql([sqlStr], []);
        const columns = result?.length ? Object.keys(result[0]).map(c => ({ name: c, type: 'text' })) : [];
        return { columns, rows: result || [], affectedRows: 0, duration: Math.round(performance.now() - start) };
      } else if (isWrite) {
        await this._sql([sqlStr], []);
        return { columns: [{ name: 'result', type: 'text' }], rows: [], affectedRows: -1, duration: Math.round(performance.now() - start) };
      } else {
        await this._sql([sqlStr], []);
        return { columns: [{ name: 'result', type: 'text' }], rows: [], affectedRows: 0, duration: Math.round(performance.now() - start) };
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getTableData(table, { limit = 100, offset = 0 } = {}) {
    try {
      const rows = await this._sql`SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`;
      const countResult = await this._sql`SELECT COUNT(*) as cnt FROM ${table}`;
      const total = countResult?.[0]?.cnt ?? 0;
      const columns = rows?.length ? Object.keys(rows[0]).map(c => ({ name: c, type: 'text' })) : [];
      return { columns, rows: rows || [], total };
    } catch { return { columns: [], rows: [], total: 0 }; }
  }

  async updateRow(table, data, id) {
    const sets = Object.entries(data)
      .filter(([k]) => k !== 'id')
      .map(([k]) => `"${k}" = ?`)
      .join(', ');
    const vals = Object.entries(data).filter(([k]) => k !== 'id').map(([, v]) => v);
    vals.push(id);
    await this._sql([`UPDATE "${table}" SET ${sets} WHERE id = ?`, ...vals], []);
  }

  async deleteRow(table, id) {
    await this._sql([`DELETE FROM "${table}" WHERE id = ?`, id], []);
  }
}

registerAdapter('sqlocal', SQLocalAdapter);
export default SQLocalAdapter;
