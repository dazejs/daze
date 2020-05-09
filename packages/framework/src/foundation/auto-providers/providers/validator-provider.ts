import { inject } from '../../../decorators';
import { Application } from '../../application';
import { Loader } from '../../../loader/loader';
export class ValidatorProvider {
  @inject() app: Application;
  @inject() loader: Loader;

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