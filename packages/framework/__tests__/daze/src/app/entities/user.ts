import { BaseEntity, table, autoIncrementPrimaryColumn, column, hasOne, hasMany, belongsToMany } from '../../../../../src';
import Profile from './profile';
import Comment from './comment';
import Role from './role';

@table('users')
export default class extends BaseEntity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  name: string;

  @column()
  age: number;

  @column()
  description: string;

  @hasOne(() => Profile, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  profile: Profile;

  @hasMany(() => Comment, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  comments: Comment[];

  @belongsToMany(() => Role, {
    foreignPivotKey: 'user_id',
    relatedPivotKey: 'role_id',
  })
  roles: Role[];
}