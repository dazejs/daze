import { Model } from './model';
import { Application } from '../foundation/application';
import { Container } from '../container';
import { Builder } from '../database/builder';
import { Database } from '../database';

export class ModelBuilder {
  /**
   * Application instance
   */
  app: Application = Container.get('app');

  /**
   * Model instance
   */
  model: Model;

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
  constructor(model: Model) {
    this.model = model;
    this.builder = this.newBuilderInstance();
    // Proxy class
    return new Proxy(this, this.proxy);
  } 

  /**
   * Model builder proxy
   */
  get proxy(): ProxyHandler<this> {
    return {
      get(target: ModelBuilder, p: string | number | symbol, receiver: any) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
        if (target.builder && Reflect.has(target.builder, p) && typeof target.builder[p as keyof Builder] === 'function') {
          return target.handleForwardCalls(p as keyof Builder);
        }
        return Reflect.get(target, p, receiver);
      }
    };
  }

  /**
   * handle proxy getter
   * @param p 
   */
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

  /**
   * set new model
   * @param model 
   */
  setModel(model: Model) {
    this.model = model;
    return this;
  }

  /**
   * get builder model
   */
  getModel() {
    return this.model;
  }

  /**
   * new model instance
   * @param attributes 
   * @param exists 
   */
  newModelInstance(attributes: Record<string, any>, exists = false) {
    return this.model.setExists(exists).fill(attributes);
  }

  /**
   * 查询预处理
   */
  prepare() {
    this.builder.columns(
      ...this.model.getColumns().keys()
    );
    return this as this & Builder;
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
      return this.builder.find();
    }
    return this.builder.whereNull(
      this.model.getSoftDeleteKey()
    ).find();
  }

  /**
   * 查询单条记录
   */
  async first() {
    if (!this.model.isForceDelete()) { 
      this.builder.whereNull(
        this.model.getSoftDeleteKey()
      );
    }
    return this.builder.first();
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
    return this.builder.where(
      this.model.getPrimaryKey(),
      '=',
      id
    ).first();
  }
}