// Nest dependencies
import { Injectable } from '@nestjs/common';

// Other dependencies
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';

// Local files
import { configService } from './config.service';

@Injectable()
export class HashService {
  public async passwordUser(password: string) {
    const rounds = 10;

    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(password, salt);
  }

  public async hashForgotCode(id: number, phone_number: string) {
    const env = configService.getEnv('CODE_FORGOT_PASSWORD');
    const vietnamCurrentTime = dayjs().unix();
    const textRaw: string = id + phone_number + vietnamCurrentTime + env;
    const hash = crypto.createHash('md5').update(textRaw).digest('hex');

    return hash;
  }
}

export const hashService = new HashService();
