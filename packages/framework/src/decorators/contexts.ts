import { createInjectDecorator } from './factory/create-inject-decorator';

export const Config = createInjectDecorator('config');
export const config = Config;
export const App = createInjectDecorator('app');
export const app = App;
export const Messenger = createInjectDecorator('messenger');
export const messenger = Messenger;
