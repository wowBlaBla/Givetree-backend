import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Socials")
export class SocialsObject {
  @Field(() => Int)
  readonly userId: number;

  @Field(() => Int)
  readonly id: number;

  @Field()
  readonly social: string;

  @Field()
  readonly link: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}
