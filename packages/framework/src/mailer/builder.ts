
import { MailManager } from './manager';
import { SendMailOptions } from 'nodemailer';

type Attachments = NonNullable<SendMailOptions['attachments']>;

/**
 * 邮件信息构建器
 */
export class MailBuilder {
  /**
     * 管理器实例
     */
  private manager: MailManager;

  /**
     * nodemailer 消息体构建
     */
  private message: SendMailOptions = {};
    
  /**
     * 构造方法
     * @param manager 
     */
  constructor(manager: MailManager) {
    this.manager = manager;
  }

  /**
     * 消息来源
     * @param from 
     * @returns 
     */
  public from(from: string) {
    this.message.from = from;
    return this;
  }

  /**
     * 发送对象
     * @param to 
     * @returns 
     */
  public to(to: string) {
    this.message.to = to;
    return this;
  }

  /**
     * 邮件主题
     * @param subject 
     * @returns 
     */
  public subject(subject: string) {
    this.message.subject = subject;
    return this;
  }

  /**
     * html 格式的邮件内容
     * @param html 
     * @returns 
     */
  public html(html: string) {
    this.message.html = html;
    return this;
  }

  // amp(amp: string) {
  //     this.message.amp = amp;
  //     return this;
  // }

  /**
     * 邮件附件
     * @param attachments 
     * @returns 
     */
  public attachments(attachments: Attachments) {
    if (!(this.message.attachments && Array.isArray(this.message.attachments))) {
      this.message.attachments = [];
    }
    this.message.attachments.push(...attachments);
    return this;
  }

  /**
     * 邮件附件
     * @param attachment 
     * @returns 
     */
  public attachment(attachment: Attachments[0]) {
    if (!(this.message.attachments && Array.isArray(this.message.attachments))) {
      this.message.attachments = [];
    }
    this.message.attachments.push(attachment);
    return this;
  }

  /**
     * 发送邮件
     */
  public async send() {
    await this.manager.send(this.message);
  }
}
