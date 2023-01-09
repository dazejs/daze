/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import validator from 'validator';

// MARK: Custom

export function passed(value: any, callback: any): boolean {
  return typeof callback === 'function' && !!callback(value);
}

// MARK: Common

export function accepted (value: any) {
  return ['yes', 'on', true, 'true', 1, '1'].includes(value);
}

export function is(value: any, comparison: any) {
  return Object.is(value, comparison);
}

export function required(value: any) {
  return value !== undefined;
}

export function equals(value: any, comparison: any) {
  return value === comparison;
}

export function notEquals(value: any, comparison: any) {
  return !equals(value, comparison);
}

export function isEmpty(value: any) {
  return value === '' || value === null || value === undefined;
}

export function isNotEmpty(value: any) {
  return !isEmpty(value);
}


// MARK: Number

export function isDivisibleBy(value: any, num: any) {
  return validator.isDivisibleBy(String(value), num);
}

export function isPositive(value: any) {
  return value > 0;
}

export function isNegative(value: any) {
  return value < 0;
}

export function min(value: any, min: any) {
  return value >= min;
}

export function max(value: any, max: any) {
  return value <= max;
}

// MARK: Date

export function afterDate(value: any, date: any) {
  return value && value.getTime() >= date.getTime();
}

export function beforeDate(value: any, date: any) {
  return value && value.getTime() <= date.getTime();
}

// MARK: Type

export function isBoolean(value: any) {
  return typeof value === 'boolean';
}

export function isDate(value: any) {
  return Object.prototype.toString.call(value) === '[object Date]';
}

export function isString(value: any) {
  return typeof value === 'string';
}

export function isNumber(value: any) {
  return typeof value === 'number';
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isError(value: any) {
  return value instanceof Error;
}

export function isFunction(value: any) {
  return typeof value === 'function';
}

export function isBuffer(value: any) {
  return Buffer.isBuffer(value);
}

export function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isRegExp(value: any) {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

export function isSymbol(value: any) {
  return typeof value === 'symbol';
}

export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}

export function isNull(value: any) {
  return value === null;
}

export function isUndefined(value: any) {
  return value === undefined;
}

// MARK: String Type

export function isDateString(value: any) {
  const date = Date.parse(value);
  return typeof value === 'string' && !Number.isNaN(date);
}

export function isBooleanString(value: any) {
  return typeof value === 'string' && validator.isBoolean(value);
}

export function isNumberString(value: any, options?: any) {
  return typeof value === 'string' && validator.isNumeric(value, options);
}

// MARK: String

export function contains(value: any, seed: any) {
  return validator.contains(value, seed);
}

export function notContains(value: any, seed: any) {
  return !contains(value, seed);
}

export function isAlpha(value: any, locale?: any) {
  return validator.isAlpha(value, locale);
}

export function isAlphanumeric(value: any, locale?: any) {
  return validator.isAlphanumeric(value, locale);
}

export function isAscii(value: any) {
  return validator.isAscii(value);
}

export function isBase64(value: any) {
  return validator.isBase64(value);
}

export function isByteLength(value: any, min: any, max: any) {
  return validator.isByteLength(value, { min, max });
}

export function isCreditCard(value: any) {
  return validator.isCreditCard(value);
}

export function isCurrency(value: any, options?: any) {
  return validator.isCurrency(value, options);
}

export function isEmail(value: any, options?: any) {
  return validator.isEmail(value, options);
}

export function isFQDN(value: any, options?: any) {
  return validator.isFQDN(value, options);
}

export function isFullWidth(value: any) {
  return validator.isFullWidth(value);
}

export function isHalfWidth(value: any) {
  return validator.isHalfWidth(value);
}

export function isHexColor(value: any) {
  return validator.isHexColor(value);
}

export function isHexadecimal(value: any) {
  return validator.isHexadecimal(value);
}

export function isIP(value: any, version?: any) {
  return validator.isIP(value, version);
}

export function isISBN(value: any, version?: any) {
  return validator.isISBN(value, version);
}

export function isISSN(value: any, options?: any) {
  return validator.isISSN(value, options);
}

export function isISIN(value: any) {
  return validator.isISIN(value);
}

export function isISO8601(value: any) {
  return validator.isISO8601(value);
}

export function isJSON(value: any) {
  return validator.isJSON(value);
}

export function isLowercase(value: any) {
  return validator.isLowercase(value);
}

export function isMobilePhone(value: any, locale?: any, options?: any) {
  return validator.isMobilePhone(value, locale, options);
}

export function isMongoId(value: any) {
  return validator.isMongoId(value);
}

export function isMultibyte(value: any) {
  return validator.isMultibyte(value);
}

export function isSurrogatePair(value: any) {
  return validator.isSurrogatePair(value);
}

export function isURL(value: any, options?: any) {
  return validator.isURL(value, options);
}

export function isUUID(value: any, version?: any) {
  return validator.isUUID(value, version);
}

export function isUppercase(value: any) {
  return validator.isUppercase(value);
}

export function length(value: any, min: any, max: any) {
  return validator.isLength(value, { min, max });
}

export function minLength(value: any, min: any) {
  return validator.isLength(value, { min });
}

export function maxLength(value: any, max: any) {
  return validator.isLength(value, { max });
}

export function matches(value: any, pattern: any, modifiers?: any) {
  return validator.matches(value, pattern, modifiers);
}
