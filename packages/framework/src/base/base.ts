/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { OutgoingHttpHeaders } from 'http';
import { Container } from '../container';
import { Response } from '../response';
import { Redirect } from '../response/redirect';
import { Application } from '../foundation/application';
import { Config } from '../config';
import { Messenger } from '../cluster/messenger';
import { AbstractConnection } from '../database/connection/connection.abstract';
import { Builder } from '../database/builder';
// import { Model } from './model';
import { Database } from '../database';

@Reflect.metadata('injectable', true)
export abstract class Base {
  /**
   * Application instance getter
   */
  get app(): Application {
    return Container.get('app');
  }

  /**
   * Config instance getter
   */
  get config(): Config {
    return Container.get('config');
  }

  /**
   * Message instance getter
   */
  get messenger(): Messenger {
    return Container.get('messenger');
  }

  /**
   * create response instance
   * @param params response constructor params
   */
  response(data?: any, code = 200, header: OutgoingHttpHeaders = {}): Response {
    return new Response(data, code, header);
  }

  /**
   * create redirect instance
   * @param params redirect constructor params
   */
  redirect(url?: string, code = 200, header: OutgoingHttpHeaders = {}): Redirect {
    return new Redirect(url, code, header);
  }

  /**
   * create database instance
   * @param name connection name
   */
  db(name?: string) {
    return this.app.get<Database>('db').connection(name) as AbstractConnection & Builder;
  }

  model<T>(name: string): T & Builder
  model(name: string): Builder
  model(name: string) {
    return this.app.get(`model.${name}`);
  }
}
