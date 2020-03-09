import { createInjectDecorator } from './factory/create-inject-decorator';

export function Inject(name: any = null, ...args: any[]) {
  return createInjectDecorator(name)(...args);
}

export function inject(name: any = null, ...args: any[]) {
  return Inject(name, ...args);
}