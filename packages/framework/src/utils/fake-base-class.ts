export function fakeBaseClass<T>(): new() => Pick<T, keyof T> {
  return class {} as any;
}