// Nest dependencies
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

// Local files
import { UserRepository } from '@repositories/user.repository';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { configService } from '../services/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const url = request.originalUrl;
    const whiteList = [
      '/api/admin/auth/sigin',
      '/api/position',
      '/api/enterprise/sigin',
      '/api/enterprise/forgot/password',
      '/api/enterprise/register',
      '/api/enterprise/forgot/password/verify',
      '/api/addresss/ward',
      '/api/addresss/district',
      '/api/addresss/province',
      '/api/enterprise/candidate',
      '/api/professional-field',
      '/api/year-of-experience',
      '/api/job-type',
      '/api/salary-range',
      '/api/age-group',
      '/api/admin/auth/register',
      'api/admin/auth/forgot/password',
      'api/df-bank',
      '/api/mini-app/auth/hro/register',
      '/api/mini-app/auth/sign-in',
      '/api/mini-app/auth/candidate/register',
      '/api/df-career',
      '/api/job/view',
      '/api/df-degree',
      '/api/mini-app/recruitment/detail',
      '/api/mini-app/recruitment/list-all',
      '/api/position/professionals',
      '/api/mini-app/candidate-interest/create-group',
      '/api/home/news/banner',
      '/api/admin/banner',
      '/api/mini-app/auth/login-by-qr',
      '/api/candidate/login-by-qr',
      '/api/candidate/sign-in',
      '/api/candidate/register',
      '/api/candidate/recruitment/list-all',
      '/api/candidate/recruitment/detail',
      '/api/collaborator/register',
      '/api/mini-app/auth/collaborator/register',
    ];
    let check = false;
    const matchWhiteList = whiteList.find((value) => url.includes(value));
    const token = this.extractTokenFromHeader(request);
    if (!token && matchWhiteList) return true;
    if (!token) {
      throw new UnauthorizedException('Vui lòng đăng nhập để xác thực');
    }
    try {
      const foundUser = await this.userRepository.findOne({
        where: {
          token,
        },
      });
      if (foundUser) {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: configService.getEnv('JWT_SECRET'),
        });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } else {
        check = true;
      }
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Vui lòng đăng nhập để xác thực');
    }
    if (check) {
      throw new HttpException(
        'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!',
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const token = request.headers.token;
    return token || undefined;
  }
}
