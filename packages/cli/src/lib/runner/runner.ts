import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import chalk from 'chalk';
import * as path from 'path';

type RunnerBinary = 'npm' | 'yarn' | 'pnpm'

export class Runner {

  private binary: RunnerBinary;
  private _directory = '';

  constructor(binary: RunnerBinary) {
    this.binary = binary;
  }

  directory(directory: string) {
    this._directory = directory;
    return this;
  }

  async run(...args: string[]) {
    return new Promise<null | string>((resolve, reject) => {
      const options: SpawnOptions = {
        cwd: path.join(process.cwd(), this._directory),
        stdio: 'inherit',
        shell: true,
      };
      const child: ChildProcess = spawn('npx', [this.binary, ...args], options);
      child.on('close', code => {
        if (code === 0) {
          resolve(null);
        } else {
          console.error(
            chalk.red(
              `\nFailed to execute command: npx ${this.binary} ${args.join(' ')}`,
            ),
          );
          reject();
        }
      });
    });
  }
}