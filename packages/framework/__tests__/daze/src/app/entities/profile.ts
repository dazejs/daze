import { BaseEntity, table, autoIncrementPrimaryColumn, column, belongsTo, entity } from '../../../../../src';
import User from './user';

@table('profiles')
@entity()
export default class extends BaseEntity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  user_id: number;

  @column()
  motto: string;

  @belongsTo(() => User)
  user: User;
}