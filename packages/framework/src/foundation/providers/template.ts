/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import path from 'path'
import nunjucks from 'nunjucks'

export class TemplateProvider {
  app: any;
  config: any;

  /**
   * create Config Provider
   * @param app Application
   */
  constructor(app: any) {
    this.app = app;
    this.config = app.get('config');
  }

  /**
   * Provider register Hook
   */
  register() {
    const templateEnv = new nunjucks.Environment([new nunjucks.FileSystemLoader(this.app.viewPath, {
      noCache: this.app.isDebug,
      watch: this.app.isDebug,
    }), new nunjucks.FileSystemLoader(path.resolve(__dirname, '../../errors/views'), {
      noCache: this.app.isDebug,
      watch: this.app.isDebug,
    })], {
      autoescape: false,
    });
    templateEnv.addGlobal('app', this.app);
    templateEnv.addGlobal('config', this.config);
    templateEnv.addGlobal('__public__', this.config.get('app.public_prefix', ''));
    this.app.singleton('templateEngine', templateEnv);
  }
}
