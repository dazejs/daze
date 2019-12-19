import { Component, Service } from '@dazejs/framework';

@Component('example')
export default class extends Service {
  list: any[];

  add(data: any) {
    this.list.push(data);
  }

  findAll() {
    return this.list;
  }
}