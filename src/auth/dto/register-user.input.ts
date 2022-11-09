import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RegisterUserWithEmailInput {
  @Field()
  email: string;

  @Field()
  userName: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterUserWithWalletInput {
  @Field()
  address: string;

  @Field()
  userName: string;

  @Field()
  network: string;

  @Field()
  nonce: string;

  @Field()
  signature: string;
}
