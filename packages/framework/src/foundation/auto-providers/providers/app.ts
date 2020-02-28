/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Tokens from 'csrf';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { Provider as BaseProvider } from '../../../base/provider';
import { ControllerServiceProvider } from '../../../controller';
import { DatabaseProvider } from '../../../database';
import { provide, depend } from '../../../decorators/provider';
import { LoggerProvider } from '../../../logger';
import { MiddlewareProvider } from '../../../middleware';
import { Router } from '../../../router';
// import { Application } from '../../application';

@depend([
  DatabaseProvider,
  MiddlewareProvider,
  ControllerServiceProvider,
  LoggerProvider
])
export class AppProvider extends BaseProvider {
  @provide('csrf')
  _csrf() {
    return new Tokens();
  }

  @provide('router')
  _router() {
    return new Router();
  }

  @provide('templateEngine')
  _template() {
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
    return templateEnv;
  }
}