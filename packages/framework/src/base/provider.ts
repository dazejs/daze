import { ComponentType } from '../symbol';
import { Base } from './base';

@Reflect.metadata('type', ComponentType.Provider)
@Reflect.metadata('injectable', true)
export abstract class Provider extends Base {
  load(target: any) {
    if (target) this.app.get('loader').load(target);
    return this;
  }
}