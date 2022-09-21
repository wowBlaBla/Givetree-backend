import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { AccountType, User } from "../../database/entities/user.entity";

@Exclude()
export class UserDto {
  constructor(
    partial: Pick<
      User,
      | "id"
      | "email"
      | "userName"
      | "type"
      | "bio"
      | "profileImage"
      | "bannerImage"
    >,
  ) {
    Object.assign(this, partial);
  }

  @Expose()
  @ApiProperty()
  readonly id: string;

  @Expose()
  @ApiProperty()
  readonly email: string;

  @Expose()
  @ApiProperty()
  readonly userName: string;

  @Expose()
  @ApiProperty()
  readonly type: AccountType;

  @Expose()
  @ApiProperty()
  readonly bio: string;

  @Expose()
  @ApiProperty()
  readonly profileImage: string;

  @Expose()
  @ApiProperty()
  readonly bannerImage: string;
}
