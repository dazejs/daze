/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Base } from './base';
// import { Service } from './service';
import { View } from '../view';
import * as Resource from '../resource';
import { Validate } from '../validate';
import { ComponentType } from '../symbol';
import { Request } from '../request';
import { ResponseManager } from '../response/manager';

@Reflect.metadata('type', ComponentType.Controller)
@Reflect.metadata('injectable', true)
export abstract class Controller extends Base {
  /**
   * context cache
   */
  __context: any[];

  /**
   * view instance cache
   */
  _view: View;

  /**
   * context setter
   */
  set __context__(context: any[]) {
    this.__context = context;
  }

  /**
   * context getter
   */
  get __context__() {
    return this.__context;
  }
  
  /**
   * @var request request instance
   */
  get request(): Request {
    return this.__context__[0];
  }

  /**
   * render view template
   * @param params
   */
  render(...params: any[]): View {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view.render(...params);
  }

  /**
   * assign view data
   * @param params
   */
  assign(name: string | object, value?: any): View {
    if (!this._view) {
      this._view = new View();
    }
    return this._view.assign(name, value);
  }

  /**
   * get view instance
   * @param params
   */
  view(template = '', vars = {}): View {
    if (!this._view) {
      this._view = new View(template , vars);
    }
    return this._view;
  }

  /**
   * get resource methods
   * @param resourceName
   */
  resource(resourceName: string) {
    return {
      item(data: any): Resource.Item {
        return new Resource.Item(data, resourceName);
      },
      collection(data: any): Resource.Collection {
        return new Resource.Collection(data, resourceName);
      },
    };
  }


  // service<T extends Service>(service: T, args?: any[]): T;
  // service<T = any>(service: string, args?: any[]): T;

  /**
   * get service
   * @param serviceName
   * @param args
   */
  service<T = any>(service: string | { new(): T }, args: any[] = []): T {
    if (typeof service === 'string') {
      return this.app.get(`service.${service}`, args);
    };
    return this.app.get<T>(service, args) as T;
  }

  /**
   * get component
   * @param {String} componentName
   * @param {Array} args
   */
  component(componentName: string, args: any[] = []) {
    return this.app.get(`component.${componentName}`, args);
  }

  /**
   * validate a data
   * @param data
   * @param validator
   */
  validate(data: any, validator: any): Validate {
    return new Validate(data, validator);
  }

  /**
   * create item resource instance
   * @param data
   * @param resourceName
   */
  item(data: any[], resourceName: any): Resource.Item {
    return new Resource.Item(data, resourceName);
  }

  /**
   * create collection resouce instance
   * @param data
   * @param resourceName
   */
  collection(data: any, resourceName: string): Resource.Collection {
    return new Resource.Collection(data, resourceName);
  }

  /**
   * send response
   */
  send(data: any) {
    return new ResponseManager(data).output(this.request);
  }
}

