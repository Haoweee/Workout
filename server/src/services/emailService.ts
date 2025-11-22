import { config } from '@config/config';
import { logger } from '@/utils/logger';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(config.sendgrid.apiKey || '');

export class EmailService {
  static async sendVerificationEmail(to: string, otp: string): Promise<void> {
    const msg = {
      to,
      from: {
        email: config.sendgrid.fromEmail || '',
        name: config.sendgrid.fromName || 'WorkoutApp Team',
      },
      subject: 'Verify your email for WorkoutApp',
      html: `
        <p>Dear User,</p>
        <p>Thank you for registering with WorkoutApp! Please use the following One-Time Password (OTP) to verify your email address:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>The WorkoutApp Team</p>
            `,
    };

    try {
      await sgMail.send(msg);
      logger.info(`Verification email sent to ${to}`);
    } catch (error) {
      logger.error(`Error sending verification email to ${to}:`, error);
      throw new Error('Failed to send verification email');
    }
  }
}
