/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function validatorFactory(validatorMethod: any, args: any[] = [], options: any = {}): PropertyDecorator {
  return (target, name) => {
    const rules = Reflect.getMetadata('rules', target) || [];
    rules.push({
      field: name,
      handler: validatorMethod,
      args,
      options,
    });
    Reflect.defineMetadata('rules', rules, target);
  };
};
