

import { Response } from '../../../src/http/response';

describe('Response', () => {
  describe('Response#code', () => {
    it('should code setter and code getter accordance', () => {
      const response = new Response();
      response.code = 404;
      expect(response.code).toBe(404);
    });

    it('should return code by getCode', () => {
      const response = new Response();
      response.code = 404;
      expect(response.getCode()).toBe(404);
    });

    it('should return code by getStatus', () => {
      const response = new Response();
      response.code = 404;
      expect(response.getStatus()).toBe(404);
    });

    it('should set code by setCode', () => {
      const response = new Response();
      response.setCode(404);
      expect(response.getStatus()).toBe(404);
    });
  });


  it('should data setter and data getter accordance', () => {
    const response = new Response();
    const data = {};
    response.data = data;
    expect(response.data).toBe(data);
  });

  describe('Response#error', () => {
    it('should set code and data', () => {
      const response = new Response();
      response.error('message', 404);
      expect(response.data).toBe('message');
      expect(response.code).toBe(404);
    });
  });


  describe('Response#success', () => {
    it('should set code and data', () => {
      const response = new Response();
      response.success('message', 200);
      expect(response.data).toBe('message');
      expect(response.code).toBe(200);
    });

    it('should set default code 200', () => {
      const response = new Response();
      response.success('message');
      expect(response.code).toBe(200);
    });
  });

  describe('Response#headers', () => {
    it('should return header by getHeader', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
      });
      expect(response.getHeader('Content-Type')).toBe('application/json');
    });

    it('should return header by getHeader and lower key', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
      });
      expect(response.getHeader('content-type')).toBe('application/json');
    });

    it('should return all headers by getHeaders', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
        Accepts: 'application/json',
      });
      expect(response.getHeaders()).toEqual({
        'content-type': 'application/json',
        accepts: 'application/json',
      });
    });

    it('should set header by setHeader', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
      });
      response.setHeader('accepts', 'application/json');
      expect(response.getHeaders()).toEqual({
        'content-type': 'application/json',
        accepts: 'application/json',
      });
    });

    it('should set headers by setHeaders', () => {
      const response = new Response('message', 200, {
        'Content-Type': 'application/json',
      });
      response.setHeaders({
        accepts: 'application/json',
      });
      expect(response.getHeaders()).toEqual({
        'content-type': 'application/json',
        accepts: 'application/json',
      });
    });
  });

  describe('Response#type', () => {
    it('should set type by setType', () => {
      const response = new Response();
      response.setType('json');
      expect(response.getHeader('content-type')).toBe('application/json; charset=utf-8');
    });

    it('should set json type by json', () => {
      const response = new Response();
      response.json();
      expect(response.getHeader('content-type')).toBe('application/json; charset=utf-8');
    });

    it('should set html type by html', () => {
      const response = new Response();
      response.html();
      expect(response.getHeader('content-type')).toBe('text/html; charset=utf-8');
    });

    it('should set text type by text', () => {
      const response = new Response();
      response.text();
      expect(response.getHeader('content-type')).toBe('text/plain; charset=utf-8');
    });
  });

  describe('Response#length', () => {
    it('should set length by setLength', () => {
      const response = new Response();
      response.setLength(200);
      expect(response.getHeader('Content-Length')).toBe(200);
    });
  });


  describe('Response#vary', () => {
    it('should set vary by setVary', () => {
      const response = new Response();
      response.setVary('Origin');
      expect(response.getHeader('Vary')).toBe('Origin');
    });

    it('should set varys by setVary repeatedly', () => {
      const response = new Response();
      response.setVary('Origin');
      response.setVary('User-Agent');
      expect(response.getHeader('Vary')).toBe('Origin,User-Agent');
    });
  });

  describe('Response#lastModified', () => {
    it('should set last-modified with number', () => {
      const response = new Response();
      response.lastModified(1567344402522);
      expect(response.getHeader('Last-Modified')).toBe(new Date(1567344402522).toUTCString());
    });

    it('should set last-modified with string', () => {
      const response = new Response();
      response.lastModified('2019/1/1');
      expect(response.getHeader('Last-Modified')).toBe(new Date('2019/1/1').toUTCString());
    });

    it('should set last-modified with Date', () => {
      const response = new Response();
      response.lastModified(new Date('2019/1/1'));
      expect(response.getHeader('Last-Modified')).toBe(new Date('2019/1/1').toUTCString());
    });
  });

  describe('Response#etag', () => {
    it('should not modify an etag with quotes', () => {
      const response = new Response();
      response.eTag('"test"');
      expect(response.getHeader('ETag')).toBe('"test"');
    });

    it('should not modify a weak etag', () => {
      const response = new Response();
      response.eTag('W/"test"');
      expect(response.getHeader('ETag')).toBe('W/"test"');
    });

    it('should add quotes around an etag if necessary', () => {
      const response = new Response();
      response.eTag('test');
      expect(response.getHeader('ETag')).toBe('"test"');
    });
  });
});
