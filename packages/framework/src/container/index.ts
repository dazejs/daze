/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import EventEmitter from 'events';
import * as symbols from '../symbol';

const BIND = Symbol('Container#bind');

/**
 * The Container
 */
export class Container extends EventEmitter {
  /**
   * Container binding identifier
   */
  binds = new Map();

  /**
   * instances Map in the container
   */
  instances = new Map();

  /**
   * abstract groups map
   */
  tags: any = {};

  /**
   * static instance
   */
  static instance: any;

  /**
   * Bind a singleton to the container
   */
  singleton(abstract: any, concrete: any = null, callable = false) {
    this[BIND](abstract, concrete, true, callable);
    return this;
  }

  /**
   * Bind a multiton to the container
   */
  multiton(abstract: any, concrete: any = null, callable = false) {
    this[BIND](abstract, concrete, false, callable);
  }

  /**
   * Determines if the instance is Shared
   */
  isShared(abstract: any) {
    return this.instances.has(abstract) || (
      this.binds.get(abstract)
      && Reflect.has(this.binds.get(abstract), 'shared')
      && this.binds.get(abstract).shared === true
    );
  }

  /**
   * Identifies whether the container has been bound
   */
  bound(abstract: any) {
    return this.binds.has(abstract) || this.instances.has(abstract);
  }

  /**
   * Identifies whether the container has been instance
   */
  exists(abstract: any) {
    return this.instances.has(abstract);
  }

  /**
   * Bind an object to the container
   */
  [BIND](abstract: any, concrete: any, shared = false, callable = false) {
    if (!abstract || !concrete) return;
    const isShared = concrete[symbols.MULTITON] === true ? false : shared;
    if (typeof concrete === 'function') {
      this.binds.set(abstract, {
        concrete,
        shared: isShared,
        callable,
      });
      return this;
    }
    this.instances.set(abstract, {
      concrete,
      shared: true,
      callable,
    });
    this.emit('binding', this.instances.get(abstract), this);
    return this;
  }

  /**
   * Create an instance of an object
   */
  make(abstract: any, args: any[] = [], force = false): any {
    const shared = this.isShared(abstract);
    let obj = null;
    // returns directly if an object instance already exists in the container
    // instance shared
    if (this.instances.has(abstract) && shared && !force) {
      return this.instances.get(abstract).concrete;
    }
    // if a binding object exists, the binding object is instantiated
    if (this.binds.has(abstract)) {
      const { concrete, callable } = this.binds.get(abstract);
      if (callable) {
        // 普通函数
        obj = this.invokeFunction(abstract, args);
      } else if (Reflect.getMetadata('injectable', concrete) === true) {
        // 可注入的class
        obj = this.invokeInjectAbleClass(abstract, args);
      } else {
        // 构造函数（class 和 function）
        obj = this.invokeConstructor(abstract, args);
      }
      this.emit('resolving', obj, this);
    }
    // 如果是单例，保存实例到容器
    if (shared && obj) {
      this.instances.set(abstract, {
        concrete: obj,
        shared,
      });
    }
    return obj;
  }

  /**
   * 调用普通函数
   */
  private invokeFunction(abstract: any, args: any[]) {
    const { concrete } = this.binds.get(abstract);
    return concrete(...args, this);
  }

  /**
   * 调用构造函数
   */
  private invokeConstructor(abstract: any, args: any[]) {
    const { concrete: Concrete } = this.binds.get(abstract);
    return new Concrete(...args, this);
  }

  /**
   * 调用可注入的 Class
   */
  private invokeInjectAbleClass(abstract: any, args: any[]) {
    const { concrete: Concrete } = this.binds.get(abstract);
    const that = this;
    const bindParams = [];
    // 需要构造方法注入参数
    const constructorInjectors = Reflect.getMetadata(
      'injectparams', Concrete,
    ) || [];


    for (const [type, params = []] of constructorInjectors) {
      const injectedParam = this.make(type, [...params, ...args]);
      bindParams.push(injectedParam);
    }
    const ConcreteProxy = new Proxy(Concrete, {
      construct(_target, _args, _ext) {
        const instance = Reflect.construct(_target, _args, _ext);
        instance.__context__ = args;
        return new Proxy(instance, {
          get(__target, __name, __receiver) {
            if (__name === 'name' || __name === 'constructor' || typeof __name !== 'string') return Reflect.get(__target, __name, __receiver);
            if (typeof __target[__name] === 'function') {
              return new Proxy(__target[__name], {
                apply(target, thisBinding, methodArgs) {
                  const bindMethodParams = [];
                  // 需要成员方法注入参数
                  const methodInjectors = Reflect.getMetadata(
                    'injectparams', Concrete, __name,
                  ) || [];

                  for (const [type, params = []] of methodInjectors) {
                    const injectedParam = that.make(type, [...params, ...args]);
                    bindMethodParams.push(injectedParam);
                  }
                  return Reflect.apply(target, thisBinding, [...bindMethodParams.reverse(), ...methodArgs]);
                },
              });
            }
            // 需要成员变量注入参数
            const propertyInjectors = Reflect.getMetadata(
              'injectparams', Concrete, __name,
            ) || [];
            const [type = '', params = []] = propertyInjectors[0] || [];
            return type
              ? that.make(type, [...params, ...args])
              : Reflect.get(__target, __name, __receiver);
          },
        });
      },
    });
    return Reflect.construct(ConcreteProxy, [...bindParams, ...args, this]);
  }

  /**
   * set abstract in groups
   */
  static tag(abstract: any, tag: string) {
    if (!abstract || !tag) return;
    if (!this.getInstance().tags[tag]) this.getInstance().tags[tag] = [];
    this.getInstance().tags[tag].push(abstract);
  }

  /**
   * gets the object instance in the container
   */
  static get(abstract: any, args: any[] = []) {
    return this.getInstance().make(abstract, args);
  }

  /**
   * bind an abstract in container
   */
  static bind(abstract: any, concrete: any = null, shared = true, callable = false) {
    return this.getInstance()[BIND](abstract, concrete, shared, callable);
  }

  /**
   * Determines whether there is a corresponding binding within the container instance
   */
  static has(abstract: any) {
    return this.getInstance().binds.has(abstract) || this.getInstance().instances.has(abstract);
  }

  /**
   * Get the container instance
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new Container();
    }
    return this.instance;
  }

  /**
   * Set the container instance
   */
  static setInstance(instance: any) {
    this.instance = instance;
  }
}
