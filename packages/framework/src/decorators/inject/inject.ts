import { createInjectDecorator } from '../factory/create-inject-decorator';

export function inject(name?: any, ...args: any[]) {
  return createInjectDecorator(name, args);
}
