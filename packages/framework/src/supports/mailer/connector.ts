import nodemailer from 'nodemailer';

/**
 * 邮件服务连接器
 */
export class MailConnector {
  /**
     * 连接邮件服务器
     * @param options 
     * @returns 
     */
  connect(options: any) {
    return nodemailer.createTransport(options);
  }
}