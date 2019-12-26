// import { inspect } from 'util';
// import { Base } from '../base';
import { ComponentType } from '../symbol';
// import { ModelBuilder } from '../model/builder';
import { Model, ColumnDescription, RelationDesc } from '../model/model';
import { HasRelations } from '../model/relations/has-relations.abstract';
import { format as dateFormat, getUnixTime } from 'date-fns';

@Reflect.metadata('type', ComponentType.Entity)
@Reflect.metadata('primaryKey', 'id')
@Reflect.metadata('connection', 'default')
export abstract class Entity {
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
  private withs: Map<string, HasRelations<this>> = new Map();

  /**
   * 渴求式加载数据集合
   * Eager load data set
   */
  private relations: Record<string, any> = {};

  /**
   * 创建实体实例
   */
  constructor() {
    this.resolve();
    this.fill(this);
    return new Proxy(this, {
      set(target: Entity, p: number | string | symbol, value: any, receiver: any) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.set(target, p, value, receiver);
        target.setAttribute(p, value);
        return true;
      },
      get(target: Entity, p: number | string | symbol, receiver: any) {
        if (typeof p === 'string' && target.columns.has(p)) return target.getAttribute(p);
        return Reflect.get(target, p, receiver);
      }
    });
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
    return this[this.getPrimaryKey() as keyof this];
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
    this.relations[key] = value;
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
   * 获取实体数据
   */
  getAttributes() {
    const data: Record<string, any> = {};
    for (const column of this.columns.keys()) {
      data[column] = this.attributes[column];
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
    return this.attributes[key];
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
  fill(attributes: Record<string, any> = {}) {
    // 只有在实体声明的字段才会被填充
    // Only fields declared in the entity are populated
    const keys = this.columns.keys();
    for (const columnKey of keys) {
      if (Reflect.has(attributes, columnKey)) {
        this.attributes[columnKey] = attributes[columnKey];
      }
    }
    return this;
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
  setWith(relation: string, value: HasRelations<this>) {
    this.withs.set(relation, value);
    return this;
  }

  /**
   * 获取实体对应的表名
   */
  getTable() {
    return this.table;
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
   * 自动保存/更新记录
   */
  async save(): Promise<boolean> {
    return (new Model(this)).save();
  }

  /**
   * 根据主键 id 获取记录
   * @param id 
   */
  async get(id: number | string): Promise<this> {
    return (new Model(this)).get(id);
  }
}