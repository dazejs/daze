import { Provider } from '../base/provider';
import { inject } from '../decorators/inject';
import type { Loader } from '../loader';

export class ValidatorProvider extends Provider {
  @inject('loader') loader: Loader;

  launch() {
    const validators = this.loader.getComponentsByType('validator') || [];
    for (const Validator of validators) {
      const name = Reflect.getMetadata('name', Validator);
      this.app.multiton(Validator, Validator);
      if (name) {
        this.app.multiton(`validator.${name}`, (...args: any[]) => {
          return this.app.get(Validator, args);
        }, true);
      }
    }
  }
}