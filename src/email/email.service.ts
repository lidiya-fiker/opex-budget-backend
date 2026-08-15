import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.dashenbank.com.et',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || 'bms-noreply@dashenbank.com.et',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }

  /**
   * Sends the CBS confirmation link to the requester after BCC approval.
   */
  async sendManualPaymentConfirmation(
    to: string,
    budgetCode: string,
    description: string,
    token: string,
  ): Promise<void> {
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/manual-payments/confirm?token=${token}`;

    await this.sendMail({
      to,
      subject: `[BMS] Manual Payment Approved – ${budgetCode}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#1a365d">Budget Management System</h2>
          <p>Your manual payment request has been <strong>approved</strong> by the BCC Team.</p>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Budget Code</strong></td>
                <td style="padding:8px;border:1px solid #e2e8f0">${budgetCode}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Description</strong></td>
                <td style="padding:8px;border:1px solid #e2e8f0">${description}</td></tr>
          </table>
          <p style="margin-top:24px">Click the button below to initiate the payment in CBS:</p>
          <a href="${confirmUrl}"
             style="display:inline-block;padding:12px 24px;background:#2b6cb0;color:#fff;
                    text-decoration:none;border-radius:6px;font-weight:bold">
            Initiate CBS Payment
          </a>
          <p style="margin-top:24px;font-size:12px;color:#718096">
            This link expires after first use. Do not share it with others.<br/>
            Dashen Bank S.C. — Budget Management System
          </p>
        </div>
      `,
    });
  }
}
