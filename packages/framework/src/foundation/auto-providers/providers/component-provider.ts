import { inject } from '../../../decorators';
import { Application } from '../../application';
import { Loader } from '../../../loader';

export class ComponentProvider {
  @inject() app: Application;

  @inject() loader: Loader;

  launch() {
    const components = this.loader.getComponentsByType('component') || [];
    for (const Component of components) {
      const name = Reflect.getMetadata('name', Component);
      this.app.multiton(Component, Component);
      if (name) {
        this.app.multiton(`component.${name}`, (...args: any[]) => {
          return this.app.get(Component, args);
        }, true);
      }
    }
  }
}