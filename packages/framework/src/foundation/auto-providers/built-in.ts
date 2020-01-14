/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Provider as BaseProvider } from '../../base/provider';
import { depend, provide } from '../../decorators/provider';
import { DecoratorProvider } from './providers/decorator';
import Tokens from 'csrf';
import { ControllerManager } from '../../controller/manager';
import { Middleware } from '../../middleware';
import { Router } from '../../router';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { Database } from '../../database';
import { Application } from '../application';
import { Logger } from '../../logger';

@depend(DecoratorProvider)
export class BuiltInProvider extends BaseProvider {
  @provide('csrf')
  _csrf() {
    return new Tokens();
  }

  @provide('controller-manager')
  _controllerManager() {
    return new ControllerManager();
  }

  @provide('middleware')
  _middleware() {
    return new Middleware();
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

  @provide('db')
  _db(app: Application) {
    return new Database(app);
  }

  @provide('logger')
  _logger() {
    return new Logger();
  }
}