import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public name: string;

  @ApiProperty({
    description:
      'Must contain at least 12 characters, 1 upercase, 1 lowercase, 1 number and 1 special character',
  })
  public password: string;
  public password_confirmation: string;
}
