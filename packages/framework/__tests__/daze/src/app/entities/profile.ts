import { BaseEntity, table, autoIncrementPrimaryColumn, column, belongsTo } from '../../../../../src';
import User from './user';

@table('profiles')
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