import { provide, disable } from '../../../decorators';
import { Template } from '../../../template';
import { Application } from '../../application';

export class TemplateProvider {
  @provide('daze-template')
  @disable
  _template(app: Application) {
    return Template.create(app);
  }
}