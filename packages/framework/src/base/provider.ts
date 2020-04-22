import { componentType } from '../decorators/component-type';
import { Base } from './base';

@componentType('provider')
export abstract class BaseProvider extends Base {
  register?(): void | Promise<void>;
  launch?(): void | Promise<void>;
}