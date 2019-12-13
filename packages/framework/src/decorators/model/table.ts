/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
export function Table(table: string): ClassDecorator {
  return function <TFunction extends Function> (target: TFunction): TFunction {
    Reflect.defineMetadata('table', table, target);
    return target;
  };
}

export function table(table: string): ClassDecorator {
  return Table(table);
}