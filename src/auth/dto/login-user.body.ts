import { ApiProperty } from "@nestjs/swagger";

export class LoginUserWithEmailBody {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginUserWithWalletBody {
  @ApiProperty()
  address: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  nonce: string;

  @ApiProperty()
  signature: string;
}
