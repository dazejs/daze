import * as validators from '../../../src/validate/validators';

describe('validate/validators', () => {
  describe('validators#passed', () => {
    it('should return true when callback passed', () => {
      expect(validators.passed(200, (value: any) => value > 100)).toBeTruthy();
    });
    it('should return false when callback failed', () => {
      expect(validators.passed(50, (value: any) => value > 100)).toBeFalsy();
    });
  });
  describe('validators#accepted', () => {
    it('should return true when passed', () => {
      expect(validators.accepted(1)).toBeTruthy();
      expect(validators.accepted('1')).toBeTruthy();
      expect(validators.accepted(true)).toBeTruthy();
      expect(validators.accepted('yes')).toBeTruthy();
      expect(validators.accepted('true')).toBeTruthy();
      expect(validators.accepted('on')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.accepted(0)).toBeFalsy();
      expect(validators.accepted('0')).toBeFalsy();
      expect(validators.accepted(false)).toBeFalsy();
      expect(validators.accepted('false')).toBeFalsy();
      expect(validators.accepted('no')).toBeFalsy();
      expect(validators.accepted('off')).toBeFalsy();
    });
  });
  describe('validators#is', () => {
    it('should return true when passed', () => {
      const t = {};
      expect(validators.is(t, t)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.is({}, {})).toBeFalsy();
    });
  });
  describe('validators#required', () => {
    it('should return true when passed', () => {
      const t = {
        a: null,
      };
      expect(validators.required(t.a)).toBeTruthy();
    });
    it('should return false when failed', () => {
      const t = {
        a: undefined
      };
      expect(validators.required(t.a)).toBeFalsy();
    });
  });
  describe('validators#equals', () => {
    it('should return true when passed', () => {
      expect(validators.equals(+0, -0)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.equals({}, {})).toBeFalsy();
    });
  });
  describe('validators#notEquals', () => {
    it('should return true when passed', () => {
      expect(validators.notEquals(+0, -0)).toBeFalsy();
    });
    it('should return false when failed', () => {
      expect(validators.notEquals({}, {})).toBeTruthy();
    });
  });
  describe('validators#isEmpty', () => {
    it('should return true when passed', () => {
      expect(validators.isEmpty(null)).toBeTruthy();
      expect(validators.isEmpty('')).toBeTruthy();
      expect(validators.isEmpty(undefined)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isEmpty('xxx')).toBeFalsy();
    });
  });
  describe('validators#isNotEmpty', () => {
    it('should return true when passed', () => {
      expect(validators.isNotEmpty(null)).toBeFalsy();
      expect(validators.isNotEmpty('')).toBeFalsy();
      expect(validators.isNotEmpty(undefined)).toBeFalsy();
    });
    it('should return false when failed', () => {
      expect(validators.isNotEmpty('xxx')).toBeTruthy();
    });
  });
  describe('validators#isDivisibleBy', () => {
    it('should return true when passed', () => {
      expect(validators.isDivisibleBy(100, 10)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isDivisibleBy(100, 3)).toBeFalsy();
    });
  });
  describe('validators#isPositive', () => {
    it('should return true when passed', () => {
      expect(validators.isPositive(100)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isPositive(-100)).toBeFalsy();
    });
  });
  describe('validators#isNegative', () => {
    it('should return true when passed', () => {
      expect(validators.isNegative(-100)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isNegative(100)).toBeFalsy();
    });
  });
  describe('validators#min', () => {
    it('should return true when passed', () => {
      expect(validators.min(100, 10)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.min(100, 200)).toBeFalsy();
    });
  });
  describe('validators#max', () => {
    it('should return true when passed', () => {
      expect(validators.max(10, 100)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.max(200, 100)).toBeFalsy();
    });
  });
  describe('validators#afterDate', () => {
    it('should return true when passed', () => {
      expect(validators.afterDate(new Date('2019-03-01'), new Date('2019-02-01'))).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.afterDate(new Date('2019-02-01'), new Date('2019-03-01'))).toBeFalsy();
    });
  });
  describe('validators#beforeDate', () => {
    it('should return true when passed', () => {
      expect(validators.beforeDate(new Date('2019-02-01'), new Date('2019-03-01'))).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.beforeDate(new Date('2019-03-01'), new Date('2019-02-01'))).toBeFalsy();
    });
  });
  describe('validators#isBoolean', () => {
    it('should return true when passed', () => {
      expect(validators.isBoolean(false)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isBoolean('false')).toBeFalsy();
    });
  });
  describe('validators#isDate', () => {
    it('should return true when passed', () => {
      expect(validators.isDate(new Date())).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isDate('2019/01/01')).toBeFalsy();
    });
  });
  describe('validators#isString', () => {
    it('should return true when passed', () => {
      expect(validators.isString('1111')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isString(1111)).toBeFalsy();
    });
  });
  describe('validators#isNumber', () => {
    it('should return true when passed', () => {
      expect(validators.isNumber(1111)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isNumber('1111')).toBeFalsy();
    });
  });
  describe('validators#isArray', () => {
    it('should return true when passed', () => {
      expect(validators.isArray([])).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isArray('[]')).toBeFalsy();
    });
  });
  describe('validators#isError', () => {
    it('should return true when passed', () => {
      expect(validators.isError(new Error())).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isError('error')).toBeFalsy();
    });
  });
  describe('validators#isFunction', () => {
    it('should return true when passed', () => {
      expect(validators.isFunction(() => {})).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isFunction('() => {}')).toBeFalsy();
    });
  });
  describe('validators#isBuffer', () => {
    it('should return true when passed', () => {
      expect(validators.isBuffer(Buffer.from('xxx'))).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isBuffer('xxx')).toBeFalsy();
    });
  });
  describe('validators#isObject', () => {
    it('should return true when passed', () => {
      expect(validators.isObject({})).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isObject('{}')).toBeFalsy();
    });
  });
  describe('validators#isRegExp', () => {
    it('should return true when passed', () => {
      expect(validators.isRegExp(/xxx/g)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isRegExp('/xxx/g')).toBeFalsy();
    });
  });
  describe('validators#isSymbol', () => {
    it('should return true when passed', () => {
      expect(validators.isSymbol(Symbol('xxx'))).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isSymbol('xxx')).toBeFalsy();
    });
  });
  describe('validators#isNullOrUndefined', () => {
    it('should return true when passed', () => {
      expect(validators.isNullOrUndefined(null)).toBeTruthy();
      expect(validators.isNullOrUndefined(undefined)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isNullOrUndefined('')).toBeFalsy();
    });
  });
  describe('validators#isNull', () => {
    it('should return true when passed', () => {
      expect(validators.isNull(null)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isNull(undefined)).toBeFalsy();
    });
  });
  describe('validators#isUndefined', () => {
    it('should return true when passed', () => {
      expect(validators.isUndefined(undefined)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isUndefined(null)).toBeFalsy();
    });
  });
  describe('validators#isDateString', () => {
    it('should return true when passed', () => {
      expect(validators.isDateString('2019/01/01')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isDateString('xxxxx')).toBeFalsy();
    });
  });
  describe('validators#isBooleanString', () => {
    it('should return true when passed', () => {
      expect(validators.isBooleanString('true')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isBooleanString(true)).toBeFalsy();
    });
  });
  describe('validators#isNumberString', () => {
    it('should return true when passed', () => {
      expect(validators.isNumberString('1111')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isNumberString(1111)).toBeFalsy();
    });
  });
  describe('validators#contains', () => {
    it('should return true when passed', () => {
      expect(validators.contains('abcdefg', 'abc')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.contains('abcdefg', 'hij')).toBeFalsy();
    });
  });
  describe('validators#notContains', () => {
    it('should return true when passed', () => {
      expect(validators.notContains('abcdefg', 'hij')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.notContains('abcdefg', 'abc')).toBeFalsy();
    });
  });
  describe('validators#isAlpha', () => {
    it('should return true when passed', () => {
      expect(validators.isAlpha('abcdefgABCDEFG')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isAlpha('abcdefg123')).toBeFalsy();
    });
  });
  describe('validators#isAlphanumeric', () => {
    it('should return true when passed', () => {
      expect(validators.isAlphanumeric('abcdefgABCDEFG123')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isAlphanumeric('abcdefgABCDEFG123*&^')).toBeFalsy();
    });
  });
  describe('validators#isAscii', () => {
    it('should return true when passed', () => {
      expect(validators.isAscii('1234abcDEF')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isAscii('１２３456')).toBeFalsy();
    });
  });

  describe('validators#isBase64', () => {
    it('should return true when passed', () => {
      expect(validators.isBase64('Zg==')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isBase64('12345')).toBeFalsy();
    });
  });
  describe('validators#isByteLength', () => {
    it('should return true when passed', () => {
      expect(validators.isByteLength('abc', 3, 5)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isByteLength('abc', 4, 5)).toBeFalsy();
    });
  });
  describe('validators#isCreditCard', () => {
    it('should return true when passed', () => {
      expect(validators.isCreditCard('6765780016990268')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isCreditCard('abc')).toBeFalsy();
    });
  });
  describe('validators#isCurrency', () => {
    it('should return true when passed', () => {
      expect(validators.isCurrency('$100')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isCurrency('$.001')).toBeFalsy();
    });
  });
  describe('validators#isEmail', () => {
    it('should return true when passed', () => {
      expect(validators.isEmail('foo@bar.com')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isEmail('foo@bar')).toBeFalsy();
    });
  });
  describe('validators#isFQDN', () => {
    it('should return true when passed', () => {
      expect(validators.isFQDN('foo.com')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isFQDN('foo')).toBeFalsy();
    });
  });
  describe('validators#isFullWidth', () => {
    it('should return true when passed', () => {
      expect(validators.isFullWidth('Foo＝Bar')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isFullWidth('[]')).toBeFalsy();
    });
  });
  describe('validators#isHalfWidth', () => {
    it('should return true when passed', () => {
      expect(validators.isHalfWidth('[]')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isHalfWidth('＝')).toBeFalsy();
    });
  });
  describe('validators#isHexColor', () => {
    it('should return true when passed', () => {
      expect(validators.isHexColor('#ffffff')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isHexColor('#ff')).toBeFalsy();
    });
  });
  describe('validators#isHexadecimal', () => {
    it('should return true when passed', () => {
      expect(validators.isHexadecimal('ffffff')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isHexadecimal('foo')).toBeFalsy();
    });
  });
  describe('validators#isIP', () => {
    it('should return true when passed', () => {
      expect(validators.isIP('192.168.1.1')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isIP('256.256.256.256')).toBeFalsy();
    });
  });
  describe('validators#isISBN', () => {
    it('should return true when passed', () => {
      expect(validators.isISBN('3836221195', 10)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isISBN('foo', 10)).toBeFalsy();
    });
  });
  describe('validators#isISSN', () => {
    it('should return true when passed', () => {
      expect(validators.isISSN('0000-0000')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isISSN('0')).toBeFalsy();
    });
  });
  describe('validators#isISIN', () => {
    it('should return true when passed', () => {
      expect(validators.isISIN('DE000WCH8881')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isISIN('foo')).toBeFalsy();
    });
  });
  describe('validators#isISO8601', () => {
    it('should return true when passed', () => {
      expect(validators.isISO8601('2019')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isISO8601('2019-')).toBeFalsy();
    });
  });
  describe('validators#isJSON', () => {
    it('should return true when passed', () => {
      expect(validators.isJSON('{ "key": "value" }')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isJSON('null')).toBeFalsy();
    });
  });
  describe('validators#isLowercase', () => {
    it('should return true when passed', () => {
      expect(validators.isLowercase('abc')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isLowercase('ABC')).toBeFalsy();
    });
  });
  describe('validators#isMobilePhone', () => {
    it('should return true when passed', () => {
      expect(validators.isMobilePhone('13777222876', 'zh-CN')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isMobilePhone('123', 'zh-CN')).toBeFalsy();
    });
  });
  describe('validators#isMongoId', () => {
    it('should return true when passed', () => {
      expect(validators.isMongoId('507f1f77bcf86cd799439011')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isMongoId('123')).toBeFalsy();
    });
  });
  describe('validators#isMultibyte', () => {
    it('should return true when passed', () => {
      expect(validators.isMultibyte('中文')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isMultibyte('abc')).toBeFalsy();
    });
  });
  describe('validators#isSurrogatePair', () => {
    it('should return true when passed', () => {
      expect(validators.isSurrogatePair('𠮷野𠮷')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isSurrogatePair('ABC1-2-3')).toBeFalsy();
    });
  });
  describe('validators#isURL', () => {
    it('should return true when passed', () => {
      expect(validators.isURL('foo.com')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isURL('.com')).toBeFalsy();
    });
  });
  describe('validators#isUUID', () => {
    it('should return true when passed', () => {
      expect(validators.isUUID('A987FBC9-4BED-3078-CF07-9141BA07C9F3')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isUUID('123')).toBeFalsy();
    });
  });
  describe('validators#isUppercase', () => {
    it('should return true when passed', () => {
      expect(validators.isUppercase('ABC')).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.isUppercase('abc')).toBeFalsy();
    });
  });
  describe('validators#length', () => {
    it('should return true when passed', () => {
      expect(validators.length('ABC', 1, 5)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.length('abc', 10, 20)).toBeFalsy();
    });
  });
  describe('validators#minLength', () => {
    it('should return true when passed', () => {
      expect(validators.minLength('ABC', 1)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.minLength('abc', 5)).toBeFalsy();
    });
  });
  describe('validators#maxLength', () => {
    it('should return true when passed', () => {
      expect(validators.maxLength('ABC', 10)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.maxLength('abc', 1)).toBeFalsy();
    });
  });
  describe('validators#matches', () => {
    it('should return true when passed', () => {
      expect(validators.matches('abc', /abc/)).toBeTruthy();
    });
    it('should return false when failed', () => {
      expect(validators.matches('123', /abc/)).toBeFalsy();
    });
  });
});
