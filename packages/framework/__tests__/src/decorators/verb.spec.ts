import 'reflect-metadata';
import {
  Route, Http,
} from '../../../src/decorators';


describe('verb Decorator', () => {
  it('should patch get route', () => {
    @Route('users')
    class Example {
      @Http.Get()
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
    @Route('users')
    class Example {
      @Http.Post(':id')
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
    @Route('users')
    class Example {
      @Http.Put(':id')
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
    @Route('users')
    class Example {
      @Http.Options(':id')
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
    @Route('users')
    class Example {
      @Http.Head(':id')
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
    @Route('users')
    class Example {
      @Http.Delete(':id')
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
