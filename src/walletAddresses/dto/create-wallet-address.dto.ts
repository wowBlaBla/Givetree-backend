import { ApiProperty } from "@nestjs/swagger";

export class CreateWalletAddressDto {
  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly network?: string;

  @ApiProperty()
  readonly type?: string;
}
