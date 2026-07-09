import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser | false,
    info: Error | string | undefined,
  ): TUser {
    if (err || !user) {
      const message =
        info instanceof Error
          ? info.message
          : typeof info === 'string'
            ? info
            : 'Unauthorized';
      throw new UnauthorizedException(message);
    }

    return user;
  }
}
