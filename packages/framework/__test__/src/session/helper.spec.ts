

import { decode, encode } from '../../../src/session/helpers';
import { isBase64 } from '../../../src/validate/validators';

describe('Session#helper', () => {
  it('should encode base64 with object by encode', () => {
    const code = encode({ a: 'aaa' });
    expect(isBase64(code)).toBeTruthy();
  });

  it('should decode base64 to object by decode', () => {
    const body = decode('eyJhIjoiYWFhIn0=');
    expect(body).toEqual({
      a: 'aaa',
    });
  });
});
