import { provide, Provider, AppendAgent } from '../../../decorators';
import { Redis } from '../../../redis';
import { app } from '../../../helpers';


@Provider()
@AppendAgent()
export class RedisProvider{
  @provide(Redis)
  _database() {
    return new Redis();
  }

  @provide('redis')
  _databaseAlias() {
    return app().get(Redis);
  }
}