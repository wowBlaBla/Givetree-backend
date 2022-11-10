import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailBody {
  @ApiProperty()
  token: string;
}
