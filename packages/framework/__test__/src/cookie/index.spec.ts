import path from 'path';
import 'reflect-metadata';
import { Cookie } from '../../../src/cookie';
import { Application } from '../../../src/foundation/application';

const app = new Application(path.resolve(__dirname, '../../daze/src'));
app.initialize();

describe('Cookie', () => {
  describe('Cookie#getOptions', () => {
    it('should return cookie options', () => {
      const cookie = new Cookie('a', 'b', {
        signed: false,
      });
      expect(cookie.getOptions().signed).toBeFalsy();
    });
  });

  describe('Cookie#getName', () => {
    it('should return cookie name', () => {
      const cookie = new Cookie('a', 'b');
      expect(cookie.getName()).toBe('a');
    });
  });

  describe('Cookie#getValue', () => {
    it('should return cookie value', () => {
      const cookie = new Cookie('a', 'b');
      expect(cookie.getValue()).toBe('b');
    });
  });

  describe('Cookie#setValue', () => {
    it('should return cookie value', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setValue('c');
      expect(cookie.getValue()).toBe('c');
    });
  });

  describe('Cookie#setHttpOnly', () => {
    it('should return options httpOnly', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setHttpOnly(false);
      expect(cookie.getOptions().httpOnly).toBe(false);
    });
    it('should return options httpOnly as fallback', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setHttpOnly();
      expect(cookie.getOptions().httpOnly).toBe(true);
    });
  });

  describe('Cookie#setSigned', () => {
    it('should return options signed', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setSigned(false);
      expect(cookie.getOptions().signed).toBe(false);
    });
    it('should return options signed as fallback', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setSigned();
      expect(cookie.getOptions().signed).toBe(true);
    });
  });

  describe('Cookie#shouldSigned', () => {
    it('should return options signed', () => {
      const cookie = new Cookie('a', 'b');
      cookie.shouldSigned();
      expect(cookie.getOptions().signed).toBe(true);
    });
  });

  describe('Cookie#doNotSigned', () => {
    it('should return options signed', () => {
      const cookie = new Cookie('a', 'b');
      cookie.doNotSigned();
      expect(cookie.getOptions().signed).toBe(false);
    });
  });

  describe('Cookie#setMaxAge', () => {
    it('should return options maxage', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setMaxAge(100);
      expect(cookie.getOptions().maxAge).toBe(100);
    });
    it('should return options maxage as fallback', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setMaxAge();
      expect(cookie.getOptions().maxAge).toBe(0);
    });
  });

  describe('Cookie#setDomain', () => {
    it('should return options domain', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setDomain('www.xxx.com');
      expect(cookie.getOptions().domain).toBe('www.xxx.com');
    });
    it('should return options domain as fallback', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setDomain();
      expect(cookie.getOptions().domain).toBe('');
    });
  });

  describe('Cookie#setPath', () => {
    it('should return options path', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setPath('/abc');
      expect(cookie.getOptions().path).toBe('/abc');
    });
    it('should return options path as fallback', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setPath();
      expect(cookie.getOptions().path).toBe('/');
    });
  });

  describe('Cookie#setSecure', () => {
    it('should return options secure', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setSecure(true);
      expect(cookie.getOptions().secure).toBe(true);
    });
    it('should return options secure as fallback', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setSecure();
      expect(cookie.getOptions().secure).toBe(false);
    });
  });

  describe('Cookie#setExpires', () => {
    it('should return options expires', () => {
      const cookie = new Cookie('a', 'b');
      cookie.setExpires(100);
      expect(cookie.getOptions().expires).toBe(100);
    });
  });
});
