

import { isBase64 } from '../../../src/validate/validators';
import { Str } from '../../../src/utils/';

describe('Session#helper', () => {
  it('should encode base64 with object by encode', () => {
    const code = Str.encodeBASE64({ a: 'aaa' });
    expect(isBase64(code)).toBeTruthy();
  });

  it('should decode base64 to object by decode', () => {
    const body = Str.decodeBASE64('eyJhIjoiYWFhIn0=');
    expect(body).toEqual({
      a: 'aaa',
    });
  });
});
