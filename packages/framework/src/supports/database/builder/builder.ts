import { IllegalArgumentError } from '../../../errors/illegal-argument-error';
import { Actuator } from '../actuator/actuator';
import { Parser } from '../parser';
import { Join } from './join';

export type TSymlink = 'and' | 'or' | ''

export type TJoinType = 'inner' | 'left' | 'right' | 'cross'

export interface ColumnDescribeOption {
  type: 'column' | 'raw';
  column: string;
  as?: string;
}

interface WhereDescribeOption {
  type: 'value' | 'column' | 'sql' | 'in' | 'notIn' | 'null' | 'notNull';
  column?: string;
  operator?: string;
  value?: any;
  symlink: TSymlink;
}

interface HavingDescribeOption {
  type: 'value';
  column: string;
  operator: string;
  value: any;
  symlink: TSymlink;
}

interface AggregateOption {
  func: string;
  column: string;
}

interface UnionOption {
  builder: Builder;
  isAll: boolean;
}

interface OrderOption {
  type: 'column' | 'raw';
  column: string;
  direction?: string;
}

type BindingKeys = 'select' | 'from' | 'join' | 'where' | 'having' | 'order' | 'union'

export class Builder {
  /**
   * The distinct
   */
  _distinct: boolean | string[] = false;

  /**
   * The aggregate desc
   */
  _aggregate?: AggregateOption;

  /**
   * The columns
   */
  _columns: ColumnDescribeOption[] = [];
  
  /**
   * the table name
   */
  _table: string;

  /**
   * the table from alias
   */
  _alias: string;

  /**
   * The where constraints
   */
  _wheres: WhereDescribeOption[] = [];

  /**
   * The orders
   */
  _orders: OrderOption[] = [];

  /**
   * The maximum number of records
   */
  _limit?: number;

  /**
   * The number of records to skip
   */
  _offset?: number;

  /**
   * The lock
   */
  _lock: boolean | string;

  /**
   * The groups for group by
   */
  _groups: string[] = [];

  /**
   * The joins
   */
  _joins: Join[] = [];

  /**
   * The Having
   */
  _havings: HavingDescribeOption[] = [];

  /**
   * The unions
   */
  _unions: UnionOption[] = [];

  /**
   * binding params
   */
  params: any[] = [];

  bindings: Map<BindingKeys, any[]> = new Map([
    ['select', []],
    ['from', []],
    ['join', []],
    ['where', []],
    ['having', []],
    ['order', []],
    ['union', []],
  ]);

  /**
   * grammar parser instance
   */
  parser: Parser;

  /**
   * connection instance
   */
  // collection: PoolConnection;

  actuator: Actuator;

  /**
   * shlould log sql
   */
  private shouldLogSql = false;

  /**
   * should dump sql
   * will return sql use select inster update and delete
   */
  private shouldDumpSql = false;

  /**
   * Create Builder instance
   * @param collection 
   */
  constructor(actuator: Actuator, parser: Parser) {
    // super();
    this.actuator = actuator;
    this.parser = parser;
  }

  /**
   * Remove aggregate func
   */
  removeAggregate() {
    this._aggregate = undefined;
    return this;
  }
  
  /**
   * show columns
   * @param columns 
   */
  select(...columns: (string | string[])[]) {
    for (const column of columns) {
      let _column = column;
      let _as;
      if (typeof _column === 'string') {
        if (~column.indexOf(` as `)) {
          [_column, _as] = _column.split(` as `);
        }
        this._columns.push({
          type: 'column',
          column: _column,
          as: _as
        });
      } else if (Array.isArray(_column)) {
        for (const item of _column) {
          let _item = item;
          let _item_as;
          if (~_item.indexOf(` as `)) {
            [_item, _item_as] = _item.split(` as `);
          }
          this._columns.push({
            type: 'column',
            column: _item,
            as: _item_as
          });
        }
      }
    }
    return this;
  }

  /**
   * select sub query
   * @param query 
   * @param as 
   */
  selectSub(query: Builder | ((query: Builder) => Builder | void), as: string) {
    const _query = new Builder(this.actuator, this.parser);
    if (typeof query === 'function') {
      query(_query);
    }
    const sql = _query.toSql();
    this.selectRaw(`(${sql}) \`${as}\``, _query.getBindings());
    return this;
  }

  /**
   * select raw
   * @param raw 
   * @param bindings 
   */
  selectRaw(raw: string, bindings: any[] = []) {
    this._columns.push({
      type: 'raw',
      column: raw,
    });
    this.addBinding('select', bindings);
    return this;
  }

  /**
   * alias colums
   * @param columns 
   */
  fields(...columns: (string | string[])[]) {
    return this.select(...columns);
  }

  /**
   * alias colums
   * @param columns 
   */
  columns(...columns: (string | string[])[]) {
    return this.select(...columns);
  }

  /**
   * Set the table target
   * @param table 
   * @param as 
   */
  table(table: string, as?: string) {
    // this._from = as ? `${table} as ${as}` : table;
    let _table = table ?? '';
    let _as = as;
    if (table && ~table.indexOf(` as `)) {
      [_table, _as] = table.split(` as `);
    }
    _table = _table.trim();
    _as = _as?.trim();
    if (_as) {
      // this._from = `${_table} as ${_as}`;
      this._alias = _as;
    }
    //  else {
    //   this._from = _table;
    // }
    this._table = _table;
    return this;
  }

  /**
   * alias table
   * @param as 
   */
  alias(as: string) {
    this._alias = as;
    return this;
  }

  /**
   * where
   * @param column 
   * @param operator 
   * @param value 
   * @param symlink 
   */
  where(
    column: string | [string, any, any?, TSymlink?][],
    operator?: any,
    value?: any,
    symlink: TSymlink = 'and'
  ) {
    if (Array.isArray(column)) {
      for (const _column of column) {
        this.where(..._column);
      }
      return this;
    }
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'value';
    if (value !== undefined) {
      this._wheres.push({ type, column, operator, value, symlink: _symlink });
      // this.addParams(value);
      this.addBinding('where', value);
    } else {
      this._wheres.push({ type, column, operator: '=', value: operator, symlink: _symlink });
      this.addBinding('where', operator);
      // this.addParams(operator);
    }
    return this;
  }

  /**
   * where use or tymlink
   * @param column 
   * @param operator 
   * @param value 
   */
  orWhere(
    column: string | [string, any, any?][],
    operator: any,
    value?: any
  ) {
    return this.where(column, operator, value, 'or');
  }

  /**
   * raw where
   * @param sql 
   * @param params 
   * @param symlink 
   */
  whereRaw(sql: string, params: any[] = [], symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'sql';
    this._wheres.push({ type, value: sql, symlink: _symlink});
    this.addBinding('where', params);
    // this.addParams(params);
    return this;
  }

  /**
   * or raw where
   * @param sql 
   * @param params 
   */
  orWhereRaw(sql: string, params: any[] = []) {
    return this.whereRaw(sql, params, 'or');
  }

  /**
   * where for column
   * @param column 
   * @param operator 
   * @param value 
   * @param symlink 
   */
  whereColumn(column: string, operator: string, value?: string, symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'column';
    if (value !== undefined) {
      this._wheres.push({ type, column, operator, value, symlink: _symlink });
    } else {
      this._wheres.push({ type, column, operator: '=', value: operator, symlink: _symlink });
    }
    return this;
  }

  /**
   * where in 
   * @param column 
   * @param value 
   * @param symlink 
   */
  whereIn(column: string, value: any[], symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'in';
    this._wheres.push({ type, column, value, symlink: _symlink });
    this.addBinding('where', value);
    return this;
  }

  /**
   * or where in
   * @param column 
   * @param value 
   */
  orWhereIn(column: string, value: any[]) {
    return this.whereIn(column, value, 'or');
  }

  /**
   * where not in
   * @param column 
   * @param value 
   * @param symlink 
   */
  whereNotIn(column: string, value: any[], symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'notIn';
    this._wheres.push({ type, column, value, symlink: _symlink });
    this.addBinding('where', value);
    return this;
  }

  /**
   * or where not in
   * @param column 
   * @param value 
   */
  orWhereNotIn(column: string, value: any[]) {
    return this.whereNotIn(column, value, 'or');
  }

  /**
   * where null
   * @param column 
   * @param symlink 
   * @param not 
   */
  whereNull(column: string, symlink: TSymlink = 'and', not = false) {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = not ? 'notNull' : 'null';
    this._wheres.push({ type, column, symlink: _symlink });
    return this;
  }

  /**
   * where not null
   * @param column 
   * @param symlink 
   */
  whereNotNull(column: string, symlink: TSymlink = 'and') {
    this.whereNull(column, symlink, true);
    return this;
  }

  /**
   * or where null
   * @param column 
   */
  orWhereNull(column: string) {
    this.whereNull(column, 'or', false);
    return this;
  }

  /**
   * or where not null
   * @param column 
   */
  orWhereNotNull(column: string) {
    this.whereNull(column, 'or', true);
    return this;
  }

  /**
   * or where column
   * @param column 
   * @param operator 
   * @param value 
   */
  orWhereColumn(column: string, operator: string, value?: string) {
    return this.whereColumn(column, operator, value, 'or');
  }

  /**
   * aggregate func
   * @param type 
   * @param column 
   */
  async aggregate(type: string, column = '*') {
    this._aggregate = {
      func: type,
      column,
    };
    this._limit = undefined;
    this._offset = undefined;
    const sql = this.toSql();
    const params = this.getBindings();
    const results = await this.actuator.select(sql, params);
    const aggregate = results[0]?.aggregate;
    if (aggregate === undefined) return;
    return Number(aggregate);
  }

  /**
   * 聚合函数- count
   * @param column 
   */
  async count(column = '*') {
    const res = await this.aggregate('count', column);
    return res ?? 0;
  }

  /**
   * 聚合函数 - max
   * @param column 
   */
  async max(column: string) {
    return this.aggregate('max', column);
  }

  /**
   * 聚合函数 - min
   * @param column 
   */
  async min(column: string) {
    return this.aggregate('min', column);
  }

  /**
   * 聚合函数 - sum
   * @param column 
   */
  async sum(column: string) {
    const res = await this.aggregate('sum', column);
    return res ?? 0;
  }

  /**
   * 聚合函数 - avg
   * @param column 
   */
  async avg(column: string) {
    return this.aggregate('avg', column);
  }

  /**
   * order by
   * @param column 
   * @param direction 
   */
  orderBy(column: string, direction = 'asc') {
    const _direction = direction.toLowerCase();
    if (!['asc', 'desc'].includes(_direction)) throw new IllegalArgumentError('Order direction must be "asc" or "desc"');
    this._orders.push({
      type: 'column',
      column,
      direction: _direction,
    });
    return this;
  }

  /**
   * order by raw
   * @param raw 
   * @returns 
   */
  orderByRaw(raw: string) {
    this._orders.push({
      type: 'raw',
      column: raw,
    });
    return this;
  }

  /**
   * limit
   * @param value 
   */
  limit(value: number) {
    if (value >= 0) this._limit = value;
    return this;
  }

  /**
   * limit 别名
   * @param value 
   */
  take(value: number) {
    return this.limit(value);
  }

  /**
   * offset
   * @param value 
   */
  offset(value: number) {
    this._offset = value >= 0 ? value : 0;
    return this;
  }

  /**
   * offset 别名
   * @param value 
   */
  skip(value: number) {
    return this.offset(value);
  }

  /**
   * 去重
   * @param column 
   * @param columns 
   */
  distinct(column: string | boolean = false, ...columns: string[]) {
    if (typeof column === 'boolean') {
      this._distinct = column;
      return this;
    }
    if (columns.length > 0) {
      this._distinct = [column, ...columns];
      return this;
    }
    this._distinct = true;
    return this;
  }

  /**
   * Lock the selected rows
   * @param value 
   */
  lock(value: boolean | string) {
    this._lock = value;
    return this;
  }

  /**
   * Share lock the selected rows
   */
  sharedLock() {
    return this.lock(false);
  }
  
  /**
   * Lock the selected rows for updating
   */
  lockForUpdate() {
    return this.lock(true);
  }

  /**
   * Add group by statement
   * @param columns 
   */
  groupBy(...columns: string[] | string[][]) {
    for (const column of columns) {
      if (typeof column === 'string') {
        this._groups.push(column);
      } else if (Array.isArray(column)) {
        this._groups.push(...column);
      }
    }
    return this;
  }

  /**
   * join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   * @param type 
   */
  join(table: string | ((join: Join & Builder) => Join | void), column?: string, operator?: any, value?: any, type: TJoinType = 'inner') {
    const join = new Join(new Builder(this.actuator, this.parser), type);
    if (typeof table === 'string' && column) {
      this._joins.push(
        join.table(table).on(column, operator, value)
      );
      this.addBinding('join', join.getBindings());
      // this.addParams(join.getParams());
    } else if (typeof table === 'function') {
      table(join);
      this._joins.push(join);
      this.addBinding('join', join.getBindings());
      // this.addParams(join.getParams());
    }
    return this;
  }

  /**
   * left join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   */
  leftJoin(table: string | ((join: Join & Builder) => Join | void), column?: string, operator?: any, value?: any) {
    return this.join(table, column, operator, value, 'left');
  }

  /**
   * right join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   */
  rightJoin(table: string | ((join: Join & Builder) => Join | void), column?: string, operator?: any, value?: any) {
    return this.join(table, column, operator, value, 'right');
  }

  /**
   * having
   * @param column 
   * @param operator 
   * @param value 
   * @param symlink 
   */
  having(column: string, operator: any, value?: any, symlink: TSymlink = 'and') {
    const _symlink = this._havings.length > 0 ? symlink : '';
    const type = 'value';
    if (value !== undefined) {
      this._havings.push({ type, column, operator, value, symlink: _symlink });
    } else {
      this._havings.push({ type, column, operator: '=', value: operator, symlink: _symlink });
    }
    return this;
  }

  /**
   * union
   * @param builder 
   * @param isAll 
   */
  union(builder: Builder | ((union: Builder) => Builder | void), isAll = false) {
    let _builder = builder as Builder;
    if (typeof builder === 'function') {
      _builder = new Builder(this.actuator, this.parser);
      builder(
        _builder
      );
    }
    this._unions.push({
      builder: _builder,
      isAll,
    });
    this.addBinding('union', this.getBindings());
    // this.addParams(_builder.getParams());
    return this;
  }

  /**
   * union all
   * @param builder 
   */
  unionAll(builder: Builder | ((union: Builder) => Builder)) {
    return this.union(builder, true);
  }

  /**
   * add binding param
   * @param key 
   * @param value 
   */
  addBinding(key: BindingKeys, value: any) {
    if (Array.isArray(value)) {
      this.bindings.get(key)?.push(...value);
      return this;
    }
    this.bindings.get(key)?.push(value);
    return this;
  }

  /**
   * get all binding params
   */
  getBindings() {
    const _keys = [...this.bindings.keys()];
    // return Array.from(this.bindings).flat();
    return this.getBindingsWithKeys(_keys);
  }

  /**
   * gei binding params with keys
   * @param keys 
   */
  getBindingsWithKeys(keys: BindingKeys[]) {
    const _keys = [...this.bindings.keys()].filter(key => keys.includes(key));
    const bindings: any[] = [];
    for (const key of _keys) {
      if (this.bindings.has(key)) {
        bindings.push(
          ...this.bindings.get(key) ?? []
        );
      }
    }
    return bindings;
  }

  /**
   * get binding params except keys
   * @param keys 
   */
  getBindingsExceptKeys(keys: BindingKeys[]) {
    const _keys = [...this.bindings.keys()].filter(key => !keys.includes(key));
    const bindings: any[] = [];
    for (const key of _keys) {
      if (this.bindings.has(key)) {
        bindings.push(
          ...this.bindings.get(key) ?? []
        );
      }
    }
    return bindings;
  }

  /**
   * gen sql string
   */
  toSql() {
    return this.parser.parseSelect(this);
  }

  /**
   * load sql and params
   */
  logSql() {
    this.shouldLogSql = true;
    return this;
  }

  /**
   * log sql alias
   */
  log() {
    this.shouldLogSql = true;
    return this;
  }

  /**
   * dump sql
   */
  dumpSql() {
    this.shouldDumpSql = true;
    return this;
  }

  /**
   * alias for dumpSql
   */
  dump() {
    return this.dumpSql();
  }

  /**
   * query multiple records from database,
   */
  async find() {
    const sql = this.toSql();
    const params = this.getBindings();
    if (this.shouldLogSql) {
      console.log('sql:', sql);
      console.log('params:', params);
    }
    const results = await this.actuator.select(sql, params);
    return results;
  }

  /**
   *  query multiple records and count from database,
   */
  async findAndCount(): Promise<[any[], number]> {
    const results: any[] = await this.find();
    const count: number = await this.count();
    return [results, count];
  }

  /**
   * query first record from database
   */
  async first(): Promise<Record<string, any> | undefined> {
    const sql = this.take(1).toSql();
    const params = this.getBindings();
    if (this.shouldLogSql) {
      console.log('sql:', sql);
      console.log('params:', params);
    }
    const results = await this.actuator.select(sql, params);
    if (!results[0]) return;
    return {
      ...results[0]
    } as Record<string, any>;
  }
  /**
   * get binding parmas for update
   * @param values 
   */
  getBindingsForUpdate(values: any[] = []) {
    const cleanBindings = this.getBindingsExceptKeys([
      'select',
      'join'
    ]);
    return [
      ...this.getBindingsWithKeys(['join']),
      ...values,
      ...cleanBindings
    ];
  }

  /**
   * get binding params for delete
   */
  getBindingsForDelete() {
    const cleanBindings = this.getBindingsExceptKeys([
      'select',
    ]);
    return [
      ...cleanBindings
    ];
  }

  /**
   * build final sql for debug
   * @param sql 
   * @param params 
   */
  private buildDebugSql(sql: string, params: any[] = []) {
    let _sql = sql;
    let i = 0;
    while (~_sql.indexOf('?')) {
      _sql = _sql.replace(/(\?)/i, params[i]);
      i++;
    }
    return _sql;
  }

  /**
   * log debug sql
   * @param sql 
   * @param params 
   */
  private logDebugSql(sql: string, params: any[] = []) {
    const finalSql = this.buildDebugSql(sql, params);
    console.log('Your SQL:\n');
    console.log(finalSql);
  }

  /**
   * commit transaction
   */
  async commit() {
    await this.actuator.commit();
  }
  
  /**
   * rollback transaction
   */
  async rollback() {
    await this.actuator.rollback();
  }

  /**
   * 批量插入
   * @param data 
   */
  async insertAll(data: Record<string, any>[] = []) {
    const params: any[] = [];
    for (const item of data) {
      params.push([
        ...Object.values(item)
      ]);
    }
    const sql = this.parser.parseInsert(this, data);
    if (this.shouldLogSql) {
      this.logDebugSql(sql, params);
    }
    if (this.shouldDumpSql) return this.buildDebugSql(sql, params);
    return this.actuator.insert(
      sql,
      params
    );
  }

  /**
   * inser data
   * @param data 
   */
  async insert(data: Record<string, any>) {
    const params = [];
    params.push(Object.values(data));
    const sql = this.parser.parseInsert(this, [data]);
    if (this.shouldLogSql) {
      this.logDebugSql(sql, params);
    }
    if (this.shouldDumpSql) return this.buildDebugSql(sql, params);
    return this.actuator.insert(
      sql,
      params
    );
  }

  /**
   * update data
   * @param data 
   */
  async update(data: Record<string, any>) {
    const columns = Object.keys(data);
    const values = columns.map(column => data[column]);
    const sql = this.parser.parseUpdate(this, columns);
    const params = this.getBindingsForUpdate(values);
    if (this.shouldLogSql) {
      this.logDebugSql(sql, params);
    }
    if (this.shouldDumpSql) return this.buildDebugSql(sql, params);
    return this.actuator.update(
      sql,
      params
    );
  }

  /**
   * 根据给定的值自增字段
   * @param column 
   * @param amount 
   * @param extra 
   */
  async increment(column: string, amount = 1, extra?: Record<string, any>) {
    const wrapedColumn = this.parser.wrapColum(column, this);
    const columns = {
      [`${column}`]: `${wrapedColumn} + ${amount}`,
      ...extra
    };
    return this.update(columns);
  }

  /**
   * 根据给定的值自减字段
   * @param column 
   * @param amount 
   * @param extra 
   */
  async decrement(column: string, amount = 1, extra?: Record<string, any>) {
    const wrapedColumn = this.parser.wrapColum(column, this);
    const columns = {
      [`${column}`]: `${wrapedColumn} - ${amount}`,
      ...extra
    };
    return this.update(columns);
  }

  /**
   * delete by id
   * @param id 
   */
  async delete(id?: number | string) {
    if (id) {
      this.where('id', '=', id);
    }
    const sql = this.parser.parseDelete(this);
    const params = this.getBindingsForDelete();
    if (this.shouldLogSql) {
      this.logDebugSql(sql, params);
    }
    if (this.shouldDumpSql) return this.buildDebugSql(sql, params);
    return this.actuator.delete(
      sql,
      params
    );
  }
}