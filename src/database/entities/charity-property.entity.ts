import {
    Entity,
    ManyToOne,
    Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { User } from "./user.entity";

@Entity({ tableName: "charity_property" })
export class CharityProperty extends BaseEntity {
    
    @Property({ nullable: true })
    foundedAt: Date;

    @Property()
    employee: Number;

    @Property({ nullable: true })
    founders: string;
    
    @Property({ nullable: true })
    phone: string;

    @ManyToOne(() => User, { joinColumn: "user_id", onDelete: "CASCADE" })
    user: User;
}