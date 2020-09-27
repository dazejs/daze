
import * as path from 'path';
import * as fs from 'fs';
import stackTrace from 'stack-trace';
import { promisify } from 'util';
import * as nunjucks from 'nunjucks';

const contextLinesNumber = 10;
const WRITE_CONTENT_IN_LINE = Symbol('Symbol#Trace#writeContentInLine');
const READ_FILE = Symbol('Trace#readFile');
const env = nunjucks.configure(path.resolve(__dirname, './template/view'));

function cutFileName(name: string) {
  return name.length > 50 ? '...' + name.slice(-50) : name;
}

class TracePage {
  render(err: Error, request: any, options = {}) {
    const stacks = this.parse(err);
    return env.render('index.html', {
      stacks: stacks.filter(s => !!s),
      name: err.name,
      message: err.message,
      request: request,
      pid: process.pid,
      ppid: process.ppid,
      platform: process.platform,
      version: process.version,
      uptime: process.uptime(),
      cutFileName,
      logo: fs.readFileSync(path.resolve(__dirname, './template/images/logo.svg')),
      options,
    });
  }

  get [READ_FILE]() {
    return promisify(fs.readFile);
  }

  parse(err: Error) {
    const stacks = stackTrace.parse(err);
    return stacks.filter(s => !!s.getFileName()).map(this[WRITE_CONTENT_IN_LINE]);
  }

  [WRITE_CONTENT_IN_LINE](line: any) {
    const filename = line.getFileName();
    const lineNumber = line.getLineNumber();
    const data = fs.readFileSync(filename, { encoding: 'utf-8' });
    const startLine = Math.max(0, lineNumber - contextLinesNumber);
    const endLine = Math.min(lineNumber + contextLinesNumber, data.length);
    const contextLines = data.split('\n').slice(startLine, endLine);
    line.content = contextLines.join('\n');
    line.startLineNumber = Math.max(0, startLine) + 1;
    return line;
  }
}

export default function (err: Error, request: any, options?: object) {
  return (new TracePage()).render(err, request, options);
}
