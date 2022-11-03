import { Entity, Enum, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { User } from "./user.entity";

enum Crypto {
    ETH = "ETH",
    BTC = "BTC",
    MATIC = "MATIC"
}

enum Fiat {
    AUD = "AUD",
    USD = "USD",
    GBP = "GBP",
    JPY = "JPY"
}

@Entity({ tableName: "donations" })
export class Donations extends BaseEntity {

    @ManyToOne(() => User, { joinColumn: "from_id", onDelete: "CASCADE" })
    from: string;

    @ManyToOne(() => User, { joinColumn: "to_id", onDelete: "CASCADE" })
    to: string;

    @Enum({ items: () => Crypto })
    crypto: Crypto

    @Property({ nullable: false })
    cryptoAmount: string;
    
    @Enum({ items: () => Fiat })
    fiat: Fiat;

    @Property({ nullable: false })
    fiatAmount: string;

    @Property({ nullable: false })
    walletAddress: string;

}