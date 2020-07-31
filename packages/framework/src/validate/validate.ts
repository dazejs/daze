/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Message } from '../foundation/support/message';
import * as validators from './validators';
import { Container } from '../container';
import { Application } from '../foundation/application';

export interface RuleData {
  field: string;
  handler: (...args: any[]) => any;
  args: any[];
  scene?: string;
  options: Record<string, any>;
}

export interface RuleIndependences {
  [key: string]: [keyof typeof validators, any[]?, { [key2: string]: any }?][];
}

export class Validate {
  /**
   * application
   */
  app: Application = Container.get('app');

  /**
   * validate rules
   */
  private _rules: RuleData[] = [];

  /**
   * validate message
   */
  private _message: Message = new Message();

  /**
   * bail check
   */
  private _bail = false;

  /**
   * Create Validate instance
   * @param data
   * @param rules
   */
  constructor(validator?: any) {
    /**
     * @type rules validator rules
     */
    if (validator) this._rules = this.getValidatorRules(validator);
  }

  /**
   * _bail check
   * @param batch 
   */
  bail(_bail = true) {
    this._bail = _bail;
    return this;
  }

  /**
   * parse different type rulse
   * @param rules rules
   */
  private getValidatorRules(validator: any) {
    // if string type
    if (typeof validator === 'string') {
      // AMRK: COMPONENT_NAME
      if (!this.app.has(validator)) return [];
      return Reflect.getMetadata('rules', this.app.get(validator).constructor) ?? [];
    }
    // if @Validator rules
    if (Reflect.getMetadata('type', validator) === 'validator') {
      return Reflect.getMetadata('rules', validator) ?? [];
    }
    // independence object rules
    return this.parseIndependenceRules(validator);
  }

  /**
   * 解析独立配置的规则
   * @param rules 
   */
  private parseIndependenceRules(rules: Record<string, any>) {
    const _rules: RuleIndependences = rules;
    const res: any[] = [];
    const fields = Object.keys(_rules);
    for (const field of fields) {
      const fieldRules = _rules[field] || [];
      for (const rule of fieldRules) {
        const handler = validators[rule[0]];
        res.push({
          field,
          handler,
          args: rule[1] || [],
          options: rule[2] || {},
        });
      }
    }
    return res;
  }

  /**
   * replace special message fields
   * @param value field value
   * @param rule stuct rule
   */
  private replaceSpecialMessageFields(value: any, rule: RuleData) {
    const {
      field,
      args,
      options,
    } = rule;
    let msg = options.message || 'validate $field failed with value: $value';
    for (const [index, val] of args.entries()) {
      msg = msg.replace(`$${index + 1}`, val);
    }
    return msg.replace('$field', field).replace('$value', value);
  }

  /**
   * validate a field
   * @param rule rule
   */
  private validateField(rule: RuleData, data: Record<string, any>) {
    if (!rule) return false;
    const {
      field, args, handler,
    } = rule;
    const property = data[field];
    try {
      const validated = handler(property, ...args);
      if (validated) return true;
      this._message.add(field, this.replaceSpecialMessageFields(property, rule));
    } catch (err) {
      this._message.add(field, err.message);
    }
    return false;
  }

  /**
   * check the rules
   */
  check(data: Record<string, any>) {
    for (const rule of this._rules) {
      const passes = this.validateField(rule, data);
      if (this._bail && !passes) return false;
    }
    return this._message.isEmpty();
  }

  make(data: Record<string, any>) {
    for (const rule of this._rules) {
      const passes = this.validateField(rule, data);
      if (this._bail && !passes) return this;
    }
    return this;
  }

  get passes() {
    return this._message.isEmpty();
  }

  get fails() {
    return !this.passes;
  }

  /**
   * get validate errors
   */
  get errors() {
    return this._message.messages;
  }

  /**
   * get validate errors
   */
  getErrors() {
    return this.errors;
  }

  /**
   * get Message instance
   */
  get message() {
    return this._message;
  }

  /**
   * get Message instance
   */
  getMessage() {
    return this.message;
  }
}
