import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserWithEmailBody {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class RegisterUserWithWalletBody {
  @ApiProperty()
  address: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  nonce: string;
}
