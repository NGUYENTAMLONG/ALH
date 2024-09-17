// Nest dependencies
import { Injectable } from '@nestjs/common';

// Other dependencies
import {
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  FindOrCreateOptions,
  QueryOptions,
  UpdateOptions,
} from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

@Injectable()
export abstract class BaseRepository<T extends Model> {
  constructor(protected model: ModelCtor<T>) {}

  async query(query: string, options?: QueryOptions): Promise<any> {
    return await this.model.sequelize?.query(query, options);
  }

  async count(options?: CountOptions<any>): Promise<number> {
    return await this.model.count(options);
  }

  public async bulkCreate(
    records: any,
    options?: CreateOptions<any>,
  ): Promise<T[]> {
    return await this.model.bulkCreate(records, options);
  }

  async findOrCreate(
    options: FindOrCreateOptions<any>,
  ): Promise<any | undefined> {
    return await this.model.findOrCreate(options);
  }

  async findOne(options: FindOptions<any>): Promise<T | null> {
    return await this.model.findOne(options);
  }

  async findAll(options?: FindOptions<any>): Promise<T[] | null> {
    return await this.model.findAll(options);
  }

  async findByPk(id: any): Promise<T | null> {
    return await this.model.findByPk(id);
  }

  async findAndCountAll(
    options?: FindAndCountOptions<any>,
  ): Promise<any | null> {
    return await this.model.findAndCountAll(options);
  }

  async create(
    properties: any,
    options?: CreateOptions<any>,
  ): Promise<T | undefined> {
    return await this.model.create(properties, options);
  }

  async update(
    properties: any,
    options: UpdateOptions<any>,
  ): Promise<any | null> {
    return await this.model.update(properties, options);
  }

  async destroy(options: DestroyOptions<any>): Promise<any | null> {
    return await this.model.destroy(options);
  }
}
