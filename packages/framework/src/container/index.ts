/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { EventEmitter } from 'events';
import { InjectParamsOption } from '../decorators/factory/decorator-factory';
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
    * 绑定的路径
    */
  paths = new Map();

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
   * 绑定路径
   * @param abstract
   * @param path
   * @returns
   */
  public bindPath(abstract: any, path: string) {
    if (!abstract || !path) return;
    this.paths.set(abstract, path);
  }

  /**
  * 获取绑定的路径
  * @param abstract
  * @returns
  */
  public getPath(abstract: any) {
    if (!abstract) return;
    return this.paths.get(abstract);
  }

  /**
   * Bind an object to the container
   */
  [BIND](abstract: any, concrete: any, shared = false, callable = false) {
    if (!abstract || !concrete) return;
    let isShared = shared;
    if (concrete && Reflect.getMetadata(symbols.MULTITON, concrete) === true) {
      isShared = false;
    } else if (concrete && Reflect.getMetadata(symbols.SINGLETON, concrete) === true) {
      isShared = true;
    }
    if (typeof concrete === 'function') {
      this.binds.set(abstract, {
        concrete,
        shared: isShared,
        callable,
      });
    } else {
      this.instances.set(abstract, {
        concrete,
        shared: true,
        callable: false,
      });
    }
    this.emit('binding', this.instances.get(abstract), this);
    return this;
  }

  /**
   * Create an instance of an object
   */
  make(abstract: any, args: any[] = [], force = false): any {
    const shared = this.isShared(abstract);
    let obj;
    // returns directly if an object instance already exists in the container
    // instance shared
    if (this.instances.has(abstract) && shared && !force) {
      return this.instances.get(abstract).concrete;
    }
    // if a binding object exists, the binding object is instantiated
    if (this.binds.has(abstract)) {
      const { concrete, callable } = this.binds.get(abstract);
      // 普通函数
      if (callable) {
        obj = this.invokeFunction(abstract, args);
      }
      // 可注入的class
      else if (Reflect.getMetadata(symbols.INJECTABLE, concrete) === true) {
        obj = this.invokeInjectAbleClass(abstract, args);
      }
      // 构造函数（class 和 function）
      else {
        obj = this.invokeConstructor(abstract, args);
      }
      this.emit('resolving', obj, this);
    }
    // 如果是单例，保存实例到容器
    if (shared && obj !== undefined && !force) {
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
   * 调用可注入的类
   */
  private invokeInjectAbleClass(abstract: any, args: any[]) {
    const { concrete: Concrete } = this.binds.get(abstract);
    const that = this;
    const ConcreteProxy = new Proxy(Concrete, {
      construct(target: any, targetArgArray: any[] = [], newTarget?: any) {
        const params = that.bindConstructorParams(Concrete, args, targetArgArray);
        const instance = Reflect.construct(target, [...params], newTarget);
        instance.__context__ = args;
        return new Proxy(instance, {
          get(instanceTarget: any, propertyKey: string | number | symbol, receiver: any) {
            if (propertyKey === 'constructor') return Reflect.get(instanceTarget, propertyKey, receiver);
            if (typeof instanceTarget[propertyKey] === 'function') { // Method
              return new Proxy(instanceTarget[propertyKey], {
                apply(methodTarget: any, thisArg: any, argArray?: any) {
                  const methodParams = that.bindMethodParams(Concrete, propertyKey.toString(), args, argArray);
                  return Reflect.apply(methodTarget, thisArg, [...methodParams]);
                }
              });
            }
            const propertyParam = that.bindProperty(Concrete, args, propertyKey.toString());
            return propertyParam ?? Reflect.get(instanceTarget, propertyKey, receiver);
          }
        });
      }
    });
    return Reflect.construct(ConcreteProxy, [...args, this]);
  }

  /**
   * 内建类型
   * @param type 
   */
  private isBuildInType(type: any) {
    return type === Number ||
      type === String ||
      type === Object ||
      type === Boolean ||
      type === Array ||
      type === Function;
  }

  /**
   * 绑定构造函数参数
   * @param Concrete 
   * @param args 
   * @param vars 
   */
  private bindConstructorParams(Concrete: any, args: any[] = [], vars: any[] = []) {
    const disableInject = Reflect.getMetadata(symbols.DISABLE_INJECT, Concrete);
    if (disableInject) return vars;
    const injectParams: InjectParamsOption[] = Reflect.getMetadata(symbols.INJECTTYPE_METADATA, Concrete) ?? [];
    const typeParams: any[] = Reflect.getMetadata(symbols.PARAMTYPES_METADATA, Concrete) ?? [];
    const argsLength = Math.max(Concrete.length, injectParams.length, typeParams.length, vars.length);
    return this.bindParams(argsLength, injectParams, typeParams, args, vars);
  }

  /**
   * 绑定类方法参数
   * @param Concrete 
   * @param key 
   * @param args 
   * @param vars 
   */
  private bindMethodParams(Concrete: any, key: string | symbol, args: any[] = [], vars: any[] = []) {
    const disableInject = Reflect.getMetadata(symbols.DISABLE_INJECT, Concrete, key);
    if (disableInject) return vars;
    const injectParams: InjectParamsOption[] = Reflect.getMetadata(symbols.INJECTTYPE_METADATA, Concrete, key) ?? [];
    const typeParams: any[] = Reflect.getMetadata(symbols.PARAMTYPES_METADATA, Concrete.prototype, key) ?? [];
    const argsLength = Math.max(Concrete.prototype[key].length, injectParams.length, typeParams.length, vars.length);
    return this.bindParams(argsLength, injectParams, typeParams, args, vars);
  }

  /**
   * 绑定类属性
   * @param Concrete 
   * @param args 
   * @param key 
   */
  private bindProperty(Concrete: any, args: any[] = [], key: string | symbol) {
    const injects: InjectParamsOption[] = Reflect.getMetadata(
      symbols.INJECTTYPE_METADATA, Concrete, key
    ) ?? [];
    const typeParam: any = Reflect.getMetadata(symbols.PROPERTYTYPE_METADATA, Concrete, key);
    if (injects[0]) {
      const { abstract, params, handler } = injects[0];
      const injectedParam = this.make(abstract, [...params ?? [], ...args]);
      if (typeof handler === 'function') {
        return handler(injectedParam);
      }
      return injectedParam;
    }
    return this.make(
      typeParam, [...args]
    );
  }

  /**
   * 参数绑定
   * @param argsLength 
   * @param injectParams 
   * @param typeParams 
   * @param args 
   * @param vars 
   */
  private bindParams(argsLength: number, injectParams: InjectParamsOption[], typeParams: any[], args: any[], vars: any[]) {
    const params: any[] = [];
    // 未确认位置的手动注入的参数数组
    const unPositionInjectParams = [];
    // 已确认位置的手动注入的参数数组
    const positionInjectParams = [];
    for (const item of injectParams) {
      if (item.index !== undefined) {
        positionInjectParams.push(item);
      } else {
        unPositionInjectParams.push(item);
      }
    }
    for (let index = 0; index < argsLength; index++) {
      // 找到手动注入的匹配参数
      const injectParam = positionInjectParams.find(item => item.index === index);
      // 当前位置的类型参数
      const typeParam = typeParams[index];
      // 存在当前位置的手动注入，优先使用
      if (injectParam) {
        const { abstract, params: _params, handler } = injectParam;
        const injected = this.make(abstract, [...(_params ?? []), ...args]);
        params.push(
          typeof handler === 'function' ? handler(injected) : injected
        );
      }
      // 存在当前位置的类型注入,并且非内置类型
      else if (typeParam && !this.isBuildInType(typeParam)) {
        const injected = this.make(typeParams[index], [...args]);
        params.push(injected);
      }
      // 还有剩余的未确认位置的手动注入参数
      else if (unPositionInjectParams.length > 0) {
        const { abstract, params: _params, handler } = unPositionInjectParams.pop() as InjectParamsOption;
        const injected = this.make(abstract, [...(_params ?? []), ...args]);
        params.push(
          typeof handler === 'function' ? handler(injected) : injected
        );
      }
      // 还有剩余传入的实参
      else if (vars.length > 0) {
        params.push(
          vars.shift()
        );
      }
    }
    // 将多余的实参附加上去
    params.push(...vars);
    return params;
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
