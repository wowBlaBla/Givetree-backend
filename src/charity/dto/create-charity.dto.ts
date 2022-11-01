import { ApiProperty } from "@nestjs/swagger";

export class CreateCharityDto {
  @ApiProperty()
  foundedAt?: Date;

  @ApiProperty()
  employee?: number;

  @ApiProperty()
  founders?: string;

  @ApiProperty()
  businessNumber?: string;

  @ApiProperty()
  causes?: string[];
}
