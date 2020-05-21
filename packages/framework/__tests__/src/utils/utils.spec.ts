import { Str, Tool } from '../../../src/utils';


exports.defer = function () {
  const result: { [key: string]: any } = {};
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

describe('daze#utils', () => {
  it('should defer', async () => {
    const deferred = Tool.defer();
    deferred.resolve('hello');
    const res = await deferred.promise;
    expect(res).toBe('hello');
  });
  
  it('str utils', () => {
    expect(Str.slugify('Hello World!')).toBe('hello-world');
    expect(Str.numberFormat(1000, 2)).toBe('1,000.00');
    expect(Str.numberFormat(123456789.123, 5, '.', ',')).toBe('123,456,789.12300');
    expect(Str.capitalize('foo Bar')).toBe('Foo Bar');
    // eslint-disable-next-line
    // @ts-ignore
    expect(Str.capitalize('FOO Bar', true)).toBe('Foo bar');
    expect(Str.decapitalize('Foo Bar')).toBe('foo Bar');
    expect(Str.chop('whitespace', 3)).toEqual(['whi', 'tes', 'pac', 'e']);
    expect(Str.chars('Hello')).toEqual(['H', 'e', 'l', 'l', 'o']);
    expect(Str.swapCase('hELLO')).toBe('Hello');
    expect(Str.include('foobar', 'ob')).toBeTruthy();
    expect(Str.count('Hello world', 'l')).toBe(3);
    expect(Str.escapeHTML('<div>Blah blah blah</div>')).toBe('&lt;div&gt;Blah blah blah&lt;/div&gt;');
    expect(Str.unescapeHTML('&lt;div&gt;Blah&nbsp;blah blah&lt;/div&gt;')).toBe('<div>Blah blah blah</div>');
    expect(Str.insert('Hellworld', 4, 'o ')).toBe('Hello world');
    expect(Str.isBlank('')).toBeTruthy();
    expect(Str.isBlank('\n')).toBeTruthy();
    expect(Str.isBlank(' ')).toBeTruthy();
    expect(Str.isBlank('   ')).toBeTruthy();
    expect(Str.isBlank(' a ')).toBeFalsy();
    expect(Str.join(' ', 'foo', 'bar')).toBe('foo bar');
    expect(Str.lines('Hello\nWorld')).toEqual(['Hello', 'World']);
    expect(Str.reverse('foobar')).toBe('raboof');
    expect(Str.startsWith('image.gif', 'image')).toBeTruthy();
    // eslint-disable-next-line
    // @ts-ignore
    expect(Str.startsWith('.vimrc', 'vim', 1)).toBeTruthy();
    expect(Str.endsWith('image.gif', 'gif')).toBeTruthy();
    // eslint-disable-next-line
    // @ts-ignore
    expect(Str.endsWith('image.old.gif', 'old', 9)).toBeTruthy();
    expect(Str.titleize('my name is epeli')).toBe('My Name Is Epeli');
    expect(Str.camelize('moz-transform')).toBe('mozTransform');
    expect(Str.camelize('-moz-transform')).toBe('MozTransform');
    expect(Str.camelize('_moz_transform')).toBe('MozTransform');
    expect(Str.camelize('Moz-transform')).toBe('MozTransform');
    expect(Str.camelize('-moz-transform', true)).toBe('mozTransform');
    expect(Str.classify('some_class_name')).toBe('SomeClassName');
    expect(Str.underscored('MozTransform')).toBe('moz_transform');
    expect(Str.trim('   foobar   ')).toBe('foobar');
    expect(Str.trim('_-foobar-_', '_-')).toBe('foobar');
    expect(Str.truncate('Hello world', 5)).toBe('Hello...');
    expect(Str.truncate('Hello', 10)).toBe('Hello');
    expect(Str.prune('Hello, world', 5)).toBe('Hello...');
    expect(Str.prune('Hello, world', 8)).toBe('Hello...');
    expect(Str.prune('Hello', 10)).toBe('Hello');
    expect(Str.prune('Hello, world', 5, ' (read a lot more)')).toBe('Hello, world');
    expect(Str.words('   I   love   you   ')).toEqual(['I', 'love', 'you']);
    expect(Str.words('I_love_you', '_')).toEqual(['I', 'love', 'you']);
    expect(Str.words('I-love-you', /-/)).toEqual(['I', 'love', 'you']);
    expect(Str.words('    ')).toEqual([]);
    expect(Str.sprintf('%.1f', 1.17)).toBe('1.2');
    expect(Str.pad('1', 8)).toBe('       1');
    expect(Str.pad('1', 8, '0')).toBe('00000001');
    expect(Str.pad('1', 8, '0', 'right')).toBe('10000000');
    expect(Str.pad('1', 8, '0', 'both')).toBe('00001000');
    expect(Str.pad('1', 8, 'bleepblorp', 'both')).toBe('bbbb1bbb');
    expect(Str.lpad('1', 8, '0')).toBe('00000001');
    expect(Str.rpad('1', 8, '0')).toBe('10000000');
    expect(Str.lrpad('1', 8, '0')).toBe('00001000');
    expect(Str.toNumber('2.556')).toBe(3);
    expect(Str.toNumber('2.556', 1)).toBe(2.6);
    expect(Str.toNumber('991.999', -1)).toBe(990);
    expect(Str.strRight('This_is_a_test_string', '_')).toBe('is_a_test_string');
    expect(Str.strRightBack('This_is_a_test_string', '_')).toBe('string');
    expect(Str.strLeft('This_is_a_test_string', '_')).toBe('This');
    expect(Str.strLeftBack('This_is_a_test_string', '_')).toBe('This_is_a_test');
    expect(Str.stripTags('a <a href=\"#\">link</a>')).toBe('a link');
    expect(Str.stripTags('a <a href=\"#\">link</a><script>alert(\"hello world!\")</script>')).toBe('a linkalert("hello world!")');
    expect(Str.repeat('foo', 3)).toBe('foofoofoo');
    expect(Str.repeat('foo', 3, 'bar')).toBe('foobarfoobarfoo');
    expect(Str.surround('foo', 'ab')).toBe('abfooab');
    expect(Str.quote('foo', '"')).toBe('"foo"');
    expect(Str.unquote('"foo"')).toBe('foo');
    expect(Str.unquote("'foo'", "'")).toBe('foo');
    expect(Str.toBoolean('true')).toBeTruthy();
    expect(Str.toBoolean('FALSE')).toBeFalsy();
    expect(Str.toBoolean('random')).toBeUndefined();
    expect(Str.toBoolean('truthy', ['truthy'], ['falsy'])).toBeTruthy();
  });
});
