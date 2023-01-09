import { BaseEntity, AutoIncrementPrimaryColumn, Column, BelongsToMany, HasOne, Entity, HasMany } from '../../../../../src';
import Profile from './profile';
import Comment from './comment';
import Role from './role';

@Entity('users')
export default class extends BaseEntity {
  @AutoIncrementPrimaryColumn()
    id: number;

  @Column()
    name: string;

  @Column()
    age: number;

  @Column()
    description: string;

  @HasOne(() => Profile)
    profile: Profile;

  @HasMany(() => Comment)
    comments: Comment[];

  @BelongsToMany(() => Role)
    roles: Role[];
}