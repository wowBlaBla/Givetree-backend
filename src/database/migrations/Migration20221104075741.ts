import { Migration } from '@mikro-orm/migrations';

export class Migration20221104075741 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` modify `tax` tinyint(1) default true;');

    this.addSql('alter table `refresh_tokens` modify `is_revoked` json;');

    this.addSql('alter table `charity_property` add `causes` varchar(255) null;');
    this.addSql('alter table `charity_property` modify `employee` int(11) not null;');
  }

}
