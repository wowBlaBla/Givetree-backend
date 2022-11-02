import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { User } from "./user.entity";

@Entity({ tableName: "wallet_addresses" })
export class WalletAddress extends BaseEntity {
  @Property()
  address: string;

  @Property()
  network: string;

  @Property()
  type: string;

  @ManyToOne(() => User, { joinColumn: "user_id", onDelete: "CASCADE" })
  user: User;
}
