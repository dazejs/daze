import { createInjectDecorator } from '../factory/create-inject-decorator';

export function autowired(target: Record<string, any>, propertyKey: string | symbol) {
  return createInjectDecorator(propertyKey.toString())(target, propertyKey);
}

export function Autowired(target: Record<string, any>, propertyKey: string | symbol) {
  return autowired(target, propertyKey);
}