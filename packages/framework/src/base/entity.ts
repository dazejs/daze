import { Model } from '../model/model';
import { componentType } from '../decorators/component-type';

@componentType('entity')
@Reflect.metadata('connection', 'default')
export class BaseEntity extends Model {
  
}