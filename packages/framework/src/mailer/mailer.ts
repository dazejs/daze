
import { config } from '../helpers';
import { MailManager } from './manager';
import { MailConnector } from './connector';
/**
 * 邮件服务
 */
export class Mailer {
  /**
     * mail 管理器
     */
  managers: Map<string, MailManager> = new Map()

  /**
     * 获取已经连接的 mail 服务
     * @param name 
     * @returns 
     */
  transporter(name = 'default') {
    if (!this.managers.has(name)) {
      const mailConfig = this.getTransporterConfigure(name);
      this.managers.set(name, this.createTransporterManager(mailConfig));
    }
    return this.managers.get(name) as MailManager;
  }

  createTransporterManager(options: any) {
    const transporter = (new MailConnector()).connect(options);
    return new MailManager(transporter);
  }

  /**
     * 根据名称获取对应邮箱配置
     * @param name 
     * @returns 
     */
  private getTransporterConfigure(name: string) {
    return config().get(`mail.${name}`);
  }
}