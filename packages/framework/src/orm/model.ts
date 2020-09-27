import { format as dateFormat, getUnixTime } from 'date-fns';
import { BelongsTo, BelongsToMany, HasMany, HasOne, HasRelations } from './relations';
import { Repository } from './repository';

export interface ColumnDescription {
  type: string;
  length: number;
};

export type RelationTypes = 'hasOne' | 'belongsTo' | 'hasMany' | 'belongsToMany'

export interface RelationDesc {
  type: RelationTypes;
  entityFn: () => any;
  pivot?: any;
  foreignKey?: string;
  localKey?: string;
  relatedPivotKey?: string;
  foreignPivotKey?: string;
}

export class Model<TEntity = {}> {
  /**
   * table name
   */
  private _table: string;

  /**
   * connection name
   */
  private _connection: string;

  /**
   * columns map
   */
  private _columns: Map<string, ColumnDescription>;

  /**
   * primary key
   */
  private _primaryKey: string;

  /**
   * is auto incrementing?
   */
  private _incrementing: boolean;

  /**
   * soft delete key
   * If not defined, delete is forced
   */
  private _softDeleteKey?: string;

  /**
   * automatically insert the create timestamp
   */
  private _createTimestampKey?: string;

  /**
   * automatically update the update timestamp
   */
  private _updateTimestampKey?: string;

  /**
   * relation map
   */
  private _relationMap: Map<string, RelationDesc>;

  /**
   * 创建模型实例
   * @param entity 
   */
  constructor(Entity: { new(): TEntity }) {
    this._table = Reflect.getMetadata('table', Entity);
    this._connection = Reflect.getMetadata('connection', Entity) ?? 'default';
    this._columns = Reflect.getMetadata('columns', Entity) ?? new Map();
    this._primaryKey = Reflect.getMetadata('primaryKey', Entity) ?? 'id';
    this._incrementing = Reflect.getMetadata('incrementing', Entity) ?? true;
    this._softDeleteKey = Reflect.getMetadata('softDeleteKey', Entity);
    this._createTimestampKey = Reflect.getMetadata('createTimestampKey', Entity);
    this._updateTimestampKey = Reflect.getMetadata('updateTimestampKey', Entity);
    this._relationMap = Reflect.getMetadata('relations', Entity) || new Map();
  }

  /**
   * get table name
   */
  getTable() {
    return this._table;
  }

  /**
   * set table name
   * @param table 
   */
  setTable(table: string) {
    this._table = table;
    return this;
  }

  /**
   * get connection name
   * default is `default`
   */
  getConnectionName() {
    return this._connection ?? 'default';
  }

  /**
   * get primary key
   * default id `id`
   */
  getPrimaryKey() {
    return this._primaryKey ?? 'id';
  }

  /**
   * get columns map
   */
  getColumns() {
    return this._columns;
  }

  /**
   * check if is auto incrementing
   */
  isIncrementing() {
    return !!this._incrementing;
  }

  /**
   * get soft delete key
   */
  getSoftDeleteKey() {
    return this._softDeleteKey as string;
  }

  /**
   * check if is force dlete
   * if true, soft delete key is undefind
   */
  isForceDelete() {
    return !this._softDeleteKey;
  }

  /**
   * should update the update timestamp
   */
  hasUpdateTimestamp() {
    return !!this._updateTimestampKey;
  }

  /**
   * get update timestap key
   */
  getUpdateTimestampKey() {
    return this._updateTimestampKey;
  }

  /**
   * get fresh date use column type
   * @param key 
   */
  getFreshDateWithColumnKey(key: string) {
    const type = this.getColumnType(key);
    return this.getFormatedDate(type);
  }

  /**
   * should insert the create timestamp
   */
  hasCreateTimestamp() {
    return !!this._createTimestampKey;
  }

  /**
   * get create timestamp key
   */
  getCreateTimestampKey() {
    return this._createTimestampKey;
  }

  /**
   * create the repository instance
   */
  createRepository(): Repository<TEntity> & TEntity {
    const repos = new Repository<TEntity>(this);
    return repos as Repository<TEntity> & TEntity;
  }

  /**
   * 获取字段类型
   * @param key 
   */
  getColumnType(key: string) {
    return this._columns.get(key)?.type;
  }

  /**
   * get relation map
   */
  getRelationMap() {
    return this._relationMap;
  }

  /**
   * get date with database column type
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
   * get realtion instance with relation name
   * @param relation 
   */
  getRelationImp(relation: string): HasRelations | undefined {
    const relationDesc = this.getRelationMap().get(relation);
    if (!relationDesc) return;
    if (relationDesc) {
      const RelationEntity = relationDesc.entityFn();
      const model = new Model(RelationEntity);
      switch (relationDesc.type) {
        case 'hasOne':
          return new HasOne(
            this,
            model,
            relationDesc.foreignKey,
            relationDesc.localKey
          );
        case 'belongsTo':
          return new BelongsTo(
            this,
            model,
            relationDesc.foreignKey,
            relationDesc.localKey
          );
        case 'hasMany':
          return new HasMany(
            this,
            model,
            relationDesc.foreignKey,
            relationDesc.localKey
          );
        case 'belongsToMany':
          return new BelongsToMany(
            this,
            model,
            relationDesc.pivot,
            relationDesc.foreignPivotKey,
            relationDesc.relatedPivotKey
          );
        default:
          return;
      }
    }
    return;
  }

  /**
   * convert data to repository instance
   * @param data 
   */
  async resultToRepository(parentRepos: Repository, data: Record<string, any>, isFromCollection = false): Promise<(Repository<TEntity> & TEntity)> {
    const repos = this.createRepository()
      .setExists(true)
      .fill(data);
    // Eager loading
    if (!isFromCollection && parentRepos.getWiths().size > 0) {
      await repos.eagerly(parentRepos.getWiths(), repos);
    }
    return repos as (Repository<TEntity> & TEntity);
  }

  /**‘
   * convert data to repository instance collection
   */
  async resultToRepositories(parentRepos: Repository, results: Record<string, any>[]): Promise<(Repository<TEntity> & TEntity)[]> {
    const data: Repository<TEntity>[] = [];
    for (const item of results) {
      data.push(
        await this.resultToRepository(parentRepos, item, true)
      );
    }
    // Eager loading
    if (parentRepos.getWiths().size > 0) {
      await parentRepos.eagerlyCollection(parentRepos.getWiths(), data);
    }
    return data as (Repository<TEntity> & TEntity)[];
  }
}