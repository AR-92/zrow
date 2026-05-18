const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'JOIN',
  'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON', 'AND', 'OR',
  'NOT', 'IN', 'NULL', 'IS', 'LIKE', 'BETWEEN', 'EXISTS', 'UNION', 'ALL',
  'DISTINCT', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET',
  'ASC', 'DESC', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'RECURSIVE',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CASCADE', 'CONSTRAINT',
  'DEFAULT', 'CHECK', 'UNIQUE', 'IF', 'GRANT', 'REVOKE', 'COMMIT',
  'ROLLBACK', 'BEGIN', 'TRANSACTION', 'EXPLAIN', 'ANALYZE', 'TRUNCATE',
  'RETURNING', 'USING', 'NATURAL', 'EXCEPT', 'INTERSECT', 'FETCH', 'NEXT',
  'ROWS', 'ONLY', 'FOR', 'OF', 'MERGE', 'MATCHED', 'DO', 'NOTHING',
]);

const TYPES = new Set([
  'INT', 'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT', 'BOOLEAN', 'BIT',
  'FLOAT', 'DOUBLE', 'REAL', 'DECIMAL', 'NUMERIC', 'MONEY',
  'CHAR', 'VARCHAR', 'TEXT', 'CLOB', 'NCHAR', 'NVARCHAR', 'NTEXT',
  'BINARY', 'VARBINARY', 'BLOB', 'BYTEA',
  'DATE', 'TIME', 'TIMESTAMP', 'DATETIME', 'YEAR', 'INTERVAL',
  'JSON', 'JSONB', 'UUID', 'ARRAY', 'ENUM', 'SERIAL', 'BIGSERIAL',
  'GEOMETRY', 'GEOGRAPHY', 'POINT', 'LINESTRING', 'POLYGON',
]);

const FUNCTIONS = new Set([
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF', 'CAST',
  'CONVERT', 'SUBSTRING', 'UPPER', 'LOWER', 'TRIM', 'LENGTH', 'REPLACE',
  'CONCAT', 'NOW', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP',
  'EXTRACT', 'DATE_PART', 'DATE_TRUNC', 'ROUND', 'CEIL', 'FLOOR', 'ABS',
  'MOD', 'POWER', 'SQRT', 'EXP', 'LN', 'LOG', 'GREATEST', 'LEAST',
  'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'LEAD', 'LAG', 'FIRST_VALUE',
  'LAST_VALUE', 'NTH_VALUE', 'STRING_AGG', 'ARRAY_AGG', 'JSON_AGG',
  'GROUP_CONCAT', 'LISTAGG', 'TO_CHAR', 'TO_DATE', 'TO_NUMBER',
  'LEFT', 'RIGHT', 'POSITION', 'STRPOS',
  'REGEXP_REPLACE', 'REGEXP_MATCH', 'SPLIT_PART',
  'MD5', 'SHA256', 'RANDOM', 'GEN_RANDOM_UUID',
]);

const BUILTINS = new Set([
  'TRUE', 'FALSE', 'NULL', 'UNKNOWN', 'CURRENT_USER', 'SESSION_USER',
  'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'LOCALTIME',
  'LOCALTIMESTAMP', 'CURRENT_CATALOG', 'CURRENT_SCHEMA', 'DEFAULT',
]);

export function highlightSql(sql) {
  if (!sql) return '';
  const tokens = [];
  let i = 0;
  const len = sql.length;

  while (i < len) {
    if (sql[i] === '\n') {
      tokens.push({ type: 'text', value: '\n' });
      i++;
      continue;
    }

    if (sql[i] === ' ' || sql[i] === '\t') {
      let ws = '';
      while (i < len && (sql[i] === ' ' || sql[i] === '\t')) ws += sql[i++];
      tokens.push({ type: 'text', value: ws });
      continue;
    }

    if (sql[i] === '-' && sql[i + 1] === '-') {
      let comment = '';
      i += 2;
      while (i < len && sql[i] !== '\n') comment += sql[i++];
      tokens.push({ type: 'comment', value: '--' + comment });
      continue;
    }

    if (sql[i] === '/' && sql[i + 1] === '*') {
      let comment = '/*';
      i += 2;
      while (i < len - 1 && !(sql[i] === '*' && sql[i + 1] === '/')) comment += sql[i++];
      if (i < len - 1) { comment += '*/'; i += 2; }
      tokens.push({ type: 'comment', value: comment });
      continue;
    }

    if (sql[i] === "'" || sql[i] === '"' || sql[i] === '`') {
      const quote = sql[i];
      let str = quote;
      i++;
      while (i < len) {
        if (sql[i] === '\\' && i + 1 < len) { str += sql[i] + sql[i + 1]; i += 2; continue; }
        str += sql[i];
        if (sql[i] === quote) { i++; break; }
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    if (sql[i] === '$' && i + 1 < len && sql[i + 1] === '$') {
      let str = '$$';
      i += 2;
      while (i < len - 1 && !(sql[i] === '$' && sql[i + 1] === '$')) str += sql[i++];
      if (i < len - 1) { str += '$$'; i += 2; }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    if (/[0-9]/.test(sql[i]) && (i === 0 || /[\s,()=<>!+\-*/%]/.test(sql[i - 1]))) {
      let num = '';
      while (i < len && /[0-9.]/.test(sql[i])) num += sql[i++];
      if (num.endsWith('.')) { num = num.slice(0, -1); i--; }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    if (/[a-zA-Z_]/.test(sql[i])) {
      let word = '';
      while (i < len && /[a-zA-Z0-9_]/.test(sql[i])) word += sql[i++];
      const upper = word.toUpperCase();
      if (KEYWORDS.has(upper)) tokens.push({ type: 'keyword', value: word });
      else if (TYPES.has(upper)) tokens.push({ type: 'type', value: word });
      else if (FUNCTIONS.has(upper)) tokens.push({ type: 'function', value: word });
      else if (BUILTINS.has(upper)) tokens.push({ type: 'builtin', value: word });
      else tokens.push({ type: 'text', value: word });
      continue;
    }

    if (/[()]/.test(sql[i])) {
      tokens.push({ type: 'text', value: sql[i] });
      i++;
      continue;
    }

    if (sql[i] === ':' && i + 1 < len && /[a-zA-Z]/.test(sql[i + 1])) {
      let varName = ':';
      i++;
      while (i < len && /[a-zA-Z0-9_]/.test(sql[i])) varName += sql[i++];
      tokens.push({ type: 'variable', value: varName });
      continue;
    }

    if (/[=<>!+\-*/%,;.]/.test(sql[i])) {
      let op = sql[i];
      i++;
      if ((op === '<' || op === '>' || op === '!' || op === '=') && i < len && sql[i] === '=') {
        op += '='; i++;
      }
      tokens.push({ type: 'operator', value: op });
      continue;
    }

    tokens.push({ type: 'text', value: sql[i] });
    i++;
  }

  return tokens.map(t => {
    const cls = `sql-${t.type}`;
    return `<span class="${cls}">${escapeHtml(t.value)}</span>`;
  }).join('');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function getLineCount(sql) {
  if (!sql) return 1;
  return sql.split('\n').length;
}

export function getLineNumbers(sql) {
  const count = getLineCount(sql);
  return Array.from({ length: count }, (_, i) => i + 1).join('\n');
}
