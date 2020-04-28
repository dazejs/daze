// import { Entity } from './entity';
import { Repository } from './repository';
import { format as dateFormat, getUnixTime } from 'date-fns';


export interface EntityMatadata {
  table: string;
  connection: string;
  columns: Map<string, any>;
  primaryKey: string;
  incrementing: boolean;
  softDeleteKey?: string;
  createTimestampKey?: string;
  updateTimestampKey?: string;
  relationMap: Map<string, any>;
}

export class Model<TEntity> {
  /**
   * 实体元数据
   */
  private metadata: EntityMatadata;

  /**
   * 创建模型实例
   * @param entity 
   */
  constructor(entity: TEntity) {
    this.metadata = this.resolveMetadata(entity);
  }

  /**
   * 获取实体元数据
   */
  getMetadata() {
    return this.metadata;
  }

  /**
   * 从实体类解析出元数据
   * @param entity 
   */
  resolveMetadata(entity: TEntity) {
    const table = Reflect.getMetadata('table', (entity as any).constructor);
    const connection = Reflect.getMetadata('connection', (entity as any).constructor) ?? 'default';
    const columns = Reflect.getMetadata('columns', (entity as any).constructor) ?? new Map();
    const primaryKey = Reflect.getMetadata('primaryKey', (entity as any).constructor) ?? 'id';
    const incrementing = Reflect.getMetadata('incrementing', (entity as any).constructor) ?? true;
    const softDeleteKey = Reflect.getMetadata('softDeleteKey', (entity as any).constructor);
    const createTimestampKey = Reflect.getMetadata('createTimestampKey', (entity as any).constructor);
    const updateTimestampKey = Reflect.getMetadata('updateTimestampKey', (entity as any).constructor);
    const relationMap = Reflect.getMetadata('relations', (entity as any).constructor) || new Map();
    return {
      table,
      connection,
      columns,
      primaryKey,
      incrementing,
      softDeleteKey,
      createTimestampKey,
      updateTimestampKey,
      relationMap
    };
  }

  /**
   * 获取实体表名
   */
  getTable() {
    return this.metadata.table;
  }

  /**
   * 获取实体连接名
   */
  getConnectionName() {
    return this.metadata.connection ?? 'default';
  }

  /**
   * 获取实体主键名
   */
  getPrimaryKey() {
    return this.metadata.primaryKey;
  }

  /**
   * 获取实体字段描述集合
   */
  getColumns() {
    return this.metadata.columns;
  }

  /**
   * 实体主键是否自动增长
   */
  isIncrementing() {
    return !!this.metadata.incrementing;
  }

  /**
   * 获取实体软删除字段名
   */
  getSoftDeleteKey() {
    return this.metadata.softDeleteKey as string;
  }

  /**
   * 实体是否需要强制删除
   */
  isForceDelete() {
    return !this.metadata.softDeleteKey;
  }

  /**
   * 实体是否需要自动更新修改时间
   */
  hasUpdateTimestamp() {
    return !!this.metadata.updateTimestampKey;
  }

  /**
   * 获取实体自动更新修改时间字段名
   */
  getUpdateTimestampKey() {
    return this.metadata.updateTimestampKey;
  }

  /**
   * 根据字段类型获取当前时间
   * @param key 
   */
  getFreshDateWithColumnKey(key: string) {
    const type = this.getColumnType(key);
    return this.getFormatedDate(type);
  }

  /**
   * 实体是否需要自动更新创建时间
   */
  hasCreateTimestamp() {
    return !!this.metadata.createTimestampKey;
  }

  /**
   * 获取实体自动更新创建时间字段名
   */
  getCreateTimestampKey() {
    return this.metadata.createTimestampKey;
  }

  /**
   * 创建模型仓库实例
   */
  createRepository() {
    const repos = new Repository<TEntity>(this);
    return repos as Repository<TEntity> & TEntity;
  }

  /**
   * 获取字段类型
   * @param key 
   */
  getColumnType(key: string) {
    return this.metadata.columns.get(key)?.type;
  }

  /**
   * 根据类型获取时间
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
   * 将数据转换为仓库实例
   * @param data 
   */
  resultToRepository(data: Record<string, any>): Repository<TEntity> & TEntity {
    return this.createRepository()
      .setExists(true)
      .fill(data) as Repository<TEntity> & TEntity ;
  }
}