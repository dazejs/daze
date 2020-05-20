/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as _ from 'underscore.string';

export class Str {
  
  static formatPrefix(prefix = '') {
    let prefixed = prefix.slice(0, 1) === '/' ? prefix : `/${prefix}`;
    prefixed = prefixed.slice(-1) === '/' ? prefixed.slice(0, prefixed.length - 1) : prefixed;
    return prefixed;
  }
  
  static decodeBASE64(str: string) {
    const body = Buffer.from(str, 'base64').toString('utf8');
    return JSON.parse(body);
  }
  
  static encodeBASE64(body: any) {
    return Buffer.from(JSON.stringify(body)).toString('base64');
  }

  // https://github.com/esamattis/underscore.string
  static slugify = _.slugify;
  static numberFormat = _.numberFormat;
  static capitalize = _.capitalize;
  static decapitalize = _.decapitalize;
  static titleize = _.titleize;
  static camelize = _.camelize;
  static swapCase = _.swapCase;
  static chop = _.chop;
  static chars = _.chars;
  static include = _.include;
  static count = _.count;
  static escapeHTML = _.escapeHTML;
  static unescapeHTML = _.unescapeHTML;
  static insert = _.insert;
  static isBlank = _.isBlank;
  static join = _.join;
  static lines = _.lines;
  static words = _.words;
  static reverse = _.reverse;
  static startsWith = _.startsWith;
  static endsWith = _.endsWith;
  static classify = _.classify;
  static underscored = _.underscored;
  static trim = _.trim;
  static truncate = _.truncate;
  static prune = _.prune;
  static sprintf = _.sprintf;
  static pad = _.pad;
  static lpad = _.lpad;
  static rpad = _.rpad;
  static lrpad = _.lrpad;
  static toNumber = _.toNumber;
  static repeat = _.repeat;
  static surround = _.surround;
  static quote = _.quote;
  static unquote = _.unquote;
  static toBoolean = _.toBoolean;
}
