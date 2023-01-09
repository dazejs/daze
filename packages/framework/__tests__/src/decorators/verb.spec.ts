import 'reflect-metadata';
import {
  Controller, Get, Post, Put, Options, Head, Del
} from '../../../src';


describe('verb Decorator', () => {
  it('should patch get route', () => {
    @Controller('users')
    class Example {
      @Get()
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
    @Controller('users')
    class Example {
      @Post(':id')
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
    @Controller('users')
    class Example {
      @Put(':id')
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
    @Controller('users')
    class Example {
      @Options(':id')
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
    @Controller('users')
    class Example {
      @Head(':id')
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
    @Controller('users')
    class Example {
      @Del(':id')
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
