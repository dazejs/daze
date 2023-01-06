import { Component } from './component';

export const agent = function (name?: string): ClassDecorator {
  return function (constructor) {
    Component(name, 'agent')(constructor);
  };
};

export const Agent = agent;