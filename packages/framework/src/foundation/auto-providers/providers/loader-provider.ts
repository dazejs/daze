import { provide, disable } from '../../../decorators';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';

export class LoaderProvider {

  // @inject() app: Application;

  @provide(Loader)
  @disable
  _loader(app: Application) {
    return new Loader(app);
  }

  @provide('loader')
  @disable
  _loaderAlias(app: Application) {
    return app.get(Loader);
  }
}