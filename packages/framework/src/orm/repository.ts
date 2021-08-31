import { Model } from './model';
// import { Entity } from './entity';
import { ModelBuilder } from './builder';
import { Builder } from '../database/builder';
import { HasRelations, BelongsToMany } from './relations';

const inspect = Symbol.for('nodejs.util.inspect.custom');

export class Repository<TEntity = any> {
  /**
   * 模型仓库是否已存在
   */
  private exists = false;

  /**
   * 模型实例
   */
  private model: Model<TEntity>;

  /**
   * 已更新的字段名集合
   */
  private updateAttributeColumns: Set<string> = new Set();

  /**
   * 渴求式加载对象集合
   * Want to load a collection of objects
   */
  private withs: Map<string, {
    relation: HasRelations;
    queryCallback?: (query: Builder) => void;
  }> = new Map();

  /**
   * 创建模型仓库实例
   * @param model 
   */
  constructor(model: Model<TEntity>) {
    this.model = model;
    return new Proxy(this, this.proxy());
  }

  /**
   * 代理器
   */
  private proxy(): ProxyHandler<this> {
    return {
      set(target: any, p: string | number | symbol, value: any, receiver: any) {
        if (target.isExists()) {
          target.addUpdateAttributeColumn(p);
        }
        return Reflect.set(target, p, value, receiver);
      }
    };
  }

  /**
   * 是否已存在
   */
  isExists() {
    return this.exists;
  }

  /**
   * 设置是否已存在
   * @param exists 
   */
  setExists(exists = true) {
    this.exists = exists;
    return this;
  }

  /**
   * 是否更新了模型仓库的数据
   */
  private hasUpdatedAttributes() {
    return !!this.updateAttributeColumns.size;
  }

  /**
   * 添加修改更新的字段
   * @param key 
   */
  private addUpdateAttributeColumn(key: string) {
    this.updateAttributeColumns.add(key);
    return this;
  }

  /**
   * 获取已更新的属性
   */
  private getUpdatedAttributes() {
    const attributes: Record<string, any> = {};
    for (const column of this.updateAttributeColumns) {
      attributes[column] = (this as any)[column];
    }
    return attributes;
  }
  
  /**
   * 创建模型查询构造器
   */
  createQueryBuilder(): ModelBuilder<TEntity> & Builder {
    return (new ModelBuilder(this.model, this)).prepare() as ModelBuilder<TEntity> & Builder;
  }

  /**
   * 获取主键值
   */
  getPrimaryValue() {
    return (this as any)[this.model.getPrimaryKey()] ?? null;
  }

  /**
   * 填充数据到仓库
   * @param data 
   */
  fill(data: any) {
    if (!data) return this;
    const keys = this.model.getColumns().keys();
    for (const key of keys) {
      this.setAttribute(key, data[key]);
    }
    return this;
  }

  /**
   * 获取仓库数据属性
   */
  getAttributes() {
    const attributes: Record<string, any> = {};

    const columns = this.model.getColumns().keys();
    for (const column of columns) {
      attributes[column] = (this as any)[column];
    }

    const customs = this.model.getCustomColumns().keys();
    for (const custom of customs) {
      attributes[custom] = (this as any)[custom];
    }

    const relationMap = this.model.getRelationMap();
    for (const realtion of relationMap.keys()) {
      const _realtion = (this as any)[realtion];
      if (_realtion) {
        if (Array.isArray(_realtion)) {
          attributes[realtion] = _realtion.map(item => item?.getAttributes());
        } else {
          attributes[realtion] = _realtion?.getAttributes();
        }
      }
    }



    return attributes;
  }

  /**
   * 设置仓库数据属性
   * @param key 
   * @param value 
   */
  setAttribute(key: string, value: any) {
    if (value === undefined) return this;
    (this as any)[key] = value;
    // 模型已存在的情况下配置更新字段
    // Configure update fields if the model already exists
    if (this.isExists()) {
      const columns = [...this.model.getColumns().keys()];
      if (columns.includes(key)) {
        this.addUpdateAttributeColumn(key);
      }
    }
    return this;
  }

  /**
   * get attr with key
   * @param key 
   */
  getAttribute(key: string) {
    if (!key) return;
    if (
      this.model.getColumns().has(key) ||
      this.model.getCustomColumns().includes(key) ||
      this.model.getRelationMap().has(key)
    ) return (this as any)[key];
  }

  /**
   * Eager loading
   * @param relations 
   */
  with(relation: string, callback?: (query: Builder) => void) {
    const relationImp = this.model.getRelationImp(relation);
    if (relationImp) {
      this.setWith(relation, relationImp, callback);
    };
    return this;
  }

  /**
   * 获取渴求式加载关联关系
   */
  getWiths() {
    return this.withs;
  }

  /**
   * set Eager load names
   * @param withs 
   */
  setWiths(withs: Map<string, any>) {
    this.withs = withs;
    return this;
  }

  /**
   * 设置渴求式加载关联关系
   * @param relation 
   * @param value 
   */
  setWith(relation: string, value: HasRelations, queryCallback?: (query: Builder) => void) {
    this.withs.set(relation, {
      relation: value,
      queryCallback
    });
    return this;
  }

  /**
   * 渴求式加载
   * @param result 
   */
  async eagerly(withs: Map<string, {
    relation: HasRelations;
    queryCallback?: (query: Builder) => void;
  }>, result: Repository) {
    for (const [relation, relationOption] of withs) {
      const { relation: relationImp, queryCallback } = relationOption; 
      await relationImp.eagerly(result, relation, queryCallback);
    }
  }

  /**
   * 渴求式加载集合
   * @param withs 
   * @param results 
   */
  async eagerlyCollection(withs: Map<string, {
    relation: HasRelations;
    queryCallback?: (query: Builder) => void;
  }>, results: Repository[]) {
    for (const [relation, relationOption] of withs) {
      const { relation: relationImp, queryCallback } = relationOption; 
      await relationImp.eagerlyMap(results, relation, queryCallback);
    }
  }

  /**
   * 对当前仓库执行删除操作
   */
  async delete() {
    if (!this.model.getPrimaryKey()) {
      throw new Error('Primary key not defined');
    }
    if (!this.isExists()) return false;
    await this.executeDelete();
    return true;
  }

  /**
   * 执行删除操作
   */
  private async executeDelete() {
    // 创建模型查询构建器
    const query = this.createQueryBuilder();
    // 强制删除数据库记录的情况
    if (this.model.isForceDelete()) {
      await query.where(
        this.model.getPrimaryKey(),
        '=',
        this.getPrimaryValue()
      ).delete();
      // 设置模型为不存在
      this.setExists(false);
      return true;
    }
    // 软删除的情况
    // 需要更新的字段
    const attributes: Record<string, any> = {};

    attributes[this.model.getSoftDeleteKey()] = this.model.getFormatedDate(
      this.model.getColumnType(
        this.model.getSoftDeleteKey()
      )
    );
    // 需要自动更新时间
    if (this.model.hasUpdateTimestamp()) {
      const updateTimestampKey = this.model.getUpdateTimestampKey() as string;
      attributes[updateTimestampKey] = this.model.getFormatedDate(
        this.model.getColumnType(updateTimestampKey)
      );
    }
    // 执行更新操作
    return query.where(
      this.model.getPrimaryKey(),
      '=',
      this.getPrimaryValue()
    ).update(attributes);
  }

  /**
   * 根据主键获取模型仓库实例
   * @param id 
   */
  async get(id: number | string) {
    const query = this.createQueryBuilder();
    if (!this.model.isForceDelete()) {
      query.whereNull(
        this.model.getSoftDeleteKey()
      );
    }
    return query.where(
      this.model.getPrimaryKey(),
      '=',
      id
    ).first();
  }

  /**
   * 创建/更新数据库记录操作
   * 自动根据场景来执行更新/创建操作
   * Create/update database record operations
   * Update/create operations are performed automatically based on the scenario
   */
  async save(): Promise<boolean> {
    const query = this.createQueryBuilder();
    // 已存在模型
    // Existing model
    if (this.isExists()) {
      // 没有字段需要更新的时候，直接返回 true
      if (!this.hasUpdatedAttributes()) return true;
      // 如果需要自动更新时间
      if (this.model.hasUpdateTimestamp()) {
        const key = this.model.getUpdateTimestampKey() as string;
        const val = this.model.getFreshDateWithColumnKey(key);
        (this as any)[key] = val;
      }
      // 获取需要更新的数据
      // 即模型实体有改动的的属性
      const updatedAttributes = this.getUpdatedAttributes();
      return this.executeUpdate(
        query,
        updatedAttributes
      );
    }
    // 不存在模型
    // There is no model
    else {
      if (this.model.hasCreateTimestamp()) {
        const key = this.model.getCreateTimestampKey() as string;
        const val = this.model.getFreshDateWithColumnKey(key);
        (this as any)[key] = val;
      }

      // 如果是递增主键
      // 需要插入记录后并且返回记录id，将记录id设置到当前模型中
      if (this.model.isIncrementing()) {
        // 执行插入操作并且设置模型主键值
        await this.executeInsertAndSetId(query);
      }
      // 如果不是递增主键
      // 普通主键必须由用户定义插入
      // 由于不存在自动递增主键，当数据字段为空的时候直接返回
      else {
        if (!this.model.getColumns().size) return true;
        await query.insert(
          this.getAttributes()
        );
      }
      this.setExists(true);
    }
    return true;
  }

  /**
   * execute an insert operation, and set inserted id
   * @param query 
   */
  private async executeInsertAndSetId(query: ModelBuilder & Builder) {
    const id = await query.insert(
      this.getAttributes()
    );
    this.setAttribute(
      this.model.getPrimaryKey(),
      id
    );
    return this;
  }

  /**
   * execute an update operation
   * @param query 
   * @param attributes 
   */
  private async executeUpdate(query: ModelBuilder & Builder, attributes: Record<string, any>) {
    await query.where(
      this.model.getPrimaryKey(),
      '=',
      this.getPrimaryValue()
    ).update(attributes);
    return true;
  }

  /**
   * 创建数据库记录
   * Create database records
   * @param attributes
   */
  async create(attributes: Record<string, any>) {
    // 创建一个不存在记录的模型
    // Create a repos with no records
    const repos = this.model.createRepository().fill(attributes).setExists(false);
    await repos.save();
    return repos;
  }

  /**
   * 根据主键值删除模型
   * @param ids 
   */
  async destroy(...ids: (number | string)[]) {
    let count = 0;
    if (!ids.length) return count;
    const key = this.model.getPrimaryKey();
    const results = await this.createQueryBuilder().whereIn(key, ids).find();
    for (const result of results) {
      if (await result.delete()) {
        count++;
      }
    }
    return count;
  }

  /**
   * 转成 json 时只输出属性数据
   */
  toJSON() {
    return this.getAttributes();
  }

  /**
   * 查看对象时只查看属性数据
   */
  [inspect]() {
    return this.toJSON();
  }

  /**
   * 设置关联关系
   * @param relation 
   * @param ids 
   */
  async attach(relation: string, ...ids: (number | string)[]) {
    if (!this.isExists()) {
      throw new Error('model does not exists!');
    }
    const relationMap = this.model.getRelationMap();
    if (!relationMap.has(relation) || relationMap.get(relation)?.type !== 'belongsToMany') {
      throw new Error(`model does not have many to many relation: [${relation}]!`);
    }
    const imp = this.model.getRelationImp(relation) as BelongsToMany;
    const insertData: any[] = [];
    for (const id of ids) {
      insertData.push({
        [`${imp.foreignPivotKey}`]: this.getPrimaryValue(),
        [`${imp.relatedPivotKey}`]: id,
      });
    }
    const repos: Repository<TEntity> = imp.pivot.createRepository();
    await repos
      .createQueryBuilder()
      .getBuilder()
      .insertAll(insertData);
    return repos;
  }

  /**
   * 取消关联关系
   * @param relation 
   * @param ids 
   */
  async detach(relation: string, ...ids: (number | string)[]) {
    if (!this.isExists()) {
      throw new Error('model does not exists!');
    }
    const relationMap = this.model.getRelationMap();
    if (!relationMap.has(relation) || relationMap.get(relation)?.type !== 'belongsToMany') {
      throw new Error(`model does not have many to many relation: [${relation}]!`);
    }
    const imp = this.model.getRelationImp(relation) as BelongsToMany;
    const repos: Repository<TEntity> = imp.pivot.createRepository();
    await repos
      .createQueryBuilder()
      .getBuilder()
      .where(imp.foreignPivotKey as string, '=', this.getPrimaryValue())
      .whereIn(imp.relatedPivotKey as string, ids)
      .delete();
    return repos;
  }
}