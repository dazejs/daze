import { inject } from '../../../decorators/inject';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';

export class ModelProvider{
  @inject() app: Application;

  @inject() loader: Loader;

  launch() {
    const models = this.loader.getComponentsByType('entity') || [];
    for (const Model of models) {
      const name = Reflect.getMetadata('name', Model);
      this.app.multiton(Model, Model);
      if (name) {
        this.app.multiton(`model.${name}`, (...args: any[]) => {
          return this.app.get(Model, args);
        }, true);
      }
    }
  }
}