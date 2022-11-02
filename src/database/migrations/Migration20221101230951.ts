import { Migration } from '@mikro-orm/migrations';

export class Migration20221101230951 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` modify `tax` tinyint(1) default true;');

    this.addSql('alter table `wallet_addresses` add `network` varchar(255) not null, add `type` varchar(255) not null;');

    this.addSql('alter table `refresh_tokens` modify `is_revoked` json;');

    this.addSql('alter table `charity_property` modify `employee` int(11) not null;');

    this.addSql('alter table `wallet_addresses` drop index `wallet_addresses_address_unique`;');
  }

}
