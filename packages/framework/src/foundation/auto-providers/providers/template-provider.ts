import { Provide, Disable } from '../../../decorators';
import { Template } from '../../../template';
import { Application } from '../../application';

export class TemplateProvider {
  @Provide('daze-template')
  @Disable
  _template(app: Application) {
    return Template.create(app);
  }
}