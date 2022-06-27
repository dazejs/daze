import inquirer from 'inquirer';

export class Question {
  private inquirer = inquirer;

  private promptList: inquirer.QuestionCollection[] = [];

  projectType() {
    this.promptList.push({
      type: 'list',
      name: 'projectType',
      message: '请选择工程类型',
      choices: [{
        name: 'Node',
        value: 'node',
      }, {
        name: 'Node + Web（SSR）',
        value: 'ssr'
      }]
    });
    return this;
  }

  productCode() {
    this.promptList.push({
      type: 'input',
      name: 'productCode',
      message: '请输入产品标识（productCode）:',
    });
    return this;
  }

  serviceCode() {
    this.promptList.push({
      type: 'input',
      name: 'serviceCode',
      message: '请输入服务标识（serviceCode）:',
    });
    return this;
  }

  async ask() {
    return this.inquirer.prompt(this.promptList);
  }
}