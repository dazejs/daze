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
        name: 'Node 工程',
        value: 'node',
      }, {
        name: 'SSR 工程',
        value: 'ssr'
      }, {
        name: 'B 端业务 SSR 工程',
        value: 'business'
      }]
    });
    return this;
  }

  packageManager() {
    this.promptList.push({
      type: 'list',
      name: 'packageManager',
      message: '选择包管理工具',
      choices: [{
        name: 'npm',
        value: 'npm',
      }, {
        name: 'yarn',
        value: 'yarn'
      }, {
        name: 'ppnpm',
        value: 'ppnpm'
      }, {
        name: '自行安装依赖',
        value: 'disable'
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