import { createInjectDecorator } from './factory/create-inject-decorator';

export function Inject(name: any, ...args: any[]) {
  return createInjectDecorator(name)(...args);
}

export function inject(name: any, ...args: any[]) {
  return Inject(name, ...args);
}