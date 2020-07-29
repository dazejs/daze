
import { PROPERTYTYPE_METADATA } from '../symbol';

export const autowired: PropertyDecorator = function (target, propertyKey) {
  const type = Reflect.getMetadata('design:type', target, propertyKey);
  Reflect.defineMetadata(PROPERTYTYPE_METADATA, type, target.constructor, propertyKey);
};

export const Autowired = autowired;
