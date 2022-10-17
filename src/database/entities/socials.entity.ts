import {
    Entity,
    ManyToOne,
    Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { User } from "./user.entity";

@Entity({ tableName: "socials" })
export class Socials extends BaseEntity {
    
    @Property({ nullable: false })
    social: string;

    @Property({ nullable: false })
    link: string;

    @ManyToOne(() => User, { joinColumn: "user_id", onDelete: "CASCADE" })
    user: User;
}