import { Builder } from '../builder';
import { Parser } from './parser';

export class MysqlParser extends Parser {
  parseLock(builder: Builder) {
    if (typeof builder._lock === 'string') return builder._lock;
    if (typeof builder._lock === 'boolean') return builder._lock ? 'for update' : 'lock in share mode';
    return '';
  }
}