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

  @hasOne(() => Profile)
  profile: Profile;

  @hasMany(() => Comment)
  comments: Comment[];

  @belongsToMany(() => Role)
  roles: Role[];
}