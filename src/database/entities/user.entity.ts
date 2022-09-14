import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { RefreshToken } from "./refresh-token.entity";
import { BaseEntity } from "./base-entity.entity";
import { Post } from "./post.entity";
import { WalletAddress } from "./wallet-address.entity";

@Entity({ tableName: "users" })
export class User extends BaseEntity {
  @Property({ nullable: true })
  email: string;

  @Property({ nullable: true })
  password: string;

  @Property({ nullable: true })
  firstName: string;

  @Property({ nullable: true })
  lastName: string;

  @OneToMany(() => Post, (post) => post.author, { cascade: [Cascade.REMOVE] })
  posts = new Collection<Post>(this);

  @OneToMany(() => WalletAddress, (walletAddress) => walletAddress.user, {
    cascade: [Cascade.REMOVE],
  })
  walletAddresses = new Collection<WalletAddress>(this);

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: [Cascade.REMOVE],
  })
  refreshTokens = new Collection<RefreshToken>(this);
}
