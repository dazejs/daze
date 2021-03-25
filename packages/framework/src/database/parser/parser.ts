import { Builder } from '../builder';


export class Parser {
  components: string[] = [
    'aggregate',
    'columns',
    'from',
    'joins',
    'wheres',
    'groups',
    'havings',
    'orders',
    'limit',
    'offset',
    'lock',
  ];

  /**
   * parse select query builkder
   * @param builder 
   */
  parseSelect(builder: Builder): string {
    // 当聚合函数与 union 一起使用时，使用临时表名包裹
    if (builder._aggregate && builder._unions.length) {
      const _sql = `${this.parseAggregate(builder)}`;
      return `${_sql} from (${this.parseSelect(builder.removeAggregate())}) as temp`;
    }

    // select sql
    const sql = this.parseComponents(builder);

    // 当使用了 union, 将 union sql 合并
    if (builder._unions.length) {
      return `(${sql}) ${this.parseUnions(builder)}`;
    }
    return sql;
  }

  /**
   * parse insert
   * @param builder 
   * @param columns 
   */
  parseInsert(builder: Builder, data?: Record<string, any>[]) {
    builder.alias('');
    if (!data || !data.length) {
      return `insert into ${this.getTable(builder)} default values`;
    }
    const columns = Object.keys(data[0]);
    const _columns = this.columnDelimite(columns, builder);

    // const values = data.map(() => `(${columns.map(() => this.parameter()).join(', ')})`).join(', ');
    const values = data.map(() => `(${this.parameter()})`).join(', ');
    return `insert into ${this.getTable(builder)} (${_columns}) values ${values}`;
  }
  /**
   * parse update
   * @param builder 
   * @param columns 
   */
  parseUpdate(builder: Builder, columns: string[] = []) {
    const _columns = this.columnDelimiteForUpdate(columns, builder);

    const where = this.parseWheres(builder);

    if (builder._joins.length > 0) {
      const joins = this.parseJoins(builder);
      return `update ${this.getTable(builder)} ${joins} set ${_columns} ${where}`;
    }

    return `update ${this.getTable(builder)} set ${_columns} ${where}`;
  }

  /**
   * parse delete
   * @param builder 
   */
  parseDelete(builder: Builder) {
    builder.alias('');
    const where = this.parseWheres(builder);
    if (builder._joins.length > 0) {
      const joins = this.parseJoins(builder);
      return `delete from ${this.getTable(builder)} ${joins} ${where}`;
    }

    return `delete from ${this.getTable(builder)} ${where}`;
  }

  /**
   * parser query components
   * @param builder 
   */
  parseComponents(builder: Builder): string {
    const sqls: string[] = [];
    for (const component of this.components) {
      const sql = this.parseComponent(builder, component);
      if (sql) {
        sqls.push(sql);
      }
    }
    return sqls.join(' ');
  }

  /**
   * parse components
   * @param builder 
   * @param part 
   */
  parseComponent(builder: Builder, part: string) {
    switch(part) {
      case 'aggregate':
        return this.parseAggregate(builder);
      case 'columns':
        return this.parseColumns(builder);
      case 'from':
        return this.parseFrom(builder);
      case 'joins':
        return this.parseJoins(builder);
      case 'wheres':
        return this.parseWheres(builder);
      case 'groups':
        return this.parseGroups(builder);
      case 'havings':
        return this.parseHavings(builder);
      case 'orders':
        return this.parseOrders(builder);
      case 'limit':
        return this.parseLimit(builder);
      case 'offset':
        return this.parseOffset(builder);
      case 'lock':
        return this.parseLock(builder);
      default:
        return '';
    }
  }

  /**
   * parse aggregate function
   * @param builder 
   */
  parseAggregate(builder: Builder) {
    if (!builder._aggregate) return '';
    let { column } = builder._aggregate;
    // 需要去重
    if (builder._distinct === true && column !== '*') {
      column = `distinct ${this.wrapColum(column, builder)}`;
    } else if (Array.isArray(builder._distinct)) {
      column = `distinct ${this.columnDelimite(builder._distinct, builder)}`;
    }
    return `select ${builder._aggregate.func}(${column}) as aggregate`;
  }

  /**
   * parse Columns
   * @param builder 
   */
  parseColumns(builder: Builder) {
    if (builder._aggregate) return '';
    const select = builder._distinct ? 'select distinct' : 'select';
    if (!builder._columns.length) return `${select} *`;
    const str = builder._columns.map(({
      type,
      column
    }) => {
      if (type === 'raw') return column;
      return this.wrapColum(column, builder);
    }).join(', ');
    return `${select} ${str}`;
  }

  /**
   * parse table target
   * @param builder 
   */
  parseFrom(builder: Builder) {
    return builder._table ? `from ${this.getTable(builder)}` : '';
  }

  /**
   * parse groups
   * @param builder 
   */
  parseGroups(builder: Builder) {
    return builder._groups.length ? `group by ${this.columnDelimite(builder._groups, builder)}`: '';
  }

  /**
   * parse where
   * @param builder 
   */
  parseWheres(builder: Builder, conjunction = 'where') {
    if (!builder._wheres.length) return '';
    const wheres: string[] = [];
    for (const where of builder._wheres) {
      const leadSymlink = where.symlink ? `${where.symlink} ` : '';
      // value type
      if (where.type === 'value') {
        wheres.push(
          //where.value
          `${leadSymlink}${this.wrapColum(where.column as string, builder)} ${where.operator} ${this.parameter()}`
        );
      }
      // column type
      if (where.type === 'column') {
        wheres.push(
          `${leadSymlink}${this.wrapColum(where.column as string, builder)} ${where.operator} ${this.wrapColum(where.value as string, builder)}`
        );
      }

      if (where.type === 'sql') {
        wheres.push(
          `${leadSymlink}${where.value}`
        );
      }

      if (where.type === 'in') {
        wheres.push(
          `${leadSymlink}${this.wrapColum(where.column as string, builder)} in (${this.parameterize(where.value)})`
        );
      }

      if (where.type === 'notIn') {
        wheres.push(
          `${leadSymlink}${this.wrapColum(where.column as string, builder)} not in (${this.parameterize(where.value)})`
        );
      }

      if (where.type === 'null') {
        wheres.push(
          `${leadSymlink}${this.wrapColum(where.column as string, builder)} is null`
        );
      }

      if (where.type === 'notNull') {
        wheres.push(
          `${leadSymlink}${this.wrapColum(where.column as string, builder)} is not ull`
        );
      }
    }
    return `${conjunction} ${wheres.join(' ')}`;
  }

  /**
   * parse orders
   * @param builder 
   */
  parseOrders(builder: Builder) {
    if (!builder._orders.length) return '';
    const flatOrders = builder._orders.map(order => `${order.column} ${order.direction}`);
    return `order by ${flatOrders.join(', ')}`;
  }

  /**
   * parse limit
   * @param builder 
   */
  parseLimit(builder: Builder) {
    return builder._limit && builder._limit >= 0 ? `limit ${builder._limit}` : '';
  }

  /**
   * parse offset
   */
  parseOffset(builder: Builder) {
    return builder._offset && builder._offset >= 0 ? `offset ${builder._offset}` : '';
  }

  /**
   * parse lock
   * @param builder 
   */
  parseLock(builder: Builder) {
    if (typeof builder._lock === 'string') return builder._lock;
    return '';
  }

  /**
   * parse joins
   * @param builder 
   */
  parseJoins(builder: Builder) {
    if (!builder._joins.length) return '';
    const joins: string[] = [];
    for (const join of builder._joins) {
      joins.push(
        `${join.type} join ${this.getTable(join.builder)} ${this.parseWheres(join.builder, 'on')}`
      );
    }
    return joins.join(' ');
  }

  /**
   * parse having
   * @param builder 
   */
  parseHavings(builder: Builder) {
    if (!builder._havings.length) return '';
    const havings: string[] = [];
    for (const having of builder._havings) {
      const leadSymlink = having.symlink ? `${having.symlink} ` : '';
      havings.push(
        `${leadSymlink}${having.column} ${having.operator} ${having.value}`
      );
    }
    return `having ${havings.join(' ')}`;
  }

  /**
   * parse unnions
   * @param builder 
   */
  parseUnions(builder: Builder) {
    const sqls: string[] = [];
    if (!builder._unions.length) return '';
    for (const union of builder._unions) {
      sqls.push(
        `${union.isAll ? 'union all' : 'union'} (${union.builder.toSql()})`
      );
    }
    return `${sqls.join(' ')}`;
  }

  /**
   * parameterize params
   * @param value 
   */
  parameterize(value: any[]) {
    return value.map(() => this.parameter());
  }

  /**
   * parameter param
   */
  parameter() {
    return '?';
  }

  /**
   * Delimite columns
   * @param columns 
   */
  columnDelimite(columns: string[], builder: Builder) {
    if (!columns) return '';
    return columns.map(column => this.wrapColum(column, builder)).join(', ');
  }

  /**
   * Delimite columns for update
   * @param columns 
   */
  columnDelimiteForUpdate(columns: string[], builder: Builder) {
    if (!columns) return '';
    return columns.map(column => `${this.wrapColum(column, builder)} = ${this.parameter()}`);
  }

  /**
   * wrapColum
   * @param column 
   */
  wrapColum(column: string, builder: Builder) {
    if (~column.indexOf('.')) {
      const [_alias, _column] = column.split('.');
      if (_column === '*') return `\`${_alias}\`.${_column}`;
      return `\`${_alias}\`.\`${_column}\``;
    }
    if (builder._alias) {
      return `\`${builder._alias}\`.\`${column}\``;
    }
    return `\`${builder._table}\`.\`${column}\``;
  }

  /**
   * get table name
   * @param builder 
   */
  getTable(builder: Builder) {
    if (builder._alias) {
      return `\`${builder._table}\` as \`${builder._alias}\``;
    }
    return `\`${builder._table}\``;
  }
}