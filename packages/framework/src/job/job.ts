import { Application } from '../foundation/application';


export class Job {

  constructor(private app: Application) {}

  async run(abstract: any, args: any[] = []) {
    const job = this.app.get(abstract);
    if (!job) throw new Error(`cannot found job [${abstract}]`);
    job?.run(...args);
  }
}