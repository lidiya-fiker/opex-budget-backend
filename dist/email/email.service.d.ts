export interface MailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare class EmailService {
    private transporter;
    constructor();
    sendMail(options: MailOptions): Promise<void>;
    sendManualPaymentConfirmation(to: string, budgetCode: string, description: string, token: string): Promise<void>;
}
