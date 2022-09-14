import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RegisterUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
