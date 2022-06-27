

export interface StorageItemInterface {
  value: any;
  expiresAt: number;
}

/**
 * 缓存的抽象方法
 */
export abstract class CacheStore {
  /**
     * 获取单个缓存
     * @param key 
     */
  abstract get(key: string): Promise<any>;

  /**
     * 获取多个缓存
     * @param keys 
     */
  // abstract many(...keys: string[]): Promise<any[]>;
  /**
     * 设置一个缓存
     * @param key 
     * @param value 
     * @param seconds 
     */
  abstract set(key: string, value: any, seconds?: number): Promise<boolean>;
  abstract add(key: string, value: any, seconds: number): Promise<boolean>;

  /**
     * 设置多个缓存
     * @param data 
     */
  // abstract setMany(data: Record<string, any>): Promise<boolean>;
  /**
     * 使缓存的值增加
     * @param key 
     * @param value 
     */
  abstract increment(key: string, value: number): Promise<number | boolean>;

  /**
     * 使缓存的值减少
     * @param key 
     * @param value 
     */
  abstract decrement(key: string, value: number): Promise<number | boolean>;

  /**
     * 设置一个不会过期的缓存
     * @param key 
     * @param value 
     */
  abstract forever(key: string, value: any): Promise<boolean>;

  /**
     * 删除一个缓存
     * @param key 
     */
  abstract remove(key: string): Promise<boolean>;
    
  /**
     * 删除所有缓存
     */
  abstract flush(): Promise<boolean>;
}