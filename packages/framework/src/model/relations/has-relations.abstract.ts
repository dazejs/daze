import { Model } from '../model';

export abstract class HasRelations<TEntity> {
  model: Model<TEntity>;

  foreignKey: string;

  localKey: string;

  constructor(model: Model<TEntity>, foreignKey: string, localKey: string) {
    this.model = model;

    this.foreignKey = foreignKey;

    this.localKey = localKey;
  }
}