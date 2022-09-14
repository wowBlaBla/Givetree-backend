import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Post")
export class WalletAddressObject {
  @Field(() => Int)
  readonly id: number;

  @Field()
  readonly address: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}
