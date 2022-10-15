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
import { CharityProfile } from "./charity-profile.entity";
import { Socials } from "./socials.entity";

export enum AccountType {
  STANDARD = "standard",
  CHARITY = "charity",
}

export enum VisibilityType {
  PRIVATE = "private",
  PUBLIC = "public",
}

@Entity({ tableName: "users" })
export class User extends BaseEntity {
  @Property({ nullable: true })
  email: string;

  @Property({ nullable: true })
  password: string;

  @Property({ nullable: true })
  title: string;

  @Property({ nullable: true })
  userName: string;

  @Enum({ items: () => AccountType, default: AccountType.STANDARD })
  type: AccountType;

  @Enum({ items: () => VisibilityType, default: VisibilityType.PRIVATE })
  visibility: VisibilityType;

  @Property({ columnType: "text", nullable: true })
  bio: string;

  @Property({ nullable: true })
  location: string;
  
  @Property({ nullable : false })
  tax: boolean;

  @Property({ nullable: true })
  profileImage: string;

  @Property({ nullable: true })
  banner: string;

  @OneToMany(() => Post, (post) => post.author, { cascade: [Cascade.REMOVE] })
  posts = new Collection<Post>(this);

  @OneToMany(() => WalletAddress, (walletAddress) => walletAddress.user, {
    cascade: [Cascade.REMOVE],
  })
  walletAddresses = new Collection<WalletAddress>(this);

  @OneToMany(() => CharityProfile, (charity) => charity.user, {
    cascade: [Cascade.REMOVE]
  })
  charityProperty = new Collection<CharityProfile>(this);

  @OneToMany(() => Socials, (social) => social.user, {
    cascade: [Cascade.REMOVE]
  })
  socials = new Collection<Socials>(this);

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: [Cascade.REMOVE],
  })

  refreshTokens = new Collection<RefreshToken>(this);

}
