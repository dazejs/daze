/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { promisify } from 'util';

export class RedisStore {
  private readonly redisConfig: object;
  private readonly _client: RedisClient;

  /**
   * Create Redis Store
   *
   * @param  redisConfig
   */
  constructor(redisConfig: object) {
    /**
     * @type redisConfig redis connect options
     */
    this.redisConfig = redisConfig;
    if (!this._client) {
      this._client = redis.createClient(this.redisConfig);
    }
  }

  /**
   * get database-redis config
   */
  getRedisConfig() {
    return this.redisConfig;
  }

  /**
   * redis client getter
   */
  get client() {
    return this._client;
  }

  /**
   * get value
   *
   * @param id redis key
   */
  async get(id: string) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return await getAsync(id);
  }

  /**
   * set value
   *
   * @param key redis key
   * @param value redis value
   * @param maxAge redis max age
   */
  async set(key: string, value: string, maxAge?: number) {
    const max = typeof maxAge === 'number' ? maxAge : 1000 * 60 * 60 * 24;
    const setAsync = promisify(
      (_key: string, _value: string, _mode: string, _duration: number, cb?: any) => {
        this.client.set(_key, _value, _mode, _duration, cb);
      }
    ).bind(this.client);
    return await setAsync(key, value, 'PX', max);
  }

  /**
   * destroy key-value
   *
   * @param ids redis keys
   */
  async del(ids: string | string[]) {
    const delAsync = promisify(
      (_ids: any, cb: any) => this.client.del(_ids, cb)
    ).bind(this.client);
    return await delAsync(ids);
  }
}
