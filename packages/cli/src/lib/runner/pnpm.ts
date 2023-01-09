import { Runner } from './runner';

export class PNpmRunner extends Runner {
  constructor() {
    super('pnpm');
  }
}