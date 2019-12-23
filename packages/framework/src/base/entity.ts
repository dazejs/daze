// import { inspect } from 'util';
// import { Base } from '../base';
import { ComponentType } from '../symbol';
// import { ModelBuilder } from '../model/builder';
import { Model } from '../model/model';

@Reflect.metadata('type', ComponentType.Entity)
@Reflect.metadata('primaryKey', 'id')
@Reflect.metadata('connection', 'default')
export abstract class Entity extends Model<any> {
  
}