// Other dependencies
import * as env from 'dotenv';
import { ConfigService } from './config.service';
env.config();

export class ConfigBull extends ConfigService {
  public getBullConfig(): any {
    return {
      redis: {
        host: this.getEnv('REDIS_HOST') || 'localhost',
        port: this.getEnv('REDIS_PORT') || 6379,
        password: this.getEnv('REDIS_PASSWORD') || '',
      },
      prefix: this.getEnv('REDIS_PREFIX') || 'local-bull-alehub',
    };
  }
}

export const configBull = new ConfigBull();
