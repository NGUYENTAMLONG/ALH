// Other dependencies
import * as dayjs from 'dayjs';
import * as env from 'dotenv';
import { diskStorage } from 'multer';
import * as path from 'path';
// Local dependencies

env.config();

type dataTypeSaveFile = 'jd' | 'image' | 'files';

export class ConfigService {
  public getTimestampDayjs(): number {
    return dayjs().unix();
  }

  public getEnv(key: string): any {
    return process.env[key];
  }

  public isProduction(): boolean {
    return this.getEnv('NODE_ENV') === 'product';
  }

  public getPortApplication(): any {
    return this.getEnv('PORT') || 3088;
  }

  public getJwtConfig(): any {
    return {
      global: true,
      secret: this.getEnv('JWT_SECRET'),
      // signOptions: { expiresIn: '60s' },
    };
  }

  public getSavFile(type: dataTypeSaveFile) {
    const options: any = {
      destination: null,
      filename: (req: any, file: Express.Multer.File, cb: any) => {
        //const nameFile = this.getTimestampDayjs() + '' + file.originalname;
        const nameFile =
          this.getTimestampDayjs() +
          '' +
          Math.floor(Math.random() * 100000000) +
          path.extname(file.originalname);
        console.log('sssss', nameFile);
        console.log('files', file);

        cb(null, nameFile);
      },
    };

    if (type === 'jd') {
      options.destination = 'public/jd';
    }

    if (type === 'image') {
      options.destination = 'public/images';
    }

    if (type === 'files') {
      options.destination = 'public/files';
    }

    return {
      storage: diskStorage(options),
    };
  }
}

export const configService = new ConfigService();
