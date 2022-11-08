import { Migration } from '@mikro-orm/migrations';

export class Migration20221108093546 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `users` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `email` varchar(255) null, `password` varchar(255) null, `title` varchar(255) null, `user_name` varchar(255) null, `type` enum(\'standard\', \'charity\') not null default \'standard\', `visibility` enum(\'private\', \'public\') not null default \'private\', `bio` text null, `location` varchar(255) null, `tax` tinyint(1) not null default true, `profile_image` varchar(255) null, `banner` varchar(255) null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `wallet_addresses` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `address` varchar(255) not null, `network` varchar(255) not null, `type` varchar(255) not null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `wallet_addresses` add index `wallet_addresses_user_id_index`(`user_id`);');

    this.addSql('create table `sales` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `collection` varchar(255) not null, `token_id` varchar(255) not null, `seller` varchar(255) not null, `network` enum(\'Ethereum\', \'Polygon\', \'Celo\', \'Arbitrum\', \'Optimism\') not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `refresh_tokens` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `user_id` int(11) unsigned not null, `is_revoked` tinyint(1) not null default false, `expires` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `refresh_tokens` add index `refresh_tokens_user_id_index`(`user_id`);');

    this.addSql('create table `posts` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `title` varchar(255) not null, `body` varchar(255) not null, `author_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `posts` add index `posts_author_id_index`(`author_id`);');

    this.addSql('create table `donations` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `from_id` int(11) unsigned not null, `to_id` int(11) unsigned not null, `crypto` enum(\'ETH\', \'BTC\', \'MATIC\') not null, `crypto_amount` varchar(255) not null, `fiat` enum(\'AUD\', \'USD\', \'GBP\', \'JPY\') not null, `fiat_amount` varchar(255) not null, `wallet_address` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `donations` add index `donations_from_id_index`(`from_id`);');
    this.addSql('alter table `donations` add index `donations_to_id_index`(`to_id`);');

    this.addSql('create table `collections` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `address` varchar(255) not null, `name` varchar(255) not null, `pattern` varchar(255) not null, `description` varchar(255) not null, `logo` varchar(255) not null, `featured` varchar(255) not null, `banner` varchar(255) not null, `theme` enum(\'padded\', \'contained\', \'covered\') not null default \'contained\', `category` enum(\'art\', \'COLLECTIBLE\') not null, `network` enum(\'ethereum\', \'polygon\', \'celo\', \'arbitrum\', \'optimism\') not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `collections` add unique `collections_pattern_unique`(`pattern`);');

    this.addSql('create table `socials` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `social` varchar(255) not null, `link` varchar(255) not null, `item_type` enum(\'user\', \'collection\') not null, `user_id` int(11) unsigned null, `collection_id` int(11) unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `socials` add index `socials_user_id_index`(`user_id`);');
    this.addSql('alter table `socials` add index `socials_collection_id_index`(`collection_id`);');

    this.addSql('create table `charity_property` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `founded_at` datetime null, `employee` int(11) not null default 0, `founders` varchar(255) null, `business_number` varchar(255) null, `causes` varchar(255) null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `charity_property` add index `charity_property_user_id_index`(`user_id`);');
    this.addSql('alter table `charity_property` add unique `charity_property_user_id_unique`(`user_id`);');

    this.addSql('alter table `wallet_addresses` add constraint `wallet_addresses_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `refresh_tokens` add constraint `refresh_tokens_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `posts` add constraint `posts_author_id_foreign` foreign key (`author_id`) references `users` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `donations` add constraint `donations_from_id_foreign` foreign key (`from_id`) references `users` (`id`) on update cascade on delete CASCADE;');
    this.addSql('alter table `donations` add constraint `donations_to_id_foreign` foreign key (`to_id`) references `users` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `socials` add constraint `socials_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;');
    this.addSql('alter table `socials` add constraint `socials_collection_id_foreign` foreign key (`collection_id`) references `collections` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `charity_property` add constraint `charity_property_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
  }

}
