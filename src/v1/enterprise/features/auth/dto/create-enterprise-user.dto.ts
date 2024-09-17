// Nest dependencies
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

const istNotEmptyMessage = (nameField: string) => {
  return `Dữ liệu ${nameField} không được trống hoặc chỉ chứa khoảng trắng`;
};

type LENGTH_TYPE = '100' | '255';

const maxLength = (nameField: string, type?: LENGTH_TYPE) => {
  const message = `Tên ${nameField} vượt quá`;

  if (type === '100') {
    return message + ' 100 ký tự';
  }

  return message + ' 255 ký tự';
};

const messageLengthPassword = {
  message: 'Độ dài mật khẩu từ 6-30 ký tự',
};

export class CreateEnterpriseUserDto {
  @ApiProperty({ required: true, example: 'Công ty cổ phần ABC' })
  @IsNotEmpty({ message: istNotEmptyMessage('enterprise_name') })
  @MaxLength(255, { message: maxLength('enterprise_name') })
  enterprise_name: string;

  @ApiProperty({ required: true, example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: istNotEmptyMessage('full_name') })
  @MaxLength(255, { message: maxLength('full_name') })
  full_name: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  position: string;

  @ApiProperty({ required: true, example: 'nguyenvana@gmail.com' })
  @IsNotEmpty({ message: istNotEmptyMessage('email') })
  @IsEmail({}, { message: 'Vui lòng nhập đúng định dạng email' })
  @MaxLength(100, { message: maxLength('email', '100') })
  email: string;

  @ApiProperty({ required: true, example: '0987654321' })
  @IsNotEmpty({ message: istNotEmptyMessage('phone_number') })
  phone_number: string;

  @ApiProperty({ required: false, example: '0987654322' })
  alternate_phone: string;

  @ApiProperty({ required: true, example: 'abcxyz' })
  @IsNotEmpty({ message: istNotEmptyMessage('password') })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống password',
  })
  // @Matches(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   {
  //     message:
  //       'password không được chứa khoảng trắng ở đầu hoặc cuối và không chứa ký tự đặc biệt',
  //   },
  // )
  @MinLength(6, messageLengthPassword)
  @MaxLength(30, messageLengthPassword)
  password: string;

  @ApiProperty({ required: true, example: 'abcxyz' })
  @IsNotEmpty({ message: istNotEmptyMessage('verify_password') })
  @NotContains(' ', {
    message: 'Vui lòng không bỏ trống verify_password',
  })
  // @Matches(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   {
  //     message:
  //       'verify_password không được chứa khoảng trắng ở đầu hoặc cuối và không chứa ký tự đặc biệt',
  //   },
  // )
  @MinLength(6, messageLengthPassword)
  @MaxLength(30, messageLengthPassword)
  verify_password: string;
}
