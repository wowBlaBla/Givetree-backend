import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "src/database/entities/user.entity";

export class UpdateProfileDto {
  @ApiProperty()
  readonly email?: string;

  @ApiProperty()
  readonly userName?: string;

  @ApiProperty()
  readonly type?: AccountType;

  @ApiProperty()
  readonly bio?: string;

  profileImage?: string;

  bannerImage?: string;
}
