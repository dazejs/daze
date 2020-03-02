import { Provider } from '../base/provider';
import type { Loader } from '../loader';
import { inject } from '../decorators/inject';

export class ModelProvider extends Provider {
  @inject('loader') loader: Loader;

  launch() {
    const entities = this.loader.getComponentsByType('entity') || [];
    for (const Entity of entities) {
      const name = Reflect.getMetadata('name', Entity);
      this.app.multiton(Entity, Entity);
      if (name) {
        this.app.multiton(`entity.${name}`, (...args: any[]) => {
          return this.app.get(Entity, args);
        }, true);
      }
    }
  }
}