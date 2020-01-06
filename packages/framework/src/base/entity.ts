// import { inspect } from 'util';
// import { Base } from '../base';
import { ComponentType } from '../symbol';
import { Model } from '../model/model';
// import { ModelBuilder } from '../model/builder';
// import { Builder } from '../database/builder';



@Reflect.metadata('type', ComponentType.Entity)
@Reflect.metadata('connection', 'default')
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Entity extends Model {
  
}

// export type Entity = _Entity & ModelBuilder & Builder
// export const Entity: new () => Entity = _Entity as any;