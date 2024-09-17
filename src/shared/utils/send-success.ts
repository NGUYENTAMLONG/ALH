import { HttpStatus } from '@nestjs/common';

interface ParametersSendSuccess {
  status?: number;
  code?: number;
  msg?: string;
  data?: any;
  paging?: any;
  links?: any;
  blocks?: any;
}

export const sendSuccess = (params: ParametersSendSuccess = {}): any => {
  const response: ParametersSendSuccess = {
    status: params.status || 1,
    code: params.code || HttpStatus.OK,
    msg: params.msg || 'Thành công',
    data: params.data || {},
    paging: params.paging,
    links: params.links || {},
    blocks: params.blocks || {},
  };

  return response;
};
