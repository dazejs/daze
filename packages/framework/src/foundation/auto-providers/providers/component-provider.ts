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
      const name = Reflect.getMetadata('name', Component) ?? Str.decapitalize(Component?.name);
      this.app.multiton(Component, Component);
      // TODO: check exclude default_1, default_2, ...
      if (name) {
        this.app.multiton(name, (...args: any[]) => {
          return this.app.get(Component, args);
        }, true);
      }
    }
  }
}