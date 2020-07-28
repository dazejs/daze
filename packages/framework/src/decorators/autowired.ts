
import { PROPERTYTYPE_METADATA } from '../symbol';

export const autowired: PropertyDecorator = function (target, propertyKey) {
  const type = Reflect.getMetadata('design:type', target, propertyKey);
  Reflect.defineMetadata(PROPERTYTYPE_METADATA, type, target, propertyKey);
};

export const Autowired = autowired;
