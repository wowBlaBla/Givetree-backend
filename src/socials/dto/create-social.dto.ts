import { ApiProperty } from "@nestjs/swagger";

export class CreateSocialDto {
  @ApiProperty({ required: true })
  readonly social: string;

  @ApiProperty({ required: true })
  readonly link: string;
}
