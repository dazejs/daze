import { MemoryCacheStore, CacheStore, RedisCacheStore, FsCacheStore } from './store';
import { config } from '../../helpers';
import { fakeBaseClass } from '../../utils/fake-base-class';

type StoreType = 'redis' | 'memory'

/**
 * 缓存模块
 */
export class Cache extends fakeBaseClass<CacheStore>() {
  /**
     * 缓存驱动管理
     */
  private stores: Map<string, CacheStore> = new Map();

  /**
     * 默认驱动
     */
  private defaultStore?: string;

  /**
     * 默认连接
     */
  private defaultConnection?: string;

  constructor() {
    super();
    return new Proxy(this, this.proxy);
  }
  /**
     * 代理器
     */
  get proxy(): ProxyHandler<this> {
    return {
      get(target: Cache, p: string | number | symbol, receiver: any) {
        if (typeof p === 'string') {
          if (Reflect.has(target, p)) {
            return Reflect.get(target, p, receiver);
          }
          return target.store()[p as keyof CacheStore];
        }
        return Reflect.get(target, p, receiver);
      }
    };
  }

  /**
     * 获取存储
     * @param store 
     * @param connection 
     * @returns 
     */
  public store(store?: StoreType, connection?:string): CacheStore {
    const _store = store ?? this.getDefaultStore();
    switch (_store) {
      case 'redis':
        return this.createRedisStore(connection);
      case 'fs':
        return this.createFsStore();
      default:
        return this.createMemoryStore();
    }
  }
    
  /**
     * 获取默认的存储器
     * @returns 
     */
  private getDefaultStore() {
    if (!this.defaultStore) {
      this.defaultStore = config('cache.store', 'memory');
    }
    return this.defaultStore as string;
  }

  /**
     * 获取默认的 redis 连接
     * @returns 
     */
  private getDefaultRedisConnection() {
    if (!this.defaultConnection) {
      if (config().has('redis.cache')) {
        this.defaultConnection = 'cache';
      } else {
        this.defaultConnection = 'default';
      }
    }
    return this.defaultConnection;
  }

  /**
     * 创建内存存储器
     * @returns 
     */
  private createMemoryStore() {
    const key = `memory`;
    if (!this.stores.has(key)) {
      const store = new MemoryCacheStore();
      this.stores.set(key, store);
    }
    return this.stores.get(key) as CacheStore;
  }

  /**
     * 创建内存存储器
     * @returns 
     */
  private createFsStore() {
    const key = `fs`;
    if (!this.stores.has(key)) {
      const store = new FsCacheStore();
      this.stores.set(key, store);
    }
    return this.stores.get(key) as CacheStore;
  }

  /**
     * 创建 Redis 存储器
     * @param connection 
     * @returns 
     */
  private createRedisStore(connection?: string) {
    const _connection = connection ?? this.getDefaultRedisConnection();
    const key = `redis.${_connection}`;
    if (!this.stores.has(key)) {
      const store = new RedisCacheStore(_connection);
      this.stores.set(key, store);
    }
    return this.stores.get(key) as CacheStore;
  }
}
