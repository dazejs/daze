import { inject } from '../../../decorators';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';


export class ResourceProvider{
  @inject() app: Application;

  @inject() loader: Loader;

  launch() {
    const resources = this.loader.getComponentsByType('resource') || [];
    for (const Resource of resources) {
      const name = Reflect.getMetadata('name', Resource);
      this.app.multiton(Resource, Resource);
      if (name) {
        this.app.multiton(name, (...args: any[]) => {
          return this.app.get(Resource, args);
        }, true);
      }
    }
  }
}