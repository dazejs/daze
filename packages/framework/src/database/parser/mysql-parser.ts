import { Parser } from './parser'
import { Builder } from '../builder'

export class MysqlParser extends Parser {
  parseLock(builder: Builder) {
    if (typeof builder._lock === 'string') return builder._lock
    return builder._lock ? 'for update' : 'lock in share mode';
  }
}