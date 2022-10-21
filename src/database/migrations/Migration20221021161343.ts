import { Migration } from '@mikro-orm/migrations';

export class Migration20221021161343 extends Migration {

  async up(): Promise<void> {
    
    //walletAddresses
    this.addSql(
      "alter table `wallet_addresses` add unique `wallet_addresses_address_unique`(`address`);",
    );
    this.addSql(
      "alter table `wallet_addresses` add index `wallet_addresses_user_id_index`(`user_id`);",
    );

    this.addSql(
      "alter table `wallet_addresses` add constraint `wallet_addresses_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    //refresh tokens
    this.addSql(
      "alter table `refresh_tokens` add index `refresh_tokens_user_id_index`(`user_id`);",
    );

    this.addSql(
      "alter table `refresh_tokens` add constraint `refresh_tokens_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    //posts
    this.addSql(
      "alter table `posts` add index `posts_author_id_index`(`author_id`);",
    );

    this.addSql(
      "alter table `posts` add constraint `posts_author_id_foreign` foreign key (`author_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    //charity property
    this.addSql(
      "alter table charity_property add index `charity_property_user_id_index`(`user_id`);"
    );

    this.addSql(
      "alter table `charity_property` add constraint `charity_property_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    //socials
    this.addSql(
      "alter table `socials` add index `socials_user_id_index`(`user_id`)"
    );

    this.addSql(
      "alter table `socials` add constraint `socials_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    this.addSql(
      "alter table `socials` add constraint `socials_collection_id_foreign` foreign key (`collection_id`) references `collections` (`id`) on update cascade on delete CASCADE;",
    );
  }

}
