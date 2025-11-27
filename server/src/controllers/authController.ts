import { Request, Response, NextFunction } from 'express';
import { CreateUserRequest, EmailLoginRequest } from '@/types';
import { AuthService } from '@/services/authService';
import { OAuthService } from '@/services/OAuth';
import { logger } from '@/utils/logger';
import { UserService } from '@/services/userService';
import { EmailService } from '@/services/emailService';
import { config } from '@/config/config';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

const MILLIS_PER_MINUTE = 60 * 1000;

let loginCodes: { userData: CreateUserRequest; otp: string; expiration: number }[] = []; // In-memory store for OTPs (for demo purposes only

setInterval(() => {
  loginCodes = loginCodes.filter((loginCodeObj) => loginCodeObj.expiration > Date.now());
}, MILLIS_PER_MINUTE * 10);

export class AuthController {
  static sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body as CreateUserRequest;

      if (
        !userData.email ||
        !userData.username ||
        !userData.password ||
        !userData.confirmPassword ||
        !userData.fullName
      ) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: email, username, password, fullName',
        });
        return;
      }

      if (userData.password !== userData.confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'Password and confirm password do not match',
        });
        return;
      }

      const otp = generateOtp();
      const expiration = Date.now() + MILLIS_PER_MINUTE * 10; // OTP valid for 10 minutes

      // Store OTP in memory (replace with DB in production)
      loginCodes.push({ userData, otp, expiration });
      logger.info(`Generated OTP for ${userData.email}: ${otp} (expires in 10 minutes)`);

      // Send OTP via email
      if (config.environment === 'production') {
        await EmailService.sendVerificationEmail(userData.email, otp);
      }

      logger.info(`OTP sent to ${userData.email}`);
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
      logger.error('Error sending OTP:', error);
      next(error);
    }
  };

  static verifyOtpRegisterOrChangePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp, password, confirmPassword, type } = req.body as {
        email?: string;
        otp?: string;
        password?: string;
        confirmPassword?: string;
        type?: 'register' | 'changePassword';
      };

      if (!email || !otp) {
        res.status(400).json({
          success: false,
          error: 'Email and OTP are required',
        });
        return;
      }

      console.log('LOGIN CODES:', loginCodes);

      const loginCodeObjIndex = loginCodes.findIndex(
        (obj) => obj.userData.email === email && obj.otp === otp && obj.expiration > Date.now()
      );

      if (loginCodeObjIndex === -1) {
        res.status(400).json({
          success: false,
          error: 'Invalid or expired OTP',
        });
        return;
      }

      const loginCodeObj = loginCodes[loginCodeObjIndex];
      if (!loginCodeObj) {
        res.status(400).json({
          success: false,
          error: 'Invalid or expired OTP',
        });
        return;
      }
      const userData = loginCodeObj.userData;

      // Remove used OTP
      loginCodes.splice(loginCodeObjIndex, 1);

      if (type === 'register') {
        // Register the user
        const result = await AuthService.register(userData);

        if (!result.success) {
          res.status(400).json(result);
          return;
        }

        logger.info(`New user registered via OTP: ${userData.email}`);
        res.cookie('auth_token', result.token, {
          httpOnly: true,
          secure: config.environment === 'production',
          sameSite: 'lax',
        });

        res.status(200).json({ success: true, user: result.user });
      } else if (type === 'changePassword') {
        // Change password flow
        if (!password || !confirmPassword) {
          res.status(400).json({
            success: false,
            error: 'Password and confirm password are required',
          });
          return;
        }

        if (password !== confirmPassword) {
          res.status(400).json({
            success: false,
            error: 'Password and confirm password do not match',
          });
          return;
        }

        const result = await AuthService.changePassword(userData.email, userData.password);

        if (!result.success) {
          res.status(400).json(result);
          return;
        }

        logger.info(`Password changed via OTP for: ${userData.email}`);
        res.status(200).json({ success: true, message: 'Password changed successfully' });
      } else {
        res.status(400).json({
          success: false,
          error: 'Invalid type specified',
        });
      }
    } catch (error) {
      logger.error('OTP verification and registration error:', error);
      next(error);
    }
  };

  static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body as CreateUserRequest;

      if (!userData.email || !userData.username || !userData.password || !userData.fullName) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: email, username, password, fullName',
        });
        return;
      }

      const result = await AuthService.register(userData);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      logger.info(`New user registered: ${userData.email}`);
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: config.environment === 'production',
        sameSite: 'lax',
      });

      res.status(200).json({ success: true, user: result.user });
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  };

  static linkOAuthAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, provider, providerId } = req.body as {
        email?: string;
        provider?: string;
        providerId?: string;
      };

      if (!email || !provider || !providerId) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: email, provider, providerId',
        });
        return;
      }

      const result = await AuthService.linkOAuthAccount(email, provider, providerId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      logger.info(`OAuth account linked: ${email} with ${provider}`);
      res.status(200).json({ success: true, message: 'OAuth account linked successfully' });
    } catch (error) {
      logger.error('Link OAuth account error:', error);
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData = req.body as EmailLoginRequest;

      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      const result = await AuthService.login(loginData);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      logger.info(`User logged in: ${loginData.email}`);
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: config.environment === 'production',
        sameSite: 'lax',
      });

      res.status(200).json({ success: true, user: result.user });
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  };

  static logout = (_: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: config.environment === 'production',
        sameSite: 'lax',
      });
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  };

  static refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body as { refreshToken?: string };

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required',
        });
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('Token refresh error:', error);
      next(error);
    }
  };

  static getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId: string = req.user!.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const result = await UserService.getUserById(userId);

      if (!result) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('Get current user error:', error);
      next(error);
    }
  };

  static googleOAuth = (_: Request, res: Response, next: NextFunction) => {
    try {
      const result = OAuthService.genGoogleOAuthUrl();

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      logger.info('Redirecting to Google OAuth URL');
      res.redirect(result.redirectUrl);
    } catch (error) {
      logger.error('Google OAuth URL generation error:', error);
      next(error);
    }
  };

  static googleOAuthCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { code } = req.query as { code?: string };

      if (!code) {
        res.status(400).json({
          success: false,
          error: 'Authorization code is required',
        });
        return;
      }

      const result = await OAuthService.googleOAuthCallback(code);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: config.environment === 'production',
        sameSite: 'lax',
      });

      const frontendUrl = 'http://localhost:5173';
      res.redirect(`${frontendUrl}/profile?tab=workouts`);
    } catch (error) {
      logger.error('Google OAuth callback error:', error);
      next(error);
    }
  };

  static appleOAuth = (_: Request, res: Response, next: NextFunction) => {
    try {
      const result = OAuthService.genAppleOAuthUrl();

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      logger.info('Redirecting to Apple OAuth URL');
      res.redirect(result.redirectUrl);
    } catch (error) {
      logger.error('Apple OAuth URL generation error:', error);
      next(error);
    }
  };

  static appleOAuthCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { code, user: userApple } = req.body as {
        code?: string;
        user?: {
          name?: {
            firstName?: string;
            lastName?: string;
          };
          email?: string;
        };
      };

      if (!code) {
        res.status(400).json({
          success: false,
          error: 'Authorization code is required',
        });
        return;
      }

      const tokens = await OAuthService.exchangeAppleCodeForToken(code);

      if (!tokens?.id_token) {
        res.status(400).json({
          success: false,
          error: 'Failed to obtain ID token from Apple',
        });
        return;
      }

      const appleUser = await OAuthService.verifyAppleIdToken(tokens.id_token);

      if (!appleUser || !appleUser.sub) {
        res.status(400).json({
          success: false,
          error: 'Invalid Apple ID token',
        });
        return;
      }

      const result = await OAuthService.appleOAuthCallback(
        appleUser,
        userApple ? JSON.stringify(userApple) : undefined
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: config.environment === 'production',
        sameSite: 'lax',
      });

      const frontendUrl = 'http://localhost:5173';
      res.redirect(`${frontendUrl}/profile?tab=workouts`);
    } catch (error) {
      logger.error('Apple OAuth callback error:', error);
      next(error);
    }
  };

  static setPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user!.userId;
      const { password, confirmPassword } = req.body as {
        password?: string;
        confirmPassword?: string;
      };

      if (!password || !confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'Password and confirm password are required',
        });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'Password and confirm password do not match',
        });
        return;
      }

      const result = await AuthService.setPassword(userId, password);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      logger.info(`Password set for user ID: ${userId}`);
      res.status(200).json({ success: true, message: 'Password set successfully' });
    } catch (error) {
      logger.error('Set password error:', error);
      next(error);
    }
  };
}
