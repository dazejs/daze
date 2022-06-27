import { Table, BaseModel, AutoIncrementPrimaryColumn } from '@dazejs/framework';

@Table('{{ name | plural | lower }}')
export class {{ name | firstUpperCase }}Entity extends BaseModel {
    @AutoIncrementPrimaryColumn()
    id: number;
}
