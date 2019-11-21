/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import path from 'path';

import { Container } from '../container';
import { Application } from '../foundation/application';

const FINAL_VARS = Symbol('View#finalVars');

export class View {
  /**
   * application
   */
  app: Application = Container.get('app');

  /**
   * view vars
   */
  vars: { [key: string]: any } = {};

  /**
   * view template name
   */
  template = '';

  constructor(template = '', vars = {}) {

    this.template = template;

    this.vars = vars;
  }

  /**
   * Generate template variables
   */
  [FINAL_VARS](vars = {}) {
    return Object.assign({}, this.vars, vars);
  }

  /**
   * Pass the variable to the template
   * @param name variable object or variable name
   * @param value variable value
   */
  assign(name: string | object, value?: any) {
    if (name && typeof name === 'object') {
      this.vars = Object.assign(this.vars, name);
    } else if (typeof name === 'string') {
      this.vars[name] = value;
    }
    return this;
  }

  /**
   * render the template
   * @param template template path and name
   * @param vars template variables
   */
  render(template: string | object = '', vars: { [key: string]: any } = {}) {
    // When parsing the controller, return it if you take this parameter
    // 解析控制器时，如果带此参数则直接 return 出去
    let newTemplate = template;
    let newVars = vars;
    if (newTemplate && typeof newTemplate === 'object') {
      newVars = newTemplate;
      newTemplate = '';
    }
    if (newTemplate) this.template = newTemplate;
    if (newVars) this.vars = this[FINAL_VARS](newVars);
    return this;
  }

  /**
   * getTemplate
   */
  getTemplate() {
    const config = this.app.get('config');
    const ext = config.get('app.viewExtension', 'html');
    if (path.extname(this.template) === '') {
      return `${this.template}.${ext}`;
    }
    return this.template;
  }

  /**
   * getVars
   */
  getVars() {
    return this.vars;
  }
}
