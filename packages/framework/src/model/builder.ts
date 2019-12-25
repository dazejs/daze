import { Model } from './model';
import { Entity } from '../base/entity';
import { Application } from '../foundation/application';
import { Container } from '../container';
import { Builder } from '../database/builder';
import { Database } from '../database';
// import { SoftDeleteModel } from './soft-delete-model';

export class ModelBuilder<TEntity extends Entity> {

  /**
   * Application instance
   */
  app: Application = Container.get('app');

  /**
   * Model instance
   */
  model: Model<TEntity>;

  /**
   * Database query builder instance
   */
  builder: Builder;

  /**
   * 不走代理的接口列表
   */
  throughs: string[] = ['insert', 'aggregate', 'count', 'max', 'min', 'sum', 'avg']; 

  /**
   * Create Builder For Model
   * @param model 
   */
  constructor(model: Model<TEntity>) {
    this.model = model;
    this.builder = this.newBuilderInstance();
    // Proxy class
    return new Proxy(this, this.proxy);
  } 

  get proxy(): ProxyHandler<this> {
    return {
      get(target: ModelBuilder<TEntity>, p: string | number | symbol, receiver: any) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
        if (target.builder && Reflect.has(target.builder, p) && typeof target.builder[p as keyof Builder] === 'function') {
          return target.handleForwardCalls(p as keyof Builder);
        }
        // if (target.builder && Reflect.has(target.builder, p) && typeof target.builder[p as keyof Builder] === 'function') {
        //   return new Proxy(target.builder[p as keyof Builder] as Function, {
        //     apply(target2: any, _thisArg: any, argArray?: any) {
        //       Reflect.apply(target2, target.builder, argArray);
        //       return new Proxy(target, target.proxy);
        //     }
        //   });
        // }
        return Reflect.get(target, p, receiver);
      }
    };
  }

  handleForwardCalls(p: keyof Builder) {
    return (...args: any[]) => {
      if (this.throughs.includes(p)) {
        return (this.builder[p] as Function)(...args);
      }
      (this.builder[p] as Function)(...args);
      return new Proxy(this, this.proxy);
    };
  }

  /**
   * 根据模型信息创建查询构造器实例
   * Create a query constructor instance based on model information
   */
  newBuilderInstance() {
    return this.app.get<Database>('db')
      .connection(
        this.model.getConnectioName()
      )
      .table(
        this.model.getTable()
      );
  }

  setModel(model: Model<TEntity>) {
    this.model = model;
    return this;
  }

  getModel() {
    return this.model;
  }

  newModelInstance(attributes: Record<string, any>, exists = false) {
    return new Model<TEntity>(
      this.model.getEntity()
    ).setExists(exists).fill(attributes);
  }

  async toModel(result: Record<string, any>, isFromCollection = false) {
    // 创建一个已存在记录的模型
    // Create a model of an existing record
    const model = this.newModelInstance(result, true) as Model<TEntity> & TEntity;
    // 预载入查询
    if (!isFromCollection && this.model.getWiths().size > 0) {
      await model.eagerly(this.model.getWiths(), model);
    }

    return model;
  }

  async toModelCollection(result: Record<string, any>[]) {
    const data = [];
    for (const item of result) {
      data.push(
        await this.toModel(item, true)
      );
    }
    return data;
  }

  /**
   * 查询预处理
   */
  prepare() {
    this.builder.columns(
      ...this.model.getColumns().keys()
    );
    return this as this & Builder & TEntity;
  }


  /**
   * 创建数据库记录
   * Create database records
   * @param attributes 
   */
  async create(attributes: Record<string, any>) {
    // 创建一个不存在记录的模型
    // Create a model with no records
    const model = this.newModelInstance(attributes, false);
    model.save();
    return model;
  }

  /**
   * 查询数据集
   */
  async find() {
    if (this.model.isForceDelete()) {
      const res = await this.builder.find();
      return this.toModelCollection(res);
    }
    const res = await this.builder.whereNull(
      this.model.getSoftDeleteKey()
    ).find();
    return this.toModelCollection(res);
  }

  async first() {
    if (!this.model.isForceDelete()) { 
      this.builder.whereNull(
        this.model.getSoftDeleteKey()
      );
    }
    const res = await this.builder.first();
    return this.toModel(res);
  }

  /**
   * 根据主键获取单条记录
   * @param id 
   */
  async get(id: number | string) {
    if (!this.model.isForceDelete()) { 
      this.builder.whereNull(
        this.model.getSoftDeleteKey()
      );
    }
    const res = await this.builder.where(
      this.model.getDefaultPrimaryKey(),
      '=',
      id
    ).first();
    return this.toModel(res);
  }
}