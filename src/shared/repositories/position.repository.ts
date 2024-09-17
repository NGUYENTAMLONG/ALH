// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { Position } from '@models/position.model';
import { Op, Transaction } from 'sequelize';
import { BaseRepository } from './base.repository';

@Injectable()
export class PositionRepository extends BaseRepository<Position> {
  constructor() {
    super(Position);
  }

  async getPosition(
    position: string,
    transaction?: Transaction,
  ): Promise<Position> {
    let createPosition = null;
    const [instance, created] = await this.findOrCreate({
      where: {
        name: {
          [Op.like]: `%${position}%`,
        },
      },
      defaults: {
        name: position,
      },
      transaction,
    });

    if (!created) {
      createPosition = instance;
    } else {
      createPosition = created;
    }

    return createPosition;
  }
}
