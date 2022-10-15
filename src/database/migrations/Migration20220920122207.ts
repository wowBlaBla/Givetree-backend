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
      "alter table `wallet_addresses` add unique `wallet_addresses_address_unique`(`address`);",
    );
    this.addSql(
      "alter table `wallet_addresses` add index `wallet_addresses_user_id_index`(`user_id`);",
    );

    this.addSql(
      "create table `refresh_tokens` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `user_id` int(11) unsigned not null, `is_revoked` json not null, `expires` datetime not null) default character set utf8mb4 engine = InnoDB;",
    );
    this.addSql(
      "alter table `refresh_tokens` add index `refresh_tokens_user_id_index`(`user_id`);",
    );

    this.addSql(
      "create table `posts` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `title` varchar(255) not null, `body` varchar(255) not null, `author_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;",
    );
    this.addSql(
      "alter table `posts` add index `posts_author_id_index`(`author_id`);",
    );

    this.addSql(
      "create table `charity_profile` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `founded_at` datetime not null, `employee` int(255) unsigned not null default 0, `founders` text(2000) not null, `phone` varchar(255) not null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;"
    );
    this.addSql(
      "alter table charity_profile add index `charity_profile_user_id_index`(`user_id`);"
    );

    this.addSql(
      "create table `socials` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `key` varchar(255) not null, `link` text(2000) not null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;"
    );
    this.addSql(
      "alter table `socials` add index `socials_user_id_index`(`user_id`)"
    );

    this.addSql(
      "alter table `wallet_addresses` add constraint `wallet_addresses_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    this.addSql(
      "alter table `refresh_tokens` add constraint `refresh_tokens_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    this.addSql(
      "alter table `posts` add constraint `posts_author_id_foreign` foreign key (`author_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    this.addSql(
      "alter table `charity_profile` add constraint `charity_profile_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    this.addSql(
      "alter table `socials` add constraint `socials_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );
  }
}
