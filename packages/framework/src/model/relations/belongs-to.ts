import { Entity } from '../../base/entity';
import { Model } from '../model';
import { HasRelations } from './has-relations.abstract';

export class BelongsTo<TEntity extends Entity> extends HasRelations<TEntity> {
  /**
   * 预载入
   */
  async eagerly(result: Model<TEntity>, relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;

    const model = this.model.newInstance(
      this.app.get(entity) as TEntity
    );

    const query = model.newModelBuilderInstance();
    const data = await query.where(localKey, '=', result.getAttribute(foreignKey)).first();
    result.setRelation(relation, data);
  }

  async eagerlyMap() {
    //
  }
}