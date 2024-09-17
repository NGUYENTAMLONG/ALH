import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CronService } from './cron.service';

@ApiTags('Cron')
@Controller({
  version: ['1'],
  path: 'crons',
})
@ApiHeader({
  name: 'x-platform',
  description: 'Giá trị web | app',
  required: true,
})
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Get('test')
  @ApiOperation({
    summary: 'Admin Test Cron',
  })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiBearerAuth()
  public testCron() {
    return this.cronService.sendTestNoti();
  }
}
