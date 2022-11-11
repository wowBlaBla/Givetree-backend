import { ApiProperty } from "@nestjs/swagger";
import { CreateCharityDto } from "src/charity/dto/create-charity.dto";
import { AccountType } from "src/database/entities/user.entity";
import { CreateSocialDto } from "src/socials/dto/create-social.dto";
import { CreateWalletAddressDto } from "src/walletAddresses/dto/create-wallet-address.dto";

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

  @ApiProperty()
  verifyToken?: string;

  @ApiProperty()
  readonly charityProperty?: CreateCharityDto;

  @ApiProperty()
  readonly walletAddress?: CreateWalletAddressDto;

  @ApiProperty()
  readonly socials?: CreateSocialDto[];
}
