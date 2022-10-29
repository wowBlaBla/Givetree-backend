import { Migration } from "@mikro-orm/migrations";

export class Migration20220920122207 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `users` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `email` varchar(255) null, `password` varchar(255) null, `title` varchar(255) null, `user_name` varchar(255) null, `type` enum('standard', 'charity') not null default 'standard', `bio` text null, `location` varchar(255) null, `tax` boolean not null default 0, `profile_image` varchar(255) null, `banner` varchar(255) null, `visibility` enum('private', 'public') not null default 'private') default character set utf8mb4 engine = InnoDB;",
    );
    
    this.addSql(
      "create table `wallet_addresses` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `address` varchar(255) not null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;",
    );

    this.addSql(
      "create table `refresh_tokens` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `user_id` int(11) unsigned not null, `is_revoked` json not null, `expires` datetime not null) default character set utf8mb4 engine = InnoDB;",
    );

    this.addSql(
      "create table `posts` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `title` varchar(255) not null, `body` varchar(255) not null, `author_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;",
    );

    this.addSql(
      "create table `charity_property` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `founded_at` datetime, `employee` int(255) unsigned default 0, `founders` text(2000), `phone` varchar(255), `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;"
    );

    // this.addSql(
    //   "create table `socials` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `social` varchar(255) not null, `link` text(2000) not null, `user_id` int(11) unsigned, `collection_id` int(11) unsigned, `item_type` enum('user', 'collection') not null) default character set utf8mb4 engine = InnoDB;"
    // );

    this.addSql(
      "create table `collections` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `address` varchar(255), `name` varchar(255), `pattern` varchar(255), `description` text(4000), `theme` enum('padded', 'contained', 'covered') not null default 'contained', `logo` text(2000), `featured` text(2000), `banner` text(2000), category enum('art','collectible','music','photography','sport','trading','utility')) default character set utf8mb4 engine = InnoDB;" 
    );

    this.addSql(
      "create table `sales` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `collection` varchar(255) not null, `token_id` int unsigned not null, `seller` varchar(255) not null) default character set utf8mb4 engine = InnoDB;"
    );
  }
}
