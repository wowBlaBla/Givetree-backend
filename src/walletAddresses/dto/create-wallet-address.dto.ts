import { ApiProperty } from "@nestjs/swagger";

export class CreateWalletAddressDto {
  @ApiProperty()
  readonly address: string;
}
