import { ApiProperty } from "@nestjs/swagger";

export class CheckWalletResponse {
  @ApiProperty()
  nonce: number | undefined;
}
