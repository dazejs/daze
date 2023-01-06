import { Application } from '../../application';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { Provide, Provider } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Str } from '../../../utils';

import { app } from '../../../helpers';

@Provider()
export class TemplateEngineProvider implements ProviderInterface {
  @Provide('template')
  _tmp(app: Application) {
    const templateEnv = new nunjucks.Environment([new nunjucks.FileSystemLoader(app.viewPath, {
      // noCache: app.isDebug,
      // watch: app.isDebug,
      noCache: false,
      watch: false
    }), new nunjucks.FileSystemLoader(path.resolve(__dirname, '../../../errors/views'), {
      // noCache: app.isDebug,
      // watch: app.isDebug,
      noCache: false,
      watch: false
    })], {
      autoescape: false,
    });
    const config = app.get('config');
    templateEnv.addGlobal('app', app);
    templateEnv.addGlobal('config', config);
    templateEnv.addGlobal('__public__', Str.formatPrefix(config.get('app.baseUrl', '')) + Str.formatPrefix(config.get('app.publicPrefix', '')));
    return templateEnv;
  }

  launch() {
    app().make('template');
  }
}