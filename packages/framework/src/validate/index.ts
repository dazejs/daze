/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import is from 'core-util-is'
import { Message } from '../foundation/support/message'
import * as validators from './validators'
import { Container } from '../container'

export class Validate {
  app: any;
  data: any;
  rules: any[];
  message: any;
  /**
   * Create Validate instance
   * @param data
   * @param rules
   */
  constructor(data: any, rules?: any) {
    /**
     * @type app Application instance
     */
    this.app = Container.get('app');

    /**
     * @type {Object} data validate data
     */
    this.data = this.parseData(data);

    /**
     * @type rules validator rules
     */
    this.rules = this.parseRules(rules);

    /**
     * @type message message instance
     */
    this.message = new Message();
  }

  /**
   * parse different type rulse
   * @param rules rules
   */
  parseRules(rules: any) {
    // if object type
    if (is.isObject(rules)) {
      // if @Validator rules
      if (Reflect.getMetadata('type', rules) === 'validator') {
        return Reflect.getMetadata('validator', rules) || [];
      }
      // independence object rules
      return this.parseIndependenceRules(rules);
    }
    // if string type
    if (is.isString(rules)) {
      const containerKey = `validator.${rules}`;
      if (!this.app.has(containerKey)) return [];
      return Reflect.getMetadata('validator', this.app.get(`validator.${rules}`)) || [];
    }
    return [];
  }

  /**
   * parse independence object rules
   * @param rules rules
   */
  parseIndependenceRules(rules: any) {
    const res = [];
    const fields: string[] = Object.keys(rules);
    for (const field of fields) {
      const fieldRules: any[] = rules[field] || [];
      for (const rule of fieldRules) {
        res.push({
          field,
          // @ts-ignore
          handler: validators[rule[0]],
          args: rule[1],
          options: rule[2],
        });
      }
    }
    return res;
  }

  /**
   * parse validate data
   * @param {Object} data data
   */
  parseData(data = {}) {
    return data;
  }

  /**
   * replace special message fields
   * @param value field value
   * @param rule stuct rule
   */
  replaceSpecialMessageFields(value: any, rule: any = {}) {
    const {
      field,
      args,
      options,
    } = rule;
    let msg = options.message || '';
    for (const [index, val] of args.entries()) {
      msg = msg.replace(`$${index + 1}`, val);
    }
    return msg.replace('$field', field).replace('$value', value);
  }

  /**
   * validate a field
   * @param rule rule
   */
  validateField(rule: any) {
    if (!rule) return false;
    const {
      field, args, handler,
    } = rule;
    const property = this.data[field];
    try {
      const validated = handler(property, ...args);
      if (validated) return true;
      this.message.add(field, this.replaceSpecialMessageFields(property, rule));
    } catch (err) {
      this.message.add(field, err.message);
    }
    return false;
  }

  /**
   * check if validate data is passed
   */
  get passes() {
    return this.check();
  }

  /**
   * check if validate data is failed
   */
  get fails() {
    return !this.passes;
  }

  /**
   * check the rules
   */
  check() {
    for (const rule of this.rules) {
      this.validateField(rule);
    }
    return this.message.isEmpty();
  }

  /**
   * get validate errors
   */
  get errors() {
    return this.message.messages;
  }
}
