import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CollectionObject {
    @Field(() => Int)
    readonly id: number;

    @Field()
    readonly address: string;

    @Field()
    readonly name: string;

    @Field()
    readonly pattern: string;

    @Field()
    readonly description: string;

    @Field()
    readonly network: string;

    @Field()
    readonly logo: string;

    @Field()
    readonly featured: string;

    @Field()
    readonly banner: string;
    
    @Field()
    readonly createdAt: Date;

    @Field()
    readonly updatedAt: Date;
}