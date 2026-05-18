import { store, actions, connectToDatabase, disconnectDatabase, getActiveConnection } from '../store.js';
import { createElement, clear, delegate, qs, refreshIcons } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { SAMPLE_QUERIES } from '../seed.js';
import { runQuery } from './editor.js';

export function initSidebar() {
  const list = qs('#connection-list');
  qs('#btn-new-connection').addEventListener('click', () => actions.openConnectionModal());

  delegate(list, '.conn-item', 'click', async (e, el) => {
    const id = el.dataset.id;
    const conn = store.get().connections.find(c => c.id === id);
    if (!conn) return;
    if (getActiveConnection()?.id === id) {
      await disconnectDatabase(id);
      renderConnections(); return;
    }
    try {
      qs('#status-text').textContent = `Connecting to ${conn.name}...`;
      qs('#status-icon').className = 'w-1.5 h-1.5 rounded-full inline-block bg-yellow-500';
      await connectToDatabase(conn);
      renderConnections();
    } catch (err) {
      qs('#status-text').textContent = `Error: ${err.message}`;
      qs('#status-icon').className = 'w-1.5 h-1.5 rounded-full inline-block bg-red-500';
    }
  });

  delegate(list, '.btn-edit-conn', 'click', (e, el) => {
    e.stopPropagation();
    const id = el.closest('[data-id]').dataset.id;
    const conn = store.get().connections.find(c => c.id === id);
    if (conn) actions.openConnectionModal(conn);
  });

  delegate(list, '.btn-del-conn', 'click', (e, el) => {
    e.stopPropagation();
    const id = el.closest('[data-id]').dataset.id;
    if (confirm('Delete this connection?')) actions.deleteConnection(id);
  });

  delegate(list, '.btn-run-sample', 'click', (e, el) => {
    const sql = el.dataset.sql;
    if (sql) runQuery(sql);
  });

  let sidebarTimer = null;
  store.subscribe(() => {
    if (sidebarTimer) return;
    sidebarTimer = requestAnimationFrame(() => {
      sidebarTimer = null;
      const s = store.get();
      renderConnections();
      qs('#status-text').textContent = s.statusText;
      qs('#status-icon').className = `w-1.5 h-1.5 rounded-full inline-block ${s.queryRunning ? 'bg-yellow-500' : s.activeConnectionId ? 'bg-green-500' : 'bg-gray-600'}`;
    });
  });
  renderConnections();
}

function renderConnections() {
  const list = qs('#connection-list');
  const { connections, activeConnectionId, tables } = store.get();
  clear(list);

  const isConnected = !!activeConnectionId;

  if (!connections.length && !isConnected) {
    const e = createElement('div', { className: 'flex flex-col items-center gap-3 py-6 text-gray-600' });
    e.innerHTML = icon('database', 'w-6 h-6', 'opacity-30');

    const demoBtn = createElement('button', {
      className: 'px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-all flex items-center gap-1.5',
      onClick: createDemoDB,
    });
    demoBtn.innerHTML = icon('database') + ' Launch Demo DB';
    e.appendChild(demoBtn);

    e.appendChild(createElement('span', { className: 'text-[11px] text-gray-600' }, 'or'));
    e.appendChild(createElement('button', { className: 'text-xs text-blue-400 hover:text-blue-300 underline', onClick: () => actions.openConnectionModal() }, 'Create custom connection'));
    list.appendChild(e);
    refreshIcons(list);
    return;
  }

  for (const conn of connections) {
    const isActive = conn.id === activeConnectionId;
    const item = createElement('div', { className: `conn-item flex items-center gap-2 px-3 py-1.5 mx-1 rounded cursor-pointer text-xs transition-all ${isActive ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'}`, dataset: { id: conn.id } });
    item.innerHTML = isActive ? icon('plug', 'w-3.5 h-3.5', 'text-blue-400') : icon('database', 'w-3.5 h-3.5');
    const label = createElement('div', { className: 'flex-1 min-w-0' });
    label.appendChild(createElement('div', { className: 'truncate' }, conn.name));
    label.appendChild(createElement('div', { className: 'text-[10px] text-gray-600' }, conn.type));
    item.appendChild(label);
    const actionsDiv = createElement('div', { className: 'flex gap-0.5 shrink-0', style: { opacity: 0 } });
    actionsDiv.innerHTML = icon('pen', 'w-3 h-3');
    actionsDiv.lastElementChild?.classList.add('btn-edit-conn', 'cursor-pointer', 'hover:text-gray-300');
    actionsDiv.innerHTML += icon('trash-2', 'w-3 h-3');
    actionsDiv.lastElementChild?.classList.add('btn-del-conn', 'cursor-pointer', 'hover:text-red-400');
    item.appendChild(actionsDiv);
    item.addEventListener('mouseenter', () => actionsDiv.style.opacity = '1');
    item.addEventListener('mouseleave', () => actionsDiv.style.opacity = '0');
    list.appendChild(item);

    if (isActive && tables.length) {
      const sub = createElement('div', { className: 'ml-3 mt-0.5 mb-1' });

      const tblHeader = createElement('div', { className: 'flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-600 uppercase tracking-wider' });
      tblHeader.appendChild(createElement('span', { className: 'flex-1' }, 'Tables'));
      tblHeader.appendChild(createElement('span', { className: 'text-gray-700' }, `(${tables.length})`));
      sub.appendChild(tblHeader);

      for (const t of tables) {
        const tItem = createElement('div', { className: 'flex items-center gap-1.5 py-0.5 px-2 rounded text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/40 cursor-pointer', dataset: { tableName: t.name }, onClick: () => { actions.addTab('editor', { name: `Browse: ${t.name}`, connectionId: conn.id, sql: `SELECT * FROM "${t.name}" LIMIT 100` }); setTimeout(() => document.querySelector('.editor-input')?.focus(), 50); } });
        tItem.innerHTML = icon('table', 'w-3 h-3');
        tItem.appendChild(document.createTextNode(t.name));
        if (t.columns?.length) {
          tItem.appendChild(createElement('span', { className: 'text-[10px] text-gray-700 ml-auto' }, `${t.columns.length} cols`));
        }
        sub.appendChild(tItem);
      }

      if (conn.isDemo) {
        sub.appendChild(createElement('div', { className: 'h-px bg-gray-800/60 my-1.5 mx-2' }));
        const qHeader = createElement('div', { className: 'flex items-center gap-1 px-2 py-0.5 text-[10px] text-gray-600 uppercase tracking-wider' });
        qHeader.textContent = 'Sample Queries';
        sub.appendChild(qHeader);

        for (const [name, sql] of Object.entries(SAMPLE_QUERIES)) {
          const qItem = createElement('div', { className: 'btn-run-sample flex items-center gap-1.5 py-0.5 px-2 rounded text-xs text-gray-500 hover:text-blue-400 hover:bg-blue-500/5 cursor-pointer', dataset: { sql } });
          qItem.innerHTML = icon('play', 'w-2.5 h-2.5');
          qItem.appendChild(document.createTextNode(name));
          sub.appendChild(qItem);
        }
      }

      list.appendChild(sub);
    }
  }

  if (!connections.length && isConnected) {
    const demoBtn = createElement('button', {
      className: 'flex items-center gap-1.5 px-3 py-1.5 mx-2 rounded-md bg-blue-600/20 text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-all',
      onClick: createDemoDB,
    });
    demoBtn.innerHTML = icon('database') + ' Launch Demo DB';
    list.appendChild(demoBtn);
  }

  refreshIcons(list);
}

async function createDemoDB() {
  const existing = store.get().connections.find(c => c.isDemo);
  if (existing) {
    try {
      await connectToDatabase(existing);
    } catch (e) {
      qs('#status-text').textContent = `Error: ${e.message}`;
    }
    return;
  }

  const demoConn = {
    name: 'Zrow Demo Database',
    type: 'sqljs',
    database: 'zrow_demo',
    isDemo: true,
    description: 'Pre-populated with users, products, orders, and more',
    seed: true,
  };

  const id = actions.addConnection(demoConn);
  try {
    await connectToDatabase({ ...demoConn, id });
    const tabId = actions.addTab('editor', { connectionId: id, name: 'Sample Query', sql: SAMPLE_QUERIES['Orders with user & item count'] });
    setTimeout(() => document.querySelector('.editor-input')?.focus(), 100);
  } catch (e) {
    qs('#status-text').textContent = `Error: ${e.message}`;
  }
}
