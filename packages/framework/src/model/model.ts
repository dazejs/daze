import { Entity } from '../base/entity';
import { ModelBuilder } from './builder';
import { Builder } from '../database/builder';

export class Model<TEntity extends Entity> {

  /**
   * 模型实体
   */
  private entity: TEntity;

  /**
   * 表名
   */
  private table: string;

  /**
   * 连接名
   */
  private connection: string;

  /**
   * 实体的数据库字段
   */
  private columns: string[] = [];

  /**
   * 主键名
   */
  private primaryKey: string;
  
  /**
   * 是否已经存在模型
   */
  private exists = false;

  /**
   * 模型属性
   */
  private attributes: Record<string, any> = {};

  /**
   * 表示主键是否是递增的
   */
  private incrementing = true;

  /**
   * 已更新的模型字段名
   */
  private updateAttributeColumns: Set<string> = new Set();

  /**
   * Create Model
   * @param entity
   */
  constructor(entity: TEntity) {
    this.entity = entity;

    this.resolveEntity(entity);

    return new Proxy(this, {
      set(target: Model<TEntity>, p: number | string | symbol, value: any, receiver: any) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.set(target, p, value, receiver);
        target.setAttribute(p, value);
        return true;
      },
      get(target: Model<TEntity>, p: number | string | symbol, receiver: any) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
        if (target.isEntityColumns(p)) return target.getAttribute(p);
        return target.newModelBuilderInstance()[p as keyof Builder];
      }
    });
  }

  /**
   * 是否是模型实体属性
   * @param column 
   */
  isEntityColumns(column: string) {
    return this.columns.includes(column);
  }

  /**
   * 设置模型是否已经存在
   * Sets whether the model already exists
   * @param exists
   */
  setExists(exists: boolean) {
    this.exists = exists;
    return this;
  }

  /**
   * 填充模型数据
   * Populate model data
   * @param attributes 
   */
  fill(attributes: Record<string, any> = {}) {
    // 只有在实体声明的字段才会被填充
    // Only fields declared in the entity are populated
    for (const column of this.columns) {
      if (Reflect.has(attributes, column)) {
        this.attributes[column] = attributes[column];
      }
    }
    return this;
  }

  /**
   * 设置模型属性
   * Set model properties
   * @param key 
   * @param value 
   */
  setAttribute(key: string, value: any) {
    this.attributes[key] = value;
    // 模型已存在的情况下配置更新字段
    // Configure update fields if the model already exists
    if (this.exists) {
      this.updateAttributeColumns.add(key);
    }
    return this;
  }

  /**
   * 获取模型属性
   * Get model attributes
   * @param key 
   */
  getAttribute(key: string) {
    if (!key) return;
    return this.attributes[key];
  }

  /**
   * 获取模型表名
   */
  getTable() {
    return this.table;
  }

  /**
   * 获取模型连接名
   */
  getConnectioName() {
    return this.connection;
  }

  /**
   * 获取模型实体字段数组
   */
  getColumns() {
    return this.columns;
  }

  /**
   * 获取所有的模型属性
   * Gets all model properties
   */
  getAttributes() {
    return this.attributes;
  }

  /**
   * 生成新的模型实例 - 已填充数据的模型
   * Generate a new model instance - the model with the populated data
   * @param attributes 
   */
  newModelInstance(attributes: Record<string, any>, exists = false) {
    return new Model<TEntity>(this.entity).setExists(exists).fill(attributes);
  }

  /**
   * 解析模型实体
   * Analytic model entity
   * @param entity 
   */
  private resolveEntity(entity: TEntity) {
    this.table = Reflect.getMetadata('table', entity.constructor);
    this.connection = Reflect.getMetadata('connection', entity.constructor) ?? 'default';
    this.columns = Reflect.getMetadata('columns', entity.constructor) ?? [];
    this.primaryKey = Reflect.getMetadata('primaryKey', entity.constructor) ?? 'id';
    this.incrementing = Reflect.getMetadata('incrementing', entity.constructor) ?? true;
  }

  /**
   * 生成模型查询构造类实例
   * Generate model query construct class instances
   */
  newModelBuilderInstance() {
    return (new ModelBuilder<TEntity>(this)).prepare();
  }

  /**
   * 获取需要更新的模型属性
   * Gets the model attributes that need to be updated
   */
  private getUpdatedAttributes() {
    const attributes: Record<string, any> = {};
    for (const column of this.updateAttributeColumns) {
      attributes[column] = this.attributes[column];
    }
    return attributes;
  }

  /**
   * 判断是否有需要更新的模型属性
   * Determine if there are model attributes that need to be updated
   */
  private hasUpdatedAttributes() {
    return !!this.updateAttributeColumns.size;
  }


  /**
   * 执行更新数据库记录操作
   * Perform update database record operations
   * @param query 
   * @param attributes 
   */
  async executeUpdate(query: ModelBuilder<TEntity> & Builder, attributes: Record<string, any>) {
    await query.where(this.getDefaultPrimaryKey(), '=', this.getPrimaryKeyVal()).update(attributes);
    return true;
  }

  /**
   * 执创建数据库记录操作
   * Perform the create database record operation
   * @param query 
   * @param attributes 
   */
  async executeInsertAndSetId(query: ModelBuilder<TEntity> & Builder) {
    const id = await query.insert(
      this.getAttributes()
    );
    this.setAttribute(
      this.getDefaultPrimaryKey(),
      id
    );
    return this;
  }

  /**
   * 获取默认主键名
   * Gets the default primary key name
   */
  getDefaultPrimaryKey() {
    return this.primaryKey || 'id';
  }

  /**
   * 获取模型主键值
   * Gets the model primary key value
   */
  getPrimaryKeyVal() {
    return this.attributes[this.getDefaultPrimaryKey()];
  }

  /**
   * 获取是否是递增主键
   * Gets whether the primary key is incrementing
   */
  getIncrementing() {
    return this.incrementing;
  }

  /**
   * 创建数据库记录
   * Create database records
   * @param attributes 
   */
  async create(attributes: Record<string, any>) {
    // 创建一个不存在记录的模型
    // Create a model with no records
    const model = this.newModelInstance(this.entity, false).fill(attributes);
    model.save();
    return model;
  }

  /**
   * 创建/更新数据库记录操作
   * 自动根据场景来执行更新/创建操作
   * Create/update database record operations
   * Update/create operations are performed automatically based on the scenario
   */
  async save() {
    const query = this.newModelBuilderInstance();
    // 已存在模型
    // Existing model
    if (this.exists) {
      if (!this.hasUpdatedAttributes()) return true;
      const updatedAttributes = this.getUpdatedAttributes();
      return this.executeUpdate(
        query,
        updatedAttributes
      );
    }
    // 不存在模型
    // There is no model
    else {
      // 如果是递增主键
      // 需要插入记录后并且返回记录id，将记录id设置到当前模型中
      if (this.getIncrementing()) {
        // 执行插入操作并且设置模型主键值
        await this.executeInsertAndSetId(query);
      }
      // 如果不是递增主键
      // 普通主键必须由用户定义插入
      // 由于不存在自动递增主键，当数据字段为空的时候直接返回
      else {
        if (!this.columns.length) return true;
        await query.insert(
          this.getAttributes()
        );
      }
    }
    return true;
  }
}