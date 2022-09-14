import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserBody {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
