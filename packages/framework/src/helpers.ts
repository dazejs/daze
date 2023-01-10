
import { AsyncLocalStorage } from 'async_hooks';
import { OutgoingHttpHeaders } from 'http';
import { Config } from './config';
import { Container } from './container';
import { Application } from './foundation/application';
import { Request } from './http/request';
import { Response } from './http/response';
import { Redirect } from './http/response/redirect';
import { Cache } from './supports/cache';
import { Redis } from './supports/redis';
import { ASYNC_LOCAL_STORAGE } from './symbol';
import { Validate } from './validate';
import { Resource } from './resource';
import { View } from './view';
import { Model } from './supports/orm';

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

/**
 * 生成模板视图
 * @param template 
 * @param vars 
 * @returns 
 */
export function view(template = '', vars: object = {}) {
  return new View(template, vars);
}


export function response(data?: any, code = 200, header: OutgoingHttpHeaders = {}) {
  return new Response(data, code, header);
}

export function redirect(url?: string, code = 200, header: OutgoingHttpHeaders = {}) {
  return new Redirect(url, code, header);
}

export function validate(validator: any) {
  return new Validate(validator);
}

export function resource(formater?: any) {
  return {
    item: (data: Record<string, any>) => {
      return new Resource(formater).item(data);
    },
    collection: (data: Record<string, any>[]) => {
      return new Resource(formater).collection(data);
    }
  };
}

export function model<TEntity>(_Entity: { new(): TEntity }) {
  return (new Model(_Entity)).createRepository();
}