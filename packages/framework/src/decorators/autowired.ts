
import { PROPERTYTYPE_METADATA } from '../symbol';

export const Autowired: PropertyDecorator = function (target, propertyKey) {
  const type = Reflect.getMetadata('design:type', target, propertyKey);
  Reflect.defineMetadata(PROPERTYTYPE_METADATA, type, target.constructor, propertyKey);
};
