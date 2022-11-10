import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";

@Entity({ tableName: "nonce" })
export class Nonce extends BaseEntity {
  @Property({ nullable: false })
  publicAddress: string;

  @Property({ nullable: false })
  nonce: string;
}
