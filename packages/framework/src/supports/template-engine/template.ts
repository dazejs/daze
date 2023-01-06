import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { Application } from '../../foundation/application';

export class Template {
  static create(app: Application) {
    const templateEnv = new nunjucks.Environment([new nunjucks.FileSystemLoader(app.viewPath, {
      noCache: app.isDebug,
      watch: app.isDebug,
    }), new nunjucks.FileSystemLoader(path.resolve(__dirname, '../errors/views'), {
      noCache: app.isDebug,
      watch: app.isDebug,
    })], {
      autoescape: false,
    });
    const config = app.get('config');
    templateEnv.addGlobal('app', app);
    templateEnv.addGlobal('config', config);
    templateEnv.addGlobal('__public__', config.get('app.publicPrefix', ''));
    return templateEnv;
  }
}