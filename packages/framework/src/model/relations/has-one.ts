import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';

export class HasOne<TEntity> extends HasRelations<TEntity> {
  /**
   * 预载入
   */
  eagerly<T = Model<TEntity>>(result: T, relation: string) {
    //
  }

  getQuery() {
    return this.model.newModelBuilderInstance();
  }
}