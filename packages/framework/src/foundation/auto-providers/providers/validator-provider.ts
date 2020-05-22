import { inject } from '../../../decorators';
import { Application } from '../../application';
import { Loader } from '../../../loader/loader';
import { Str } from '../../../utils';

export class ValidatorProvider {
  @inject() app: Application;
  @inject() loader: Loader;

  launch() {
    const validators = this.loader.getComponentsByType('validator') || [];
    for (const Validator of validators) {
      const injectionName: string | undefined = Reflect.getMetadata('name', Validator) ?? Str.decapitalize(Validator?.name);
      this.app.multiton(Validator, Validator);
      if (injectionName && !injectionName.startsWith('default')) {
        if (this.app.has(injectionName)) throw new Error(`specified resource name ${injectionName} conflicts with existing!`);
        this.app.multiton(injectionName, (...args: any[]) => {
          return this.app.get(Validator, args);
        }, true);
      }
    }
  }
}