import { Builder, TJoinType, TSymlink } from './builder';


export class Join {
  builder: Builder;

  _table: string;

  type: TJoinType;

  [key: string]: any;

  constructor(builder: Builder, type: TJoinType) {
    this.builder = builder;
    this.joinType = type;

    return new Proxy(this, this.proxy);
  }

  get proxy(): ProxyHandler<this> {
    return {
      get(target, p, receiver) {
        if (typeof p !== 'string') return Reflect.get(target, p, receiver);
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p, receiver);
        }
        return target.builder[p as keyof Builder];
      }
    };
  }

  on(column: string, operator: string, seed?: string, symlink: TSymlink = 'and') {
    this.builder.whereColumn(column, operator, seed, symlink);
    return this;
  }

  getParams() {
    return this.builder.getBindings();
  }
}