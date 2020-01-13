/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { Provider as BaseProvider } from '../../base/provider';

export class TemplateProvider extends BaseProvider {
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
    templateEnv.addGlobal('__public__', this.config.get('app.publicPrefix', ''));
    this.app.singleton('templateEngine', templateEnv);
  }
}
