import { inject } from '../../../decorators';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';
import { Str } from '../../../utils';

export class ModelProvider{
  @inject() app: Application;

  @inject() loader: Loader;

  launch() {
    const models = this.loader.getComponentsByType('entity') || [];
    for (const Model of models) {
      const name = Reflect.getMetadata('name', Model) ?? Str.decapitalize(Model?.name);
      this.app.multiton(Model, Model);
      if (name) {
        this.app.multiton(name, (...args: any[]) => {
          return this.app.get(Model, args);
        }, true);
      }
    }
  }
}