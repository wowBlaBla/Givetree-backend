import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Sales")
export class SalesObject {
    
    @Field(() => Int)
    readonly id: number;

    @Field()
    readonly collection: string;

    @Field(() => Int)
    readonly tokenId: string;

    @Field()
    readonly seller: string;

    @Field()
    readonly createdAt: Date;

    @Field()
    readonly updatedAt: Date;
}