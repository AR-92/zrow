import { store, actions, connectToDatabase } from '../store.js';
import { createElement, clear, qs, show, hide, refreshIcons } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { getAllAdapterInfos } from '../adapters/registry.js';
import { SAMPLE_QUERIES } from '../seed.js';

export function initConnectionModal() {
  const overlay = qs('#modal-overlay');
  let rendering = false;
  store.select(
    s => s.connectionModalOpen,
    (open) => {
      if (rendering) return;
      rendering = true;
      if (open) {
        show(overlay);
        render(store.get().editingConnection);
      } else {
        hide(overlay);
      }
      setTimeout(() => { rendering = false; }, 50);
    }
  );
  overlay.addEventListener('click', (e) => { if (e.target === overlay) actions.closeConnectionModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && store.get().connectionModalOpen) actions.closeConnectionModal(); });
}

function render(editing) {
  const container = qs('#modal-content');
  clear(container);

  const form = document.createElement('form');
  form.className = 'fade-in';
  form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });

  const header = createElement('div', { className: 'flex items-center justify-between px-5 py-3 border-b border-gray-800' });
  header.appendChild(createElement('h2', { className: 'text-sm font-semibold text-gray-200' }, editing ? 'Edit Connection' : 'New Connection'));
  const cb = createElement('button', { type: 'button', className: 'w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all', onClick: () => actions.closeConnectionModal() });
  cb.innerHTML = icon('x', 'w-4 h-4');
  header.appendChild(cb);
  form.appendChild(header);

  const fields = createElement('div', { className: 'px-5 py-4 space-y-4' });
  fields.appendChild(field('Connection Name', 'conn-name', editing?.name || '', 'My DB'));
  fields.appendChild(adapterSelect(editing?.type));
  fields.appendChild(field('Database Name', 'conn-db', editing?.database || '', ':memory: for in-memory'));

  const desc = field('Description', 'conn-desc', editing?.description || '', 'optional');
  fields.appendChild(desc);

  const wasmGroup = createElement('div', { id: 'wasm-group', className: `${editing?.type !== 'sqljs' ? 'hidden' : ''}` });
  wasmGroup.appendChild(createElement('label', { className: 'block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1' }, 'WASM Path (optional)'));
  wasmGroup.appendChild(createElement('input', { className: 'modal-input w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors', id: 'conn-wasm', value: editing?.wasmPath || '', placeholder: 'Custom WASM URL' }));
  fields.appendChild(wasmGroup);
  form.appendChild(fields);

  const footer = createElement('div', { className: 'flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50' });
  footer.appendChild(createElement('button', { type: 'button', className: 'text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all', onClick: () => actions.closeConnectionModal() }, 'Cancel'));
  const demoBtn = createElement('button', {
    type: 'button',
    className: 'text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all flex items-center gap-1.5',
    onClick: async () => {
      actions.closeConnectionModal();
      const existing = store.get().connections.find(c => c.isDemo);
      if (existing) {
        try { await connectToDatabase(existing); } catch {}
        return;
      }
      const demoConn = { name: 'Zrow Demo Database', type: 'sqljs', database: 'zrow_demo', isDemo: true, seed: true };
      const id = actions.addConnection(demoConn);
      try {
        await connectToDatabase({ ...demoConn, id });
        actions.addTab('editor', { connectionId: id, name: 'Sample Query', sql: SAMPLE_QUERIES['Orders with user & item count'] });
      } catch {}
    },
  });
  demoBtn.innerHTML = icon('database') + ' Launch Demo DB';
  footer.appendChild(demoBtn);
  footer.appendChild(createElement('button', { type: 'submit', className: 'text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all' }, editing ? 'Save' : 'Create'));
  form.appendChild(footer);
  container.appendChild(form);

  qs('#conn-type').addEventListener('change', () => {
    const g = qs('#wasm-group');
    if (g) g.classList.toggle('hidden', qs('#conn-type').value !== 'sqljs');
  });

  setTimeout(() => qs('#conn-name')?.focus(), 100);
  refreshIcons(container);
}

function field(label, id, value, placeholder) {
  const g = document.createElement('div');
  g.appendChild(createElement('label', { className: 'block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1', htmlFor: id }, label));
  g.appendChild(createElement('input', { className: 'w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors', id, value, placeholder }));
  return g;
}

function adapterSelect(selected) {
  const g = document.createElement('div');
  g.appendChild(createElement('label', { className: 'block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1' }, 'Database Type'));
  const sel = document.createElement('select');
  sel.className = 'w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors appearance-none cursor-pointer';
  sel.id = 'conn-type';
  for (const a of getAllAdapterInfos()) {
    const o = document.createElement('option');
    o.value = a.slug; o.textContent = a.name;
    if (selected === a.slug) o.selected = true;
    sel.appendChild(o);
  }
  g.appendChild(sel);
  return g;
}

function submit() {
  const { editingConnection } = store.get();
  const name = qs('#conn-name').value.trim();
  const type = qs('#conn-type').value;
  const database = qs('#conn-db').value.trim();
  const description = qs('#conn-desc').value.trim();
  const wasmPath = qs('#conn-wasm')?.value.trim() || '';
  if (!name) return;
  actions.addConnection({ ...(editingConnection || {}), name, type, database: database || ':memory:', description, ...(type === 'sqljs' && wasmPath ? { wasmPath } : {}) });
  actions.closeConnectionModal();
}
