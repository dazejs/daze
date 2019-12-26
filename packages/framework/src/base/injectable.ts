import { Request } from '../request';
import * as Resource from '../resource';
import { Validate } from '../validate';
import { Base } from './base';
// import { Entity } from './entity';
import { Resource as BaseResource } from './resource';
// import { Entity } from './entity';
// import { Model } from '../model';
// import { ModelBuilder } from '../model/builder';
// import { Builder } from '../database/builder';

@Reflect.metadata('injectable', true)
export class Injectable extends Base {
  // inject __context__
  __context__: any[];

  /**
   * @var request request instance
   */
  get request(): Request {
    return this.__context__[0];
  }

  /**
  * get resource methods
  * @param resourceName
  */
  resource(resource: string | { new(): BaseResource }) {
    return {
      item: (data: any) => {
        return (new Resource.Item(data, resource))
          .setContext(this.__context__);
      },
      collection: (data: any) => {
        return (new Resource.Collection(data, resource))
          .setContext(this.__context__);
      },
    };
  }

  /**
 * get service
 * @param serviceName
 * @param args
 */
  service<T = any>(service: string | { new(): T }): T {
    if (typeof service === 'string') {
      return this.app.get(`service.${service}`, this.__context__);
    };
    return this.app.get<T>(service, this.__context__) as T;
  }

  /**
   * get component
   * @param {String} componentName
   * @param {Array} args
   */
  component<T = any>(component: string | { new(): T }) {
    if (typeof component === 'string') {
      return this.app.get(`component.${component}`, this.__context__);
    };
    return this.app.get<T>(component, this.__context__) as T;
  }

  /**
 * validate a data
 * @param data
 * @param validator
 */
  validate(data: any, validator: any): Validate {
    return new Validate(data, validator);
  }

  /**
 * create item resource instance
 * @param data
 * @param resourceName
 */
  item(data: any, resource: string | { new(): BaseResource }): Resource.Item {
    return (new Resource.Item(data, resource)).setContext(this.__context__);
  }

  /**
   * create collection resouce instance
   * @param data
   * @param resourceName
   */
  collection(data: any, resource: string | { new(): BaseResource }): Resource.Collection {
    return (new Resource.Collection(data, resource).setContext(this.__context__));
  }

  // model<TEntity extends Entity>(entity: string | { new(): TEntity })  {
  //   return (new Model<TEntity>(
  //     typeof entity === 'string' ? this.app.get<TEntity>(`entity.${entity}`) : this.app.get<TEntity>(entity)
  //   )) as Model<TEntity>;
  //   // return typeof entity === 'string' ? this.app.get<Model<TEntity>>(`entity.${entity}`) : this.app.get<Model<TEntity>>(entity);
  // }
}