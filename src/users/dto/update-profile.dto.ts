import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiProperty()
  readonly email?: string;

  @ApiProperty()
  readonly firstName?: string;

  @ApiProperty()
  readonly lastName?: string;
}
