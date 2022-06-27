import { CacheStore, StorageItemInterface } from './store';

/**
 * 使用内存存储缓存数据
 */
export class MemoryCacheStore extends CacheStore {
    
  /**
     * 内存 Map
     */
  private storage: Map<string, StorageItemInterface> = new Map();

  constructor() {
    super();
  }
    
  /**
     * 获取缓存
     * @param key 
     * @returns 
     */
  async get(key: string) {
    if (!this.storage.has(key)) return;
    const item = this.storage.get(key) as StorageItemInterface;
    const expiresAt = item.expiresAt ?? 0;
    // 发现已经过期了，则删除
    if (expiresAt !== 0 && Date.now() > expiresAt) {
      this.remove(key);
      return;
    }
    return item.value;
  }

  /**
     * 设置缓存
     * @param key 
     * @param value 
     * @param seconds 
     * @returns 
     */
  async set(key: string, value: any, seconds?: number) {
    const item: StorageItemInterface = {
      value,
      expiresAt: seconds ? Date.now() + seconds * 1000 : 0
    };
    this.storage.set(key, item);
    return true;
  }

  async add(key: string, value: any, seconds: number) {
    if (await this.get(key)) return false;
    return this.set(key, value, seconds);
  }

  /**
     * 缓存数据增长
     * @param key 
     * @param value 
     * @returns 
     */
  async increment(key: string, value = 1) {
    const existing = await this.get(key);
    // 存在正常数据
    if (existing !== undefined && existing !== null) {
      value = existing + 1;
      const item = this.storage.get(key) as StorageItemInterface;
      item.value = value;
      this.storage.set(key, item);
    }
    await this.forever(key, value);
    return value; 
  }

  /**
     * 缓存诗句减少
     * @param key 
     * @param value 
     * @returns 
     */
  async decrement(key: string, value = 1) {
    return this.increment(key, value * -1);
  }

  /**
     * 设置一个不会过期的缓存
     * @param key 
     * @param value 
     * @returns 
     */
  async forever(key: string, value: any) {
    return this.set(key, value, 0);
  }

  /**
     * 删除一个缓存
     * @param key 
     * @returns 
     */
  async remove(key: string) {
    if (this.storage.has(key)) {
      this.storage.delete(key);
      return true;
    }
    return false;
  }

  /**
     * 清空所有缓存
     * @returns 
     */
  async flush() {
    this.storage = new Map();
    return true;
  }
}