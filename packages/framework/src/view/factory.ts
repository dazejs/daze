/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Container } from '../container';
import { Application } from '../foundation/application';
import { View } from '.';
import { Request } from '../request';

export class ViewFactory {
  /**
   * application
   */
  app: Application = Container.get('app');

  /**
   * view
   */
  view: View;

  constructor(view: View) {
    this.view = view;
  }

  combineVars(request: Request) {
    const defaultVars = {
      sessionValue(key: string) {
        return request.session().get(key);
      },
      get __token__() {
        return request._csrf;
      },
    };
    return Object.assign({}, defaultVars, this.view.getVars());
  }

  output(request: Request) {
    const template = this.app.get('templateEngine');
    const vars = this.combineVars(request);
    return template.render(this.view.getTemplate(), vars);
  }
}
