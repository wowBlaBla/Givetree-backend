import {
  Cascade,
  Collection,
  Entity,
  Enum,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./base-entity.entity";
import { Socials } from "./socials.entity";

export enum Theme {
  PADDED = "padded",
  CONTAINED = "contained",
  COVERED = "covered",
}

export enum Category {
  ART = "art",
  COLLECTIBLE = "COLLECTIBLE",
}

export enum networks {
  Ethereum = "ethereum",
  Polygon = "polygon",
  Celo = "celo",
  Arbitrum = "arbitrum",
  Optimism = "optimism",
}

@Entity({ tableName: "collections" })
export class Collections extends BaseEntity {
  @Property()
  address: string;

  @Property()
  name: string;

  @Property({ unique: true })
  pattern: string;

  @Property()
  description: string;

  @Property()
  logo: string;

  @Property()
  featured: string;

  @Property()
  banner: string;

  @Enum({ items: () => Theme, default: Theme.CONTAINED })
  theme: Theme;

  @Enum({ items: () => Category })
  category: Category;

  @Enum({ items: () => networks })
  network: networks;

  @OneToMany(() => Socials, (social) => social.collection, {
    cascade: [Cascade.REMOVE],
  })
  socials = new Collection<Socials>(this);
}
