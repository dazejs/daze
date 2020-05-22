import { inject } from '../../../decorators';
import { Application } from '../../application';
import { Loader } from '../../../loader';
import { Str } from '../../../utils';

export class ComponentProvider {
  @inject() app: Application;

  @inject() loader: Loader;

  launch() {
    const components = this.loader.getComponentsByType('component') || [];
    for (const Component of components) {
      const injectionName: string | undefined = Reflect.getMetadata('name', Component) ?? Str.decapitalize(Component?.name);
      this.app.multiton(Component, Component);
      if (injectionName && !injectionName.startsWith('default')) {
        if (this.app.has(injectionName)) throw new Error(`specified component name ${injectionName} conflicts with existing!`);
        this.app.multiton(injectionName, (...args: any[]) => {
          return this.app.get(Component, args);
        }, true);
      }
    }
  }
}