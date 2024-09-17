import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

export enum Role {
  User = 1,
  Admin = 2,
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: number[]) => {
  return applyDecorators(SetMetadata('roles', roles), ApiSecurity('token'));
};
