"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = class EmailService {
    transporter;
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
    async sendMail(options) {
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM || 'bms-noreply@dashenbank.com.et',
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
    }
    async sendManualPaymentConfirmation(to, budgetCode, description, token) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map