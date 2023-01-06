import { Container } from '../../container';
import { Application } from '../../foundation/application';
import { Database } from '../database';
import { Builder } from '../database/builder';
import { Paginator, PaginatorOption } from '../../pagination';
// import { fakeBaseClass } from '../utils/fake-base-class';
import { Model } from './model';
import { Repository } from './repository';

export class ModelBuilder<TEntity = any>{
  /**
     * Application instance
     */
  private app: Application = Container.get('app');

  /**
     * Database query builder instance
     */
  private builder: Builder;

  /**
     * model instance
     */
  private model: Model<TEntity>;

  /**
     * repository instance
     */
  private repository: Repository;

  /**
     * 不走代理的接口列表
     */
  private throughs: string[] = ['insert', 'update', 'increment', 'decrement', 'delete', 'aggregate', 'count', 'max', 'min', 'sum', 'avg'];

  /**
     * Create Builder
     * @param model
     */
  constructor(model: Model<TEntity>, repository: Repository) {
    this.model = model;
    this.repository = repository;
    this.builder = this.newBuilderInstance();
    // Proxy class
    return new Proxy(this, this.proxy);
  }

  /**
     * Model builder proxy
     */
  get proxy(): ProxyHandler<this> {
    return {
      get(target: any, p: string | number | symbol, receiver: any) {
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
        return (this.builder[p] as any)(...args);
      }
      (this.builder[p] as any)(...args);
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
        this.model.getConnectionName()
      )
      .table(
        this.model.getTable()
      );
  }

  /**
     * 使用实体的字段
     */
  useEntityColumns() {
    this.builder.columns(
      ...this.model.getColumns().keys()
    );
    return this;
  }

  /**
     * get database builder
     */
  getBuilder() {
    return this.builder;
  }

  /**
     * 关联预加载
     */
  with(relation: string, callback?: (query: ModelBuilder<TEntity>) => void) {
    this.repository.with(relation, callback);
    return this;
  }

  /**
     * 查询数据集
     * @override
     */
  async find() {
    if (this.model.isForceDelete() || this.repository.needWithTrashed) {
      const records = await this.builder.find();
      return this.model.resultToRepositories(this.repository, records);
    }
    if (this.model.getSoftDeleteDefaultValue() === null) {
      this.builder.whereNull(
        this.model.getSoftDeleteKey()
      );
    } else {
      this.builder.where(
        this.model.getSoftDeleteKey(),
        this.model.getSoftDeleteDefaultValue()
      );
    }
    const records = await this.builder.find();
    return this.model.resultToRepositories(this.repository, records);
  }

  /**
     * 查询数据集和 count
     */
  async findAndCount(): Promise<[(Repository<TEntity> & TEntity)[], number]> {
    if (this.model.isForceDelete() || this.repository.needWithTrashed) {
      const [records, count] = await this.builder.findAndCount();
      const results = await this.model.resultToRepositories(this.repository, records);
      return [results, count];
    }
    if (this.model.getSoftDeleteDefaultValue() === null) {
      this.builder.whereNull(
        this.model.getSoftDeleteKey()
      );
    } else {
      this.builder.where(
        this.model.getSoftDeleteKey(),
        this.model.getSoftDeleteDefaultValue()
      );
    }
    const [records, count] = await this.builder.findAndCount();
    const results = await this.model.resultToRepositories(this.repository, records);
    return [results, count];
  }

  /**
     * 分页查询
     * @param page 
     * @param perPage 
     */
  async pagination(page: number, perPage = 10, option?: PaginatorOption) {
    this.builder.take(perPage).skip((page - 1) * perPage);
    const [items, count] = await this.findAndCount();
    const paginator: Paginator = new Paginator(
      items.map(item => item.getAttributes()),
      count,
      page,
      perPage,
      option
    );
    return paginator;
  }

  /**
     * 查询单条记录
     */
  async first() {
    if (!this.model.isForceDelete() && !this.repository.needWithTrashed) {
      if (this.model.getSoftDeleteDefaultValue() === null) {
        this.builder.whereNull(
          this.model.getSoftDeleteKey()
        );
      } else {
        this.builder.where(
          this.model.getSoftDeleteKey(),
          this.model.getSoftDeleteDefaultValue()
        );
      }
    }
    const record = await this.builder.first();
    if (!record) return;
    return this.model.resultToRepository(this.repository, record);
  }

  // private secret(record: Record<string, any>) {
  //     if (this.repository.needWithSecret) return record;
  //     const keys = Object.keys(record);
  //     const columns = this.model.getColumns()
  //     for (const [column, desc] of columns) {
            
  //     }

  // }
  /**
     * 查询记录是否存在，如果存在直接返回，如果不存在则创建
     */
  async firstOrCreate(attributes: Record<string, any>): Promise<(Repository<TEntity> & TEntity)> {
    const repos = await this.first();
    if (repos) return repos;
    return await this.repository.create(attributes);
  }
}