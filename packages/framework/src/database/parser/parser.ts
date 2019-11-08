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
   * parser query components
   * @param builder 
   */
  parseComponents(builder: Builder): string {
    const sqls = [];
    for (const component of this.components) {
      const sql = this.parseComponent(builder, component);
      if (sql) {
        sqls.push(sql);
      }
    }
    return sqls.join(' ');
  }

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
      column = `distinct ${column}`;
    } else if (Array.isArray(builder._distinct)) {
      column = `distinct ${this.columnDelimite(builder._distinct)}`;
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
    return `${select} ${this.columnDelimite(builder._columns)}`;
  }

  /**
   * parse table target
   * @param builder 
   */
  parseFrom(builder: Builder) {
    return builder._from ? `from ${builder._from}` : '';
  }

  /**
   * parse groups
   * @param builder 
   */
  parseGroups(builder: Builder) {
    return builder._groups.length ? `group by ${this.columnDelimite(builder._groups)}`: '';
  }

  /**
   * parse where
   * @param builder 
   */
  parseWheres(builder: Builder, conjunction = 'where') {
    if (!builder._wheres.length) return '';
    const wheres = [];
    for (const where of builder._wheres) {
      const leadSymlink = where.symlink ? `${where.symlink} ` : '';
      // value type
      if (where.type === 'value') {
        wheres.push(
          //where.value
          `${leadSymlink}${where.column} ${where.operator} ${this.placeholder()}`
        );
      }
      // column type
      if (where.type === 'column') {
        wheres.push(
          `${leadSymlink}${where.column} ${where.operator} ${where.value}`
        );
      }

      if (where.type === 'sql') {
        wheres.push(
          `${leadSymlink}${where.value}`
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
    return builder._limit >= 0 ? `limit ${builder._limit}` : '';
  }

  /**
   * parse offset
   */
  parseOffset(builder: Builder) {
    return builder._offset >= 0 ? `offset ${builder._offset}` : '';
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
    const joins = [];
    for (const join of builder._joins) {
      joins.push(
        `${join.joinType} join ${join._from} ${this.parseWheres(join.builder, 'on')}`
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
    const havings = [];
    for (const having of builder._havings) {
      const leadSymlink = having.symlink ? `${having.symlink} ` : '';
      havings.push(
        `${leadSymlink}${having.column} ${having.operator} ${having.value}`
      );
    }
    return `having ${havings.join(' ')}`;
  }

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

  placeholder() {
    return '?';
  }

  columnDelimite(columns: string[]) {
    return columns.join(', ');
  }
}