import { inject } from '../../../decorators';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';
import { Str } from '../../../utils';


export class ResourceProvider{
  @inject() app: Application;

  @inject() loader: Loader;

  launch() {
    const resources = this.loader.getComponentsByType('resource') || [];
    for (const Resource of resources) {
      const injectionName: string | undefined = Reflect.getMetadata('name', Resource) ?? Str.decapitalize(Resource?.name);
      this.app.multiton(Resource, Resource);
      if (injectionName && !injectionName.startsWith('default')) {
        if (this.app.has(injectionName)) throw new Error(`specified resource name ${injectionName} conflicts with existing!`);
        this.app.multiton(injectionName, (...args: any[]) => {
          return this.app.get(Resource, args);
        }, true);
      }
    }
  }
}