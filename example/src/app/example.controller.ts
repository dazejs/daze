import { Controller, http, Request, Autowired, Logger } from '../../../packages/framework/dist';
@Controller()
export class Example {
  @Autowired
  logger: Logger;

  @http.get("/get")
  log(_request: Request) {
    return 'not found';
  }
}