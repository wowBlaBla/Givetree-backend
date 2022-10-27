import { Migration } from '@mikro-orm/migrations';

export class Migration20221027165407 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` change `banner_image` `title` varchar(255) null;');


    this.addSql('alter table `users` add `visibility` enum(\'private\', \'public\') not null default \'private\', add `location` varchar(255) null, add `tax` tinyint(1) not null, add `banner` varchar(255) null;');

    this.addSql('alter table `refresh_tokens` modify `is_revoked` json;');

    this.addSql('create table `collections` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `address` varchar(255) not null, `name` varchar(255) not null, `pattern` varchar(255) not null, `description` varchar(255) not null, `network` varchar(255) not null, `logo` varchar(255) not null, `featured` varchar(255) not null, `banner` varchar(255) not null, `theme` enum(\'padded\', \'contained\', \'covered\') not null default \'contained\', `category` enum(\'art\', \'COLLECTIBLE\') not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `socials` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `social` varchar(255) not null, `link` varchar(255) not null, `item_type` enum(\'user\', \'collection\') not null, `user_id` int(11) unsigned not null, `collection_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `socials` add index `socials_user_id_index`(`user_id`);');
    this.addSql('alter table `socials` add index `socials_collection_id_index`(`collection_id`);');

    this.addSql('create table `charity_property` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `founded_at` datetime null, `employee` int(11) not null, `founders` varchar(255) null, `phone` varchar(255) null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `charity_property` add index `charity_property_user_id_index`(`user_id`);');

    this.addSql('alter table `socials` add constraint `socials_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;');
    this.addSql('alter table `socials` add constraint `socials_collection_id_foreign` foreign key (`collection_id`) references `collections` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `charity_property` add constraint `charity_property_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;');
  }

}
