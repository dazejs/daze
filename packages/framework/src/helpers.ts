
import { Application }  from './foundation/application';
import { Container } from './container';
import { Config } from './config';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_LOCAL_STORAGE } from './symbol';
import { Request } from './http/request';
import { Redis } from './supports/redis';
import { Cache } from './supports/cache';

export function app(): Application
export function app<T = any>(name: any): T
export function app(name?: any) {
  const app: Application = Container.get('app');
  if (!name) return app;
  return app.get(name);
}

export function config(): Config;
export function config(name: string): any;
export function config(name: string, defaultValue?: any): any;
export function config(name?: string, defaultValue?: any) {
  if (!name)  return app().get('config');
  return app().get('config').get(name, defaultValue);
   
}



/**
 * 上下文 Map
 * @returns
 */
export function contextStore() {
  const store =  app().get<AsyncLocalStorage<Map<string, any>>>(ASYNC_LOCAL_STORAGE).getStore();
  if (!store) throw new Error('未找到请求上下文');
  return store;
}

/**
 * 获取当前请求
 * @returns 
 */
export function request() {
  const store = contextStore();
  if (!store.has('request')) throw new Error('未找到请求实例');
  return store.get('request') as Request;
}


/**
 * 获取数据库连接
 * @param name
 * @returns
 */
export function db(name?: string) {
  return app().get('db').connection(name);
}

/**
 * 获取 Redis 连接
 * @param name
 * @returns
 */
export function redis(name?: string) {
  return app().get<Redis>('redis').connection(name);
}


/**
 * 获取 Redis 连接
 * @param name
 * @returns
 */
export function cache(name?: 'memory' | 'redis', connection?: string) {
  return app().get<Cache>('cache').store(name, connection);
}