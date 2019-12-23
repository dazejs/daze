import { HasRelations } from './has-relations.abstract';
// import { Entity } from '../../base/entity';

export class BelongsTo<TModel> extends HasRelations<TModel> {

  /**
   * 预载入
   */
  eagerly() {
    //
  }

  eagerlyMap() {
    //
  }
}