import { Migration } from '@mikro-orm/migrations';

export class Migration20221103002802 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` modify `tax` tinyint(1) not null;');

    this.addSql('alter table `refresh_tokens` modify `is_revoked` json not null;');

    this.addSql('create table `donations` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `from_id` int(11) unsigned not null, `to_id` int(11) unsigned not null, `crypto` enum(\'ETH\', \'BTC\', \'MATIC\') not null, `crypto_amount` varchar(255) not null, `fiat` enum(\'AUD\', \'USD\', \'GBP\', \'JPY\') not null, `fiat_amount` varchar(255) not null, `wallet_address` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `donations` add index `donations_from_id_index`(`from_id`);');
    this.addSql('alter table `donations` add index `donations_to_id_index`(`to_id`);');

    this.addSql('alter table `charity_property` modify `employee` int(11) default 0;');

    this.addSql('alter table `donations` add constraint `donations_from_id_foreign` foreign key (`from_id`) references `users` (`id`) on update cascade on delete CASCADE;');
    this.addSql('alter table `donations` add constraint `donations_to_id_foreign` foreign key (`to_id`) references `users` (`id`) on update cascade on delete CASCADE;');

    this.addSql('alter table `collections` add unique `collections_pattern_unique`(`pattern`);');
  }

}
