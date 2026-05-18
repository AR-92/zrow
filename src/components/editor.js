import { store, actions, getActiveTab, executeQuery, getActiveConnection, connectToDatabase } from '../store.js';
import { createElement, clear, qs, debounce, refreshIcons } from '../utils/dom.js';
import { highlightSql, getLineNumbers } from '../utils/sql-highlight.js';
import { icon } from '../utils/icons.js';

export function initEditor() {
  const container = qs('#editor-container');
  const statusInfo = qs('#status-query-info');

  const toolbar = createElement('div', { className: 'flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0' });
  const runBtn = createElement('button', { className: 'flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors', onClick: runCurrentQuery });
  runBtn.innerHTML = icon('play') + ' Run';
  toolbar.appendChild(runBtn);
  toolbar.appendChild(createElement('span', { className: 'text-[10px] text-gray-600' }, 'Ctrl+Enter'));
  const statusEl = createElement('span', { className: 'text-xs text-gray-500 ml-3 flex-1' }, 'Ready');
  toolbar.appendChild(statusEl);
  container.appendChild(toolbar);

  const wrap = createElement('div', { className: 'editor-wrapper flex-1' });
  const gutter = createElement('div', { className: 'editor-gutter', id: 'editor-gutter' });
  const highlight = createElement('pre', { className: 'editor-highlight', id: 'editor-highlight' });
  const textarea = createElement('textarea', { className: 'editor-input', id: 'editor-input', spellcheck: 'false', autocomplete: 'off', placeholder: 'Enter SQL...', disabled: true });
  wrap.append(gutter, highlight, textarea);
  container.appendChild(wrap);

  const update = debounce(() => {
    const sql = textarea.value;
    highlight.innerHTML = highlightSql(sql) + '\n'.repeat(Math.max(1, sql.split('\n').length));
    gutter.textContent = getLineNumbers(sql);
    const { tabs, activeTabId } = store.get();
    if (activeTabId) actions.updateTabSQL(activeTabId, sql);
  }, 30);

  textarea.addEventListener('input', update);
  textarea.addEventListener('scroll', () => { highlight.scrollTop = textarea.scrollTop; highlight.scrollLeft = textarea.scrollLeft; gutter.scrollTop = textarea.scrollTop; });
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); const s = textarea.selectionStart; textarea.value = textarea.value.substring(0, s) + '  ' + textarea.value.substring(textarea.selectionEnd); textarea.selectionStart = textarea.selectionEnd = s + 2; update(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCurrentQuery(); }
  });

  store.subscribe(() => {
    const tab = getActiveTab();
    if (!tab || !tab.sql && tab.type === 'editor') {
      const loaded = store.get().activeConnectionId;
      textarea.disabled = !loaded;
      textarea.placeholder = loaded ? 'Enter SQL...' : 'Connect to a database first';
      if (!loaded) { textarea.value = ''; update(); }
      return;
    }
    textarea.disabled = false;
    textarea.placeholder = 'Enter SQL...';
    if (textarea.value !== (tab.sql || '')) { textarea.value = tab.sql || ''; update(); }
  }, false);

  store.subscribe(() => {
    const { queryRunning, queryError, results } = store.get();
    if (queryRunning) { statusEl.innerHTML = icon('loader-circle', 'w-3 h-3', 'animate-spin') + ' Running...'; statusInfo.textContent = ''; }
    else if (queryError) { statusEl.innerHTML = icon('alert-circle', 'w-3 h-3') + ' ' + queryError; statusEl.className = 'text-xs text-red-400 ml-3 flex-1'; statusInfo.textContent = ''; }
    else if (results) { statusEl.textContent = `${results.rows.length} rows in ${results.duration}ms`; statusEl.className = 'text-xs text-green-400 ml-3 flex-1'; statusInfo.textContent = `${results.columns.length} cols`; }
    else { statusEl.textContent = 'Ready'; statusEl.className = 'text-xs text-gray-500 ml-3 flex-1'; statusInfo.textContent = ''; }
    refreshIcons(statusEl.parentElement);
  }, false);
}

async function runCurrentQuery() {
  const tab = getActiveTab();
  if (!tab) return;
  let conn = getActiveConnection();
  if (!conn) {
    conn = store.get().connections[0];
    if (!conn) { actions.openConnectionModal(); return; }
    try { await connectToDatabase(conn); } catch (e) { actions.setQueryError(`Connection failed: ${e.message}`); return; }
  }
  const sql = qs('#editor-input').value.trim();
  if (!sql) return;
  try { await executeQuery(store.get().activeConnectionId, sql); } catch {}
}

export async function runQuery(sql) {
  const input = qs('#editor-input');
  if (input) {
    input.value = sql;
    const evt = new Event('input');
    input.dispatchEvent(evt);
  }
  let conn = getActiveConnection();
  if (!conn) {
    conn = store.get().connections[0];
    if (!conn) { actions.openConnectionModal(); return; }
    try { await connectToDatabase(conn); } catch (e) { actions.setQueryError(`Connection failed: ${e.message}`); return; }
  }
  try { await executeQuery(store.get().activeConnectionId, sql); } catch {}
}
