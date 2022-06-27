import { CacheStore } from './store';
import { redis } from '../../helpers';
import { RedisClient } from '../../redis';

/**
 * 使用 Redis 存储缓存数据
 */
export class RedisCacheStore extends CacheStore {
  /**
     * Redis 客户端
     */
  private redis: RedisClient;

  /**
     * 构造函数
     * @param connection 
     */
  constructor(connection = 'default') {
    super();
    this.redis = redis(connection);
  }
    
  /**
     * 获取缓存
     * @param key 
     * @returns 
     */
  async get(key: string, defaultVal?: any) {
    const value = await this.redis.get(key);
    if (value) {
      return value;
    }
    return defaultVal;
  }

  /**
     * 设置缓存
     * @param key 
     * @param value 
     * @param seconds 
     * @returns 
     */
  async set(key: string, value: string | Buffer | number, seconds: number) {
    await this.redis.setex(key, Math.max(seconds, 1), value);
    return true;
  }

  /**
     * 当缓存不存在的时候写入
     * 使用 lua 脚本保证原子性
     * @param key 
     * @param value 
     * @param seconds 
     * @returns 
     */
  async add(key: string, value: string | Buffer | number, seconds: number) {
    const lua = `return redis.call('exists',KEYS[1])<1 and redis.call('setex',KEYS[1],ARGV[2],ARGV[1])`;
    const res = await this.redis.eval(lua, 1, key, value, Math.max(seconds, 1));
    return !!res;
  }

  /**
     * 缓存增长
     * @param key 
     * @param value 
     * @returns 
     */
  async increment(key: string, value = 1) {
    return this.redis.incrby(key, value);
  }

  /**
     * 缓存减少
     * @param key 
     * @param value 
     * @returns 
     */
  async decrement(key: string, value = 1) {
    return this.redis.decrby(key, value);
  }

  /**
     * 设置长期的缓存
     * @param key 
     * @param value 
     * @returns 
     */
  async forever(key: string, value: string | Buffer | number) {
    await this.redis.set(key, value);
    return true;
  }

  /**
     * 删除缓存
     * @param key 
     * @returns 
     */
  async remove(key: string) {
    await this.redis.del(key);
    return true;
  }

  /**
     * 清空缓存数据库
     * 谨慎使用
     * @returns 
     */
  async flush() {
    await this.redis.flushdb();
    return true;
  }
}