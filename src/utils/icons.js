const BASE = 'inline-block shrink-0';

export function icon(name, size = 'w-3.5 h-3.5', cls = '') {
  return `<i data-lucide="${name}" class="${BASE} ${size} ${cls}"></i>`;
}

export const I = {
  bee: () => icon('box', 'w-5 h-5', 'text-blue-400'),
  plus: () => icon('plus'),
  close: () => icon('x', 'w-3 h-3'),
  play: () => icon('play'),
  stop: () => icon('square'),
  moon: () => icon('moon'),
  sun: () => icon('sun'),
  database: () => icon('database', 'w-4 h-4'),
  table: () => icon('table', 'w-4 h-4'),
  folder: () => icon('folder', 'w-4 h-4'),
  chevronRight: () => icon('chevron-right', 'w-3 h-3'),
  chevronDown: () => icon('chevron-down', 'w-3 h-3'),
  edit: () => icon('pen', 'w-3.5 h-3.5'),
  trash: () => icon('trash-2', 'w-3.5 h-3.5'),
  copy: () => icon('copy'),
  search: () => icon('search'),
  download: () => icon('download'),
  alert: () => icon('alert-circle', 'w-4 h-4'),
  spinner: () => '<i data-lucide="loader-circle" class="inline-block w-4 h-4 animate-spin"></i>',
  refresh: () => icon('refresh-cw'),
  terminal: () => icon('terminal', 'w-3.5 h-3.5'),
  connect: () => icon('plug', 'w-4 h-4'),
  disconnect: () => icon('plug-zap', 'w-4 h-4'),
  github: () => `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  history: () => icon('history'),
  filter: () => icon('filter'),
  fileText: () => icon('file-text', 'w-3.5 h-3.5'),
  settings: () => icon('settings'),
  box: () => icon('box'),
  zap: () => icon('zap'),
};

export function refreshIcons(root) {
  if (window.lucide) {
    if (root) lucide.createIcons({ root });
    else lucide.createIcons();
  }
}
