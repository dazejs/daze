
import 'reflect-metadata';
import { Controller } from '../../src/base/controller'

export function createController() {
  class _Controller extends Controller {
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

  Reflect.defineMetadata('type', 'controller', _Controller.prototype);

  return _Controller;
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
