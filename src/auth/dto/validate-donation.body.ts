import { ApiProperty } from "@nestjs/swagger";

export class ValidateDonationWalletBody {

  @ApiProperty()
  address: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  nonce: string;

  @ApiProperty()
  signature: string;
}