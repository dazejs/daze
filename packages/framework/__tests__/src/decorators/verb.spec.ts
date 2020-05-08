import 'reflect-metadata';
import {
  controller, http,
} from '../../../src';


describe('verb Decorator', () => {
  it('should patch get route', () => {
    @controller('users')
    class Example {
      @http.get()
      index() {
        //
      }
    }
    const routes = Reflect.getMetadata('routes', Example);
    expect(routes.index).toEqual([
      {
        method: 'GET',
        uri: '',
      },
    ]);
  });

  it('should patch post route', () => {
    @controller('users')
    class Example {
      @http.post(':id')
      store() {
        //
      }
    }
    const routes = Reflect.getMetadata('routes', Example);
    expect(routes.store).toEqual([
      {
        method: 'POST',
        uri: '/:id',
      },
    ]);
  });

  it('should patch put route', () => {
    @controller('users')
    class Example {
      @http.put(':id')
      put() {
        //
      }
    }
    const routes = Reflect.getMetadata('routes', Example);
    expect(routes.put).toEqual([
      {
        method: 'PUT',
        uri: '/:id',
      },
    ]);
  });

  it('should patch options route', () => {
    @controller('users')
    class Example {
      @http.options(':id')
      options() {
        //
      }
    }
    const routes = Reflect.getMetadata('routes', Example);
    expect(routes.options).toEqual([
      {
        method: 'OPTIONS',
        uri: '/:id',
      },
    ]);
  });

  it('should patch head route', () => {
    @controller('users')
    class Example {
      @http.head(':id')
      head() {
        //
      }
    }
    const routes = Reflect.getMetadata('routes', Example);
    expect(routes.head).toEqual([
      {
        method: 'HEAD',
        uri: '/:id',
      },
    ]);
  });

  it('should patch delete route', () => {
    @controller('users')
    class Example {
      @http.del(':id')
      del() {
        //
      }
    }
    const routes = Reflect.getMetadata('routes', Example);
    expect(routes.del).toEqual([
      {
        method: 'DELETE',
        uri: '/:id',
      },
    ]);
  });
});
