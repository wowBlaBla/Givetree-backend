import { ApiProperty } from "@nestjs/swagger";

export class ValidateRecaptchaBody {
  @ApiProperty()
  token: string;
}