import { Base } from './base'

export abstract class Provider extends Base {
  load(target: any) {
    if (target) this.app.get('loader').load(target);
    return this
  }
}