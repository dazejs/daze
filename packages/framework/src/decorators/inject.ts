import { createInjectDecorator } from './factory/create-inject-decorator';

export function inject(name: any = null, ...args: any[]) {
  return createInjectDecorator(name)(...args);
}