import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { OAuthUrlResponse, ServiceAuthResponse, OAuthCallbackResult } from '@/types';
import { prisma } from '@services/database';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';
import { TokenService } from '@services/tokenService';
import { URLSearchParams } from 'url';
import appleSignin, { AppleIdTokenType } from 'apple-signin-auth';

interface AppleTokenResponse {
  access_token: string;
  expires_in?: number;
  id_token?: string;
  refresh_token?: string;
  token_type?: string;
}

async function downloadAndSaveImage(imageUrl: string, userId: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    // Always use .jpg for Google avatars (safe default)
    const ext = 'jpg';
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeUserId}_${uuidv4()}.${ext}`;
    const filePath = path.join(__dirname, '../../uploads/avatars', fileName);
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    // Return the relative path to store in DB
    return `/uploads/avatars/${fileName}`;
  } catch (e) {
    logger.error('Failed to download avatar:', e);
    return null;
  }
}

export class OAuthService {
  static genGoogleOAuthUrl(): OAuthUrlResponse | { success: false; error: string } {
    if (!config.oauth.googleClientId || !config.oauth.googleRedirectUri) {
      return {
        success: false,
        error: 'Google OAuth is not properly configured',
      };
    }

    const params = new URLSearchParams({
      client_id: config.oauth.googleClientId,
      redirect_uri: config.oauth.googleRedirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline', // get refresh token
      prompt: 'consent', // force consent screen (optional)
    });

    return {
      success: true,
      redirectUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    };
  }

  static async googleOAuthCallback(
    code: string
  ): Promise<ServiceAuthResponse | OAuthCallbackResult> {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.oauth.googleClientId!,
        client_secret: config.oauth.googleClientSecret!,
        redirect_uri: config.oauth.googleRedirectUri!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const error = await tokenRes.text();
      logger.error('Google token exchange error:', error);
      return { success: false, error: 'Failed to generate Google OAuth URL' };
    }

    interface GoogleTokenResponse {
      access_token: string;
      expires_in?: number;
      refresh_token?: string;
      scope?: string;
      token_type?: string;
      id_token?: string;
    }
    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    if (!tokens.access_token) {
      logger.error('No access token returned from Google:', tokens);
      return { success: false, error: 'Failed to generate Google OAuth URL' };
    }

    // Fetch Google profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const profile = await profileRes.json();

    // Type guard to ensure profile has an email property
    if (
      typeof profile !== 'object' ||
      profile === null ||
      typeof (profile as { email?: unknown }).email !== 'string'
    ) {
      return { success: false, error: 'Failed to retrieve email from Google profile' };
    }

    // Find user in DB
    let user = await prisma.user.findUnique({
      where: { email: (profile as { email: string }).email },
    });

    if (!user) {
      // Save the profile picture locally
      const tempUserId = (profile as { email: string }).email;
      let avatarUrl: string | null = null;
      if ((profile as { picture?: string }).picture) {
        avatarUrl = await downloadAndSaveImage(
          (profile as { picture: string }).picture,
          tempUserId
        );
      }

      // Create new user
      user = await prisma.user.create({
        data: {
          email: (profile as { email: string }).email,
          username: (profile as { email?: string }).email?.split('@')[0] ?? '',
          fullName: (profile as { name?: string }).name || '',
          avatarUrl: avatarUrl || '',
          passwordHash: '', // No password for OAuth users
          // emailVerified: true,  // consider email verified from OAuth provider
        },
      });
    }

    if (!user) {
      return { success: false, error: 'User not found in database' };
    }

    // Create app session JWT
    const token = TokenService.generateToken(user.id, user.email);

    return { success: true, token, user: user };
  }

  static genAppleOAuthUrl(): OAuthUrlResponse | { success: false; error: string } {
    if (!config.oauth.appleClientId || !config.oauth.appleRedirectUri) {
      return {
        success: false,
        error: 'Apple OAuth is not properly configured',
      };
    }

    // save the state in redis or jwt --> prevents csrf attacks
    const state = crypto.randomUUID();

    const params = new URLSearchParams({
      client_id: config.oauth.appleClientId,
      redirect_uri: config.oauth.appleRedirectUri,
      response_type: 'code',
      response_mode: 'form_post',
      scope: 'name email',
      state,
    });

    return {
      success: true,
      redirectUrl: `https://appleid.apple.com/auth/authorize?${params.toString()}`,
    };
  }

  static genAppleClientSecret(): string {
    if (
      !config.oauth.appleClientId ||
      !config.oauth.appleTeamId ||
      !config.oauth.appleKeyId ||
      !config.oauth.applePrivateKey ||
      !config.oauth.appleRedirectUri
    ) {
      throw new Error('Apple OAuth is not properly configured');
    }
    const privateKey = config.oauth.applePrivateKey.replace(/\\n/g, '\n');

    const clientSecret = appleSignin.getClientSecret({
      clientID: config.oauth.appleClientId,
      teamID: config.oauth.appleTeamId,
      keyIdentifier: config.oauth.appleKeyId,
      privateKey: privateKey,
      expAfter: 604800, // 7 days
    });

    return clientSecret;
  }

  static async exchangeAppleCodeForToken(code: string): Promise<AppleTokenResponse> {
    if (!config.oauth.appleClientId || !config.oauth.appleRedirectUri) {
      throw new Error('Apple OAuth is not properly configured');
    }

    const clientSecret = this.genAppleClientSecret();

    const params = new URLSearchParams({
      client_id: config.oauth.appleClientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.oauth.appleRedirectUri,
    });

    const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenRes.ok) {
      const error = await tokenRes.text();
      logger.error('Apple token exchange error:', error);
      throw new Error('Failed to exchange code for Apple token');
    }

    const tokens = (await tokenRes.json()) as AppleTokenResponse;

    if (!tokens.id_token) {
      logger.error('No ID token returned from Apple:', tokens);
      throw new Error('Failed to exchange code for Apple token');
    }

    return tokens;
  }

  static async verifyAppleIdToken(idToken: string): Promise<AppleIdTokenType> {
    const user = await appleSignin.verifyIdToken(idToken, {
      audience: config.oauth.appleClientId!,
    });

    if (!user || !user.sub) {
      throw new Error('Invalid Apple ID token');
    }

    return user;
  }

  static async appleOAuthCallback(
    appleUser: AppleIdTokenType,
    userApple?: string
  ): Promise<ServiceAuthResponse | OAuthCallbackResult> {
    // Find user in DB
    let user = await prisma.user.findUnique({
      where: { email: appleUser.email },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: appleUser.email,
          username: appleUser.email?.split('@')[0] ?? '',
          fullName: (() => {
            if (!userApple) return '';
            try {
              const parsed = JSON.parse(userApple) as {
                name?: { firstName?: string; lastName?: string };
              };
              if (parsed.name && parsed.name.firstName && parsed.name.lastName) {
                return parsed.name.firstName + ' ' + parsed.name.lastName;
              }
              return '';
            } catch {
              return '';
            }
          })(),
          passwordHash: '', // No password for OAuth users
        },
      });
    }

    if (!user) {
      return { success: false, error: 'User not found in database' };
    }

    // Create app session JWT
    const token = TokenService.generateToken(user.id, user.email);

    return { success: true, token, user: user };
  }
}
