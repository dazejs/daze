
import 'reflect-metadata';
import { Controller } from '../../src/base/controller'

export function createController() {
  return class extends Controller {
    get hello() {
      return 'hello';
    }

    index() { }

    show() { }

    create() { }

    stroe() { }

    edit() { }

    update() { }

    destory() { }
  }
};

export function createService() {
  const target = class {};
  Reflect.defineMetadata('type', 'service', target.prototype);
  Reflect.defineMetadata('name', 'user', target.prototype);
  return target;
};

export function createResource() {
  const target = class { };
  Reflect.defineMetadata('type', 'resource', target.prototype);
  Reflect.defineMetadata('name', 'user', target.prototype);
  return target;
};

export function createComponent() {
  const target = class { };
  Reflect.defineMetadata('type', 'component', target.prototype);
  Reflect.defineMetadata('name', 'user', target.prototype);
  return target;
};
