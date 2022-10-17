import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "src/database/entities/user.entity";

interface Charity {
  foundedDate?: number;
  employee?: number;
  founders?: string;
  businessNumber?: string;
  causes?: string[];
};

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

  banner?: string;

  charityProperty?: Charity; 
}
