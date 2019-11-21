// import { inspect } from 'util';
// import { Base } from '../base';
import { ComponentType } from '../symbol';
// import { ModelBuilder } from '../model/builder';

@Reflect.metadata('type', ComponentType.Entity)
@Reflect.metadata('primaryKey', 'id')
@Reflect.metadata('connection', 'default')
export abstract class Entity {
  // attributes: Record<string, any> = {};


  // constructor() {
  //   // this.fill();
  //   return new Proxy(this, {
  //     set(target: Entity, p: number | string | symbol, value: any, receiver: any) {
  //       if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.set(target, p, value, receiver);
  //       target.setAttribute(p, value);
  //       return true;
  //     },
  //     get(target: Entity, p: number | string | symbol, receiver: any) {
  //       if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
  //       return target.getAttribute(p);
  //     }
  //   });
  // }

  // constructor() {
  //   return new Proxy(this, {
  //     set(target: Model, p: number | string | symbol, value: any, receiver: any) {
  //       const columns = Reflect.getMetadata('columns', this.constructor) ?? [];
  //       if (columns.includes(p)) return Reflect.set(target[_data], p, value);
  //       return Reflect.set(target, p, value, receiver);
  //     },
  //     get(target: Model, p: number | string | symbol, receiver: any) {
  //       if (Reflect.has(target, p)) return Reflect.get(target, p, receiver);
  //       return Reflect.get(target[_data], p);
  //     }
  //   });
  // }

  /**
   * 模型是否已存在
   */
  // exists = false;

  /**
   * 填充模型默认属性
   */
  // fill(data: Record<string, any>) {
  //   const columns = Reflect.getMetadata('columns', this.constructor);
  //   for (const column of columns) {
  //     if (data[column]) {
  //       this.setAttribute(column, data[column]);
  //     }
  //   }
  //   return this;
  // }

  // setAttribute(key: string, value: any) {
  //   this.attributes[key] = value;
  //   return this;
  // }

  // getAttribute(key: string) {
  //   if (!key) return;
  //   return this.attributes[key];
  // }

  // create(data: Record<string, any>) {
  //   const columns = Reflect.getMetadata('columns', this.constructor);
  //   for (const column of columns) {
  //     this.setAttribute(column, data[column]);
  //   }
  //   return this;
  // }

  // toJSON() {
  //   const columns = Reflect.getMetadata('columns', this.constructor) ?? [];
  //   const getterColumns = Reflect.getMetadata('getter-columns', this.constructor) ?? [];
  //   const res: Record<string, any> = {};
  //   for (const column of columns) {
  //     res[column] = this[column as keyof this];
  //   }
  //   for (const column of getterColumns) {
  //     res[column] = this[column as keyof this];
  //   }
  //   return res;
  // }

  // [inspect.custom]() {
  //   return this.toJSON();
  // }

  // newModelBuilder() {
  //   return (new ModelBuilder(this)).prepare();
  // }

  // getAttributesWithoutPrimaryKey() {
  //   //
  // }

  // async save() {
  //   const query = this.newModelBuilder();

  //   // 已存在模型
  //   if (this.exists) {

  //   }
  //   // 不存在模型
  //   else {
  //     await query.insert(this.attributes);
  //   }
  // }
}