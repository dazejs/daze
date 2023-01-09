import 'reflect-metadata';
import path from 'path';
import Accepts from 'accepts';
import Cookies from 'cookies';
import { Request, Application } from '../../../src';
import { context } from '../../common/context';

const app = new Application({
  rootPath: path.resolve(__dirname, '../../daze/src')
});
beforeAll(() => app.initialize());

describe('Request', () => {
  describe('Request#headers', () => {
    it('should return the request headers', () => {
      const _headers = {
        name: 'dazejs',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.headers).toEqual(_headers);
    });

    it('should return the request headers when no getHeader name', () => {
      const _headers = {
        name: 'dazejs',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.getHeaders()).toEqual(_headers);
    });

    it('should return header value use getHeader name', () => {
      const _headers = {
        name: 'dazejs',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.getHeader('name')).toEqual('dazejs');
      expect(instance.get('name')).toEqual(_headers.name);
    });

    it('need to be compatible with referer and referrer', () => {
      const _headers = {
        name: 'dazejs',
        referer: 'localhost',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.getHeader('referer')).toEqual(_headers.referer);
      expect(instance.getHeader('referrer')).toEqual(_headers.referer);
    });

    it('should return "" when not set headers key', () => {
      const { req, res } = context({});
      const instance = new Request(req, res);
      expect(instance.getHeader('referer')).toBe('');
      expect(instance.getHeader('name')).toBe('');
    });
  });

  describe('Request#method', () => {
    it('when method is get', () => {
      const { req, res } = context({
        method: 'GET',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('GET');
      expect(instance.getMethod()).toEqual('GET');
      expect(instance.isGet()).toBeTruthy();
    });

    it('when method is post', () => {
      const { req, res } = context({
        method: 'POST',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('POST');
      expect(instance.getMethod()).toEqual('POST');
      expect(instance.isPost()).toBeTruthy();
    });

    it('when method is put', () => {
      const { req, res } = context({
        method: 'PUT',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('PUT');
      expect(instance.getMethod()).toEqual('PUT');
      expect(instance.isPut()).toBeTruthy();
    });

    it('when method is patch', () => {
      const { req, res } = context({
        method: 'PATCH',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('PATCH');
      expect(instance.getMethod()).toEqual('PATCH');
      expect(instance.isPatch()).toBeTruthy();
    });

    it('when method is delete', () => {
      const { req, res } = context({
        method: 'DELETE',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('DELETE');
      expect(instance.getMethod()).toEqual('DELETE');
      expect(instance.isDelete()).toBeTruthy();
    });

    it('when method is head', () => {
      const { req, res } = context({
        method: 'HEAD',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('HEAD');
      expect(instance.getMethod()).toEqual('HEAD');
      expect(instance.isHead()).toBeTruthy();
    });

    it('when method is options', () => {
      const { req, res } = context({
        method: 'OPTIONS',
      });
      const instance = new Request(req, res);
      expect(instance.method).toEqual('OPTIONS');
      expect(instance.getMethod()).toEqual('OPTIONS');
      expect(instance.isOptions()).toBeTruthy();
    });
  });

  describe('Request#length', () => {
    it('should return content-length header as a number', () => {
      const _headers = {
        'content-length': '10',
      };
      const { req, res } = context({
        headers: _headers,
      });
      const instance = new Request(req, res);
      expect(instance.length).toBe(10);
      expect(instance.getLength()).toBe(10);
    });

    it('should return undefined when no content-length', () => {
      const { req, res } = context({});
      const instance2 = new Request(req, res);
      expect(instance2.length).toBeUndefined();
    });
  });

  describe('Request#url', () => {
    it('should use req.url', () => {
      const request = {
        url: '/users?name=zewail',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.url).toBe(request.url);
      expect(instance.getUrl()).toBe(request.url);
    });
  });

  describe('Request#socket', () => {
    it('should use req.socket', () => {
      const request = {
        url: '/users?name=zewail',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.socket).toBe(req.socket);
      expect(instance.getSocket()).toBe(req.socket);
    });
  });


  describe('Request#protocol', () => {
    it('when https', () => {
      const request = {
        socket: { encrypted: true },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.protocol).toBe('https');
      expect(instance.getProtocol()).toBe('https');
    });

    it('when http', () => {
      const request = {
        socket: { encrypted: false },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.protocol).toBe('http');
      expect(instance.getProtocol()).toBe('http');
    });

    it('when proxy is not trusted', () => {
      const request = {
        url: '/users?name=zewail',
        headers: {
          'x-forwarded-proto': 'https, http',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', false);
      expect(instance.protocol).toBe('http');
    });

    it('when proxy is trusted and no x-forwarded-proto', () => {
      const request = {
        url: '/users?name=zewail',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', true);
      expect(instance.protocol).toBe('http');
    });

    it('when proxy is trusted', () => {
      const request = {
        url: '/users?name=zewail',
        headers: {
          'x-forwarded-proto': 'https, http',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', true);
      expect(instance.protocol).toBe('https');
    });
  });

  describe('Request#host', () => {
    it('should return host with port', () => {
      const request = {
        headers: {
          host: 'xxx.com:8000',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('when no host', () => {
      const { req, res } = context({});
      const instance = new Request(req, res);
      expect(instance.host).toBe('');
    });

    it('when http/2', () => {
      const request = {
        httpVersionMajor: 2,
        httpVersion: 2.0,
        headers: {
          ':authority': 'xxx.com:9000',
          host: 'xxx.com:8000',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.host).toBe('xxx.com:9000');
    });

    it('when http/1', () => {
      const request = {
        httpVersionMajor: 1,
        httpVersion: 1.1,
        headers: {
          ':authority': 'xxx.com:9000',
          host: 'xxx.com:8000',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('should use host as fallback when http/2', () => {
      const request = {
        httpVersionMajor: 2,
        httpVersion: 2.0,
        headers: {
          host: 'xxx.com:8000',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('when proxy is not trusted on http/1', () => {
      const request = {
        httpVersionMajor: 1,
        httpVersion: 1.1,
        headers: {
          host: 'xxx.com:8000',
          'x-forwarded-host': 'yyy.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', false);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('when proxy is not trusted on http/2', () => {
      const request = {
        httpVersionMajor: 2,
        httpVersion: 2.0,
        headers: {
          host: 'xxx.com:8000',
          'x-forwarded-host': 'yyy.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', false);
      expect(instance.host).toBe('xxx.com:8000');
    });

    it('when proxy is trusted on http/1', () => {
      const request = {
        httpVersionMajor: 1,
        httpVersion: 1.1,
        headers: {
          host: 'xxx.com:8000',
          'x-forwarded-host': 'yyy.com, zzz.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', true);
      expect(instance.host).toBe('yyy.com');
    });

    it('when proxy is trusted on http/2', () => {
      const request = {
        httpVersionMajor: 2,
        httpVersion: 2.0,
        headers: {
          host: 'xxx.com:8000',
          'x-forwarded-host': 'yyy.com, zzz.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      app.get('config').set('app.proxy', true);
      expect(instance.host).toBe('yyy.com');
    });
  });

  describe('Request#origin', () => {
    it('should return protocol and host', () => {
      const request = {
        headers: {
          host: 'yyy.com',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.origin).toBe('http://yyy.com');
      expect(instance.getOrigin()).toBe('http://yyy.com');
    });
  });

  describe('Request#href', () => {
    it('should return full url', () => {
      const request = {
        url: '/users?name=zewail',
        headers: {
          host: 'localhost',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.href).toBe('http://localhost/users?name=zewail');
      expect(instance.getHref()).toBe('http://localhost/users?name=zewail');
    });

    it('should return url when url have protocol', () => {
      const request = {
        url: 'http://localhost/users?name=zewail',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.href).toBe('http://localhost/users?name=zewail');
    });
  });

  describe('Request#path', () => {
    it('should return req pathname', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.path).toBe('/users');
      expect(instance.getPath()).toBe('/users');
    });
  });

  describe('Request#querystring', () => {
    it('should return req querystring', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.querystring).toBe('page=10&color=blue');
      expect(instance.getQuerystring()).toBe('page=10&color=blue');
    });

    it('should return "" when no query', () => {
      const request = {
        url: '/users',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.querystring).toBe('');
    });
  });

  describe('Request#search', () => {
    it('should return req search', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.search).toBe('?page=10&color=blue');
      expect(instance.getSearch()).toBe('?page=10&color=blue');
    });

    it('should return "" when no query', () => {
      const request = {
        url: '/users',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.search).toBe('');
    });
  });

  describe('Request#query', () => {
    it('should return req query object', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.query).toEqual({
        page: '10',
        color: 'blue',
      });
      expect(instance.getQuery()).toEqual({
        page: '10',
        color: 'blue',
      });
    });
  });

  describe('Request#type', () => {
    it('should return content type', () => {
      const request = {
        url: '/users?page=10&color=blue',
        headers: {
          'content-type': 'text/html; applition/json',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.type).toBe('text/html');
      expect(instance.getType()).toBe('text/html');
    });

    it('should return "" when no content type', () => {
      const { req, res } = context({});
      const instance = new Request(req, res);
      expect(instance.type).toBe('');
    });
  });

  describe('Request#accepts', () => {
    it('should accepts return Accepts instance', () => {
      const request = {
        url: '/users?page=10&color=blue',
        headers: {
          accept: 'application/json, text/html, text/plain',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.accept).toBeInstanceOf(Accepts);
    });

    it('when Accept type is populated', () => {
      const request = {
        url: '/users?page=10&color=blue',
        headers: {
          accept: 'application/*;q=0.1, text/html, text/plain, image/jpeg;q=0.5',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.acceptsTypes()).toEqual(['text/html', 'text/plain', 'image/jpeg', 'application/*']);
    });

    it('when Accept-Encoding is populated', () => {
      const request = {
        url: '/users?page=10&color=blue',
        headers: {
          'accept-encoding': 'gzip, compress;q=0.3',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.acceptsEncodings()).toEqual(['gzip', 'compress', 'identity']);
      expect(instance.acceptsEncodings('gzip', 'compress')).toBe('gzip');
    });

    it('when Accept-Charsets is populated', () => {
      const request = {
        url: '/users?page=10&color=blue',
        headers: {
          'accept-charset': 'utf-8, iso-8859-1;q=0.3',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.acceptsCharsets()).toEqual(['utf-8', 'iso-8859-1']);
    });

    it('when Accept-Language is populated', () => {
      const request = {
        url: '/users?page=10&color=blue',
        headers: {
          'accept-language': 'en;q=0.8, es',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.acceptsLanguages()).toEqual(['es', 'en']);
    });
  });

  describe('Request#param', () => {
    it('shoud return query value', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.getParam('page')).toBe('10');
    });

    it('shoud return body value', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.getParam('name')).toBe('dazejs');
    });

    it('should return undefined when key does not exist', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.getParam('age')).toBeUndefined();
    });

    it('should return default value when key does not exist', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.getParam('age', '100')).toBe('100');
    });

    it('should return all param object whitout name', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.getParams()).toEqual({
        page: '10',
        color: 'blue',
        name: 'dazejs',
      });
    });
  });

  describe('Request#only', () => {
    it('should return only object', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.only('name', 'page')).toEqual({
        name: 'dazejs',
        page: '10',
      });
    });

    it('should return only object when array param', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.only(['name', 'page'])).toEqual({
        name: 'dazejs',
        page: '10',
      });
    });

    it('should return only object when invalid param', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.only(['name', 'page', 'age'])).toEqual({
        name: 'dazejs',
        page: '10',
      });
      expect(instance.only('name', 'page', 'age')).toEqual({
        name: 'dazejs',
        page: '10',
      });
    });

    it('should return only object when invalid type', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.only(['name', 'page', 'age'], {})).toEqual({
        name: 'dazejs',
        page: '10',
      });
      expect(instance.only('name', 'page', 'age', {})).toEqual({
        name: 'dazejs',
        page: '10',
      });
    });
  });

  describe('Request#except', () => {
    it('should return left object', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.except('color')).toEqual({
        name: 'dazejs',
        page: '10',
      });
    });

    it('should return left object when array param', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.except(['color'])).toEqual({
        name: 'dazejs',
        page: '10',
      });
    });

    it('should return left object when invalid param', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.except(['color', 'age'])).toEqual({
        name: 'dazejs',
        page: '10',
      });
      expect(instance.except('color', 'age')).toEqual({
        name: 'dazejs',
        page: '10',
      });
    });

    it('should return left object when invalid type', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.except(['color', 'age'], {})).toEqual({
        name: 'dazejs',
        page: '10',
      });
      expect(instance.except('color', 'age', {})).toEqual({
        name: 'dazejs',
        page: '10',
      });
    });
  });

  describe('Request#proxy', () => {
    it('shoud return param value', () => {
      const request = {
        url: '/users?page=10&color=blue',
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      (instance as any)._body = {
        fields: {
          name: 'dazejs',
        },
      };
      expect(instance.page).toBe('10');
      expect(instance.color).toBe('blue');
    });
  });

  describe('Request#cookies', () => {
    it('should return cookie object', () => {
      const request = {
        url: '/users?page=10&color=blue',
        headers: {
          cookie: 'name=dazejs;age=18',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.cookies).toBeInstanceOf(Cookies);
    });

    it('should return cookie value', () => {
      const request = {
        url: '/users?page=10&color=blue',
        headers: {
          cookie: 'name=dazejs;age=20',
        },
      };
      const { req, res } = context(request);
      const instance = new Request(req, res);
      expect(instance.cookies.get('name')).toBe('dazejs');
    });
  });
});
