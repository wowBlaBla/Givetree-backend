import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginUserWithEmailInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginUserWithWalletInput {
  @Field()
  address: string;

  @Field()
  network: string;
}
