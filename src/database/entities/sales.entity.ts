import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";

@Entity({ tableName: "sales"})
export class Sales  extends BaseEntity{
    
    @Property({ nullable: false })
    collection: string;
    
    @Property({ nullable: false })
    tokenId: string;

    @Property({ nullable: false })
    seller: string;

}