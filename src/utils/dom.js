export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') el.className = val;
    else if (key === 'style' && typeof val === 'object') Object.assign(el.style, val);
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'dataset' && typeof val === 'object') Object.assign(el.dataset, val);
    else if (key === 'html') el.innerHTML = val;
    else if (key === 'text') el.textContent = val;
    else el.setAttribute(key, val);
  }
  for (const child of children) {
    if (child == null) continue;
    if (typeof child === 'string' || typeof child === 'number') el.appendChild(document.createTextNode(child));
    else if (child instanceof Node) el.appendChild(child);
  }
  return el;
}

export function qs(selector, parent = document) { return parent.querySelector(selector); }
export function qsa(selector, parent = document) { return parent.querySelectorAll(selector); }

export function on(el, event, handler, opts = {}) {
  if (typeof el === 'string') el = qs(el);
  if (!el) return () => {};
  el.addEventListener(event, handler, opts);
  return () => el.removeEventListener(event, handler, opts);
}

export function delegate(parent, selector, event, handler) {
  const wrapper = (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) handler(e, target);
  };
  parent.addEventListener(event, wrapper);
  return () => parent.removeEventListener(event, wrapper);
}

export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
export function show(el) { if (typeof el === 'string') el = qs(el); if (el) el.classList.remove('hidden'); }
export function hide(el) { if (typeof el === 'string') el = qs(el); if (el) el.classList.add('hidden'); }
export function setText(el, text) { if (typeof el === 'string') el = qs(el); if (el) el.textContent = text; }

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function debounce(fn, ms = 200) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

export function refreshIcons(root) {
  if (window.lucide) {
    if (root) lucide.createIcons({ root });
    else lucide.createIcons();
  }
}
