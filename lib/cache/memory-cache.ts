type CacheItem<T> = { value: T; expiresAt: number };
const cache = new Map<string, CacheItem<unknown>>();

export async function getOrSetCache<T>(key: string, ttlMs: number, factory: () => Promise<T>): Promise<T> {
  const item = cache.get(key) as CacheItem<T> | undefined;
  
  if (item && item.expiresAt > Date.now()) {
    return item.value;
  }

  const value = await factory();

  // لو البيانات جاية عبارة عن مصفوفة فاضية، بلاش نكشها عشان نسيب فرصة يقرأ من الإكسيل تاني
  const isEmptyArray = Array.isArray(value) && value.length === 0;

  if (value !== null && value !== undefined && !isEmptyArray) {
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  return value;
}

export function clearCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}