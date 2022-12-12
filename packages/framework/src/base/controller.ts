/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { View } from '../view';
import { Injectable } from './injectable';
import { ComponentType } from '../decorators/component-type';

@ComponentType('controller')
export abstract class BaseController extends Injectable {
  /**
   * view instance cache
   */
  private _view: View;

  /**
   * render view template
   * @param params
   */
  public render(...params: any[]): View {
    if (!this._view) {
      this._view = new View(...params);
    }
    return this._view.render(...params);
  }

  /**
   * assign view data
   * @param params
   */
  public assign(name: string | object, value?: any): View {
    if (!this._view) {
      this._view = new View();
    }
    return this._view.assign(name, value);
  }

  /**
   * get view instance
   * @param params
   */
  public view(template = '', vars = {}): View {
    if (!this._view) {
      this._view = new View(template , vars);
    }
    return this._view;
  }
}

