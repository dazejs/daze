/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// 容器实例多例标识 - used
export const MULTITON = Symbol('DAZE#multiton');
export const SINGLETON = Symbol('DAZE#singleton');
// Session Symboles - used
export const SESSION = {
  NEW_FLASHS: 'daze__new_flashes',
  OLD_FLASHS: 'daze__old_flashes',
  PREVIOUS: 'daze__previous',
  CURRENT: 'daze__current',
  OLD_INPUT: 'daze__old_input',
  ERRORS: 'daze__errors',
};

// 标识需要注入的
export const HTTP_CODE = '__DAZE_HTTP_CODE__';
export const HTTP_HEADER = '__DAZE_HTTP_HEADER__';


/**
 * Inject type ids - used
 */
export const INJECTORS = {
  REQUEST: '__DAZE_INJECT_REQUEST__',
  RESPONSE: '__DAZE_INJECT_RESPONSE__',
  REQ: '__DAZE_INJECT_REQ__',
  RES: '__DAZE_INJECT_RES__',
  QUERY: '__DAZE_INJECT_QUERY__',
  PARAMS: '__DAZE_INJECT_PARAMS__',
  BODY: '__DAZE_INJECT_BODY__',
  HEADERS: '__DAZE_INJECT_HEADERS__',
  SERVICE: '__DAZE_INJECT_SERVICE__',
  COOKIE: '__DAZE_INJECT_COOKIE__',
  SESSION: '__DAZE_INJECT_SESSION__',
};

export const ProviderType = {
  PROVIDER: Symbol("DAZE#PROVIDER"),
  PROVIDE: Symbol("DAZE#PROVIDE"),
  ORDER: Symbol("DAZE#ORDER"),
};

// 进程类型标示
export const ProcessType  = {
  ONLY_AGENT: Symbol("DAZE#only-agent"),
  APPEND_AGENT: Symbol("DAZE#append-agent"),
  ONLY_MASTER: Symbol("DAZE#only-master"),
  APPEND_MASTER: Symbol("DAZE#append-master"),
};

// 禁用依赖注入标记
export const DISABLE_INJECT = 'daze:disable_inject';
// 可注入的标记
export const INJECTABLE = 'daze:injectable';

// 自动依赖注入
// 由 TS 编译器注入
export const PARAMTYPES_METADATA = 'design:paramtypes';
export const PROPERTYTYPE_METADATA = 'daze:property_type_metadata';
// 手动依赖注入
export const INJECTTYPE_METADATA = 'daze:inject_type_metadata';

// Async hook 的 local stroage
export const ASYNC_LOCAL_STORAGE = 'daze:async_local_storage';