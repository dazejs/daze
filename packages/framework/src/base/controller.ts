/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Base } from './base'
import { View } from '../view'
import * as Resource from '../resource'
import { Validate } from '../validate'
import { ComponentType } from '../symbol'

export class Controller extends Base {
  __context: any[];
  _view: any;

  set __context__(context: any[]) {
    this.__context = context
  }

  get __context__() {
    return this.__context
  }
  /**
   * @var request request instance
   */
  get request() {
    return this.__context__[0];
  }

  /**
   * render view template
   * @param params
   */
  render(...params:any[]) {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view.render(...params);
  }

  /**
   * assign view data
   * @param params
   */
  assign(...params: any[]) {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view.assign(...params);
  }

  /**
   * get view instance
   * @param params
   */
  view(...params: any[]) {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view;
  }

  /**
   * get resource methods
   * @param resourceName
   */
  resource(resourceName: string) {
    return {
      item(data: any) {
        return new Resource.Item(data, resourceName);
      },
      collection(data: any) {
        return new Resource.Collection(data, resourceName);
      },
    };
  }

  /**
   * get service
   * @param serviceName
   * @param args
   */
  service(serviceName: string, args: any[] = []) {
    return this.app.get(`service.${serviceName}`, args);
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
  validate(data: any[], validator: any[]) {
    return new Validate(data, validator);
  }

  /**
   * create item resource instance
   * @param data
   * @param resourceName
   */
  item(data: any[], resourceName: any) {
    return new Resource.Item(data, resourceName);
  }

  /**
   * create collection resouce instance
   * @param data
   * @param resourceName
   */
  collection(data: any, resourceName: string) {
    return new Resource.Collection(data, resourceName);
  }
}

Reflect.defineMetadata('type', ComponentType.Controller, Controller.prototype);

