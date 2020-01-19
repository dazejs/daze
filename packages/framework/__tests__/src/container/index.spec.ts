
import 'reflect-metadata';
import { Container } from '../../../src/container';
import { Injectable } from '../../../src/decorators';

it('Container.setInstance', () => {
  const App = class { };
  Container.setInstance(App);
  expect(Container.instance).toBe(App);
});


it('Container.bind and Container.get', () => {
  Container.setInstance(null);
  const App = class { };
  Container.bind(App, App);
  Container.bind('a', null);
  expect(Container.get('a')).toBeUndefined();
  expect(Container.get(App)).toBeInstanceOf(App);
});

it('Container.has', () => {
  Container.setInstance(null);
  const App = class { };
  const Non = class { };
  Container.bind(App, App);
  expect(Container.has(App)).toBeTruthy();
  expect(Container.has(Non)).toBeFalsy();
});


it('Container#bound', () => {
  Container.setInstance(null);
  const App = class { };
  const Non = class { };
  const ContainerInstance = new Container();
  ContainerInstance.singleton(App, App);
  expect(ContainerInstance.bound(App)).toBeTruthy();
  expect(ContainerInstance.bound(Non)).toBeFalsy();
});

it('Container#exists', () => {
  Container.setInstance(null);
  const App = class { };
  const AppInstance = new App();
  const ContainerInstance = new Container();
  ContainerInstance.singleton(AppInstance, AppInstance);
  expect(ContainerInstance.exists(AppInstance)).toBeTruthy();
});

it('Container.get', () => {
  Container.setInstance(null);
  const fn = () => {
    //
  };
  const App = class {};
  // shared
  Container.bind('a', App, true);
  expect(Container.get('a')).toBe(Container.get('a'));

  // not shared
  Container.bind('b', App, false);
  expect(Container.get('b')).not.toBe(Container.get('b'));
  Container.bind('c', fn);
  Container.bind('d', fn);
  Container.bind('e', fn);
  Container.bind('f', fn);
});

it('singleton and multiton', () => {
  Container.setInstance(null);
  const Singleton = class { };
  const Multiton = class { };
  const normalFun = () => {
    //
  };
  const ContainerInstance = new Container();
  ContainerInstance.singleton(Singleton, Singleton);
  ContainerInstance.multiton(Multiton, Multiton);
  ContainerInstance.multiton(normalFun, normalFun);
  expect(ContainerInstance.isShared(Singleton)).toBeTruthy();
  expect(ContainerInstance.isShared(Multiton)).toBeFalsy();
});

it('instance replace', () => {
  class App extends Container { }
  Container.setInstance(App);
  const app = new App();
  app.singleton('app', App);
  expect(app.make('app')).toBeInstanceOf(App);
  Container.instance = null;
});


it('Container#callable', () => {
  const callableFn = () => 'callable';

  

  Container.bind('callable', callableFn, false, true);

  expect(Container.get('callable')).toBe('callable');
});

it('Container inject class', () => {
  @Injectable()
  class App {
    param: any;
    prop: any;
    constructor(param: any) {
      this.param = param;
      this.prop = '';
    }

    index(param: any) {
      return param;
    }
  };
  Container.bind(App, App);
  Container.bind('request', (r: any) => r, false, true);
  Reflect.defineMetadata('injectparams', [
    ['request', ['request']],
  ], App);
  Reflect.defineMetadata('injectparams', [
    ['request', ['request']]
  ], App, 'prop');
  Reflect.defineMetadata('injectparams', [
    ['request', ['request']],
  ], App, 'index');

  const app = Container.get(App);

  expect(app.param).toBe('request');
  expect(app.index()).toBe('request');
  expect(app.prop).toBe('request');
});
