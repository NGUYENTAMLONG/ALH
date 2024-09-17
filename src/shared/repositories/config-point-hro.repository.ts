// Nest dependencies
import { Injectable } from '@nestjs/common';
// Local dependencies
import { ConfigPointHro } from '@models/config-point-hro.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class ConfigPointHroRepository extends BaseRepository<ConfigPointHro> {
  constructor() {
    super(ConfigPointHro);
  }
}
