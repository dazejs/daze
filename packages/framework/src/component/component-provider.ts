import { Provider } from '../base/provider';
import type { Loader } from '../loader';
import { inject } from '../decorators/inject';

export class ComponentProvider extends Provider {
  @inject('loader') loader: Loader;

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