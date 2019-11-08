import { Base } from '../base';
import { Builder } from '../database/builder';
import { ComponentType } from '../symbol';
import { ModelBuilder } from './builder';


@Reflect.metadata('type', ComponentType.Model)
@Reflect.metadata('injectable', true)
export abstract class Model extends Base {

  connection = 'default';

  table: string;

  primaryKey = 'id';

  constructor() {
    super();
    return new Proxy(this, this.proxy);
  }

  get proxy(): ProxyHandler<this> {
    return {
      get(target, p, receiver) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
        return target.newModelBuilder()[p as keyof ModelBuilder];
      }
    };
  }

  newModelBuilder() {
    return new ModelBuilder(
      new Builder(
        this.app.get('db')
          .connection(this.connection)
          .table(this.table)
      )
    );
  }
}