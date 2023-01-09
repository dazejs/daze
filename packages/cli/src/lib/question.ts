import inquirer from 'inquirer';

export class Question {
  private inquirer = inquirer;

  private promptList: inquirer.QuestionCollection[] = [];

  projectType() {
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
        name: 'pnpm',
        value: 'pnpm'
      }, {
        name: '自行安装依赖',
        value: 'disable'
      }]
    });
    return this;
  }
  async ask() {
    return this.inquirer.prompt(this.promptList);
  }
}