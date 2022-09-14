import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { User } from "./user.entity";

@Entity({ tableName: "posts" })
export class Post extends BaseEntity {
  @Property()
  title: string;

  @Property()
  body: string;

  @ManyToOne(() => User, { joinColumn: "author_id", onDelete: "CASCADE" })
  author: User;
}
