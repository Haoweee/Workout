import { config } from '@config/config';
import { logger } from '@/utils/logger';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(config.sendgrid.apiKey || '');

export class EmailService {
  static async sendVerificationEmail(to: string, verificationLink: string): Promise<void> {
    const msg = {
      to,
      from: {
        email: config.sendgrid.fromEmail || '',
        name: config.sendgrid.fromName || 'WorkoutApp Team',
      },
      subject: 'Verify your email for WorkoutApp',
      html: `
                <p>Thank you for registering with WorkoutApp!</p>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>If you did not sign up for this account, please ignore this email.</p>
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
