import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Charity")
export class CharityObject {
    
    @Field(() => Int)
    readonly user_id: number;
  
    @Field(() => Int)
    readonly id: number;

    @Field()
    readonly foundedAt: Date
    
    @Field()
    readonly employee: number;

    @Field()
    readonly founders: string;

    @Field()
    readonly phone: string;

    @Field()
    readonly createdAt: Date;
  
    @Field()
    readonly updatedAt: Date;

}