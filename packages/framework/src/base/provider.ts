import { componentType } from '../decorators/component-type';
import { Base } from './base';

@componentType('provider')
export abstract class Provider extends Base {
  register?(): void | Promise<void>;
  launch?(): void | Promise<void>;
}