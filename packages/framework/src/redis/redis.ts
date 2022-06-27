import { config } from '../helpers';
import { Connector } from './connector';
import { Redis as IRedis, Cluster as ICluster } from 'ioredis';
import { fakeBaseClass } from '../utils';

export type RedisClient = IRedis | ICluster

export class Redis extends fakeBaseClass<RedisClient>() { 
  /**
     * 连接实例
     */
  private instances: Map<string, RedisClient> = new Map();

  constructor() {
    super();
    return new Proxy(this, this.proxy);
  }

  /**
     * 代理器
     */
  get proxy(): ProxyHandler<this> {
    return {
      get(target: Redis, p: string | number | symbol, receiver: any) {
        if (typeof p === 'string') {
          if (Reflect.has(target, p)) {
            return Reflect.get(target, p, receiver);
          }
          return target.connection()[p as keyof RedisClient];
        }
        return Reflect.get(target, p, receiver);
      }
    };
  }

  /**
     * 获取 redis 连接
     * @param name 
     * @returns 
     */
  public connection(name = 'default') {
    if (!this.instances.has(name)) {
      const config = this.getConnectioncConfigure(name);
      const instance = this.createConnection(config);
      instance && this.instances.set(name, instance);
    }
    return this.instances.get(name) as RedisClient;
  }

  /**
     * 获取连接配置
     * @param name 
     * @returns 
     */
  private getConnectioncConfigure(name: string) {
    const options = config().get(`redis.${name}`);
    if (!options) throw new Error(`未找到 Redis 配置 [redis.${name}]`);
    return options;
  }

  /**
     * 创建连接
     * @param options 
     * @returns 
     */
  private createConnection(options: any) {
    const redis = (new Connector()).connect(options);
    return redis;
  }
}