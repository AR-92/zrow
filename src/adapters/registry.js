const adapters = new Map();

export function registerAdapter(type, adapterClass) {
  adapters.set(type, adapterClass);
}

export function getAdapterForType(type) {
  return adapters.get(type) || null;
}

export function getAdapterTypes() {
  return Array.from(adapters.keys());
}

export function getAdapterInfo(type) {
  const a = adapters.get(type);
  return a ? a.info : null;
}

export function getAllAdapterInfos() {
  return Array.from(adapters.entries()).map(([type, cls]) => ({
    type,
    ...cls.info,
  }));
}

export async function connectAdapter(adapterClass, config) {
  const instance = new adapterClass();
  await instance.connect(config);
  return instance;
}
