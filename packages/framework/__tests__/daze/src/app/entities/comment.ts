import { BaseEntity, AutoIncrementPrimaryColumn, Column, BelongsTo, Entity } from '../../../../../src';
import User from './user';

@Entity('comments')
export default class extends BaseEntity {
  @AutoIncrementPrimaryColumn()
    id: number;

  @Column()
    user_id: number;

  @Column()
    comment: string;

  @BelongsTo(() => User)
    user: User;
}