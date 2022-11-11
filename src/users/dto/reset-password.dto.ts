import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty()
  readonly currentPassword?: string;

  @ApiProperty()
  readonly newPassword: string;
}
