/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import Tokens from 'csrf';
import { Provider } from '../../../base/provider';
import { ControllerServiceProvider } from '../../../controller';
import { DatabaseProvider } from '../../../database';
import { depend, provide } from '../../../decorators/provider';
import { LoggerProvider } from '../../../logger';
import { MiddlewareProvider } from '../../../middleware';
import { Router } from '../../../router';
import { TemplateProvider } from '../../../template';


@depend([
  DatabaseProvider,
  MiddlewareProvider,
  ControllerServiceProvider,
  LoggerProvider,
  TemplateProvider
])
export class AppProvider extends Provider {
  @provide('csrf')
  _csrf() {
    return new Tokens();
  }

  @provide('router')
  _router() {
    return new Router();
  }
}