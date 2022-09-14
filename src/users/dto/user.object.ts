import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("User")
export class UserObject {
  @Field(() => Int)
  readonly id: number;

  @Field({ nullable: true })
  readonly email: string;

  @Field({ nullable: true })
  readonly firstName: string;

  @Field({ nullable: true })
  readonly lastName: string;
}
