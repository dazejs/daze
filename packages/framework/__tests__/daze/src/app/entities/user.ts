import { Entity, table, autoIncrementPrimaryColumn, column, hasOne, hasMany } from '../../../../../src';
import Profile from './profile';
import Comment from './comment';

@table('users')
export default class extends Entity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  name: string;

  @column()
  age: number;

  @column()
  description: string;

  @hasOne(Profile, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  profile: Profile;

  @hasMany(Comment, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  comments: Comment[];
}