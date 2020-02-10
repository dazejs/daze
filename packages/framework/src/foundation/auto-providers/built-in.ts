/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Provider as BaseProvider } from '../../base/provider';
import { depend } from '../../decorators/provider';
import { DecoratorProvider } from './providers/decorator';
import { AppProvider } from './providers/app';

@depend([
  AppProvider,
  DecoratorProvider,
])
export class BuiltInProvider extends BaseProvider {
  
}