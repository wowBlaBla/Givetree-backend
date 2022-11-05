import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { User } from "./user.entity";

@Entity({ tableName: "charity_property" })
export class CharityProperty extends BaseEntity {
  @Property({ nullable: true })
  foundedAt: Date;

  @Property({ default: 0 })
  employee: number;

  @Property({ nullable: true })
  founders: string;

  @Property({ nullable: true })
  businessNumber: string;

  @Property({ nullable: true })
  causes: string;

  @OneToOne(() => User)
  user: User;
}
