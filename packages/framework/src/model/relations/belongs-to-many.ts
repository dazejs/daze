import { Entity, PivotEntity } from '../../base';
import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';
import pluralize from 'pluralize';
import { Join } from '../../database/builder/join';

export class BelongsToMany extends HasRelations {
  /**
   * 中间表实体实例
   */
  pivot: Entity;

  /**
   * 关联外键
   */
  foreignPivotKey?: string;

  /**
   * 关联中间表键
   */
  relatedPivotKey?: string;

  /**
   * 创建多对多关联关系
   * @param parent 
   * @param model 
   * @param Pivot 
   * @param foreignPivotKey 
   * @param relatedPivotKey 
   */
  constructor(parent: Model, model: Model, Pivot?: typeof Model, foreignPivotKey?: string, relatedPivotKey?: string) {
    super();
    this.parent = parent;
    this.model = model;
    // 默认单数形式的表名_主键名
    this.foreignPivotKey = foreignPivotKey;
    // 默认单数形式的表名_主键名
    this.relatedPivotKey = relatedPivotKey;
    // 中间表实体实例
    this.pivot = this.newPivot(Pivot);
  }

  /**
   * 获取默认外键名
   */
  getDefaultForeignPivotKey() {
    return `${pluralize.singular(this.parent.getTable())}_${this.parent.getPrimaryKey()}`;
  }

  /**
   * 获取默认关联外键名
   */
  getDefaultRelatedPivotKey() {
    return `${pluralize.singular(this.model.getTable())}_${this.model.getPrimaryKey()}`;
  }

  /**
   * 新建中间表实体实例
   */
  newPivot(Pivot?: typeof Model) {
    const _class = Pivot ?? PivotEntity;
    const _pivot = new _class();
    if (_pivot instanceof PivotEntity) {
      return _pivot;
    }
    throw new Error('pivot entity must extends: PivotEntity');
  }

  /**
   * 渴求式加载单条记录的关联数据
   * @param resultModel 需要被加载的模型
   * @param relation 关联名
   */
  async eagerly(resultModel: Model, relation: string) {
    const foreignPivotKey = this.foreignPivotKey ?? this.getDefaultForeignPivotKey();
    const relatedPivotKey = this.relatedPivotKey ?? this.getDefaultRelatedPivotKey();
    // 需要被加载的模型主键值
    const pk = resultModel.getPrimaryValue();
    // 关联表名，默认父模型单数行书的表名_当前模型单数形式的表名
    const table = this.pivot.getTable() ?? `${pluralize.singular(this.parent.getTable())}_${pluralize.singular(this.model.getTable())}`;
    // 设置表名到中间表
    this.pivot.setTable(`${table} as pivot`);

    const query = this.pivot.newModelBuilderInstance();
    // 获取中间表与当前模型的关联数据
    const records: Record<string, any>[] = await query.columns('relate.*').join((join: Join) => {
      return join.table(this.model.getTable(), 'relate')
        .on(`pivot.${relatedPivotKey}`, `relate.${this.model.getPrimaryKey()}`)
        .where(`pivot.${foreignPivotKey}`, '=', pk);
    }).find();
    // 添加关联数据到需要被加载的模型中
    resultModel.setRelation(relation, await this.model.resultsToModels(records));
  }

  /**
   * 渴求式加载多个模型的关联数据
   * @param resultModels 
   * @param relation 
   */
  async eagerlyMap(resultModels: Model[], relation: string) {
    const foreignPivotKey = this.foreignPivotKey ?? this.getDefaultForeignPivotKey();
    const relatedPivotKey = this.relatedPivotKey ?? this.getDefaultRelatedPivotKey();
    // 查询范围 - foreignPivotKey
    const range = new Set();
    for (const model of resultModels) {
      const id = model.getPrimaryValue();
      id && range.add(id);
    }
    if (range.size > 0) {
      // 关联表名，默认父模型单数行书的表名_当前模型单数形式的表名
      const table = this.pivot.getTable() ?? `${pluralize.singular(this.parent.getTable())}_${pluralize.singular(this.model.getTable())}`;
      // 设置表名到中间表
      this.pivot.setTable(`${table} as pivot`);

      const query = this.pivot.newModelBuilderInstance();
      // 获取中间表与当前模型的关联数据
      const records: Record<string, any>[] = await query.columns('relate.*', `pivot.${foreignPivotKey}`).join((join: Join) => {
        return join.table(this.model.getTable(), 'relate')
          .on(`pivot.${relatedPivotKey}`, `relate.${this.model.getPrimaryKey()}`)
          .whereIn(`pivot.${foreignPivotKey}`, [...range]);
      }).find();

      const map = new Map();
      for (const record of records) {
        const items = map.get(record[foreignPivotKey]) || [];
        if (items && Array.isArray(items)) {
          items.push(record);
        }
        map.set(record[foreignPivotKey], items);
      }
      for (const model of resultModels) {
        const items = map.get(model.getPrimaryValue());
        items && model.setRelation(relation, await this.model.resultsToModels(items));
      }
    }
  }
}