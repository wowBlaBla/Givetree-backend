import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { User } from "./user.entity";

@Entity({ tableName: "refresh_tokens" })
export class RefreshToken extends BaseEntity {
  @ManyToOne(() => User, { onDelete: "CASCADE", joinColumn: "user_id" })
  user: User;

  @Property({ name: "is_revoked", default: false })
  revoked: boolean;

  @Property()
  expires: Date;
}
