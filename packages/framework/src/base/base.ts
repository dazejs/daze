/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { OutgoingHttpHeaders } from 'http';
import { Config } from '../config';
import { Container } from '../container';
import { Database } from '../database';
import { Application } from '../foundation/application';
import { MessengerService } from '../messenger';
import { Model } from '../orm/model';
import { Response } from '../response';
import { Validate } from '../validate';
import { Redirect } from '../response/redirect';
import { Resource } from '../resource';
// import { Entity } from '../orm/entity';

export abstract class Base {
  /**
   * Application instance getter
   */
  protected get app(): Application {
    return Container.get('app');
  }

  /**
   * Config instance getter
   */
  protected get config(): Config {
    return Container.get('config');
  }

  /**
   * Message instance getter
   */
  protected get messenger(): MessengerService {
    return Container.get('messenger');
  }

  /**
   * create response instance
   * @param params response constructor params
   */
  protected response(data?: any, code = 200, header: OutgoingHttpHeaders = {}): Response {
    return new Response(data, code, header);
  }

  /**
   * create redirect instance
   * @param params redirect constructor params
   */
  protected redirect(url?: string, code = 302, header: OutgoingHttpHeaders = {}): Redirect {
    return new Redirect(url, code, header);
  }

  /**
   * create resource
   * @param formater 
   */
  protected resource(formater?: any) {
    return {
      item: (data: Record<string, any>) => {
        return new Resource(formater).item(data);
      },
      collection: (data: Record<string, any>[]) => {
        return new Resource(formater).collection(data);
      }
    };
  }

  protected validate(validator: any) {
    return new Validate(validator);
  }

  /**
   * create database instance
   * @param name connection name
   */
  protected db(name?: string) {
    return this.app.get<Database>('db').connection(name);
  }

  protected logger(channel?: string) {
    return this.app.get('logger').channel(channel);
  }

  protected model<TEntity>(_Entity: { new(): TEntity }) {
    return (new Model(_Entity)).createRepository();
  }
}
