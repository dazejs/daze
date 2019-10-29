import { Builder, TSymlink, TJoinType } from './builder'


export class Join {
  builder: Builder;

  table: string;

  type: TJoinType;

  constructor(builder: Builder, table: string, type: TJoinType) {
    this.builder = builder
    this.table = table;
    this.type = type;
  }

  on(column: string, operator: string, seed?: string, symlink: TSymlink = 'and') {
    this.builder.whereColumn(column, operator, seed, symlink)
    return this
  }
}