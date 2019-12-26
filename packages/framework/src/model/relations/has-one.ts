import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';
import { Entity } from '../../base/entity';

export class HasOne<TEntity extends Entity> extends HasRelations<TEntity> {
  /**
   * 预载入单个模型
   * @param result 
   * @param relation 
   */
  async eagerly(result: TEntity, relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;
    const model = new Model(
      this.app.get(entity) as TEntity
    );

    const query = model.newModelBuilderInstance();
    const data = await query.where(foreignKey, '=', result.getAttribute(localKey)).first();
    const res = await model.resultToEntity(data);
    result.setRelation(relation, res);
  }

  /**
   * 预载入模型集合
   * @param results 
   * @param relation 
   */
  async eagerlyMap(results: TEntity[], relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;

    const range = [];

    for (const item of results) {
      // 获取关联外键列表
      const id = item.getAttribute(localKey);
      if (id) {
        range.push(id);
      }
    }

    if (range.length > 0) {
      const model = new Model(
        this.app.get(entity) as TEntity
      );

      const query = model.newModelBuilderInstance();

      const res: Record<string, any>[] = await query.whereIn(foreignKey, range).find();

      const resMap = new Map(
        res.map(item => [item.getAttribute(foreignKey), item])
      );

      for (const item of results) {
        const data = resMap.get(item.getAttribute(localKey));
        if (data) {
          const _data = await model.resultToEntity(data, true);
          item.setRelation(relation, _data);
        }
      }
    }
  }
}