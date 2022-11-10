import { ApiProperty } from "@nestjs/swagger";

export class CheckWalletBody {

  @ApiProperty()
  address: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  type: string;
}