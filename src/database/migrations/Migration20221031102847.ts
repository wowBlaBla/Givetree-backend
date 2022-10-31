import { Migration } from '@mikro-orm/migrations';

export class Migration20221031102847 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` modify `tax` tinyint(1) default true;');

    this.addSql('alter table `refresh_tokens` modify `is_revoked` json;');

    this.addSql('alter table `charity_property` modify `employee` int(11) not null;');
  }

}
