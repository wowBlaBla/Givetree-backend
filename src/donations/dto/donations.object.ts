import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Donations")
export class DonationsObject {
    
    @Field(() => Int)
    readonly id: number;

    @Field()
    readonly from: string;

    @Field(() => Int)
    readonly to: string;

    @Field()
    readonly amount: string;

    @Field()
    readonly crypto: string;

    @Field()
    readonly currency: string;

    @Field()
    readonly walletAddress: string;

    @Field()
    readonly createdAt: Date;

    @Field()
    readonly updatedAt: Date;
}