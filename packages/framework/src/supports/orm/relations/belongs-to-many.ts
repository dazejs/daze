import pluralize from 'pluralize';
import { Builder } from '../../database/builder';
import { Join } from '../../database/builder/join';
import { ModelBuilder } from '../builder';
import { Model } from '../model';
import { PivotEntity } from '../pivot-model';
import { Repository } from '../repository';
import { HasRelations } from './has-relations.abstract';

export class BelongsToMany extends HasRelations {
  /**
   * 中间表实体实例
   */
  pivot: Model<PivotEntity>;

  /**
   * 关联外键
   */
  foreignPivotKey: string;

  /**
   * 关联中间表键
   */
  relatedPivotKey: string;

  /**
   * 创建多对多关联关系
   * @param parent
   * @param model
   * @param Pivot
   * @param foreignPivotKey
   * @param relatedPivotKey
   */
  constructor(parent: Model<any>, model: Model, Pivot?: any, foreignPivotKey?: string, relatedPivotKey?: string) {
    super();
    this.parent = parent;
    this.model = model;
    // 默认单数形式的表名_主键名
    this.foreignPivotKey = foreignPivotKey ?? this.getDefaultForeignPivotKey();
    // 默认单数形式的表名_主键名
    this.relatedPivotKey = relatedPivotKey ?? this.getDefaultRelatedPivotKey();
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
  newPivot(Pivot?: any) {
    const _class = Pivot ?? PivotEntity;
    const _pivot = new Model(_class);
    const table = _pivot.getTable() ?? `${pluralize.singular(this.parent.getTable())}_${pluralize.singular(this.model.getTable())}`;
    _pivot.setTable(`${table} as pivot`);
    return _pivot;
  }

  /**
   * 渴求式加载单条记录的关联数据
   * @param resultRepos 需要被加载的模型
   * @param relation 关联名
   */
  async eagerly(resultRepos: Repository, relation: string, queryCallback?: (query: ModelBuilder<any> & Builder) => void) {
    const foreignPivotKey = this.foreignPivotKey;
    const relatedPivotKey = this.relatedPivotKey;
    // 需要被加载的模型主键值
    const pk = resultRepos.getPrimaryValue();
    // // 关联表名，默认父模型单数行书的表名_当前模型单数形式的表名
    // const table = this.pivot.getTable() ?? `${pluralize.singular(this.parent.getTable())}_${pluralize.singular(this.model.getTable())}`;
    // // 设置表名到中间表
    // this.pivot.setTable(`${table} as pivot`);

    // const query = this.pivot.newModelBuilderInstance();
    // 获取中间表与当前模型的关联数据

    const model = this.model.createRepository();
    const [currentRelation, ...restRelation] = relation.split('.');
    if (restRelation.length) {
      model.with(restRelation.join('.'));
    }
    const query = model.createQueryBuilder();
    if (queryCallback) queryCallback(query);
    const records: Record<string, any>[] = await query
      .getBuilder()
      .columns([...this.model.getColumns().keys()], `pivot.${relatedPivotKey}`, `pivot.${foreignPivotKey}`)
      .alias('relate')
      .join((join: Join) => {
        return join.table(this.pivot.getTable(), 'pivot')
          .on(`pivot.${relatedPivotKey}`, `relate.${this.model.getPrimaryKey()}`)
          .where(`pivot.${foreignPivotKey}`, '=', pk);
      }).find();
    // console.log(await this.model.resultsToModels(records));
    // 添加关联数据到需要被加载的模型中
    if (records) {
      resultRepos.setAttribute(
        currentRelation,
        await this.model.resultToRepositories(model, records)
      );
    }
  }

  /**
   * 渴求式加载多个模型的关联数据
   * @param resultReposes 
   * @param relation 
   */
  async eagerlyMap(resultReposes: Repository[], relation: string, queryCallback?: (query: ModelBuilder<any> & Builder) => void) {
    const foreignPivotKey = this.foreignPivotKey;
    const relatedPivotKey = this.relatedPivotKey;
    // 查询范围 - foreignPivotKey
    const range = new Set();
    for (const repos of resultReposes) {
      const id = repos.getPrimaryValue();
      id && range.add(id);
    }
    if (range.size > 0) {
      // // 关联表名，默认父模型单数行书的表名_当前模型单数形式的表名
      // const table = this.pivot.getTable() ?? `${pluralize.singular(this.parent.getTable())}_${pluralize.singular(this.model.getTable())}`;
      // // 设置表名到中间表
      // this.pivot.setTable(`${table} as pivot`);

      // const query = this.pivot.newModelBuilderInstance();
      // 获取中间表与当前模型的关联数据

      const model: Repository = this.model.createRepository();
      const [currentRelation, ...restRelation] = relation.split('.');
      if (restRelation.length) {
        model.with(restRelation.join('.'));
      }
      const query = model.createQueryBuilder();
      
      if (queryCallback) queryCallback(query);
      const records: Record<string, any>[] = await query
        .getBuilder()
        .columns([...this.model.getColumns().keys()], `pivot.${relatedPivotKey}`, `pivot.${foreignPivotKey}`)
        .alias('relate')
        .join((join: Join) => {
          return join.table(this.pivot.getTable(), 'pivot')
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
      for (const repos of resultReposes) {
        const items = map.get(repos.getPrimaryValue());
        if (items) {
          repos.setAttribute(
            currentRelation,
            await this.model.resultToRepositories(model, items)
          );
        }
      }
    }
  }
}