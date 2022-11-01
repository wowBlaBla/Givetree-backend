import { Field, Int, ObjectType } from "@nestjs/graphql";
import { CreateCharityDto } from "src/charity/dto/create-charity.dto";
import { AccountType } from "src/database/entities/user.entity";
import { CreateSocialDto } from "src/socials/dto/create-social.dto";

@ObjectType("User")
export class UserObject {
  @Field(() => Int)
  readonly id: number;

  @Field({ nullable: true })
  readonly email: string;

  @Field({ nullable: true })
  readonly userName: string;

  // @Field(() => AccountType)
  // readonly type: AccountType;

  @Field(() => String)
  readonly type: string;

  @Field({ nullable: true })
  readonly bio: string;

  @Field({ nullable: true })
  readonly profileImage: string;

  @Field({ nullable: true })
  readonly banner: string;

  // @Field()
  // readonly charityProperty: CreateCharityDto;

  // @Field()
  // readonly walletAddress: string;

  // @Field()
  // readonly socials: CreateSocialDto[];
}
