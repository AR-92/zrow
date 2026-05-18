import { store, actions } from '../store.js';
import { createElement, clear, qs, delegate, refreshIcons } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

export function initTabs() {
  const tabBar = qs('#tab-bar');
  store.subscribe(() => {
    const { tabs, activeTabId } = store.get();
    clear(tabBar);
    if (!tabs.length) {
      tabBar.appendChild(createElement('div', { className: 'flex items-center px-3 text-[11px] text-gray-600' }, 'No tabs'));
      return;
    }
    for (const tab of tabs) {
      const isActive = tab.id === activeTabId;
      const el = createElement('div', { className: `tab-item flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-gray-800/60 select-none whitespace-nowrap transition-all ${isActive ? 'text-blue-400 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`, dataset: { tabId: tab.id } });
      el.innerHTML = tab.type === 'editor' ? icon('terminal', 'w-3 h-3') : icon('table', 'w-3 h-3');
      el.appendChild(createElement('span', { className: 'truncate max-w-[120px]' }, tab.name));
      const close = createElement('button', { className: 'tab-close flex items-center justify-center w-3.5 h-3.5 rounded opacity-0 hover:opacity-100 hover:bg-gray-700/60 transition-all ml-0.5', dataset: { tabClose: tab.id } });
      close.innerHTML = icon('x', 'w-2.5 h-2.5');
      el.appendChild(close);
      tabBar.appendChild(el);
    }
    refreshIcons(tabBar);
  }, false);

  delegate(tabBar, '.tab-item', 'click', (e, el) => {
    const id = parseInt(el.dataset.tabId);
    if (!isNaN(id)) actions.setActiveTab(id);
  });
  delegate(tabBar, '[data-tab-close]', 'click', (e, el) => {
    e.stopPropagation();
    const id = parseInt(el.dataset.tabClose);
    if (!isNaN(id)) actions.closeTab(id);
  });
}
