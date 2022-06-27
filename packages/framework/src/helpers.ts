import { Container } from './container';
import { Application } from './foundation/application';
import { Model } from './orm/model';
import { Mailer } from './mailer';
import { Config } from './config';
import { Redis } from './redis';
import { Cache } from './cache';

/**
 * 获取应用实例
 * @returns
 */
export function app(): Application
export function app(name: any): any
export function app(name?: any) {
  const app: Application = Container.get('app');
  if (!name) return app;
  return app.get(name);
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
 * 获取邮件服务
 * @param name
 * @returns
 */
export function mail(name?: string) {
  return app().get<Mailer>('mail').transporter(name).create();
}

/**
 * 获取配置实例
 * @returns
 */
export function config(): Config;
export function config(name: string): any;
export function config(name: string, defaultValue?: any): any;
export function config(name?: string, defaultValue?: any) {
  if (!name)  return app().get('config');
  return app().get('config').get(name, defaultValue);
   
}

/**
 * 获取模型仓库
 * @param _Entity
 * @returns
 */
export function model<TEntity>(_Entity: { new(): TEntity }) {
  return (new Model(_Entity)).createRepository();
}
