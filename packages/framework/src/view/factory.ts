/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Container } from '../container'

export class ViewFactory {
  app = Container.get('app');
  view: any;
  constructor(view: any) {
    this.view = view;
  }

  combineVars(request: any) {
    const defaultVars = {
      session_value(key: string) {
        return request.session().get(key);
      },
      get __token__() {
        return request._csrf;
      },
    };
    return Object.assign({}, defaultVars, this.view.getVars());
  }

  output(request: any) {
    const template = this.app.get('templateEngine');
    const vars = this.combineVars(request);
    return template.render(this.view.getTemplate(), vars);
  }
}
