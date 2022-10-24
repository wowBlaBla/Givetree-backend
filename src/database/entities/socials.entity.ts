import {
    Entity,
    ManyToOne,
    Property,
    Enum,
} from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { Collections } from "./collections.entity";
import { User } from "./user.entity";

export enum Type {
    USER = "user",
    COLLECTION = "collection"
};

@Entity({ tableName: "socials" })
export class Socials extends BaseEntity {
    
    @Property({ nullable: false })
    social: string;

    @Property({ nullable: false })
    link: string;

    @Enum({ items: ()=> Type})
    item_type: Type;
    
    @ManyToOne(() => User, { joinColumn: "user_id", onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Collections, { joinColumn: "collection_id", onDelete: "CASCADE" })
    collection: Collections
}