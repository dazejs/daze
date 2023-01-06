import nodemailer from 'nodemailer';
import { MailBuilder } from './builder';

/**
 * 邮件管理器
 */
export class MailManager {
  private transporter: nodemailer.Transporter;
    
  constructor(transporter: nodemailer.Transporter) {
    this.transporter = transporter;
  }

  create() {
    return new MailBuilder(this);
  }

  send(message: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(message);
  }
}