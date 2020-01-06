import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';
import pluralize from 'pluralize';

export class HasOne extends HasRelations {


  /**
   * 创建一对一关联关系
   * @param parent 
   * @param model 
   * @param foreignKey 
   * @param localKey 
   */
  constructor(parent: Model, model: Model, foreignKey?: string, localKey?: string) {
    super();
    this.parent = parent;
    this.model = model;
    this.foreignKey = foreignKey;
    this.localKey = localKey;
  }

  /**
   * 获取默认外键名
   */
  getDefaultForeignKey() {
    return `${pluralize.singular(this.parent.getTable())}_${this.parent.getPrimaryKey()}`;
  }

  /**
   * 获取默认关联主键名
   */
  getDefaultLocalKey() {
    return this.parent.getPrimaryKey();
  }

  /**
   * 预载入单个实体
   * @param result 
   * @param relation 
   */
  async eagerly(resultModel: Model, relation: string) {
    const foreignKey = this.foreignKey ?? this.getDefaultForeignKey();
    const localKey = this.localKey ?? this.getDefaultLocalKey();
    const query = this.model.newModelBuilderInstance();
    const record = await query.where(foreignKey, '=', resultModel.getAttribute(localKey)).first();
    record && resultModel.setRelation(relation, await this.model.resultToModel(record));
  }

  /**
   * 预载入模型集合
   * @param results 
   * @param relation 
   */
  async eagerlyMap(resultModels: Model[], relation: string) {
    const foreignKey = this.foreignKey ?? this.getDefaultForeignKey();
    const localKey = this.localKey ?? this.getDefaultLocalKey();
    const range = new Set();
    for (const model of resultModels) {
      const id = model.getAttribute(localKey);
      id && range.add(id);
    }

    if (range.size > 0) {
      const query = this.model.newModelBuilderInstance();
      const records: Record<string, any>[] = await query.whereIn(foreignKey, [...range]).find();

      const map = new Map();
      for (const record of records) {
        map.set(record[foreignKey], record);
      }

      for (const item of resultModels) {
        const record = map.get(item.getAttribute(localKey));
        record && item.setRelation(relation, await this.model.resultToModel(record, true));
      }
    }
  }
}