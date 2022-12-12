import { Entity, BaseEntity, autoIncrementPrimaryColumn, column, createTimestampColumn, updateTimestampColumn } from '../../../packages/framework/dist';

@Entity('packages')
export class ExampleEntity extends BaseEntity {
  @autoIncrementPrimaryColumn()
    id: number;

  @column()
    author: string;

  @column()
    name: string;

  @column()
    description: string;

  @createTimestampColumn('datetime')
    created_at: number;

  @updateTimestampColumn('datetime')
    updated_at: number;
}