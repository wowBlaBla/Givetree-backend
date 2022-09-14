import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RegisterUserWithEmailInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterUserWithWalletInput {
  @Field()
  address: string;
}
