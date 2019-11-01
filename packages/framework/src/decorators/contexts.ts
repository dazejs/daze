import { createInjectDecorator } from './factory/create-inject-decorator';
import * as symbols from '../symbol';

export const useService = createInjectDecorator(symbols.INJECTORS.SERVICE);
export const useValidator = createInjectDecorator(symbols.INJECTORS.VALIDATOR);
export const useResource = createInjectDecorator(symbols.INJECTORS.RESOURCE);
export const useModel = createInjectDecorator(symbols.INJECTORS.MODEL);
export const useComponent = createInjectDecorator(symbols.INJECTORS.COMPONENT);
export const Config = createInjectDecorator('config');
export const App = createInjectDecorator('app');
export const Messenger = createInjectDecorator('messenger');
