import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';

export class HasOne<TEntity> extends HasRelations<TEntity> {
  /**
   * 预载入
   */
  async eagerly(result: Model<TEntity>) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;
    const model = new Model(
      this.app.get(entity)
    );
    const query = model.newModelBuilderInstance();
    const data = await query.where(foreignKey, '=', result.getAttribute(localKey)).first();
    return data;
  }
}