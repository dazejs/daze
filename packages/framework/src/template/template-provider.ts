import { Provider } from '../base/provider';
import { provide } from '../decorators/provider';
import type { Application } from '../foundation/application';
import { Template } from './template';

export class TemplateProvider extends Provider {
  @provide('daze-template')
  _template(app: Application) {
    return Template.create(app);
  }
}