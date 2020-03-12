import { provide } from '../../../decorators/provider';
import { inject } from '../../../decorators/inject';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';

export class LoaderProvider {

  @inject() app: Application;

  @provide(Loader)
  _loader(app: Application) {
    return new Loader(app);
  }

  @provide('loader')
  _loaderAlias(app: Application) {
    return app.get(Loader);
  }

  async launch() {
    await this.app.get<Loader>(Loader).autoScanApp();
  }
}