import { Model } from './model';
import { ModelBuilder } from './builder';
import { Builder } from '../database/builder';

const inspect = Symbol.for('nodejs.util.inspect.custom');

export class Repository<TEntity> {
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
    return (new ModelBuilder(this.model)).prepare() as ModelBuilder<TEntity> & Builder;
  }

  /**
   * 获取主键值
   */
  private getPrimaryValue() {
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
      (this as any)[key] = data[key];
    }
    return this;
  }

  /**
   * 获取仓库数据属性
   */
  getAttributes() {
    const columns = this.model.getColumns().keys();
    const attributes: Record<string, any> = {};
    for (const column of columns) {
      attributes[column] = (this as any)[column];
    }
    return attributes;
  }

  /**
   * 设置仓库数据属性
   * @param key 
   * @param value 
   */
  setAttribute(key: string, value: any) {
    (this as any)[key] = value;
    // 模型已存在的情况下配置更新字段
    // Configure update fields if the model already exists
    if (this.isExists()) {
      this.addUpdateAttributeColumn(key);
    }
    return this;
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
    }
    return true;
  }

  private async executeInsertAndSetId(query: ModelBuilder<TEntity> & Builder) {
    const id = await query.insert(
      this.getAttributes()
    );
    this.setAttribute(
      this.model.getPrimaryKey(),
      id
    );
    return this;
  }

  private async executeUpdate(query: ModelBuilder<TEntity> & Builder, attributes: Record<string, any>) {
    await query.where(
      this.model.getPrimaryKey(),
      '=',
      this.getPrimaryValue()
    ).update(attributes);
    return true;
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
}