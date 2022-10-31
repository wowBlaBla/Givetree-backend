import { Entity, Property, Enum } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";

enum networks {
    Ethereum = "Ethereum",
    Polygon = "Polygon",
    Celo = "Celo",
    Arbitrum = "Arbitrum",
    Optimism = "Optimism"
};

@Entity({ tableName: "sales"})
export class Sales  extends BaseEntity{
    
    @Property({ nullable: false })
    collection: string;
    
    @Property({ nullable: false })
    tokenId: string;

    @Property({ nullable: false })
    seller: string;

    @Enum({ items: () => networks })
    network: networks;
}