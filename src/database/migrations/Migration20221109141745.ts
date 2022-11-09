import { Migration } from '@mikro-orm/migrations';

export class Migration20221109141745 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `nonces` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `wallet_address` varchar(255) not null, `nonce` varchar(255) not null, `sign_type` enum(\'signin\', \'register\', \'switch\') not null, `signer_id` int(11) unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `nonces` add index `nonces_signer_id_index`(`signer_id`);');

    this.addSql('alter table `nonces` add constraint `nonces_signer_id_foreign` foreign key (`signer_id`) references `users` (`id`) on update cascade on delete CASCADE;');
  }

}
