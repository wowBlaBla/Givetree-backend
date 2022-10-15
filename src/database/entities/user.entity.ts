import {
  Cascade,
  Collection,
  Entity,
  Enum,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { RefreshToken } from "./refresh-token.entity";
import { BaseEntity } from "./base-entity.entity";
import { Post } from "./post.entity";
import { WalletAddress } from "./wallet-address.entity";

export enum AccountType {
  STANDARD = "standard",
  CHARITY = "charity",
}

@Entity({ tableName: "users" })
export class User extends BaseEntity {
  @Property({ nullable: true })
  email: string;

  @Property({ nullable: true })
  password: string;

  @Property({ nullable: true })
  userName: string;

  @Enum({ items: () => AccountType, default: AccountType.STANDARD })
  type: AccountType;

  @Property({ columnType: "text", nullable: true })
  bio: string;

  @Property({ nullable: true })
  profileImage: string;

  @Property({ nullable: true })
  bannerImage: string;

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
