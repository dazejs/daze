/**
 * 执行器抽象类
 */
export abstract class Actuator {
  abstract query(sql: string, bindings?: any): Promise<any>
  abstract select(query: string, bindings?: any[]): Promise<any[]>
  abstract insert(query: string, bindings?: any[]): Promise<number>
  abstract update(query: string, bindings?: any[]): Promise<number>
  abstract delete(query: string, bindings?: any[]): Promise<number>
  abstract commit(): Promise<void>
  abstract rollback(): Promise<void>
}