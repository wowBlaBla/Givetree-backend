import { ApiProperty } from "@nestjs/swagger";

export class ValidateRecaptchaResponse {
  @ApiProperty()
  success: boolean;
  challengeTs: Date;
  hostname: string;
  errorCodes: string[];
}
