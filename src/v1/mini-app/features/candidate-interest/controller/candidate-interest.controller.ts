//Nest dependencies
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
//Local files
import { Roles } from '@decorators/roles.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { jwtManipulationService } from '@services/jwt.manipulation.service';
import { ROLE } from '@utils/constants';
import { CandidateInterestService } from '../service/candidate-interest.service';
import { InterestInforDto } from '../dto/candidate-interest.dto';

@ApiTags('[MINI-APP] Candidate Interest')
@Controller('mini-app/candidate-interest')
export class CandidateInterestController {
  constructor(
    private readonly candidateInterestService: CandidateInterestService,
  ) {}

  @Post('create-group')
  @ApiOperation({
    summary:
      'Ứng viên/cộng tác viên lưu thông tin nghề nghiệp quan tâm, bằng cấp, số năm kinh nghiệm, chức vụ mong muốn, mức lương mong muốn',
  })
  async createInterestInformations(@Body() dto: InterestInforDto) {
    const result =
      await this.candidateInterestService.createInterestInformations(dto);
    return result;
  }

  @ApiSecurity('token')
  @UseGuards(AuthGuard)
  @Roles(ROLE.CANDIDATE, ROLE.COLLABORATOR, ROLE.HRO)
  @Get('my-interest')
  @ApiOperation({
    summary: 'User lấy thông tin quan tâm đã tạo',
  })
  async getCandidateInterest(@Headers('token') token: any) {
    const user_id = jwtManipulationService.decodeJwtToken(token, 'id');
    const result = await this.candidateInterestService.getCandidateInterest(
      user_id,
    );
    return result;
  }
}
