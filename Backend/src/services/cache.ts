export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem<any>> = new Map();
  private TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {}

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  public clear(): void {
    this.cache.clear();
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }
}

export default Cache.getInstance(); 