import { ApiProperty } from "@nestjs/swagger";

export class CheckWalletBody {
  @ApiProperty()
  address: string;
}
