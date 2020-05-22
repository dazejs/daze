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
      const injectionName: string | undefined = Reflect.getMetadata('name', Model) ?? Str.decapitalize(Model?.name);
      this.app.multiton(Model, Model);
      if(injectionName && !injectionName.startsWith('default')) {
        if (this.app.has(injectionName)) throw new Error(`specified entity name ${injectionName} conflicts with existing!`);
        this.app.multiton(injectionName, (...args: any[]) => {
          return this.app.get(Model, args);
        }, true);
      }
    }
  }
}