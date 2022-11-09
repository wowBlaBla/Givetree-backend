import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Nonce")
export class NonceObject {
    
    @Field(() => Int)
    id: number;

    @Field()
    walletAddress: string;
    
    @Field()
    signType: string;

    @Field()
    nonce: string;

    @Field()
    signature: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}