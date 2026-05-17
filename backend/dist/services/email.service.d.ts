export declare const sendEmail: (to: string, subject: string, html: string) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
export declare const sendTwoFactorEmail: (to: string, otpCode: string) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
export declare const sendDataExportEmail: (to: string, userData: any) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
export declare const sendPasswordResetEmail: (to: string, resetCode: string) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
export declare const sendGeneralNotificationEmail: (to: string, title: string, message: string, actionUrl?: string) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo | undefined>;
//# sourceMappingURL=email.service.d.ts.map