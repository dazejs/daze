import { Model } from '../model/model';
import { ComponentType } from '../symbol';

@Reflect.metadata('type', ComponentType.Entity)
@Reflect.metadata('connection', 'default')
export class Entity extends Model {
  
}