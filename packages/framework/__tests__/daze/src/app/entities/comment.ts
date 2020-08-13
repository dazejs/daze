import { BaseEntity, table, autoIncrementPrimaryColumn, column, belongsTo, entity } from '../../../../../src';
import User from './user';

@entity()
@table('comments')
export default class extends BaseEntity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  user_id: number;

  @column()
  comment: string;

  @belongsTo(() => User)
  user: User;
}