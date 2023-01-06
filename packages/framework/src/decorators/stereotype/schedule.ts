import { Component } from './component';


export const schedule = function (name?: string): ClassDecorator {
  return function (constructor) {
    Component(name, 'schedule')(constructor);
  };
};

export const Schedule = schedule;