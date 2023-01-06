import { app, Autowired, Controller, http, Logger } from '../../../packages/framework/dist';

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

  @http.Get('set')
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