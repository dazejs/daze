import { Entity } from '../model/entity';
import { componentType } from '../decorators/component-type';

@componentType('entity')
@Reflect.metadata('connection', 'default')
export class BaseEntity extends Entity {
  
}