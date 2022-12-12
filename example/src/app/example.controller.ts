import { Controller, http, app, Request, Autowired, Logger, View,  } from '../../../packages/framework/dist';
import { ExampleEntity } from './example.entity';

@Controller()
export class Example {
  @Autowired
    logger: Logger;
  // @Get()
  // async index(request: Request, @Query('name') anme = '') {
  //     return new View('hello', {
  //         name: anme || 'tiger'
  //     });
  // }

  @http.Get('/*/set')
  async set() {
    return 'set';
  }

  @http.Get('/route')
  async route() {
    console.dir(app().get('router'), {
      customInspect: true,
      depth: 7
    });
    return 'route';
  } 

  @http.Get('/del-route')
  async delroute() {
    app().get('router').unRegistry('/set', ['GET'], {});
    return 'route';
  }
}