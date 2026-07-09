import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

export const AUTH_COOKIE_NAME = 'token';

export function getAuthCookieOptions(configService: ConfigService): CookieOptions {
  const secure = configService.get<string | boolean>('COOKIE_SECURE');
  const sameSite = configService.get<string>('COOKIE_SAMESITE') ?? 'lax';

  return {
    httpOnly: true,
    secure: secure === true || secure === 'true',
    sameSite: sameSite as CookieOptions['sameSite'],
    path: '/',
    maxAge: 1000 * 60 * 60 * 24, // 1 day, matching JWT expiry
  };
}
