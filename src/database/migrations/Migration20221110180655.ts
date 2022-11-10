import { Migration } from '@mikro-orm/migrations';

export class Migration20221110180655 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` change `nonce` `is_email_verified` tinyint(1) not null default false;');


    this.addSql('alter table `users` add `verify_token` varchar(255) null;');

    this.addSql('create table `nonce` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `public_address` varchar(255) not null, `nonce` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `nonces`;');
  }

}
