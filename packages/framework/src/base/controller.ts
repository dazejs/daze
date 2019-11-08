/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Injectable } from './injectable';
import { View } from '../view';
import { ComponentType } from '../symbol';

@Reflect.metadata('type', ComponentType.Controller)
export abstract class Controller extends Injectable {
  /**
   * view instance cache
   */
  _view: View;

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
}

