import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordBody {
  @ApiProperty()
  token: string;

  @ApiProperty()
  password: string;
}
