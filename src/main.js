import { store, actions, connectToDatabase, executeQuery, browseTable, disconnectDatabase } from './store.js';
import { qs, qsa, delegate, createElement, clear, refreshIcons } from './utils/dom.js';
import { highlightSql, getLineNumbers } from './utils/sql-highlight.js';

document.addEventListener('DOMContentLoaded', () => {
  const { theme } = store.get();
  document.documentElement.classList.toggle('dark', theme === 'dark');
  render();

  store.subscribe(() => {
    const s = store.get();
    const st = qs('#status-text');
    if (st) st.textContent = s.statusText;
    const si = qs('#status-icon');
    if (si) si.className = `w-2 h-2 rounded-full ${s.queryRunning ? 'bg-amber-400 animate-pulse' : s.activeConnectionId ? 'bg-emerald-400' : 'bg-gray-600'}`;
  });
});

function render() {
  renderSidebar();
  renderTabs();
  renderContent();
  renderFooter();
  refreshIcons();
}

// ── Sidebar ────────────────────────────────────
function renderSidebar() {
  const el = qs('#sidebar');
  clear(el);
  const s = store.get();
  const { connections, activeConnectionId, tables, currentTable } = s;

  el.innerHTML = `
    <div class="flex items-center gap-2 px-4 h-10 shrink-0 border-b border-gray-800/60">
      <i data-lucide="database" class="w-4 h-4 text-blue-400"></i>
      <span class="text-xs font-semibold text-gray-300">Zrow</span>
      <span class="text-[9px] text-gray-600 ml-auto">v2</span>
    </div>
    <div class="flex-1 overflow-y-auto py-2" id="sidebar-body"></div>
    <div class="px-3 py-2 border-t border-gray-800/60 text-[11px] text-gray-500">
      <div class="flex items-center gap-2">
        <span id="status-icon" class="w-2 h-2 rounded-full ${activeConnectionId ? 'bg-emerald-400' : 'bg-gray-600'}"></span>
        <span id="status-text" class="truncate">${s.statusText}</span>
      </div>
    </div>
  `;

  const body = qs('#sidebar-body');

  if (!connections.length && !activeConnectionId) {
    body.innerHTML = `
      <div class="flex flex-col items-center gap-3 py-8 px-4 text-center">
        <i data-lucide="database" class="w-8 h-8 text-gray-700"></i>
        <p class="text-xs text-gray-600">No connections yet</p>
        <button id="btn-new-conn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Database
        </button>
      </div>
    `;
    qs('#btn-new-conn')?.addEventListener('click', showConnectModal);
    refreshIcons(body);
    return;
  }

  let html = '';
  for (const conn of connections) {
    const active = conn.id === activeConnectionId;
    html += `
      <div class="conn-item flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg cursor-pointer text-xs transition-all ${active ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}" data-id="${conn.id}">
        <i data-lucide="${active ? 'plug' : 'database'}" class="w-3.5 h-3.5 shrink-0"></i>
        <span class="truncate flex-1">${conn.name}</span>
        <span class="text-[10px] text-gray-600">SQLite</span>
        <button class="btn-del-conn opacity-0 hover:opacity-100 hover:text-red-400 transition-opacity" data-id="${conn.id}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `;
    if (active && tables.length) {
      html += `<div class="ml-2 pl-2 border-l border-gray-800/60 mt-0.5">`;
      html += `<div class="flex items-center px-2 py-1 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
        <i data-lucide="layers" class="w-3 h-3 mr-1"></i> Tables <span class="font-normal ml-1">(${tables.length})</span>
      </div>`;
      for (const t of tables) {
        html += `
          <div class="table-item flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-all ${currentTable === t.name ? 'text-blue-400 bg-blue-500/5' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'}" data-table="${t.name}">
            <i data-lucide="table" class="w-3 h-3 shrink-0"></i>
            <span class="truncate">${t.name}</span>
            <span class="ml-auto text-[9px] text-gray-600">${t.columns.length}</span>
          </div>
        `;
      }
      html += `</div>`;
    }
  }
  body.innerHTML = html;
  refreshIcons(body);

  delegate(body, '.conn-item', 'click', async (e, el) => {
    const id = el.dataset.id;
    const conn = connections.find(c => c.id === id);
    if (!conn) return;
    if (activeConnectionId === id) { await disconnectDatabase(); render(); return; }
    store.setKey('statusText', `Connecting to ${conn.name}...`);
    render();
    try { await connectToDatabase(conn); render(); }
    catch (err) { store.setKey('statusText', `Error: ${err.message}`); render(); }
  });

  delegate(body, '.btn-del-conn', 'click', (e, el) => {
    e.stopPropagation();
    if (confirm('Delete this connection?')) { actions.deleteConnection(el.dataset.id); render(); }
  });

  delegate(body, '.table-item', 'click', async (e, el) => {
    const name = el.dataset.table;
    if (currentTable !== name) { await browseTable(name); render(); }
  });

  if (!activeConnectionId) {
    body.innerHTML += `
      <div class="px-3 mt-2">
        <button id="btn-new-conn" class="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Connection
        </button>
      </div>
    `;
    qs('#btn-new-conn')?.addEventListener('click', showConnectModal);
    refreshIcons(body);
  }
}

// ── Tabs ───────────────────────────────────────
function renderTabs() {
  const bar = qs('#tab-bar');
  clear(bar);
  const { tabs, activeTabId } = store.get();
  if (!tabs.length) {
    bar.innerHTML = '<div class="flex items-center px-3 text-[11px] text-gray-600">No tabs</div>';
    return;
  }
  for (const tab of tabs) {
    const active = tab.id === activeTabId;
    const el = createElement('div', {
      className: `tab-item flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-gray-800/60 select-none whitespace-nowrap transition-all ${active ? 'text-blue-400 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`,
      dataset: { tabId: tab.id },
    });
    el.innerHTML = `<i data-lucide="${tab.type === 'editor' ? 'terminal' : 'table'}" class="w-3 h-3"></i>`;
    el.appendChild(createElement('span', { className: 'truncate max-w-[120px]' }, tab.name));
    const close = createElement('button', { className: 'flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-gray-700/60 transition-all ml-0.5', dataset: { tabClose: tab.id } });
    close.innerHTML = '<i data-lucide="x" class="w-2.5 h-2.5"></i>';
    el.appendChild(close);
    bar.appendChild(el);
  }
  refreshIcons(bar);

  delegate(bar, '.tab-item', 'click', (e, el) => {
    const id = parseInt(el.dataset.tabId);
    if (!isNaN(id)) {
      const tab = tabs.find(t => t.id === id);
      if (tab?.type === 'editor') {
        store.setKey('currentTable', null);
        store.setKey('currentTableData', null);
        store.setKey('currentTableInfo', null);
      }
      actions.setActiveTab(id);
      render();
    }
  });
  delegate(bar, '[data-tab-close]', 'click', (e, el) => {
    e.stopPropagation();
    const id = parseInt(el.dataset.tabClose);
    if (!isNaN(id)) { actions.closeTab(id); render(); }
  });
}

// ── Content ────────────────────────────────────
function renderContent() {
  const area = qs('#content-area');
  clear(area);
  const s = store.get();
  const { tabs, activeTabId } = s;

  if (s.currentTable && s.currentTableData) {
    renderTableView(area, s);
    return;
  }

  if (!tabs.length || !activeTabId) {
    area.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
        <i data-lucide="terminal" class="w-12 h-12 opacity-30"></i>
        <p class="text-sm">${s.activeConnectionId ? 'Open a table or write a query' : 'Connect to a database to get started'}</p>
        ${s.activeConnectionId ? '<button id="btn-new-query" class="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"><i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Query</button>' : ''}
      </div>
    `;
    qs('#btn-new-query')?.addEventListener('click', () => {
      store.setKey('currentTable', null);
      store.setKey('currentTableData', null);
      store.setKey('currentTableInfo', null);
      actions.addTab('editor');
      render();
    });
    refreshIcons(area);
    return;
  }

  const tab = tabs.find(t => t.id === activeTabId);
  if (tab?.type === 'editor') {
    renderEditor(area, tab, s);
  }
}

function renderEditor(area, tab) {
  const s = store.get();
  area.innerHTML = `
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0">
        <button id="btn-run" class="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors">
          <i data-lucide="play" class="w-3 h-3"></i> Run
        </button>
        <span class="text-[10px] text-gray-600">Ctrl+Enter</span>
        <span id="editor-status" class="text-xs ml-3 flex-1 text-gray-500"></span>
      </div>
      <div class="editor-wrapper relative" style="min-height:120px;flex:1">
        <div class="editor-gutter" id="editor-gutter">1</div>
        <pre class="editor-highlight" id="editor-highlight"></pre>
        <textarea class="editor-input" id="editor-input" spellcheck="false" autocomplete="off" placeholder="${s.activeConnectionId ? 'Enter SQL...' : 'Connect to a database first'}" ${!s.activeConnectionId ? 'disabled' : ''}>${tab.sql || ''}</textarea>
      </div>
    </div>
    <div id="results-panel" class="flex flex-col overflow-hidden border-t border-gray-800/60" style="min-height:100px;max-height:50%"></div>
  `;
  refreshIcons(area);

  const textarea = qs('#editor-input');
  const highlight = qs('#editor-highlight');
  const gutter = qs('#editor-gutter');
  const statusEl = qs('#editor-status');

  function updateEditor() {
    const sql = textarea.value;
    highlight.innerHTML = highlightSql(sql) + '\n'.repeat(Math.max(1, (sql.match(/\n/g) || '').length + 1));
    gutter.textContent = getLineNumbers(sql);
    actions.updateTabSQL(tab.id, sql);
  }

  textarea.addEventListener('input', updateEditor);
  textarea.addEventListener('scroll', () => { highlight.scrollTop = textarea.scrollTop; highlight.scrollLeft = textarea.scrollLeft; gutter.scrollTop = textarea.scrollTop; });
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); const s = textarea.selectionStart; textarea.value = textarea.value.substring(0, s) + '  ' + textarea.value.substring(textarea.selectionEnd); textarea.selectionStart = textarea.selectionEnd = s + 2; updateEditor(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runQuery(); }
  });
  updateEditor();
  setTimeout(() => textarea.focus(), 50);
  qs('#btn-run')?.addEventListener('click', runQuery);

  updateEditorStatus(s);

  const unsub = store.subscribe(() => {
    updateEditorStatus(store.get());
    renderResultsPanel(qs('#results-panel'));
  }, false);
}

function updateEditorStatus(s) {
  const el = qs('#editor-status');
  if (!el) return;
  if (s.queryRunning) el.innerHTML = '<i data-lucide="loader-circle" class="w-3 h-3 animate-spin inline-block mr-1"></i> Running...';
  else if (s.queryError) el.innerHTML = `<i data-lucide="alert-circle" class="w-3 h-3 inline-block mr-1"></i> ${s.queryError}`;
  else if (s.results) el.textContent = `${s.results.rows.length} rows in ${s.results.duration}ms`;
  else el.textContent = 'Ready';
  refreshIcons(el?.parentElement);
}

function renderResultsPanel(container) {
  if (!container) return;
  const s = store.get();

  if (s.queryRunning) {
    container.innerHTML = `<div class="flex items-center justify-center h-full gap-2 text-sm text-gray-500"><i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> Running...</div>`;
    refreshIcons(container);
    return;
  }
  if (s.queryError) {
    container.innerHTML = `<div class="flex items-start gap-2 p-4 text-sm text-red-400"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 shrink-0"></i> ${s.queryError}</div>`;
    refreshIcons(container);
    return;
  }
  if (!s.results?.columns?.length) {
    container.innerHTML = `<div class="flex flex-col items-center justify-center h-full gap-3 text-gray-600"><i data-lucide="arrow-up-right" class="w-8 h-8 opacity-30"></i><span class="text-xs">Run a query to see results</span></div>`;
    refreshIcons(container);
    return;
  }
  container.innerHTML = buildDataTable(s.results, true);
  refreshIcons(container);
}

async function runQuery() {
  const sql = qs('#editor-input')?.value?.trim();
  if (!sql || !store.get().activeConnectionId) return;
  try { await executeQuery(sql); } catch {}
}

// ── Table View ────────────────────────────────
function renderTableView(area, s) {
  const data = s.currentTableData;
  const info = s.currentTableInfo;
  const name = s.currentTable;

  if (!data) {
    area.innerHTML = `<div class="flex items-center justify-center h-full text-gray-600 text-sm">Loading...</div>`;
    return;
  }

  const colHtml = info?.columns?.map(c =>
    `<div class="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-gray-800/30 hover:bg-gray-800/20">
      <span class="w-28 font-medium text-gray-300">${c.name}</span>
      <span class="w-20 text-blue-400 font-mono">${c.type}</span>
      <span class="w-28 text-gray-500">${c.primaryKey ? '<span class="text-amber-400 font-medium">PK</span>' : ''}${c.notNull ? ' <span class="text-gray-600">NOT NULL</span>' : ''}</span>
      <span class="text-gray-600 truncate">${c.defaultValue != null ? `default: ${c.defaultValue}` : ''}</span>
    </div>`
  ).join('') || '';

  area.innerHTML = `
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0">
        <i data-lucide="table" class="w-4 h-4 text-blue-400"></i>
        <span class="text-sm font-medium text-gray-200">${name}</span>
        <span class="text-xs text-gray-500">${data.total || 0} rows</span>
        <button id="btn-query-table" class="ml-auto px-2 py-1 text-xs rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors">
          <i data-lucide="terminal" class="w-3 h-3 inline-block mr-1"></i> Query
        </button>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          ${buildDataTable(data, true)}
        </div>
        ${info ? `<div class="w-56 shrink-0 border-l border-gray-800/60 bg-gray-900/30 overflow-y-auto hidden md:block">
          <div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60">Columns</div>
          ${colHtml}
          ${info.indexes?.length ? `<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Indexes</div>
          ${info.indexes.map(i => `<div class="px-3 py-1 text-xs text-gray-400">${i.name} ${i.unique ? '(unique)' : ''}</div>`).join('')}` : ''}
          ${info.foreignKeys?.length ? `<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Foreign Keys</div>
          ${info.foreignKeys.map(f => `<div class="px-3 py-1 text-xs text-gray-400">${f.column} → ${f.refTable}(${f.refColumn})</div>`).join('')}` : ''}
        </div>` : ''}
      </div>
    </div>
  `;
  refreshIcons(area);

  qs('#btn-query-table')?.addEventListener('click', () => {
    actions.addTab('editor', {
      connectionId: store.get().activeConnectionId,
      name: `Query: ${name}`,
      sql: `SELECT * FROM "${name}" LIMIT 100`,
    });
    render();
  });
}

// ── Data Table ─────────────────────────────────
function buildDataTable(data, withToolbar) {
  const cols = data.columns || [];
  const rows = data.rows || [];
  let html = '';

  if (withToolbar) {
    html += `<div class="flex items-center gap-2 px-3 py-1 border-b border-gray-800/60 bg-gray-900/20 shrink-0 text-[11px]">
      <span class="text-gray-500">${rows.length} rows</span>
      <span class="text-gray-700">·</span>
      <span class="text-gray-500">${cols.length} cols</span>
      <button class="ml-auto px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportJSON(${rows.length})">
        <i data-lucide="download" class="w-3 h-3"></i> JSON
      </button>
      <button class="px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportCSV(${rows.length})">
        <i data-lucide="file-text" class="w-3 h-3"></i> CSV
      </button>
    </div>`;
  }

  html += `<div class="flex-1 overflow-auto"><table class="result-table">`;
  html += `<thead><tr>${cols.map(c => `<th>${c.name || c}</th>`).join('')}</tr></thead>`;
  html += `<tbody>`;
  for (const row of rows) {
    html += `<tr>${cols.map(c => {
      const v = row[c.name || c];
      if (v == null) return `<td><span class="text-gray-600 italic">NULL</span></td>`;
      if (typeof v === 'object') return `<td title="${String(v)}">${JSON.stringify(v)}</td>`;
      return `<td title="${String(v)}">${String(v)}</td>`;
    }).join('')}</tr>`;
  }
  html += `</tbody></table></div>`;
  return html;
}

window.exportJSON = function () {
  const st = store.get();
  const src = st.results || (st.currentTableData ? { columns: st.currentTableData.columns, rows: st.currentTableData.rows } : null);
  if (!src) return;
  const cols = src.columns.map(c => c.name || c);
  const data = src.rows.map(r => { const o = {}; cols.forEach(c => o[c] = r[c]); return o; });
  download(JSON.stringify(data, null, 2), 'results.json', 'application/json');
};

window.exportCSV = function () {
  const st = store.get();
  const src = st.results || (st.currentTableData ? { columns: st.currentTableData.columns, rows: st.currentTableData.rows } : null);
  if (!src) return;
  const cols = src.columns.map(c => c.name || c);
  const esc = v => { const sv = v == null ? '' : String(v); return sv.includes(',') || sv.includes('"') || sv.includes('\n') ? '"' + sv.replace(/"/g, '""') + '"' : sv; };
  const lines = [cols.map(esc).join(','), ...src.rows.map(r => cols.map(c => esc(r[c])).join(','))];
  download(lines.join('\n'), 'results.csv', 'text/csv');
};

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── Footer ─────────────────────────────────────
function renderFooter() {
  const el = qs('#footer');
  const s = store.get();
  el.innerHTML = `
    <div class="flex items-center gap-3 px-3 py-[3px] text-[11px] text-gray-500">
      <button id="btn-new-tab" class="flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer py-[1px]">
        <i data-lucide="plus" class="w-2.5 h-2.5"></i> New Tab
      </button>
      <span class="w-px h-3 bg-gray-800"></span>
      <button id="btn-theme" class="flex items-center justify-center hover:text-gray-300 transition-colors cursor-pointer py-[1px]">
        <i data-lucide="${s.theme === 'dark' ? 'moon' : 'sun'}" class="w-2.5 h-2.5"></i>
      </button>
      <a href="https://github.com/anomalyco/zrow" target="_blank" class="flex items-center justify-center hover:text-gray-300 transition-colors py-[1px]">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>
      <span class="flex-1"></span>
      <span>${s.activeConnectionId ? `${(s.tables || []).length} tables` : ''}</span>
    </div>
  `;
  qs('#btn-new-tab')?.addEventListener('click', () => { actions.addTab('editor'); render(); });
  qs('#btn-theme')?.addEventListener('click', actions.toggleTheme);
  refreshIcons(el);
}

// ── Connect Modal ──────────────────────────────
function showConnectModal(editing) {
  const overlay = qs('#modal-overlay');
  overlay.classList.remove('hidden');
  const content = qs('#modal-content');
  clear(content);

  const isPersist = editing?.database && editing.database !== ':memory:';
  content.innerHTML = `
    <form id="conn-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200">${editing ? 'Edit' : 'New'} Database</h2>
        <button type="button" id="modal-close" class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="px-5 py-4 space-y-4">
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Name</label>
          <input class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" id="conn-name" value="${editing?.name || ''}" placeholder="My Database" autofocus>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Storage</label>
          <div class="flex gap-3">
            <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer hover:border-gray-600 transition-colors flex-1">
              <input type="radio" name="conn-storage" value="memory" ${!isPersist ? 'checked' : ''}>
              <i data-lucide="cpu" class="w-4 h-4 text-gray-400"></i>
              <span class="text-xs text-gray-300">In-Memory</span>
            </label>
            <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer hover:border-gray-600 transition-colors flex-1">
              <input type="radio" name="conn-storage" value="persist" ${isPersist ? 'checked' : ''}>
              <i data-lucide="hard-drive" class="w-4 h-4 text-gray-400"></i>
              <span class="text-xs text-gray-300">Persistent</span>
            </label>
          </div>
        </div>
        <div id="db-name-group" class="${isPersist ? '' : 'hidden'}">
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Database Name</label>
          <input class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" id="conn-db" value="${isPersist ? editing.database : 'my_database'}" placeholder="my_database">
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Auto-seed demo data</label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="conn-seed" ${(!editing || editing.seed !== false) ? 'checked' : ''}>
            <span class="text-xs text-gray-400">Pre-populate with sample tables and data</span>
          </label>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">${editing ? 'Save' : 'Create'}</button>
      </div>
    </form>
  `;
  refreshIcons(content);

  qs('#modal-close').addEventListener('click', hideModal);
  qs('#modal-cancel').addEventListener('click', hideModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hideModal(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { hideModal(); document.removeEventListener('keydown', esc); } });

  qsa('input[name="conn-storage"]').forEach(r => {
    r.addEventListener('change', () => {
      qs('#db-name-group').classList.toggle('hidden', qs('input[name="conn-storage"]:checked')?.value === 'memory');
    });
  });

  qs('#conn-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = qs('#conn-name').value.trim();
    if (!name) return;
    const storage = qs('input[name="conn-storage"]:checked')?.value;
    const dbName = qs('#conn-db')?.value?.trim() || name;
    const database = storage === 'persist' ? dbName : ':memory:';
    const seed = qs('#conn-seed')?.checked !== false;
    const id = actions.addConnection({ ...(editing || {}), name, database, seed });
    hideModal();
    store.setKey('statusText', `Connecting to ${name}...`);
    render();
    try {
      const conn = store.get().connections.find(c => c.id === id);
      if (conn) await connectToDatabase(conn);
      render();
    } catch (err) {
      store.setKey('statusText', `Error: ${err.message}`);
      render();
    }
  });

  setTimeout(() => qs('#conn-name')?.focus(), 100);
}

function hideModal() {
  qs('#modal-overlay').classList.add('hidden');
}
