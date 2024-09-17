// Nest dependencies
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

// Other dependencies
import * as jwt from 'jsonwebtoken';

// Local files
import { configService } from './config.service';

export class JwtManipulationService {
  public decodeJwtToken(token: string, property: string): any {
    let result;
    try {
      if (!token) throw new Error();
      let decodedJwtData: any;
      try {
        decodedJwtData = jwt.verify(token, configService.getEnv('JWT_SECRET'));
      } catch (error) {
        throw new BadRequestException('Token signature is not valid');
      }

      if (property === 'all') result = decodedJwtData;
      else result = decodedJwtData[property];
    } catch {
      throw new UnauthorizedException(
        'Vui lòng đăng nhập tài khoản doanh nghiệp vào hệ thống',
      );
    }

    return result;
  }
}

const jwtManipulationService = new JwtManipulationService();

export { jwtManipulationService };
