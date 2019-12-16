import { createInjectDecorator } from './factory/create-inject-decorator';

export function Inject(name: string, ...args: any[]) {
  return createInjectDecorator(name)(...args);
}

export function inject(name: string, ...args: any[]) {
  return Inject(name, ...args);
}