import { store } from '../store.js';
import { createElement, clear, qs, refreshIcons } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

export function initResults() {
  const container = qs('#results-container');
  const handle = qs('#resize-handle');
  let resizing = false, startY, startH;
  handle.addEventListener('mousedown', (e) => {
    resizing = true; startY = e.clientY; startH = container.offsetHeight;
    document.body.style.cursor = 's-resize'; document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    const d = startY - e.clientY;
    const newH = startH - d;
    if (newH > 60 && newH < window.innerHeight * 0.7) {
      container.style.flex = 'none'; container.style.height = newH + 'px';
    }
  });
  document.addEventListener('mouseup', () => { if (resizing) { resizing = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; } });

  store.subscribe(render, false);
}

function render() {
  const container = qs('#results-container');
  const { results, queryRunning, queryError } = store.get();
  clear(container);

  if (queryRunning) {
    container.appendChild(createElement('div', { className: 'flex items-center justify-center h-full gap-2 text-sm text-gray-500' }, createElement('span', { html: icon('loader-circle', 'w-4 h-4', 'animate-spin') }), 'Running...'));
    refreshIcons(container); return;
  }

  if (queryError) {
    container.appendChild(createElement('div', { className: 'flex items-start gap-2 p-4 text-sm text-red-400' }, createElement('span', { className: 'mt-0.5 shrink-0', html: icon('alert-circle', 'w-4 h-4') }), queryError));
    refreshIcons(container); return;
  }

  if (!results?.columns?.length) {
    container.appendChild(createElement('div', { className: 'empty-state text-sm' }, createElement('span', { html: icon('terminal', 'w-8 h-8', 'opacity-30') }), 'Run a query to see results'));
    refreshIcons(container); return;
  }

  const wrapper = createElement('div', { className: 'flex flex-col h-full overflow-hidden fade-in' });
  const bar = createElement('div', { className: 'flex items-center gap-2 px-3 py-1 border-b border-gray-800/60 bg-gray-900/20 shrink-0 text-[11px]' });
  bar.append(
    createElement('span', { className: 'text-gray-500' }, `${results.rows.length} rows`),
    createElement('span', { className: 'text-gray-700' }, '·'),
    createElement('span', { className: 'text-gray-500' }, `${results.columns.length} cols`),
    createElement('span', { className: 'text-gray-700' }, '·'),
    createElement('span', { className: 'text-gray-500' }, `${results.duration}ms`),
  );
  const expBtn = createElement('button', { className: 'ml-auto px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1', onClick: () => exportResults(results) });
  expBtn.innerHTML = icon('download') + ' Export';
  bar.appendChild(expBtn);
  wrapper.appendChild(bar);

  const scroll = createElement('div', { className: 'flex-1 overflow-auto' });
  const table = createElement('table', { className: 'result-table' });
  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  for (const c of results.columns) hr.appendChild(createElement('th', {}, c.name || c));
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of results.rows) {
    const tr = document.createElement('tr');
    for (const c of results.columns) {
      const cn = c.name || c;
      const v = row[cn];
      const td = createElement('td', { title: v != null ? String(v) : 'NULL' });
      if (v == null) td.appendChild(createElement('span', { className: 'text-gray-600 italic' }, 'NULL'));
      else if (typeof v === 'object') td.textContent = JSON.stringify(v);
      else td.textContent = String(v);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  scroll.appendChild(table);
  wrapper.appendChild(scroll);
  container.appendChild(wrapper);
}

function exportResults(results) {
  const data = results.rows.map(r => { const o = {}; results.columns.forEach(c => o[c.name || c] = r[c.name || c]); return o; });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'results.json';
  a.click();
  URL.revokeObjectURL(blob);
}
