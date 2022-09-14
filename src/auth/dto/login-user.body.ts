import { ApiProperty } from "@nestjs/swagger";

export class LoginUserBody {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
