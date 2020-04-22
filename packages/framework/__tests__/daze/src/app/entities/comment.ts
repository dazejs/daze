import { BaseEntity, table, autoIncrementPrimaryColumn, column, belongsTo } from '../../../../../src';
import User from './user';

@table('comments')
export default class extends BaseEntity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  user_id: number;

  @column()
  comment: string;

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  user: User;
}