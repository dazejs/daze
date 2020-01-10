import { Actuator } from '../actuator/actuator';
import { Builder } from '../builder';
import { Parser } from '../parser/parser';

export abstract class Manager {
  /**
   * sql parser
   */
  parser: Parser;

  /**
   * sql actuator
   */
  actuator: Actuator;

  /**
   * close connection close
   */
  abstract close(): void

  /**
   * set table
   * @param table 
   * @param as 
   */
  abstract table(table: string, as?: string): Builder
  abstract beginTransaction(): Promise<Builder>
}