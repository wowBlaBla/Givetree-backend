import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { User } from "./user.entity";

enum SignTypes {
    SIGNIN = "signin",
    REGISTER = "register",
    SWITCH = "switch",
}

@Entity({ tableName: "nonces" })
export class Nonces extends BaseEntity {

    @Property({ nullable: false })
    walletAddress: string;

    @Property({ nullable: false })
    nonce: string;

    @Enum({ items: () => SignTypes })
    signType: SignTypes

    @ManyToOne(() => User, { joinColumn: "signer_id", onDelete: "CASCADE", nullable: true })
    signer: User; 
}