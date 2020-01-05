// import { format as dateFormat, getUnixTime } from 'date-fns';
import { Entity } from '../base/entity';
import { Builder } from '../database/builder';
import { ModelBuilder } from './builder';
import { HasRelations } from './relations/has-relations.abstract';
import { HasOne, BelongsTo, HasMany, BelongsToMany } from './relations';
import { format as dateFormat, getUnixTime } from 'date-fns';
import { Container } from '../container';
import { Application } from '../foundation/application';


export type RelationTypes = 'hasOne' | 'belongsTo' | 'hasMany' | 'belongsToMany'

export interface RelationDesc {
  type: RelationTypes;
  entity: typeof Entity;
  pivot?: typeof Entity;
  foreignKey?: string;
  localKey?: string;
  relatedPivotKey?: string;
  foreignPivotKey?: string;
}

export interface ColumnDescription {
  type: string;
  length: number;
};

// export type ProxyModel = Model & Entity & ModelBuilder & Builder
// type ProxySoftDeleteModel = SoftDeleteModel & Entity & ModelBuilder & Builder

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Model{
  /**
   * 应用实例
   */
  private app: Application = Container.get('app');

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
  private columns: Map<string, ColumnDescription> = new Map();

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
   * 软删除字段名称
   * soft deletes key name
   */
  private softDeleteKey: string;

  /**
   * 自动创建时间字段名称
   * create timestamp key name
   */
  private createTimestampKey: string;

  /**
   * 自动更新时间字段名称
   * update timestamp key name
   */
  private updateTimestampKey: string;

  /**
   * 实体的关联关系描述集合
   * The associations of entities describe the set
   */
  private relationMap: Map<string, RelationDesc>;

  /**
   * 渴求式加载对象集合
   * Want to load a collection of objects
   */
  private withs: Map<string, HasRelations> = new Map();

  /**
   * 渴求式加载数据集合
   * Eager load data set
   */
  private relations: Map<string, Entity | Entity[]> = new Map();

  /**
   * 模型实体
   */
  // private entity: Entity; AAsae33

  /**
   * Create Model
   * @param entity
   */
  constructor() {
    // this.entity = entity;
    this.resolve();
    // this.fill(entity);
    // return new Proxy(this as unknown as Model, {
    //   set(target: Model, p: number | string | symbol, value: any, receiver: any) {
    //     if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.set(target, p, value, receiver);
    //     target.setAttribute(p, value);
    //     return true;
    //   },
    //   get(target: Model, p: number | string | symbol, receiver: any) {
    //     if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
    //     if (target.isEntityColumns(p) || target.isEntityRelations(p)) return target.getAttribute(p);
    //     return target.newModelBuilderInstance()[p as keyof Builder];
    //   }
    // });
  }

  /**
   * 解析 metadata
   */
  resolve() {
    this.table = Reflect.getMetadata('table', this.constructor);
    this.connection = Reflect.getMetadata('connection', this.constructor) ?? 'default';
    this.columns = Reflect.getMetadata('columns', this.constructor) ?? new Map();
    this.primaryKey = Reflect.getMetadata('primaryKey', this.constructor) ?? 'id';
    this.incrementing = Reflect.getMetadata('incrementing', this.constructor) ?? true;
    this.softDeleteKey = Reflect.getMetadata('softDeleteKey', this.constructor);
    this.createTimestampKey = Reflect.getMetadata('createTimestampKey', this.constructor);
    this.updateTimestampKey = Reflect.getMetadata('updateTimestampKey', this.constructor);
    this.relationMap = Reflect.getMetadata('relations', this.constructor) || new Map();
  }

  /**
   * 获取默认主键名
   * Gets the default primary key name
   */
  getPrimaryKey() {
    return this.primaryKey || 'id';
  }

  /**
   * 获取模型主键值
   * Gets the model primary key value
   */
  getPrimaryValue() {
    return this.getAttribute(this.getPrimaryKey());
  }

  /**
 * 获取是否是递增主键
 * Gets whether the primary key is incrementing
 */
  isIncrementing() {
    return this.incrementing;
  }

  /**
  * 获取软删除字段名
  */
  getSoftDeleteKey() {
    return this.softDeleteKey;
  }

  /**
  * 根据字段名获取字段类型
  * @param key 
  */
  getColumnType(key: string) {
    return this.columns.get(key)?.type;
  }

  /**
   * 获取 columns
   */
  getColumns() {
    return this.columns;
  }

  /**
   * 获取 relations
   */
  getRealtions() {
    return this.relations;
  }

  /**
   * 设置 relation
   * @param key 
   * @param value 
   */
  setRelation(key: string, value: any) {
    this.relations.set(key, value);
  }

  /**
   * 获取注入的关联关系
   */
  getRelationMap() {
    return this.relationMap;
  }

  /**
   * 设置实体是否在表中已存在
   * @param exists 
   */
  setExists(exists: boolean) {
    this.exists = exists;
    return this;
  }

  /**
   * 实体是否在表中已存在
   */
  isExists() {
    return this.exists;
  }

  /**
   * 是否是模型实体属性
   * @param column 
   */
  isEntityColumns(columnKey: string) {
    return this.getColumns()
      .has(columnKey);
  }

  /**
   * 是否是关联属性
   * Is it an associated property
   * @param columnKey 
   */
  isEntityRelations(columnKey: string) {
    return this.getRelationMap()
      .has(columnKey);
  }

  /**
   * 获取模型连接名
   * get connection name
   */
  getConnectioName() {
    return this.connection;
  }

  /**
   * need eagerly
   * @param relations 
   */
  with(...relations: string[]) {
    for (const relation of relations) {
      const relationImp = this.getRelationImp(relation);
      if (relationImp) {
        this.setWith(relation, relationImp);
      };
    }
    return this;
  }

  /**
   * get relation implementat
   * @param relation 
   */
  getRelationImp(relation: string): HasRelations | undefined {
    const relationDesc = this.getRelationMap().get(relation);
    if (!relationDesc) return;
    if (relationDesc) {
      switch (relationDesc.type) {
        case 'hasOne':
          return new HasOne(this, new relationDesc.entity(), relationDesc.foreignKey, relationDesc.localKey);
        case 'belongsTo':
          return new BelongsTo(this, new relationDesc.entity(), relationDesc.foreignKey, relationDesc.localKey);
        case 'hasMany':
          return new HasMany(this, new relationDesc.entity(), relationDesc.foreignKey, relationDesc.localKey);
        case 'belongsToMany':
          return new BelongsToMany(this, new relationDesc.entity(), relationDesc.pivot, relationDesc.foreignPivotKey, relationDesc.relatedPivotKey);
        default:
          return;
      }
    }
    return;
  }

  /**
   * 渴求式加载
   * @param result 
   */
  async eagerly(withs: Map<string, HasRelations>, result: Entity) {
    for (const [relation, relationImp] of withs) {
      await relationImp.eagerly(result, relation);
    }
  }

  /**
   * 渴求式加载集合
   * @param withs 
   * @param results 
   */
  async eagerlyCollection(withs: Map<string, HasRelations>, results: Entity[]) {
    for (const [relation, relationImp] of withs) {
      await relationImp.eagerlyMap(results, relation);
    }
  }

  /**
   * 根据字段类型获取当前时间
   * getFreshDateWithColumnKey
   * @param key 
   */
  getFreshDateWithColumnKey(key: string) {
    const type = this.getColumnType(key);
    return this.getFormatedDate(type);
  }

  /**
   * 是否配置了自动创建时间字段
   * has create timestamp
   */
  hasCreateTimestamp() {
    return !!this.createTimestampKey;
  }


  /**
   * 是否配置了自动更新时间字段
   * has update timestamp
   */
  hasUpdateTimestamp() {
    return !!this.updateTimestampKey;
  }

  /**
   * 获取自动创建时间字段名
   * get create timestamp
   */
  getCreateTimestampKey() {
    return this.createTimestampKey;
  }

  /**
   * 获取自动更新时间字段名
   * get update timestamp
   */
  getUpdateTimestampKey() {
    return this.updateTimestampKey;
  }

  /**
   * 添加字段名到待更新字段列表
   * @param column 
   */
  addUpdateAttributeColumn(column: string) {
    return this.updateAttributeColumns.add(column);
  }

  /**
   * 获取需要更新的字段属性
   * Gets the model attributes that need to be updated
   */
  getUpdatedAttributes() {
    const attributes: Record<string, any> = {};
    for (const column of this.updateAttributeColumns) {
      attributes[column] = this.attributes[column];
    }
    return attributes;
  }

  /**
   * 判断是否有需要更新的字段属性
   * Determine if there are model attributes that need to be updated
   */
  hasUpdatedAttributes() {
    return !!this.updateAttributeColumns.size;
  }

  /**
   * 获取渴求式加载关联关系
   */
  getWiths() {
    return this.withs;
  }

  /**
   * 设置渴求式加载关联关系
   * @param relation 
   * @param value 
   */
  setWith(relation: string, value: HasRelations) {
    this.withs.set(relation, value);
    return this;
  }

  /**
   * 获取实体对应的表名
   */
  getTable() {
    return this.table;
  }

  setTable(table: string) {
    this.table = table;
    return this;
  }

  /**
   * 获取实体对应的连接名
   */
  getConnectionName() {
    return this.connection;
  }

  /**
   * 记录是否需要被完全删除
   * Whether the record needs to be deleted completely
   */
  isForceDelete() {
    return !this.softDeleteKey;
  }

  /**
   * 获取当前格式化的时间格式
   * 根据数据库字段格式进行格式化
   * @param type 
   */
  getFormatedDate(type = 'int') {
    switch (type.toLowerCase()) {
      case 'date':
        return dateFormat(new Date(), 'yyyy-MM-dd');
      case 'time':
        return dateFormat(new Date(), 'HH:MM:SS');
      case 'year':
        return dateFormat(new Date(), 'yyyy');
      case 'datetime':
        return dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
      case 'timestamp':
        return dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
      case 'int':
      default:
        return getUnixTime(new Date());
    }
  }

  /**
   * 生成模型查询构造类实例
   * Generate model query construct class instances
   */
  newModelBuilderInstance(): ModelBuilder & Builder {
    return (new ModelBuilder(this as unknown as Model)).prepare() as ModelBuilder & Builder;
  }

  /**
   * 执行更新数据库记录操作
   * Perform update database record operations
   * @param query 
   * @param attributes 
   */
  async executeUpdate(query: ModelBuilder & Builder, attributes: Record<string, any>) {
    await query.where(
      this.getPrimaryKey(),
      '=',
      this.getPrimaryValue()
    ).update(attributes);
    return true;
  }

  /**
   * 执创建数据库记录操作
   * Perform the create database record operation
   * @param query 
   * @param attributes 
   */
  async executeInsertAndSetId(query: ModelBuilder & Builder) {
    const id = await query.insert(
      this.getAttributes()
    );
    this.setAttribute(
      this.getPrimaryKey(),
      id
    );
    return this;
  }

  /**
   * 删除
   */
  async delete() {
    if (!this.getPrimaryKey()) {
      throw new Error('Primary key not defined');
    }
    if (!this.isExists()) return;

    await this.executeDelete();

    return true;
  }

  /**
   * 执行删除操作
   */
  async executeDelete() {
    // 创建模型查询构建器
    const query = this.newModelBuilderInstance();
    // 强制删除数据库记录的情况
    if (this.isForceDelete()) {
      await query.where(
        this.getPrimaryKey(),
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
    
    attributes[this.getSoftDeleteKey()] = this.getFormatedDate(
      this.getColumnType(
        this.getSoftDeleteKey()
      )
    );
    // 需要自动更新时间
    if (this.hasUpdateTimestamp()) {
      const updateTimestampKey = this.getUpdateTimestampKey();
      attributes[updateTimestampKey] = this.getFormatedDate(
        this.getColumnType(updateTimestampKey)
      );
    } 
    // 执行更新操作
    return query.where(
      this.getPrimaryKey(),
      '=',
      this.getPrimaryValue()
    ).update(attributes);
  }

  /**
   * 获取实体数据
   */
  getAttributes(): Record<string, any> {
    // console.log(this.relations);
    const data: Record<string, any> = {};
    for (const column of this.columns.keys()) {
      data[column] = this.attributes[column];
    }
    for (const realtion of this.relations.keys()) {
      const _realtion = this.relations.get(realtion);
      if (_realtion) {
        if (Array.isArray(_realtion)) {
          data[realtion] = _realtion.map(item => item?.getAttributes());
        } else {
          data[realtion] = _realtion?.getAttributes();
        }
      }
    }
    return data;
  }

  /**
   * 获取实体属性数据
   * Get model attributes
   * @param key 
   */
  getAttribute(key: string) {
    if (!key) return;
    if (this.columns.has(key)) return this.attributes[key];
    if (this.relations.has(key)) return this.relations.get(key);
  }

  /**
   * 设置实体属性
   * Set model properties
   * @param key 
   * @param value 
   */
  setAttribute(key: string, value: any) {
    this.attributes[key] = value;
    // 模型已存在的情况下配置更新字段
    // Configure update fields if the model already exists
    if (this.exists) {
      this.addUpdateAttributeColumn(key);
    }
    return this;
  }

  /**
 * 填充数据对象到实体属性中
 * @param attributes 
 */
  fill(attributes: Record<string, any> | Entity = {}) {
    // 只有在实体声明的字段才会被填充
    // Only fields declared in the entity are populated
    const keys = this.columns.keys();
    if (attributes instanceof Entity) {
      for (const columnKey of keys) {
        if (Reflect.has(attributes, columnKey)) {
          this.attributes[columnKey] = attributes.getAttribute(columnKey);
        }
      }
      return this;
    }

    for (const columnKey of keys) {
      if (Reflect.has(attributes, columnKey)) {
        this.attributes[columnKey] = attributes[columnKey];
      }
    }
    return this;
  }

  /**
   * 新建模型实例
   */
  newInstance() {
    return this.app.get<Model>(this.constructor);
  }

  /**
   * 将记录转成模型返回
   * @param result 
   * @param isFromCollection 
   */
  async resultToModel(result: Record<string, any>, isFromCollection = false) {
    const model = this.newInstance();
    model.fill(result);
    model.setExists(true);
    if (!isFromCollection && this.getWiths().size > 0) {
      await model.eagerly(this.getWiths(), model);
    }
    return model;
  }

  /**
   * 将记录转成模型集合返回
   * @param results 
   */
  async resultsToModels(results: Record<string, any>[]) {
    const data = [];
    for (const item of results) {
      data.push(
        await this.resultToModel(item, true)
      );
    }
    // 渴求式加载
    if (this.getWiths().size > 0) {
      await this.eagerlyCollection(this.getWiths(), data);
    }
    return data;
  }

  /**
   * 根据主键获取记录
   * @param id 
   */
  async get(id: number | string) {
    const query = this.newModelBuilderInstance();
    const res = await query.get(id);
    const model = await this.resultToModel(res);
    return model;
  }

  /**
   * 获取单条数据
   */
  async first() {
    const query = this.newModelBuilderInstance();
    if (!this.isForceDelete()) {
      query.whereNull(
        this.getSoftDeleteKey()
      );
    }
    const res = await query.first();
    const resultModel = await this.resultToModel(res);
    return resultModel;
  }

  /**
   * 获取多条数据
   */
  async find() {
    const query = this.newModelBuilderInstance();
    if (this.isForceDelete()) {
      const results = await query.find();
      const resultModels = await this.resultsToModels(results);
      return resultModels;
    }
    const results = await query.whereNull(
      this.getSoftDeleteKey()
    ).find();
    const resultModels = await this.resultsToModels(results);
    return resultModels;
  }

  /**
   * 创建/更新数据库记录操作
   * 自动根据场景来执行更新/创建操作
   * Create/update database record operations
   * Update/create operations are performed automatically based on the scenario
   */
  async save(): Promise<boolean> {
    const query = this.newModelBuilderInstance();
    // 已存在模型
    // Existing model
    if (this.isExists()) {
      // 没有字段需要更新的时候，直接返回 true
      if (!this.hasUpdatedAttributes()) return true;
      // 如果需要自动更新时间
      if (this.hasUpdateTimestamp()) {
        this.setAttribute(
          this.getUpdateTimestampKey(),
          this.getFreshDateWithColumnKey(this.getUpdateTimestampKey())
        );
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
      if (this.hasCreateTimestamp()) {
        this.setAttribute(
          this.getCreateTimestampKey(),
          this.getFreshDateWithColumnKey(this.getCreateTimestampKey())
        );
      }

      // 如果是递增主键
      // 需要插入记录后并且返回记录id，将记录id设置到当前模型中
      if (this.isIncrementing()) {
        // 执行插入操作并且设置模型主键值
        await this.executeInsertAndSetId(query);
      }
      // 如果不是递增主键
      // 普通主键必须由用户定义插入
      // 由于不存在自动递增主键，当数据字段为空的时候直接返回
      else {
        if (!this.getColumns().size) return true;
        await query.insert(
          this.getAttributes()
        );
      }
    }
    return true;
  }

  /**
   * JSON.stringify parser
   */
  toJSON() {
    return this.getAttributes();
  }
}

// export type Model = _Model & ModelBuilder & Builder;
// export const Model: new (entity: Entity) => Model = _Model as any;