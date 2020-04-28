/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
export function table(table: string): ClassDecorator {
  return function <TFunction extends Function> (target: TFunction) {
    Reflect.defineMetadata('table', table, target);
  };
}
