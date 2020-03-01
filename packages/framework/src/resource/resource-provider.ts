import { Provider } from '../base/provider';
import type { Loader } from '../loader';
import { inject } from '../decorators/inject';

export class ResourceProvider extends Provider {
  @inject('loader') loader: Loader;

  launch() {
    const resources = this.loader.getComponentsByType('resource') || [];
    for (const Resource of resources) {
      const name = Reflect.getMetadata('name', Resource);
      this.app.multiton(Resource, Resource);
      if (name) {
        this.app.multiton(`resource.${name}`, (...args: any[]) => {
          return this.app.get(Resource, args);
        }, true);
      }
    }
  }
}