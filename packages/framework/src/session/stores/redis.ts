/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { promisify } from 'util'
import * as redis from 'redis'

export default class RedisSessionStore {
  app: any;
  redisConfig: any;
  _client: any;
  /**
   * Create Redis Session Store
   * @param  app
   */
  constructor(app: any) {
    /**
     * @type app Application instance
     */
    this.app = app;

    /**
     * @type redisConfig redis connect options
     */
    this.redisConfig = this.getRedisConfigure();
  }

  /**
   * get database-redis config
   */
  getRedisConfigure() {
    const config = this.app.get('config');
    const redisDatabaseConfig = config.get('database.redis', {});
    const connectionName = config.get('session.connection', '');
    return redisDatabaseConfig[connectionName] || {};
  }

  /**
   * redis client getter
   */
  get client() {
    if (!this._client) {
      this._client = redis.createClient(this.redisConfig);
    }
    return this._client;
  }

  /**
   * get value
   * @param id redis key
   */
  async get(id: string) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const res = await getAsync(id);
    if (!res) return null;
    return JSON.parse(res);
  }

  /**
   * set value
   * @param  id redis key
   * @param sess redis value
   * @param maxAge redis max age
   */
  async set(id: string, sess: string, maxAge?: number) {
    const max = typeof maxAge === 'number' ? maxAge : 1000 * 60 * 60 * 24;
    const val = JSON.stringify(sess);
    const setAsync = promisify(this.client.set).bind(this.client);
    const res = await setAsync(id, val, 'PX', max);
    return res;
  }

  /**
   * destroy key-value
   * @param id redis key
   */
  async destroy(id: string) {
    const delAsync = promisify(this.client.del).bind(this.client);
    const res = await delAsync(id);
    return res;
  }
}

module.exports = RedisSessionStore;
