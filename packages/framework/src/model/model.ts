// import { format as dateFormat, getUnixTime } from 'date-fns';
import { Entity } from '../base/entity';
import { Builder } from '../database/builder';
import { ModelBuilder } from './builder';
// import { Relationship } from './relationship';
import { HasRelations } from './relations/has-relations.abstract';
import { HasOne, BelongsTo } from './relations';

export type RelationTypes = 'hasOne' | 'belongsTo'

export interface RelationDesc {
  type: RelationTypes;
  entity: { new(): Entity};
  foreignKey: string;
  localKey: string;
}

export interface ColumnDescription {
  type: string;
  length: number;
};

// export type ProxyModel = Model & TEntity & ModelBuilder & Builder
// type ProxySoftDeleteModel = SoftDeleteModel & TEntity & ModelBuilder & Builder

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class _Model<TEntity extends Entity> {

  /**
   * 模型实体
   */
  private entity: TEntity;

  /**
   * Create Model
   * @param entity
   */
  constructor(entity: TEntity) {
    this.entity = entity;
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
   * 是否是模型实体属性
   * @param column 
   */
  isEntityColumns(columnKey: string) {
    return this.entity
      .getColumns()
      .has(columnKey);
  }

  /**
   * 是否是关联属性
   * Is it an associated property
   * @param columnKey 
   */
  isEntityRelations(columnKey: string) {
    return this.entity
      .getRelationMap()
      .has(columnKey);
  }

  isForceDelete() {
    return this.entity.isForceDelete();
  }

  /**
   * 设置模型是否已经存在
   * Sets whether the model already exists
   * @param exists
   */
  setExists(exists: boolean) {
    this.entity.setExists(exists);
    return this;
  }

  /**
   * 填充模型数据
   * Populate model data
   * @param attributes 
   */
  fill(attributes: Record<string, any> = {}) {
    this.entity.fill(attributes);
    return this;
  }

  // /**
  //  * 设置模型属性
  //  * Set model properties
  //  * @param key 
  //  * @param value 
  //  */
  // setAttribute(key: string, value: any) {
  //   this.entity[key as keyof TEntity] = value;
  //   // 模型已存在的情况下配置更新字段
  //   // Configure update fields if the model already exists
  //   if (this.entity.isExists()) {
  //     this.entity.addUpdateAttributeColumn(key);
  //   }
  //   return this;
  // }

  // /**
  //  * 获取模型属性
  //  * Get model attributes
  //  * @param key 
  //  */
  // getAttribute(key: string) {
  //   if (!key) return;
  //   return this.entity[key as keyof TEntity];
  // }

  // /**
  //  * 获取需要被渴求式加载的对象集合
  //  * Gets the collection of objects that need to be loaded by the desired type
  //  */
  // getWiths() {
  //   return this.entity.getWiths();
  // }

  /**
   * 获取模型表名
   * get table name
   */
  getTable() {
    return this.entity.getTable();
  }

  /**
   * 获取模型连接名
   * get connection name
   */
  getConnectioName() {
    return this.entity.getConnectionName();
  }

  /**
   * 获取模型实体字段数组
   * Gets an array of model entity fields
   */
  getColumns() {
    return this.entity.getColumns();
  }

  getSoftDeleteKey() {
    return this.entity.getSoftDeleteKey();
  }

  getPrimaryKey() {
    return this.entity.getPrimaryKey();
  }

  /**
   * 获取所有的模型属性
   * Gets all model properties
   */
  // getAttributes() {
  //   return this.attributes;
  // }

  // /**
  //  * get entity
  //  */
  // getEntity() {
  //   return this.entity;
  // }

  // /**
  //  * 解析模型实体
  //  * Analytic model entity
  //  * @param entity 
  //  */
  // resolveEntity<T extends Entity>(entity: T) {
  //   return this;
  // }

  /**
   * need eagerly
   * @param relations 
   */
  with(...relations: string[]): Model<TEntity> {
    for (const relation of relations) {
      const relationImp = this.getRelationImp(relation);
      if (relationImp) {
        this.entity.setWith(relation, relationImp);
      };
    }
    return this as unknown as Model<TEntity>;
  }

  /**
   * get relation implementat
   * @param relation 
   */
  getRelationImp(relation: string): HasRelations<TEntity> | undefined {
    const relationDesc = this.entity.getRelationMap().get(relation);
    if (!relationDesc) return;
    
    if (relationDesc) {
      switch (relationDesc.type) {
        case 'hasOne':
          return new HasOne(relationDesc.foreignKey, relationDesc.localKey, relationDesc.entity);
        case 'belongsTo':
          return new BelongsTo(relationDesc.foreignKey, relationDesc.localKey, relationDesc.entity);
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
  async eagerly(withs: Map<string, HasRelations<TEntity>>, result: TEntity) {
    for (const [relation, relationImp] of withs) {
      await relationImp.eagerly(result, relation);
    }
  }

  async eagerlyCollection(withs: Map<string, HasRelations<TEntity>>, results: TEntity[]) {
    for (const [relation, relationImp] of withs) {
      await relationImp.eagerlyMap(results, relation);
    }
  }

  // /**
  //  * 设置关联结果
  //  * @param key 
  //  * @param value 
  //  */
  // setRelation(key: string, value: Model) {
  //   this.relations[key] = value;
  //   return this;
  // }

  /**
   * 生成模型查询构造类实例
   * Generate model query construct class instances
   */
  newModelBuilderInstance(): ModelBuilder<TEntity> & Builder {
    return (new ModelBuilder(this as unknown as Model<TEntity>)).prepare() as ModelBuilder<TEntity> & Builder;
  }

  

  



 

  /**
   * 创建新的 model 实例
   */
  newInstance<T extends Entity>(): Model<T> {
    const model =  new _Model(
      this.entity
    );

    return model as unknown as Model<T>;
  }




  /**
   * 执行更新数据库记录操作
   * Perform update database record operations
   * @param query 
   * @param attributes 
   */
  async executeUpdate(query: ModelBuilder<TEntity> & Builder, attributes: Record<string, any>) {
    await query.where(
      this.entity.getPrimaryKey(),
      '=',
      this.entity.getPrimaryValue()
    ).update(attributes);
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
      this.entity.getAttributes()
    );
    this.entity.setAttribute(
      this.entity.getPrimaryKey(),
      id
    );
    return this;
  }

  /**
   * 删除
   */
  async delete() {
    if (!this.entity.getPrimaryKey()) {
      throw new Error('Primary key not defined');
    }
    if (!this.entity.isExists()) return;

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
    if (this.entity.isForceDelete()) {
      await query.where(
        this.entity.getPrimaryKey(),
        '=',
        this.entity.getPrimaryValue()
      ).delete();
      // 设置模型为不存在
      this.entity.setExists(false);
      return true;
    }
    // 软删除的情况
    // 需要更新的字段
    const attributes: Record<string, any> = {};
    
    attributes[this.entity.getSoftDeleteKey()] = this.entity.getFormatedDate(
      this.entity.getColumnType(
        this.entity.getSoftDeleteKey()
      )
    );
    // 需要自动更新时间
    if (this.entity.hasUpdateTimestamp()) {
      const updateTimestampKey = this.entity.getUpdateTimestampKey();
      attributes[updateTimestampKey] = this.entity.getFormatedDate(
        this.entity.getColumnType(updateTimestampKey)
      );
    } 
    // 执行更新操作
    return query.where(
      this.entity.getPrimaryKey(),
      '=',
      this.entity.getPrimaryValue()
    ).update(attributes);
  }

  // /**
  //  * 根据 id 删除记录
  //  * @param ids 
  //  */
  // async destroy(...ids: (number | string)[]) {
  //   let count = 0;
  //   const model = this.newInstance(
      
  //   );
  //   const _models = await model.whereIn(
  //     model.getDefaultPrimaryKey(),
  //     ids
  //   ).find();
  //   for (const _model of _models) {
  //     if (await _model.delete()) count++;
  //   }
  //   return count;
  // }


  async resultToEntity(result: Record<string, any>, isFromCollection = false) {

    this.fill(result);

    this.entity.setExists(true);

    if (!isFromCollection && this.entity.getWiths().size > 0) {
      await this.eagerly(this.entity.getWiths(), this.entity);
    }

    return this.entity;
  }

  async resultsToEntities(results: Record<string, any>[]) {
    const data = [];
    for (const item of results) {
      data.push(
        await this.resultToEntity(item, true)
      );
    }

    // 预载入查询
    if (this.entity.getWiths().size > 0) {
      await this.eagerlyCollection(this.entity.getWiths(), data);
    }

    return data;
  }


  async get(id: number | string) {
    const query = this.newModelBuilderInstance();
    const res = await query.get(id);
    return this.resultToEntity(res);
  }

  async first() {
    const query = this.newModelBuilderInstance();

    if (!this.entity.isForceDelete()) {
      query.whereNull(
        this.entity.getSoftDeleteKey()
      );
    }
    const res = await query.first();
    return this.resultToEntity(res);
  }

  async find() {
    const query = this.newModelBuilderInstance();
    if (this.entity.isForceDelete()) {
      const results = await query.find();
      return this.resultsToEntities(results);
    }
    const results = await query.whereNull(
      this.entity.getSoftDeleteKey()
    ).find();
    return this.resultsToEntities(results);
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
    if (this.entity.isExists()) {
      // 没有字段需要更新的时候，直接返回 true
      if (!this.entity.hasUpdatedAttributes()) return true;
      // 如果需要自动更新时间
      if (this.entity.hasUpdateTimestamp()) {
        this.entity.setAttribute(
          this.entity.getUpdateTimestampKey(),
          this.entity.getFreshDateWithColumnKey(this.entity.getUpdateTimestampKey())
        );
      }
      // 获取需要更新的数据
      // 即模型实体有改动的的属性
      const updatedAttributes = this.entity.getUpdatedAttributes();
      return this.executeUpdate(
        query,
        updatedAttributes
      );
    }
    // 不存在模型
    // There is no model
    else {
      if (this.entity.hasCreateTimestamp()) {
        this.entity.setAttribute(
          this.entity.getCreateTimestampKey(),
          this.entity.getFreshDateWithColumnKey(this.entity.getCreateTimestampKey())
        );
      }

      // 如果是递增主键
      // 需要插入记录后并且返回记录id，将记录id设置到当前模型中
      if (this.entity.isIncrementing()) {
        // 执行插入操作并且设置模型主键值
        await this.executeInsertAndSetId(query);
      }
      // 如果不是递增主键
      // 普通主键必须由用户定义插入
      // 由于不存在自动递增主键，当数据字段为空的时候直接返回
      else {
        if (!this.entity.getColumns().size) return true;
        await query.insert(
          this.entity.getAttributes()
        );
      }
    }
    return true;
  }
}

export type Model<T extends Entity> = _Model<T> & ModelBuilder<T> & Builder;
export const Model: new <T extends Entity>(entity: T) => Model<T> = _Model as any;