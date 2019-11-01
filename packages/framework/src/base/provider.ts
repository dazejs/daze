import { Base } from './base';
import { ComponentType } from '../symbol';

@Reflect.metadata('type', ComponentType.Provider)
export abstract class Provider extends Base {
  load(target: any) {
    if (target) this.app.get('loader').load(target);
    return this;
  }
}